"use client";

import { useTranslation } from "react-i18next";

import { ArrowBack } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";

import {
  IMPRESSUM,
  formatAddressLine,
  formatCityLine,
} from "@portfolio/shared";

import Link from "next/link";

import { AmbientBackground } from "@/components/AmbientBackground";
import { AnimatedGrid } from "@/components/AnimatedGrid";
import { Footer } from "@/components/Footer";
import { Navigation, SkipToContent } from "@/components/Navigation";
import { THEME_MODE } from "@/constants/elements";
import { SECTION, Z_INDEX } from "@/constants/layout";

// ── Styled components ──────────────────────────────────────────────────

const BackLink = styled(Link)(({ theme }) => ({
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  color: theme.palette.text.muted,
  textDecoration: "none",
  fontSize: 14,
  fontFamily: "Inter, sans-serif",
  fontWeight: 500,
  marginBottom: 32,
  transition: "color 0.2s ease",
  "&:hover": {
    color: theme.palette.accent.primary,
  },
}));

const ContentContainer = styled(Box)(({ theme }) => ({
  maxWidth: 800,
  width: "100%",
  margin: "0 auto",
  padding: `120px ${SECTION.PADDING_X}px 80px`,
  textAlign: "left",
  [theme.breakpoints.down("sm")]: {
    padding: `120px ${SECTION.PADDING_X_MOBILE}px 80px`,
  },
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontSize: 18,
  fontWeight: 600,
  color: theme.palette.text.primary,
  marginTop: 40,
  marginBottom: 12,
}));

const BodyText = styled(Typography)(({ theme }) => ({
  fontSize: 15,
  lineHeight: 1.8,
  color: theme.palette.text.muted,
}));

// ── Component ──────────────────────────────────────────────────────────

export default function PrivacyPolicyContent() {
  const { t } = useTranslation();
  const theme = useTheme();

  const rightsItems = [
    t("datenschutz.rights.access"),
    t("datenschutz.rights.rectification"),
    t("datenschutz.rights.erasure"),
    t("datenschutz.rights.restriction"),
    t("datenschutz.rights.portability"),
    t("datenschutz.rights.objection"),
  ];

  const sections = [
    {
      key: "general",
      titleKey: "datenschutz.general.title",
      textKey: "datenschutz.general.text",
    },
    {
      key: "contactForm",
      titleKey: "datenschutz.contactForm.title",
      textKey: "datenschutz.contactForm.text",
    },
    {
      key: "emailService",
      titleKey: "datenschutz.emailService.title",
      textKey: "datenschutz.emailService.text",
    },
    {
      key: "captcha",
      titleKey: "datenschutz.captcha.title",
      textKey: "datenschutz.captcha.text",
    },
    {
      key: "hosting",
      titleKey: "datenschutz.hosting.title",
      textKey: "datenschutz.hosting.text",
    },
    {
      key: "analytics",
      titleKey: "datenschutz.analytics.title",
      textKey: "datenschutz.analytics.text",
    },
    {
      key: "storage",
      titleKey: "datenschutz.storage.title",
      textKey: "datenschutz.storage.text",
    },
    {
      key: "fonts",
      titleKey: "datenschutz.fonts.title",
      textKey: "datenschutz.fonts.text",
    },
    {
      key: "github",
      titleKey: "datenschutz.github.title",
      textKey: "datenschutz.github.text",
    },
    {
      key: "complaint",
      titleKey: "datenschutz.complaint.title",
      textKey: "datenschutz.complaint.text",
    },
  ] as const;

  const isDark = theme.palette.mode === THEME_MODE.DARK;

  return (
    <>
      {isDark && <AmbientBackground intensity={3} />}
      <Box
        sx={{
          position: "fixed",
          inset: 0,
          zIndex: Z_INDEX.BACKGROUND,
          pointerEvents: "none",
        }}
      >
        <AnimatedGrid intensity="subtle" />
      </Box>
      <SkipToContent />
      <Navigation />
      <main
        id="main-content"
        style={{ position: "relative", zIndex: Z_INDEX.CONTENT }}
      >
        <ContentContainer>
          {/* Back link */}
          <BackLink href="/">
            <ArrowBack sx={{ fontSize: 16 }} />
            {t("errors.backHome")}
          </BackLink>

          {/* Page title */}
          <Typography
            component="h1"
            sx={{
              fontSize: { xs: 32, md: 40 },
              fontWeight: 700,
              color: "text.primary",
              letterSpacing: "-0.5px",
              mb: 1,
            }}
          >
            {t("datenschutz.title")}
          </Typography>

          {/* Divider */}
          <Box
            sx={{
              height: 1,
              backgroundColor: theme.palette.border.default,
              mt: 2,
              mb: 3,
            }}
          />

          {/* 1. Responsible Party */}
          <SectionTitle>{t("datenschutz.responsible.title")}</SectionTitle>
          <BodyText>{t("datenschutz.responsible.text")}</BodyText>
          <BodyText sx={{ mt: 1.5 }}>
            {IMPRESSUM.fullName}
            <br />
            {formatAddressLine(IMPRESSUM)}
            <br />
            {formatCityLine(IMPRESSUM)}
            {IMPRESSUM.country && (
              <>
                <br />
                {IMPRESSUM.country}
              </>
            )}
            <br />
            {t("impressum.phone")}: {IMPRESSUM.phone}
            <br />
            {t("impressum.email")}:{" "}
            <Box
              component="a"
              href={`mailto:${IMPRESSUM.email}`}
              sx={{
                color: theme.palette.accent.primary,
                textDecoration: "none",
                "&:hover": { textDecoration: "underline" },
              }}
            >
              {IMPRESSUM.email}
            </Box>
          </BodyText>

          {/* Sections 2–10 + 12 */}
          {sections.map((section) => (
            <Box key={section.key}>
              <SectionTitle>{t(section.titleKey)}</SectionTitle>
              <BodyText>{t(section.textKey)}</BodyText>
            </Box>
          ))}

          {/* 11. Your Rights (with list) */}
          <SectionTitle>{t("datenschutz.rights.title")}</SectionTitle>
          <BodyText>{t("datenschutz.rights.text")}</BodyText>
          <Box
            component="ul"
            sx={{
              mt: 1.5,
              pl: 3,
              display: "flex",
              flexDirection: "column",
              gap: 0.5,
            }}
          >
            {rightsItems.map((item) => (
              <Box
                key={item}
                component="li"
                sx={{
                  fontSize: 15,
                  lineHeight: 1.8,
                  color: theme.palette.text.muted,
                }}
              >
                {item}
              </Box>
            ))}
          </Box>
        </ContentContainer>
      </main>
      <Footer />
    </>
  );
}
