"use client";

import { useState } from "react";

import { useTranslation } from "react-i18next";

import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  FormHelperText,
  Typography,
} from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";

import { SOCIAL_LINKS } from "@portfolio/shared";

import Link from "next/link";
import { toast } from "sonner";
import * as yup from "yup";

import { SCROLL_REVEAL_CONFIG } from "@/constants/animation";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { submitContact } from "@/store/slices/contactSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";

// ── Types ────────────────────────────────────────────────────────────

interface FormState {
  name: string;
  email: string;
  subject: string;
  message: string;
  consent: boolean;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
  consent?: string;
}

// ── Styled components ────────────────────────────────────────────────

const ContactSection = styled("section")(({ theme }) => ({
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: "80px 40px",
  textAlign: "center",
  position: "relative",
  [theme.breakpoints.down("sm")]: {
    padding: "80px 16px",
  },
}));

interface RevealBoxProps {
  isRevealed: boolean;
  reducedMotion: boolean;
  delay?: number;
}

const RevealBox = styled(Box, {
  shouldForwardProp: (prop) =>
    prop !== "isRevealed" && prop !== "reducedMotion" && prop !== "delay",
})<RevealBoxProps>(({ isRevealed, reducedMotion, delay = 0 }) => ({
  opacity: isRevealed || reducedMotion ? 1 : 0,
  transform:
    isRevealed || reducedMotion
      ? "translateY(0)"
      : `translateY(${delay === 0 ? 50 : 30}px)`,
  transition: reducedMotion
    ? "none"
    : `opacity 0.8s ${SCROLL_REVEAL_CONFIG.EASING} ${delay}ms, transform 0.8s ${SCROLL_REVEAL_CONFIG.EASING} ${delay}ms`,
}));

const FormInput = styled("input")(({ theme }) => ({
  flex: 1,
  padding: "14px 18px",
  background:
    theme.palette.mode === "dark"
      ? "rgba(255, 255, 255, 0.02)"
      : "rgba(15, 23, 42, 0.02)",
  border:
    theme.palette.mode === "dark"
      ? "1px solid rgba(255, 255, 255, 0.06)"
      : "1px solid rgba(15, 23, 42, 0.08)",
  borderRadius: 10,
  color: theme.palette.mode === "dark" ? "#e2e8f0" : "#0f172a",
  fontSize: 13,
  fontFamily: "inherit",
  outline: "none",
  transition: "border-color 0.3s",
  "&:focus": {
    borderColor: "rgba(6, 182, 212, 0.3)",
  },
  "&::placeholder": {
    color: "rgba(148, 163, 184, 0.25)",
  },
}));

const FormTextarea = styled("textarea")(({ theme }) => ({
  width: "100%",
  padding: "14px 18px",
  background:
    theme.palette.mode === "dark"
      ? "rgba(255, 255, 255, 0.02)"
      : "rgba(15, 23, 42, 0.02)",
  border:
    theme.palette.mode === "dark"
      ? "1px solid rgba(255, 255, 255, 0.06)"
      : "1px solid rgba(15, 23, 42, 0.08)",
  borderRadius: 10,
  color: theme.palette.mode === "dark" ? "#e2e8f0" : "#0f172a",
  fontSize: 13,
  fontFamily: "inherit",
  outline: "none",
  transition: "border-color 0.3s",
  minHeight: 120,
  resize: "vertical",
  boxSizing: "border-box",
  "&:focus": {
    borderColor: "rgba(6, 182, 212, 0.3)",
  },
  "&::placeholder": {
    color: "rgba(148, 163, 184, 0.25)",
  },
}));

const SubmitButton = styled(Button)(() => ({
  background:
    "linear-gradient(135deg, rgba(6, 182, 212, 0.12), rgba(99, 102, 241, 0.12))",
  color: "rgba(6, 182, 212, 0.8)",
  fontFamily: "Inter, sans-serif",
  fontWeight: 500,
  fontSize: 14,
  padding: "14px 32px",
  borderRadius: 10,
  border: "1px solid rgba(6, 182, 212, 0.2)",
  textTransform: "none",
  letterSpacing: "0.5px",
  transition: "background 0.2s ease, border-color 0.2s ease",
  "&:hover:not(:disabled)": {
    background: "rgba(6, 182, 212, 0.18)",
    borderColor: "rgba(6, 182, 212, 0.35)",
  },
  "&:disabled": {
    opacity: 0.6,
    color: "rgba(6, 182, 212, 0.5)",
  },
}));

const socialLinkSx = {
  fontSize: 12,
  color: "rgba(148, 163, 184, 0.3)",
  textDecoration: "none",
  letterSpacing: "0.5px",
  transition: "color 0.3s",
  "&:hover": { color: "rgba(6, 182, 212, 0.7)" },
} as const;

// ── Helpers ──────────────────────────────────────────────────────────

const EMPTY_FORM: FormState = {
  name: "",
  email: "",
  subject: "",
  message: "",
  consent: false,
};

