import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import * as yup from "yup";

// Rate limiting: in-memory Map
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 3;
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour

// Yup validation schema (server-side)
const contactSchema = yup.object({
  name: yup.string().required().trim(),
  email: yup.string().required().email().trim(),
  subject: yup.string().required().trim(),
  message: yup.string().required().min(10).max(5000).trim(),
  consent: yup.boolean().oneOf([true]),
  captchaToken: yup.string().default(""),
  website: yup.string().default(""), // honeypot
});

export async function POST(request: NextRequest) {
  try {
    // 1. Rate limiting
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      "unknown";
    const now = Date.now();
    const entry = rateLimitMap.get(ip);

    if (entry) {
      if (now > entry.resetAt) {
        rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
      } else if (entry.count >= RATE_LIMIT_MAX) {
        return NextResponse.json(
          { error: "Too many requests" },
          { status: 429 },
        );
      } else {
        entry.count++;
      }
    } else {
      rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    }

    // 2. Parse + validate body
    const body = await request.json();
    const data = await contactSchema.validate(body, { abortEarly: false });

    // 3. Honeypot check (silent success)
    if (data.website) {
      return NextResponse.json({ success: true });
    }

    // 4. CAPTCHA verification (placeholder — check env var exists)
    const captchaSecret = process.env.CAPTCHA_SECRET_KEY;
    if (captchaSecret && data.captchaToken) {
      // TODO: Verify with actual CAPTCHA provider
      // For now, skip verification if no secret configured
    }

    // 5. Send email via Resend
    const resendApiKey = process.env.RESEND_API_KEY;
    const contactToEmail = process.env.CONTACT_TO_EMAIL;

    if (!resendApiKey || !contactToEmail) {
      console.error("Missing RESEND_API_KEY or CONTACT_TO_EMAIL env vars");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 },
      );
    }

    const resend = new Resend(resendApiKey);
    await resend.emails.send({
      from: "Portfolio Contact <onboarding@resend.dev>",
      to: contactToEmail,
      subject: `[Portfolio] ${data.subject}`,
      text: `Name: ${data.name}\nEmail: ${data.email}\n\n${data.message}`,
      replyTo: data.email,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 },
      );
    }
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
