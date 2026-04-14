"use client";

import { useRef, useState } from "react";

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
import { alpha, styled, useTheme } from "@mui/material/styles";

import { SOCIAL_LINKS } from "@portfolio/shared";

import type { TurnstileInstance } from "@marsidev/react-turnstile";
import { Turnstile } from "@marsidev/react-turnstile";
import Link from "next/link";
import { toast } from "sonner";
import * as yup from "yup";

import {
  REVEAL_ANIMATION,
  SCROLL_REVEAL_CONFIG,
  TRANSITION,
} from "@/constants/animation";
import { SECTION_ID, THEME_MODE } from "@/constants/elements";
import { CAPTCHA, FORM_ERROR_ID, VALIDATION } from "@/constants/form";
import { CONTENT_MAX_WIDTH, FORM_LAYOUT, SECTION } from "@/constants/layout";
import { FONT_FAMILY } from "@/constants/typography";
import useDeviceTypeDetection from "@/hooks/useDeviceTypeDetection";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { submitContact } from "@/store/actions/contact.actions";
import { store, useAppDispatch, useAppSelector } from "@/store/store";

import { CircuitCircle } from "../CircuitCircle";

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
  padding: `${SECTION.PADDING_Y}px ${SECTION.PADDING_X}px`,
  textAlign: "center",
  position: "relative",
  overflow: "hidden",
  [theme.breakpoints.down("sm")]: {
    padding: `${SECTION.PADDING_Y}px ${SECTION.PADDING_X_MOBILE}px`,
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
  position: "relative",
  zIndex: 1,
  opacity: isRevealed || reducedMotion ? 1 : 0,
  transform:
    isRevealed || reducedMotion
      ? "translateY(0)"
      : `translateY(${delay === 0 ? 50 : 30}px)`,
  transition: reducedMotion
    ? "none"
    : `opacity ${REVEAL_ANIMATION.FORM_DURATION} ${SCROLL_REVEAL_CONFIG.EASING} ${delay}ms, transform ${REVEAL_ANIMATION.FORM_DURATION} ${SCROLL_REVEAL_CONFIG.EASING} ${delay}ms`,
}));

const FormInput = styled("input")(({ theme }) => ({
  flex: 1,
  padding: "14px 18px",
  background: theme.palette.glass.background,
  border: `1px solid ${theme.palette.border.default}`,
  borderRadius: FORM_LAYOUT.INPUT_BORDER_RADIUS,
  color: theme.palette.text.primary,
  fontSize: 13,
  fontFamily: "inherit",
  outline: "none",
  transition: `border-color ${TRANSITION.MEDIUM}`,
  "&:focus": {
    borderColor: alpha(theme.palette.accent.primary, 0.3),
  },
  "&::placeholder": {
    color: theme.palette.text.muted,
  },
}));

const FormTextarea = styled("textarea")(({ theme }) => ({
  width: "100%",
  padding: "14px 18px",
  background: theme.palette.glass.background,
  border: `1px solid ${theme.palette.border.default}`,
  borderRadius: FORM_LAYOUT.INPUT_BORDER_RADIUS,
  color: theme.palette.text.primary,
  fontSize: 13,
  fontFamily: "inherit",
  outline: "none",
  transition: `border-color ${TRANSITION.MEDIUM}`,
  minHeight: FORM_LAYOUT.TEXTAREA_MIN_HEIGHT,
  resize: "vertical",
  boxSizing: "border-box",
  "&:focus": {
    borderColor: alpha(theme.palette.accent.primary, 0.3),
  },
  "&::placeholder": {
    color: theme.palette.text.muted,
  },
}));

const SubmitButton = styled(Button)(({ theme }) => ({
  background: `linear-gradient(135deg, ${alpha(theme.palette.accent.primary, 0.12)}, ${alpha(theme.palette.accent.secondary, 0.12)})`,
  color: alpha(theme.palette.accent.primary, 0.8),
  fontFamily: FONT_FAMILY.SANS,
  fontWeight: 500,
  fontSize: 14,
  padding: "14px 32px",
  borderRadius: FORM_LAYOUT.SUBMIT_BORDER_RADIUS,
  border: `1px solid ${alpha(theme.palette.accent.primary, 0.2)}`,
  textTransform: "none",
  letterSpacing: "0.5px",
  transition: "background 0.2s ease, border-color 0.2s ease",
  "&:hover:not(:disabled)": {
    background: alpha(theme.palette.accent.primary, 0.18),
    borderColor: alpha(theme.palette.accent.primary, 0.35),
  },
  "&:disabled": {
    opacity: 0.6,
    color: alpha(theme.palette.accent.primary, 0.5),
  },
}));

