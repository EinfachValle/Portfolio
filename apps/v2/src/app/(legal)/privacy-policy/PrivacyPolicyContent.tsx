"use client";

import { useTranslation } from "react-i18next";

import { Box, Typography } from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";

import {
  IMPRESSUM,
  formatAddressLine,
  formatCityLine,
} from "@portfolio/shared";

// ── Styled components ──────────────────────────────────────────────────

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

  return (
    <>
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
    </>
  );
}
