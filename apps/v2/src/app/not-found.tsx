"use client";

import { useTranslation } from "react-i18next";

import { ArrowBack } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";

import Link from "next/link";

import { AmbientBrush } from "@/components/AmbientBrush";
import { AnimatedGrid } from "@/components/AnimatedGrid";
import { Footer } from "@/components/Footer";
import { Mascot } from "@/components/Mascot";
import { Navigation, SkipToContent } from "@/components/Navigation";
import { TRANSITION } from "@/constants/animation";
import { SECTION, Z_INDEX } from "@/constants/layout";
import { FONT_FAMILY } from "@/constants/typography";

// ── Styled components ──────────────────────────────────────────────────

const PageWrapper = styled(Box)({
  position: "relative",
  minHeight: "100dvh",
  display: "flex",
  flexDirection: "column",
  overflowX: "hidden",
});

const MainContent = styled("main")(({ theme }) => ({
  flex: 1,
  position: "relative",
  zIndex: Z_INDEX.CONTENT,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: `100px ${SECTION.PADDING_X}px 60px`,
  [theme.breakpoints.down("sm")]: {
    padding: `100px ${SECTION.PADDING_X_MOBILE}px 60px`,
  },
}));

const BackLink = styled(Link)(({ theme }) => ({
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  color: theme.palette.text.muted,
  textDecoration: "none",
  fontSize: 14,
  fontFamily: FONT_FAMILY.SANS,
  fontWeight: 500,
  marginBottom: 32,
  transition: `color ${TRANSITION.FAST}`,
  "&:hover": {
    color: theme.palette.accent.primary,
  },
}));

const ContentContainer = styled(Box)({
  maxWidth: 640,
  width: "100%",
  textAlign: "center",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
});

// ── Component ──────────────────────────────────────────────────────────

export default function NotFound() {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <PageWrapper>
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
      <MainContent id="main-content">
        <AmbientBrush side="right" top="5%" size={500} pulseDelay={0} />
        <AmbientBrush
          side="left"
          top="50%"
          size={500}
          color="primary"
          pulseDelay={4}
        />
        <ContentContainer>
          <Box sx={{ mb: 3 }}>
            <Mascot variant="lost" size={180} />
          </Box>

          <Typography
            component="h1"
            sx={{
              fontSize: { xs: 72, md: 120 },
              fontWeight: 700,
              background: `linear-gradient(135deg, ${theme.palette.accent.primary}, ${theme.palette.accent.secondary})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              lineHeight: 1,
              mb: 2,
            }}
          >
            404
          </Typography>

          <Typography
            sx={{
              fontSize: { xs: 24, md: 32 },
              fontWeight: 600,
              color: "text.primary",
              mb: 1.5,
            }}
          >
            {t("errors.notFoundTitle")}
          </Typography>

          <Typography
            sx={{
              fontSize: 15,
              lineHeight: 1.8,
              color: "text.muted",
              mb: 4,
            }}
          >
            {t("errors.notFoundText")}
          </Typography>

          <BackLink href="/">
            <ArrowBack sx={{ fontSize: 16 }} />
            {t("errors.backHome")}
          </BackLink>
        </ContentContainer>
      </MainContent>
      <Footer />
    </PageWrapper>
  );
}
