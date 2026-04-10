"use client";

import { useTranslation } from "react-i18next";

import { ArrowBack } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";

import { IMPRESSUM } from "@portfolio/shared";

import Link from "next/link";

import { Footer } from "@/components/Footer";
import { Navigation, SkipToContent } from "@/components/Navigation";

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

const ContentContainer = styled(Box)({
  maxWidth: 800,
  width: "100%",
  margin: "0 auto",
  padding: "120px 24px 80px",
  textAlign: "left",
});

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

export default function LegalNoticeContent() {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <>
      <SkipToContent />
      <Navigation />
      <main id="main-content">
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
            {t("impressum.title")}
          </Typography>

          {/* Subtitle */}
          <BodyText sx={{ mb: 3 }}>{t("impressum.according")}</BodyText>

          {/* Divider */}
          <Box
            sx={{
              height: 1,
              backgroundColor: theme.palette.border.default,
              mb: 3,
            }}
          />

          {/* Contact section */}
          <SectionTitle>{t("impressum.contact")}</SectionTitle>
          <BodyText>
            {IMPRESSUM.fullName}
            <br />
            {IMPRESSUM.address}
            <br />
            {IMPRESSUM.city}
          </BodyText>
          <BodyText sx={{ mt: 1 }}>
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

          {/* Liability for Content */}
          <SectionTitle>{t("impressum.liability.title")}</SectionTitle>

          <Typography
            component="h3"
            sx={{
              fontSize: 16,
              fontWeight: 600,
              color: "text.primary",
              mb: 1,
            }}
          >
            {t("impressum.liability.content")}
          </Typography>
          <BodyText>{t("impressum.liability.contentText")}</BodyText>

          {/* Liability for Links */}
          <Typography
            component="h3"
            sx={{
              fontSize: 16,
              fontWeight: 600,
              color: "text.primary",
              mt: 3,
              mb: 1,
            }}
          >
            {t("impressum.liability.links")}
          </Typography>
          <BodyText>{t("impressum.liability.linksText")}</BodyText>

          {/* Copyright */}
          <Typography
            component="h3"
            sx={{
              fontSize: 16,
              fontWeight: 600,
              color: "text.primary",
              mt: 3,
              mb: 1,
            }}
          >
            {t("impressum.liability.copyright")}
          </Typography>
          <BodyText>{t("impressum.liability.copyrightText")}</BodyText>
        </ContentContainer>
      </main>
      <Footer />
    </>
  );
}
