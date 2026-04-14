"use client";

import { useEffect, useState } from "react";

import { useTranslation } from "react-i18next";

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

const NameWrapper = styled(Box)({
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
  ({ animDelay, enabled, reducedMotion }) => ({
    display: "inline-block",
    opacity: reducedMotion ? 1 : 0,
    transform: reducedMotion ? "none" : "translateY(100%)",
    whiteSpace: "pre",
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

const CTAButton = styled("a")(({ theme }) => ({
  display: "inline-block",
  padding: "12px 28px",
  borderRadius: 10,
  fontSize: 13,
  fontWeight: 500,
  fontFamily: FONT_FAMILY.SANS,
  textDecoration: "none",
  cursor: "pointer",
  letterSpacing: "0.5px",
  transition: `background ${TRANSITION.FAST}, color ${TRANSITION.FAST}, border-color ${TRANSITION.FAST}`,
  // Primary variant (glass)
  "&[data-variant='primary']": {
    background: `linear-gradient(135deg, ${alpha(theme.palette.accent.primary, 0.12)}, ${alpha(theme.palette.accent.secondary, 0.12)})`,
    color: alpha(theme.palette.accent.primary, 0.8),
    border: `1px solid ${alpha(theme.palette.accent.primary, 0.2)}`,
    "&:hover": {
      background: alpha(theme.palette.accent.primary, 0.18),
      borderColor: alpha(theme.palette.accent.primary, 0.35),
    },
  },
  // Secondary variant (ghost)
  "&[data-variant='secondary']": {
    background: "transparent",
    color: theme.palette.text.muted,
    border: `1px solid ${theme.palette.border.default}`,
    "&:hover": {
      borderColor: alpha(
        theme.palette.text.primary,
        theme.palette.mode === THEME_MODE.DARK ? 0.12 : 0.2,
      ),
      color: theme.palette.text.body,
    },
  },
}));

interface ScrollIndicatorProps {
  visible: boolean;
  reducedMotion: boolean;
}

const ScrollIndicator = styled("a", {
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

        {/* Name — two lines, no extra gap between them */}
        <Box>
          <NameWrapper>
            <Typography
              component="h1"
              sx={{
                fontSize: { xs: 48, md: 72 },
                fontWeight: 200,
                color: "text.primary",
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
            <NameWrapper>
              <Typography
                component="div"
                sx={{
                  fontSize: { xs: 48, md: 72 },
                  fontWeight: 700,
                  color: "text.primary",
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
            href={`#${SECTION_ID.PROJECTS}`}
            data-variant="primary"
            onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
              e.preventDefault();
              document
                .getElementById(SECTION_ID.PROJECTS)
                ?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            {exploreProjects}
          </CTAButton>
          <CTAButton
            href={`#${SECTION_ID.CONTACT}`}
            data-variant="secondary"
            onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
              e.preventDefault();
              document
                .getElementById(SECTION_ID.CONTACT)
                ?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            {getInTouch}
          </CTAButton>
        </FadeInBox>
      </ContentContainer>

      {/* Scroll indicator — hidden in mobile landscape (viewport too short) */}
      {!isMobileHorizontal && (
        <ScrollIndicator
          href={`#${SECTION_ID.ABOUT}`}
          visible={scrollVisible}
          reducedMotion={reducedMotion}
          aria-label={scrollDown}
          onClick={(e) => {
            e.preventDefault();
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