const socialLinkSx = {
  fontSize: 12,
  color: "text.muted",
  textDecoration: "none",
  letterSpacing: "0.5px",
  transition: `color ${TRANSITION.MEDIUM}`,
  "&:hover": { color: "accent.primary" },
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
  const { isMobile } = useDeviceTypeDetection();
  const reducedMotion = useReducedMotion();

  const { ref, isRevealed } = useScrollReveal({ threshold: 0.15 });

  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [honeypot, setHoneypot] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [captchaToken, setCaptchaToken] = useState("");
  const turnstileRef = useRef<TurnstileInstance>(null);

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
      .min(VALIDATION.MESSAGE_MIN_LENGTH, t("contact.validation.messageMin"))
      .max(VALIDATION.MESSAGE_MAX_LENGTH, t("contact.validation.messageMax")),
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

    const success = await dispatch(
      submitContact({
        ...form,
        captchaToken,
        website: honeypot,
      }),
    );

    if (success) {
      toast.success(t("contact.success"));
      setForm(EMPTY_FORM);
      setErrors({});
    } else {
      const { error: contactError } = store.getState().contact;
      const errorMsg = contactError?.includes("429")
        ? t("contact.rateLimit")
        : t("contact.error");
      toast.error(errorMsg);
    }

    // Reset CAPTCHA after every attempt
    turnstileRef.current?.reset();
    setCaptchaToken("");
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
    <ContactSection
      id={SECTION_ID.CONTACT}
      ref={ref as React.RefCallback<HTMLElement>}
    >
      {theme.palette.mode === THEME_MODE.LIGHT && (
        <>
          <CircuitCircle side="right" top="5%" size={800} />
          <CircuitCircle side="left" top="50%" size={700} />
        </>
      )}
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
            fontSize: 13,
            fontWeight: 600,
            letterSpacing: "4px",
            textTransform: "uppercase",
            color: "accent.muted",
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
              background: `linear-gradient(135deg, ${theme.palette.accent.primary}, ${theme.palette.accent.tertiary})`,
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
            color: "text.muted",
            fontSize: 14,
            maxWidth: CONTENT_MAX_WIDTH.DESCRIPTION,
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
            maxWidth: CONTENT_MAX_WIDTH.FORM,
            width: "100%",
            mx: "auto",
            display: "flex",
            flexDirection: "column",
            gap: `${FORM_LAYOUT.FIELD_GAP}px`,
          }}
        >
          {/* Name + Email row */}
          <Box
            data-testid="contact-fields-row"
            sx={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              gap: `${FORM_LAYOUT.FIELD_GAP}px`,
            }}
          >
            <FormInput
              name="name"
              placeholder={t("contact.name")}
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              disabled={isSubmitting}
              required
              aria-required="true"
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? FORM_ERROR_ID.NAME : undefined}
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
              aria-describedby={errors.email ? FORM_ERROR_ID.EMAIL : undefined}
            />
          </Box>
          {/* Name/Email errors */}
          {(errors.name || errors.email) && (
            <Box
              sx={{
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
                gap: `${FORM_LAYOUT.FIELD_GAP}px`,
                mt: -0.5,
              }}
            >
              <Box sx={{ flex: 1 }}>
                {errors.name && (
                  <Typography
                    id={FORM_ERROR_ID.NAME}
                    sx={{ color: "error.main", fontSize: 12 }}
                  >
                    {errors.name}
                  </Typography>
                )}
              </Box>
              <Box sx={{ flex: 1 }}>
                {errors.email && (
                  <Typography
                    id={FORM_ERROR_ID.EMAIL}
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
              errors.subject ? FORM_ERROR_ID.SUBJECT : undefined
            }
          />
          {errors.subject && (
            <Typography
              id={FORM_ERROR_ID.SUBJECT}
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
              errors.message ? FORM_ERROR_ID.MESSAGE : undefined
            }
          />
          {errors.message && (
            <Typography
              id={FORM_ERROR_ID.MESSAGE}
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
                    errors.consent ? FORM_ERROR_ID.CONSENT : undefined
                  }
                  sx={{
                    color: errors.consent ? "error.main" : "text.secondary",
                    "&.Mui-checked": {
                      color: "accent.primary",
                    },
                    p: "4px",
                    mr: 1,
                  }}
                />
              }
              label={consentLabel}
              sx={{ alignItems: "flex-start", ml: 0 }}
            />
            {errors.consent && (
              <FormHelperText
                id={FORM_ERROR_ID.CONSENT}
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

          {/* CAPTCHA */}
          {CAPTCHA.SITE_KEY && (
            <Turnstile
              ref={turnstileRef}
              siteKey={CAPTCHA.SITE_KEY}
              onSuccess={setCaptchaToken}
              onError={() => setCaptchaToken("")}
              onExpire={() => setCaptchaToken("")}
              options={{
                size: "flexible",
                theme:
                  theme.palette.mode === THEME_MODE.DARK ? "dark" : "light",
              }}
            />
          )}

          {/* Submit */}
          <SubmitButton
            data-testid="contact-submit"
            type="submit"
            disabled={isSubmitting || (!!CAPTCHA.SITE_KEY && !captchaToken)}
            disableElevation
          >
            {isSubmitting ? (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <CircularProgress size={16} sx={{ color: "text.onAccent" }} />
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
