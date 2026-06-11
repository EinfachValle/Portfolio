"use client";

import { useTranslation } from "react-i18next";

import { ArrowBack } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";

import { IMPRESSUM } from "@portfolio/shared";

import Link from "next/link";

import { AmbientBrush } from "@/components/AmbientBrush";
import { AnimatedGrid } from "@/components/AnimatedGrid";
import { Footer } from "@/components/Footer";
import { LegalNav } from "@/components/LegalNav";
import { Navigation, SkipToContent } from "@/components/Navigation";
import { SECTION, Z_INDEX } from "@/constants/layout";

// ISO date the statement was last reviewed. Bump when the copy changes — an
// accessibility statement is expected to carry a creation/review date.
const LEGAL_LAST_REVIEWED = "2026-06-11";

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

const FeatureList = styled("ul")(({ theme }) => ({
  margin: "12px 0 0",
  paddingLeft: 22,
  color: theme.palette.text.muted,
  fontSize: 15,
  lineHeight: 1.8,
  "& li": {
    marginBottom: 8,
  },
}));

// ── Component ──────────────────────────────────────────────────────────

export default function AccessibilityContent() {
  const { t, i18n } = useTranslation();
  const theme = useTheme();

  const reviewedDate = new Date(LEGAL_LAST_REVIEWED).toLocaleDateString(
    i18n.language,
    { year: "numeric", month: "long", day: "numeric" },
  );

  const features = [
    "motion",
    "keyboard",
    "skip",
    "semantics",
    "theme",
    "responsive",
    "language",
  ] as const;

  const linkSx = {
    color: theme.palette.accent.primary,
    textDecoration: "none",
    "&:hover": { textDecoration: "underline" },
  } as const;

  return (
    <>
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
        <AmbientBrush side="right" top="3%" size={550} pulseDelay={0} />
        <AmbientBrush
          side="left"
          top="35%"
          size={500}
          color="primary"
          pulseDelay={3}
        />
        <AmbientBrush side="right" top="70%" size={500} pulseDelay={6} />
        <ContentContainer>
          {/* Back link */}
          <BackLink href="/">
            <ArrowBack sx={{ fontSize: 16 }} />
            {t("errors.backHome")}
          </BackLink>

          {/* Legal page switcher */}
          <LegalNav />

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
            {t("accessibility.title")}
          </Typography>

          {/* Subtitle */}
          <BodyText sx={{ mb: 3 }}>{t("accessibility.subtitle")}</BodyText>

          {/* Divider */}
          <Box
            sx={{
              height: 1,
              backgroundColor: theme.palette.border.default,
              mb: 3,
            }}
          />

          {/* Conformance status */}
          <SectionTitle>{t("accessibility.status")}</SectionTitle>
          <BodyText>{t("accessibility.statusBody")}</BodyText>
          <BodyText sx={{ mt: 1 }}>
            <Box
              component="a"
              href="https://www.w3.org/TR/WCAG21/"
              target="_blank"
              rel="noreferrer noopener"
              sx={linkSx}
            >
              {t("accessibility.wcagLink")} →
            </Box>
          </BodyText>

          {/* Features */}
          <SectionTitle>{t("accessibility.features")}</SectionTitle>
          <BodyText>{t("accessibility.featuresIntro")}</BodyText>
          <FeatureList>
            {features.map((key) => (
              <li key={key}>{t(`accessibility.featureList.${key}`)}</li>
            ))}
          </FeatureList>

          {/* Scope */}
          <SectionTitle>{t("accessibility.scope")}</SectionTitle>
          <BodyText>{t("accessibility.scopeBody")}</BodyText>

          {/* Known limitations */}
          <SectionTitle>{t("accessibility.known")}</SectionTitle>
          <BodyText>{t("accessibility.knownBody")}</BodyText>

          {/* Legal note */}
          <SectionTitle>{t("accessibility.legal")}</SectionTitle>
          <BodyText>{t("accessibility.legalBody")}</BodyText>

          {/* Feedback */}
          <SectionTitle>{t("accessibility.feedback")}</SectionTitle>
          <BodyText>
            {t("accessibility.feedbackBody")}{" "}
            <Box component="a" href={`mailto:${IMPRESSUM.email}`} sx={linkSx}>
              {IMPRESSUM.email}
            </Box>
          </BodyText>

          {/* Last reviewed */}
          <BodyText sx={{ mt: 4, fontSize: 13, opacity: 0.8 }}>
            {t("accessibility.created", { date: reviewedDate })}
          </BodyText>
        </ContentContainer>
      </main>
      <Footer />
    </>
  );
}
