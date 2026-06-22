"use client";

import { useEffect, useState } from "react";

import { useTranslation } from "react-i18next";

import { CodeOutlined, MailOutlined } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import { alpha, keyframes, styled, useTheme } from "@mui/material/styles";

import {
  HERO_ANIMATION,
  HERO_TIMING,
  REVEAL_ANIMATION,
  TRANSITION,
} from "@/constants/animation";
import {
  CSS_CLASS,
  ELEMENT_ID,
  EVENT,
  SECTION_ID,
  THEME_MODE,
} from "@/constants/elements";
import { CONTENT_MAX_WIDTH, SECTION } from "@/constants/layout";
import { FONT_FAMILY } from "@/constants/typography";
import { useCharReveal } from "@/hooks/useCharReveal";
import useDeviceTypeDetection from "@/hooks/useDeviceTypeDetection";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useTypewriter } from "@/hooks/useTypewriter";

import { AmbientBrush } from "../AmbientBrush";
import { AnimatedGrid } from "../AnimatedGrid";

// ── Styled components ──────────────────────────────────────────────────

const HeroSection = styled("section")({
  position: "relative",
  height: "100dvh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  overflow: "hidden",
});

const ContentContainer = styled(Box)(({ theme }) => ({
  position: "relative",
  zIndex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
  padding: `0 ${SECTION.PADDING_X}px`,
  maxWidth: CONTENT_MAX_WIDTH.HERO,
  width: "100%",
  gap: "24px",
  [theme.breakpoints.down("sm")]: {
    padding: `0 ${SECTION.PADDING_X_MOBILE}px`,
    gap: "16px",
  },
}));

// A <span> (not a div) so it's valid phrasing content inside the <h1>.
const NameWrapper = styled("span")({
  display: "block",
  overflow: "hidden",
});

const charIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(100%);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const CharSpan = styled("span", {
  shouldForwardProp: (prop) =>
    prop !== "animDelay" && prop !== "enabled" && prop !== "reducedMotion",
})<{ animDelay: number; enabled: boolean; reducedMotion: boolean }>(
  ({ theme, animDelay, enabled, reducedMotion }) => ({
    display: "inline-block",
    opacity: reducedMotion ? 1 : 0,
    transform: reducedMotion ? "none" : "translateY(100%)",
    whiteSpace: "pre",
    // Gradient fill per char — background-clip:text doesn't reach the glyphs of
    // inline-block descendants, so it must sit on the span itself. The 3D
    // extrusion/glow filter lives on the outer name Box instead, so the
    // NameWrapper's overflow:hidden (reveal mask) doesn't clip the shadow.
    background: theme.palette.name3d.gradient,
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    WebkitTextFillColor: "transparent",
    ...(enabled && !reducedMotion
      ? {
          animation: `${charIn} ${REVEAL_ANIMATION.CHAR_DURATION} cubic-bezier(0.16, 1, 0.3, 1) ${animDelay}s forwards`,
        }
      : {}),
  }),
);

interface FadeInBoxProps {
  visible: boolean;
  reducedMotion: boolean;
  delay?: number;
}