// ── Component ────────────────────────────────────────────────────────

export function Contact() {
  const { t } = useTranslation();
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const status = useAppSelector((s) => s.contact.status);
  const reducedMotion = useReducedMotion();

  const { ref, isRevealed } = useScrollReveal({ threshold: 0.15 });

  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [honeypot, setHoneypot] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});

  const isSubmitting = status === "submitting";

  // Build Yup schema using current translations
  const schema = yup.object({
    name: yup.string().required(t("contact.validation.nameRequired")),
    email: yup
      .string()
      .required(t("contact.validation.emailRequired"))
      .email(t("contact.validation.emailInvalid")),
    subject: yup.string().required(t("contact.validation.subjectRequired")),
    message: yup
      .string()
      .required(t("contact.validation.messageRequired"))
      .min(10, t("contact.validation.messageMin"))
      .max(5000, t("contact.validation.messageMax")),
    consent: yup
      .boolean()
      .oneOf([true], t("contact.validation.consentRequired")),
  });

  function handleChange(field: keyof FormState, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
    // Clear error on change
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // Validate
    const validationErrors: FormErrors = {};
    try {
      await schema.validate(form, { abortEarly: false });
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        err.inner.forEach((ve) => {
          if (ve.path) {
            validationErrors[ve.path as keyof FormErrors] = ve.message;
          }
        });
        setErrors(validationErrors);
        return;
      }
    }

    // Honeypot check: silently succeed
    if (honeypot) {
      toast.success(t("contact.success"));
      setForm(EMPTY_FORM);
      return;
    }

    const result = await dispatch(
      submitContact({
        ...form,
        captchaToken: "",
        website: honeypot,
      }),
    );

    if (submitContact.fulfilled.match(result)) {
      toast.success(t("contact.success"));
      setForm(EMPTY_FORM);
      setErrors({});
    } else {
      const errorMsg = result.error?.message?.includes("429")
        ? t("contact.rateLimit")
        : t("contact.error");
      toast.error(errorMsg);
    }
  }

  // Heading: split into prefix + bold last word
  const heading = t("contact.heading");
  const lastSpace = heading.lastIndexOf(" ");
  const headingPrefix = heading.slice(0, lastSpace + 1);
  const headingHighlight = heading.slice(lastSpace + 1);

  // Render the consent label with a Next.js Link for the privacy policy text
  const consentRaw = t("contact.consent");
  // The translation contains <link>...</link> tags
  const consentParts = consentRaw.split(/(<link>.*?<\/link>)/);
  const consentLabel = (
    <Typography component="span" sx={{ fontSize: 14, color: "text.primary" }}>
      {consentParts.map((part, i) => {
        const match = part.match(/^<link>(.*?)<\/link>$/);
        if (match) {
          return (
            <Typography
              key={i}
              component={Link}
              href="/privacy-policy"
              sx={{
                fontSize: 14,
                color: theme.palette.accent.primary,
                textDecoration: "underline",
                textUnderlineOffset: "2px",
                "&:hover": { opacity: 0.8 },
              }}
            >
              {match[1]}
            </Typography>
          );
        }
        return part;
      })}
    </Typography>
  );

  return (
    <ContactSection id="contact" ref={ref as React.RefCallback<HTMLElement>}>
      {/* Content: section label + heading + description */}
      <RevealBox
        isRevealed={isRevealed}
        reducedMotion={reducedMotion}
        delay={0}
      >
        {/* Section label */}
        <Typography
          variant="overline"
          sx={{
            display: "block",
            fontSize: 10,
            letterSpacing: "4px",
            textTransform: "uppercase",
            color: "rgba(6, 182, 212, 0.4)",
            mb: 3,
          }}
        >
          {t("contact.sectionLabel")}
        </Typography>

        {/* Heading with bold last word */}
        <Typography
          component="h2"
          sx={{
            fontSize: { xs: 32, md: 40 },
            fontWeight: 200,
            color: "text.primary",
            mb: 1.5,
          }}
        >
          {headingPrefix}
          <Typography
            component="span"
            sx={{
              fontWeight: 700,
              background: "linear-gradient(135deg, #06b6d4, #a855f7)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {headingHighlight}
          </Typography>
        </Typography>

        {/* Description */}
        <Typography
          sx={{
            color: "rgba(148, 163, 184, 0.4)",
            fontSize: 14,
            maxWidth: 440,
            mx: "auto",
            mb: 4,
            lineHeight: 1.7,
          }}
        >
          {t("contact.description")}
        </Typography>
      </RevealBox>

      {/* Form */}
      <RevealBox
        isRevealed={isRevealed}
        reducedMotion={reducedMotion}
        delay={200}
      >
        <Box
          component="form"
          onSubmit={handleSubmit}
          noValidate
          sx={{
            maxWidth: 480,
            width: "100%",
            mx: "auto",
            display: "flex",
            flexDirection: "column",
            gap: "14px",
          }}
        >
          {/* Name + Email row */}
          <Box sx={{ display: "flex", gap: "14px" }}>
            <FormInput
              name="name"
              placeholder={t("contact.name")}
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              disabled={isSubmitting}
              required
              aria-required="true"
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? "contact-name-error" : undefined}
            />
            <FormInput
              name="email"
              type="email"
              placeholder={t("contact.email")}
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
              disabled={isSubmitting}
              required
              aria-required="true"
              aria-invalid={Boolean(errors.email)}
              aria-describedby={
                errors.email ? "contact-email-error" : undefined
              }
            />
          </Box>
          {/* Name/Email errors */}
          {(errors.name || errors.email) && (
            <Box
              sx={{
                display: "flex",
                gap: "14px",
                mt: -0.5,
              }}
            >
              <Box sx={{ flex: 1 }}>
                {errors.name && (
                  <Typography
                    id="contact-name-error"
                    sx={{ color: "error.main", fontSize: 12 }}
                  >
                    {errors.name}
                  </Typography>
                )}
              </Box>
              <Box sx={{ flex: 1 }}>
                {errors.email && (
                  <Typography
                    id="contact-email-error"
                    sx={{ color: "error.main", fontSize: 12 }}
                  >
                    {errors.email}
                  </Typography>
                )}
              </Box>
            </Box>
          )}

          {/* Subject */}
          <FormInput
            name="subject"
            placeholder={t("contact.subject")}
            value={form.subject}
            onChange={(e) => handleChange("subject", e.target.value)}
            disabled={isSubmitting}
            required
            aria-required="true"
            aria-invalid={Boolean(errors.subject)}
            aria-describedby={
              errors.subject ? "contact-subject-error" : undefined
            }
          />
          {errors.subject && (
            <Typography
              id="contact-subject-error"
              sx={{ color: "error.main", fontSize: 12, mt: -0.5 }}
            >
              {errors.subject}
            </Typography>
          )}

          {/* Message */}
          <FormTextarea
            name="message"
            placeholder={t("contact.messagePlaceholder")}
            value={form.message}
            onChange={(e) => handleChange("message", e.target.value)}
            disabled={isSubmitting}
            required
            aria-required="true"
            aria-invalid={Boolean(errors.message)}
            aria-describedby={
              errors.message ? "contact-message-error" : undefined
            }
          />
          {errors.message && (
            <Typography
              id="contact-message-error"
              sx={{ color: "error.main", fontSize: 12, mt: -0.5 }}
            >
              {errors.message}
            </Typography>
          )}

          {/* DSGVO Consent */}
          <Box sx={{ textAlign: "left" }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={form.consent}
                  onChange={(e) => handleChange("consent", e.target.checked)}
                  disabled={isSubmitting}
                  aria-required="true"
                  aria-invalid={Boolean(errors.consent)}
                  aria-describedby={
                    errors.consent ? "contact-consent-error" : undefined
                  }
                  sx={{
                    color: errors.consent ? "error.main" : "text.secondary",
                    "&.Mui-checked": {
                      color: "accent.primary",
                    },
                    pt: 0,
                    pb: 0,
                    pr: 1,
                  }}
                />
              }
              label={consentLabel}
              sx={{ alignItems: "flex-start", ml: 0 }}
            />
            {errors.consent && (
              <FormHelperText
                id="contact-consent-error"
                error
                sx={{ ml: 0, mt: 0.5 }}
              >
                {errors.consent}
              </FormHelperText>
            )}
          </Box>

          {/* Honeypot — hidden from real users */}
          <Box
            component="input"
            name="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={honeypot}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setHoneypot(e.target.value)
            }
            sx={{
              visibility: "hidden",
              position: "absolute",
              left: "-9999px",
            }}
            aria-hidden="true"
          />

          {/* CAPTCHA placeholder */}
          <Box data-captcha-container />

          {/* Submit */}
          <SubmitButton type="submit" disabled={isSubmitting} disableElevation>
            {isSubmitting ? (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <CircularProgress size={16} sx={{ color: "#ffffff" }} />
                {t("contact.sending")}
              </Box>
            ) : (
              `${t("contact.submit")} \u2192`
            )}
          </SubmitButton>
        </Box>
      </RevealBox>

      {/* Social links as text */}
      <RevealBox
        isRevealed={isRevealed}
        reducedMotion={reducedMotion}
        delay={400}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: "20px",
            mt: 2,
          }}
        >
          <Typography
            component="a"
            href={SOCIAL_LINKS.github}
            target="_blank"
            rel="noopener noreferrer"
            sx={socialLinkSx}
          >
            GitHub
          </Typography>
          <Typography
            component="a"
            href={SOCIAL_LINKS.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            sx={socialLinkSx}
          >
            LinkedIn
          </Typography>
          <Typography
            component="a"
            href={SOCIAL_LINKS.instagram}
            target="_blank"
            rel="noopener noreferrer"
            sx={socialLinkSx}
          >
            Instagram
          </Typography>
        </Box>
      </RevealBox>
    </ContactSection>
  );
}
