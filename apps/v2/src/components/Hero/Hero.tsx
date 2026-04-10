"use client";

import { useEffect, useState } from "react";

import { useTranslation } from "react-i18next";

import { Box, Typography } from "@mui/material";
import { keyframes, styled, useTheme } from "@mui/material/styles";

import { HERO_TIMING } from "@/constants/animation";
import { useCharReveal } from "@/hooks/useCharReveal";
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

const ContentContainer = styled(Box)({
  position: "relative",
  zIndex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
  padding: "0 24px",
  maxWidth: 800,
  width: "100%",
  gap: "24px",
});

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
          animation: `${charIn} 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${animDelay}s forwards`,
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
})<AccentLineProps>(({ animate, reducedMotion }) => ({
  height: 2,
  width: animate || reducedMotion ? 64 : 0,
  background: "linear-gradient(90deg, #06b6d4, rgba(99, 102, 241, 0.5))",
  margin: "0 auto",
  transition: reducedMotion
    ? "none"
    : "width 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
}));

const CTAButton = styled("a")(() => ({
  display: "inline-block",
  padding: "12px 28px",
  borderRadius: 10,
  fontSize: 13,
  fontWeight: 500,
  fontFamily: "Inter, sans-serif",
  textDecoration: "none",
  cursor: "pointer",
  letterSpacing: "0.5px",
  transition: "background 0.2s ease, color 0.2s ease, border-color 0.2s ease",
  // Primary variant (glass)
  "&[data-variant='primary']": {
    background:
      "linear-gradient(135deg, rgba(6, 182, 212, 0.12), rgba(99, 102, 241, 0.12))",
    color: "rgba(6, 182, 212, 0.8)",
    border: "1px solid rgba(6, 182, 212, 0.2)",
    "&:hover": {
      background: "rgba(6, 182, 212, 0.18)",
      borderColor: "rgba(6, 182, 212, 0.35)",
    },
  },
  // Secondary variant (ghost)
  "&[data-variant='secondary']": {
    background: "transparent",
    color: "rgba(148, 163, 184, 0.45)",
    border: "1px solid rgba(255, 255, 255, 0.06)",
    "&:hover": {
      borderColor: "rgba(255, 255, 255, 0.12)",
      color: "rgba(148, 163, 184, 0.7)",
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
      }, 300);
      const t1 = setTimeout(() => setAccentVisible(true), 1100);
      const t2 = setTimeout(() => setTypewriterEnabled(true), 1300);
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
    const content = document.getElementById("app-content");
    if (content?.classList.contains("ready")) {
      const cleanup = startSequence();
      return cleanup;
    }

    // Otherwise wait for the loaderDone event
    let cleanup: (() => void) | undefined;
    function onLoaderDone() {
      cleanup = startSequence();
    }
    window.addEventListener("loaderDone", onLoaderDone);
    return () => {
      window.removeEventListener("loaderDone", onLoaderDone);
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
    <HeroSection id="hero">
      <AnimatedGrid intensity="full" />

      <ContentContainer>
        {/* Subtitle — above name */}
        <FadeInBox visible={subtitleVisible} reducedMotion={reducedMotion}>
          <Typography
            sx={{
              fontSize: 11,
              fontWeight: 400,
              letterSpacing: "5px",
              textTransform: "uppercase",
              color: "rgba(6, 182, 212, 0.5)",
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
                  animDelay={0.3 + item.delay}
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
                    animDelay={0.7 + item.delay}
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
              color: "rgba(148, 163, 184, 0.45)",
              fontFamily: "monospace",
              maxWidth: 560,
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
                  animation: "blink 1.06s step-end infinite",
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
            href="#projects"
            data-variant="primary"
            onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
              e.preventDefault();
              document
                .getElementById("projects")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            {exploreProjects}
          </CTAButton>
          <CTAButton
            href="#contact"
            data-variant="secondary"
            onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
              e.preventDefault();
              document
                .getElementById("contact")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            {getInTouch}
          </CTAButton>
        </FadeInBox>
      </ContentContainer>

      {/* Scroll indicator */}
      <ScrollIndicator
        href="#about"
        visible={scrollVisible}
        reducedMotion={reducedMotion}
        aria-label={scrollDown}
        onClick={(e) => {
          e.preventDefault();
          document
            .getElementById("about")
            ?.scrollIntoView({ behavior: "smooth" });
        }}
      >
        <Typography
          sx={{
            fontSize: 10,
            fontWeight: 400,
            letterSpacing: "2px",
            textTransform: "uppercase",
            color: "rgba(148, 163, 184, 0.2)",
          }}
        >
          {scrollDown}
        </Typography>
        <Box
          sx={{
            width: "1px",
            height: 32,
            background:
              "linear-gradient(180deg, rgba(6, 182, 212, 0.3), transparent)",
            "@keyframes scrollPulse": {
              "0%, 100%": { opacity: 0.3, transform: "scaleY(0.7)" },
              "50%": { opacity: 1, transform: "scaleY(1)" },
            },
            animation: "scrollPulse 2s infinite",
          }}
        />
      </ScrollIndicator>
    </HeroSection>
  );
}
