"use client";

import { useTranslation } from "react-i18next";

import { ArrowBack, Refresh } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import { alpha, styled, useTheme } from "@mui/material/styles";

import Link from "next/link";

import { AmbientBackground } from "@/components/AmbientBackground";
import { AnimatedGrid } from "@/components/AnimatedGrid";
import { Footer } from "@/components/Footer";
import { Navigation, SkipToContent } from "@/components/Navigation";
import { TRANSITION } from "@/constants/animation";
import { THEME_MODE } from "@/constants/elements";
import { SECTION, Z_INDEX } from "@/constants/layout";
import { FONT_FAMILY } from "@/constants/typography";

// ── Styled components ──────────────────────────────────────────────────

const BackLink = styled(Link)(({ theme }) => ({
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  color: theme.palette.text.muted,
  textDecoration: "none",
  fontSize: 14,
  fontFamily: FONT_FAMILY.SANS,
  fontWeight: 500,
  transition: `color ${TRANSITION.FAST}`,
  "&:hover": {
    color: theme.palette.accent.primary,
  },
}));

const RetryButton = styled("button")(({ theme }) => ({
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  background: `linear-gradient(135deg, ${alpha(theme.palette.accent.primary, 0.12)}, ${alpha(theme.palette.accent.secondary, 0.12)})`,
  color: alpha(theme.palette.accent.primary, 0.8),
  border: `1px solid ${alpha(theme.palette.accent.primary, 0.2)}`,
  borderRadius: 10,
  padding: "12px 28px",
  fontSize: 14,
  fontFamily: FONT_FAMILY.SANS,
  fontWeight: 500,
  cursor: "pointer",
  transition: `background ${TRANSITION.FAST}, border-color ${TRANSITION.FAST}`,
  "&:hover": {
    background: alpha(theme.palette.accent.primary, 0.18),
    borderColor: alpha(theme.palette.accent.primary, 0.35),
  },
}));

const ContentContainer = styled(Box)(({ theme }) => ({
  maxWidth: 800,
  width: "100%",
  margin: "0 auto",
  padding: `120px ${SECTION.PADDING_X}px 80px`,
  textAlign: "center",
  [theme.breakpoints.down("sm")]: {
    padding: `120px ${SECTION.PADDING_X_MOBILE}px 80px`,
  },
}));

// ── Component ──────────────────────────────────────────────────────────

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { t } = useTranslation();
  const theme = useTheme();

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
          <Typography
            component="h1"
            sx={{
              fontSize: { xs: 24, md: 32 },
              fontWeight: 600,
              color: "text.primary",
              mb: 1.5,
            }}
          >
            {t("errors.errorTitle")}
          </Typography>

          <Typography
            sx={{
              fontSize: 15,
              lineHeight: 1.8,
              color: "text.muted",
              mb: 4,
            }}
          >
            {t("errors.errorText")}
          </Typography>

          <Box
            sx={{
              display: "flex",
              gap: 2,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <RetryButton onClick={reset}>
              <Refresh sx={{ fontSize: 16 }} />
              {t("errors.tryAgain")}
            </RetryButton>
            <BackLink href="/">
              <ArrowBack sx={{ fontSize: 16 }} />
              {t("errors.backHome")}
            </BackLink>
          </Box>
        </ContentContainer>
      </main>
      <Footer />
    </>
  );
}