const FadeInBox = styled(Box, {
  shouldForwardProp: (prop) =>
    prop !== "visible" && prop !== "reducedMotion" && prop !== "delay",
})<FadeInBoxProps>(({ visible, reducedMotion, delay = 0 }) => ({
  opacity: visible || reducedMotion ? 1 : 0,
  transform: visible || reducedMotion ? "translateY(0)" : "translateY(12px)",
  transition: reducedMotion
    ? "none"
    : `opacity 0.6s ease ${delay}ms, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
}));

interface AccentLineProps {
  animate: boolean;
  reducedMotion: boolean;
}

const AccentLine = styled(Box, {
  shouldForwardProp: (prop) => prop !== "animate" && prop !== "reducedMotion",
})<AccentLineProps>(({ theme, animate, reducedMotion }) => ({
  height: HERO_ANIMATION.ACCENT_LINE_HEIGHT,
  width: animate || reducedMotion ? HERO_ANIMATION.ACCENT_LINE_WIDTH : 0,
  background: `linear-gradient(90deg, ${theme.palette.accent.primary}, ${alpha(theme.palette.accent.secondary, 0.5)})`,
  margin: "0 auto",
  transition: reducedMotion
    ? "none"
    : "width 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
}));

const CTAButton = styled("button")(({ theme }) => ({
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  padding: "12px 28px",
  borderRadius: 10,
  fontSize: 13,
  fontWeight: 500,
  fontFamily: FONT_FAMILY.SANS,
  textDecoration: "none",
  cursor: "pointer",
  appearance: "none",
  outline: "none",
  letterSpacing: "0.5px",
  // Frosted glass — blur the grid behind so the buttons lift off it
  backdropFilter: `blur(${theme.palette.ctaGlass.blur}px)`,
  WebkitBackdropFilter: `blur(${theme.palette.ctaGlass.blur}px)`,
  transition: `background ${TRANSITION.FAST}, color ${TRANSITION.FAST}, border-color ${TRANSITION.FAST}, box-shadow ${TRANSITION.FAST}`,
  "& .MuiSvgIcon-root": {
    fontSize: 16,
    transition: `color ${TRANSITION.FAST}`,
  },
  // Primary variant (glass) — gradient kept on hover (only alphas change) so
  // the transition interpolates smoothly instead of flashing to solid.
  "&[data-variant='primary']": {
    // Opaque frosting base (color) under the accent tint (image) so the grid
    // dots behind get frosted out instead of bleeding through.
    backgroundColor: theme.palette.ctaGlass.primaryFrost,
    backgroundImage: `linear-gradient(135deg, ${alpha(theme.palette.accent.primary, 0.2)}, ${alpha(theme.palette.accent.secondary, 0.2)})`,
    color: alpha(theme.palette.accent.primary, 0.85),
    border: `1px solid ${alpha(theme.palette.accent.primary, 0.28)}`,
    boxShadow: theme.palette.ctaGlass.primaryShadow,
    "&:hover": {
      backgroundImage: `linear-gradient(135deg, ${alpha(theme.palette.accent.primary, 0.3)}, ${alpha(theme.palette.accent.secondary, 0.3)})`,
      borderColor: alpha(theme.palette.accent.primary, 0.4),
      color: theme.palette.accent.primary,
    },
  },
  // Secondary variant (ghost) — adds a subtle background tint on hover that's
  // visible in both light and dark modes.
  "&[data-variant='secondary']": {
    // Opaque frosting base so dots don't bleed through; hover adds a tint as an
    // image layer on top of the base (keeps the frosting intact).
    backgroundColor: theme.palette.ctaGlass.ghostBackground,
    color: theme.palette.text.muted,
    border: `1px solid ${theme.palette.border.default}`,
    boxShadow: theme.palette.ctaGlass.ghostShadow,
    "&:hover": {
      backgroundImage: `linear-gradient(${alpha(
        theme.palette.text.primary,
        theme.palette.mode === THEME_MODE.DARK ? 0.05 : 0.04,
      )}, ${alpha(
        theme.palette.text.primary,
        theme.palette.mode === THEME_MODE.DARK ? 0.05 : 0.04,
      )})`,
      borderColor: alpha(
        theme.palette.text.primary,
        theme.palette.mode === THEME_MODE.DARK ? 0.2 : 0.25,
      ),
      color: theme.palette.text.primary,
    },
  },
}));

interface ScrollIndicatorProps {
  visible: boolean;
  reducedMotion: boolean;
}

const ScrollIndicator = styled("button", {
  shouldForwardProp: (prop) => prop !== "visible" && prop !== "reducedMotion",
})<ScrollIndicatorProps>(({ visible, reducedMotion }) => ({
  position: "absolute",
  bottom: 32,
  left: "50%",
  transform: "translateX(-50%)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 8,
  textDecoration: "none",
  background: "transparent",
  border: "none",
  padding: 0,
  appearance: "none",
  outline: "none",
  opacity: visible || reducedMotion ? 1 : 0,
  transition: reducedMotion ? "none" : "opacity 0.6s ease",
  cursor: "pointer",
}));

// ── Component ──────────────────────────────────────────────────────────

export function Hero() {
  const { t } = useTranslation();
  const theme = useTheme();
  const reducedMotion = useReducedMotion();
  const { isMobileHorizontal } = useDeviceTypeDetection();

  const name = t("hero.name");
  const subtitle = t("hero.subtitle");
  const tagline = t("hero.tagline");
  const exploreProjects = t("hero.exploreProjects");
  const getInTouch = t("hero.getInTouch");
  const scrollDown = t("hero.scrollDown");

  // Split name into first and last on space
  const spaceIndex = name.indexOf(" ");
  const firstName = spaceIndex >= 0 ? name.slice(0, spaceIndex) : name;
  const lastName = spaceIndex >= 0 ? name.slice(spaceIndex + 1) : "";

  // Phase flags to trigger animations in sequence
  const [nameEnabled, setNameEnabled] = useState(false);
  const [subtitleVisible, setSubtitleVisible] = useState(false);
  const [accentVisible, setAccentVisible] = useState(false);
  const [typewriterEnabled, setTypewriterEnabled] = useState(false);
  const [ctaVisible, setCtaVisible] = useState(false);
  const [scrollVisible, setScrollVisible] = useState(false);

  // Wait for loader to finish before starting hero animations
  useEffect(() => {
    if (reducedMotion) return;

    function startSequence() {
      const t0 = setTimeout(() => {
        setSubtitleVisible(true);
        setNameEnabled(true);
      }, HERO_ANIMATION.SUBTITLE_DELAY);
      const t1 = setTimeout(
        () => setAccentVisible(true),
        HERO_ANIMATION.ACCENT_DELAY,
      );
      const t2 = setTimeout(
        () => setTypewriterEnabled(true),
        HERO_ANIMATION.TYPEWRITER_DELAY,
      );
      const t3 = setTimeout(() => setCtaVisible(true), HERO_TIMING.CTA_DELAY);
      const t4 = setTimeout(
        () => setScrollVisible(true),
        HERO_TIMING.SCROLL_INDICATOR_DELAY,
      );
      return () => {
        clearTimeout(t0);
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
        clearTimeout(t4);
      };
    }

    // If loader already done (e.g. client-side navigation), start immediately
    const content = document.getElementById(ELEMENT_ID.APP_CONTENT);
    if (content?.classList.contains(CSS_CLASS.READY)) {
      const cleanup = startSequence();
      return cleanup;
    }

    // Otherwise wait for the loaderDone event
    let cleanup: (() => void) | undefined;
    function onLoaderDone() {
      cleanup = startSequence();
    }
    window.addEventListener(EVENT.LOADER_DONE, onLoaderDone);
    return () => {
      window.removeEventListener(EVENT.LOADER_DONE, onLoaderDone);
      cleanup?.();
    };
  }, [reducedMotion]);

  // Line 1 chars: base delay 0.3s + stagger
  const firstNameChars = useCharReveal(
    firstName,
    nameEnabled || reducedMotion,
    { staggerDelay: 50 },
  );

  // Line 2 chars: base delay 0.7s + stagger
  const lastNameChars = useCharReveal(lastName, nameEnabled || reducedMotion, {
    staggerDelay: 50,
  });

  const { displayText, showCursor } = useTypewriter(
    tagline,
    typewriterEnabled || reducedMotion,
  );

  return (
    <HeroSection id={SECTION_ID.HERO}>
      <AnimatedGrid intensity="full" />
      <AmbientBrush side="right" top="20%" size={500} pulseDelay={0} />

      <ContentContainer>
        {/* Subtitle — above name */}
        <FadeInBox visible={subtitleVisible} reducedMotion={reducedMotion}>
          <Typography
            data-testid="hero-subtitle"
            sx={{
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: "5px",
              textTransform: "uppercase",
              background: `linear-gradient(135deg, ${theme.palette.accent.primary}, ${theme.palette.accent.secondary})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {subtitle}
          </Typography>
        </FadeInBox>

        {/* Name — a single <h1> carrying the full name as its accessible name.
            The per-character spans are the visual treatment only (aria-hidden),
            so screen readers announce "Valentin Röhle" as one heading instead
            of spelling out each letter. The 3D extrusion/glow filter sits on
            the h1 (overflow visible) so it isn't clipped by the NameWrapper
            reveal mask below. */}
        <Box
          component="h1"
          aria-label={name}
          sx={{ filter: theme.palette.name3d.filter, m: 0 }}
        >
          <NameWrapper aria-hidden="true">
            <Typography
              component="span"
              sx={{
                display: "block",
                fontSize: { xs: 48, md: 72 },
                fontWeight: 200,
                lineHeight: 1.05,
                textAlign: "center",
              }}
            >
              {firstNameChars.map((item, i) => (
                <CharSpan
                  key={i}
                  animDelay={HERO_ANIMATION.NAME_DELAY + item.delay}
                  enabled={nameEnabled}
                  reducedMotion={reducedMotion}
                >
                  {item.char}
                </CharSpan>
              ))}
            </Typography>
          </NameWrapper>

          {lastName && (
            <NameWrapper aria-hidden="true">
              <Typography
                component="span"
                sx={{
                  display: "block",
                  fontSize: { xs: 48, md: 72 },
                  fontWeight: 700,
                  lineHeight: 1.05,
                  textAlign: "center",
                }}
              >
                {lastNameChars.map((item, i) => (
                  <CharSpan
                    key={i}
                    animDelay={HERO_ANIMATION.LASTNAME_DELAY + item.delay}
                    enabled={nameEnabled}
                    reducedMotion={reducedMotion}
                  >
                    {item.char}
                  </CharSpan>
                ))}
              </Typography>
            </NameWrapper>
          )}
        </Box>

        {/* Accent line */}
        <AccentLine animate={accentVisible} reducedMotion={reducedMotion} />

        {/* Tagline — typewriter */}
        <FadeInBox
          visible={typewriterEnabled || reducedMotion}
          reducedMotion={reducedMotion}
          sx={{ minHeight: 48, display: "flex", alignItems: "center" }}
        >
          <Typography
            sx={{
              fontSize: 15,
              fontWeight: 300,
              color: "text.muted",
              fontFamily: FONT_FAMILY.MONO,
              maxWidth: CONTENT_MAX_WIDTH.TAGLINE,
            }}
          >
            {displayText}
            {showCursor && (
              <Box
                component="span"
                sx={{
                  display: "inline-block",
                  ml: "1px",
                  color: theme.palette.accent.primary,
                  "@keyframes blink": {
                    "0%, 100%": { opacity: 1 },
                    "50%": { opacity: 0 },
                  },
                  animation: `blink ${HERO_ANIMATION.CURSOR_BLINK_DURATION}s step-end infinite`,
                }}
              >
                |
              </Box>
            )}
          </Typography>
        </FadeInBox>

        {/* CTA buttons */}
        <FadeInBox
          visible={ctaVisible}
          reducedMotion={reducedMotion}
          delay={0}
          sx={{
            display: "flex",
            gap: 2,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <CTAButton
            type="button"
            data-variant="primary"
            onClick={() => {
              document
                .getElementById(SECTION_ID.PROJECTS)
                ?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            <CodeOutlined />
            {exploreProjects}
          </CTAButton>
          <CTAButton
            type="button"
            data-variant="secondary"
            onClick={() => {
              document
                .getElementById(SECTION_ID.CONTACT)
                ?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            <MailOutlined />
            {getInTouch}
          </CTAButton>
        </FadeInBox>
      </ContentContainer>

      {/* Scroll indicator — hidden in mobile landscape (viewport too short) */}
      {!isMobileHorizontal && (
        <ScrollIndicator
          type="button"
          visible={scrollVisible}
          reducedMotion={reducedMotion}
          aria-label={scrollDown}
          onClick={() => {
            document
              .getElementById(SECTION_ID.ABOUT)
              ?.scrollIntoView({ behavior: "smooth" });
          }}
        >
          <Typography
            sx={{
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: "3px",
              textTransform: "uppercase",
              color: theme.palette.text.faint,
            }}
          >
            {scrollDown}
          </Typography>
          <Box
            sx={{
              width: "1px",
              height: HERO_ANIMATION.SCROLL_PULSE_HEIGHT,
              background: `linear-gradient(180deg, ${theme.palette.accent.muted}, transparent)`,
              "@keyframes scrollPulse": {
                "0%, 100%": { opacity: 0.3, transform: "scaleY(0.7)" },
                "50%": { opacity: 1, transform: "scaleY(1)" },
              },
              animation: `scrollPulse ${HERO_ANIMATION.SCROLL_PULSE_DURATION}s infinite`,
            }}
          />
        </ScrollIndicator>
      )}
    </HeroSection>
  );
}
