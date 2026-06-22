"use client";

import { useTranslation } from "react-i18next";

import { ArrowBack } from "@mui/icons-material";
import { Box } from "@mui/material";
import { alpha, styled } from "@mui/material/styles";

import Link from "next/link";

import { AmbientBrush } from "@/components/AmbientBrush";
import { AnimatedGrid } from "@/components/AnimatedGrid";
import { LegalNav } from "@/components/LegalNav";
import { ELEMENT_ID, THEME_MODE } from "@/constants/elements";
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

// Frosted panel behind the legal copy: the animated dot grid runs full-bleed
// behind these pages and made body text hard to read where dots sat under it.
// A blurred, semi-opaque pane lifts the text onto its own readable surface.
const GlassPanel = styled(Box)(({ theme }) => ({
  position: "relative",
  background: alpha(
    theme.palette.background.default,
    theme.palette.mode === THEME_MODE.DARK ? 0.6 : 0.72,
  ),
  backdropFilter: "blur(14px)",
  WebkitBackdropFilter: "blur(14px)",
  border: `1px solid ${theme.palette.border.default}`,
  borderRadius: 16,
  padding: "36px 40px",
  [theme.breakpoints.down("sm")]: {
    padding: "28px 22px",
  },
}));

// ── Layout ─────────────────────────────────────────────────────────────

/**
 * Shared shell for the legal pages (impressum / privacy / accessibility).
 * Grid, ambient brushes, back link and the page-switcher tabs live here so
 * switching tabs only swaps the page body — no full chrome rebuild, no header
 * fly-in. The navigation/footer come from the root SiteShell, which is also
 * persistent, so the whole frame stays put between legal pages.
 */
export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { t } = useTranslation();

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
      <main
        id={ELEMENT_ID.MAIN_CONTENT}
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
          <BackLink href="/">
            <ArrowBack sx={{ fontSize: 16 }} />
            {t("errors.backHome")}
          </BackLink>

          <LegalNav />

          <GlassPanel>{children}</GlassPanel>
        </ContentContainer>
      </main>
    </>
  );
}
