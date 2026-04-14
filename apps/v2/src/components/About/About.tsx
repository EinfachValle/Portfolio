"use client";

import { useEffect, useState } from "react";

import { useTranslation } from "react-i18next";

import { Box, Typography } from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";

import { REVEAL_ANIMATION, SCROLL_REVEAL_CONFIG } from "@/constants/animation";
import { SECTION_ID, THEME_MODE } from "@/constants/elements";
import { CONTENT_MAX_WIDTH, SECTION } from "@/constants/layout";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useScrollReveal } from "@/hooks/useScrollReveal";

import { CircuitCircle } from "../CircuitCircle";
import { TechOrbit } from "./TechOrbit";

const HIGHLIGHT_WORDS = new Set([
  // English
  "design",
  "development",
  "accessible",
  "pixel-perfect",
  "performant",
  // German
  "entwicklung",
  "barrierefreie",
  "pixelgenaue",
  "wartbar",
]);

// ── Styled components ────────────────────────────────────────────────

const AboutSection = styled("section")(({ theme }) => ({
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: `${SECTION.PADDING_Y}px ${SECTION.PADDING_X}px`,
  position: "relative",
  overflow: "hidden",
  [theme.breakpoints.down("sm")]: {
    padding: `${SECTION.PADDING_Y}px ${SECTION.PADDING_X_MOBILE}px`,
  },
}));

interface ContentContainerProps {
  isRevealed: boolean;
  reducedMotion: boolean;
}

const ContentContainer = styled(Box, {
  shouldForwardProp: (prop) =>
    prop !== "isRevealed" && prop !== "reducedMotion",
})<ContentContainerProps>(({ isRevealed, reducedMotion }) => ({
  maxWidth: CONTENT_MAX_WIDTH.ABOUT,
  width: "100%",
  opacity: isRevealed || reducedMotion ? 1 : 0,
  transform: isRevealed || reducedMotion ? "translateY(0)" : "translateY(60px)",
  transition: reducedMotion
    ? "none"
    : `all ${REVEAL_ANIMATION.SECTION_DURATION} ${SCROLL_REVEAL_CONFIG.EASING}`,
}));

interface WordSpanProps {
  revealed: boolean;
  reducedMotion: boolean;
  delay: number;
}

const WordSpan = styled("span", {
  shouldForwardProp: (prop) =>
    prop !== "revealed" && prop !== "reducedMotion" && prop !== "delay",
})<WordSpanProps>(({ revealed, reducedMotion, delay }) => ({
  display: "inline-block",
  opacity: revealed || reducedMotion ? 1 : 0,
  transform: revealed || reducedMotion ? "translateY(0)" : "translateY(16px)",
  transition: reducedMotion
    ? "none"
    : `opacity ${REVEAL_ANIMATION.WORD_DURATION} ${SCROLL_REVEAL_CONFIG.EASING} ${delay}ms, transform ${REVEAL_ANIMATION.WORD_DURATION} ${SCROLL_REVEAL_CONFIG.EASING} ${delay}ms`,
  whiteSpace: "pre",
}));

// ── Helpers ──────────────────────────────────────────────────────────

function splitIntoTokens(text: string): string[] {
  // Split by spaces but keep trailing spaces attached as " word" pairs
  const rawWords = text.split(" ");
  return rawWords.map((word, i) =>
    i < rawWords.length - 1 ? word + " " : word,
  );
}

function isHighlighted(word: string): boolean {
  // Strip trailing punctuation/spaces before comparing
  const clean = word.replace(/[\s.,!?;:]+$/, "").toLowerCase();
  return HIGHLIGHT_WORDS.has(clean);
}

// ── Sub-component: animated paragraph ────────────────────────────────

interface WordRevealParagraphProps {
  text: string;
  revealed: boolean;
  reducedMotion: boolean;
  wordOffset: number;
}

function WordRevealParagraph({
  text,
  revealed,
  reducedMotion,
  wordOffset,
}: WordRevealParagraphProps) {
  const theme = useTheme();
  const tokens = splitIntoTokens(text);

  return (
    <Typography
      component="p"
      sx={{
        fontSize: { xs: 16, md: 20 },
        fontWeight: 300,
        lineHeight: 1.7,
        color: theme.palette.text.body,
        m: 0,
      }}
    >
      {tokens.map((token, i) => {
        const delay = (wordOffset + i) * REVEAL_ANIMATION.WORD_STAGGER;
        const highlighted = isHighlighted(token);
        return (
          <WordSpan
            key={i}
            revealed={revealed}
            reducedMotion={reducedMotion}
            delay={delay}
            style={
              highlighted
                ? { color: theme.palette.accent.primary, fontWeight: 500 }
                : undefined
            }
          >
            {token}
          </WordSpan>
        );
      })}
    </Typography>
  );
}

// ── Component ────────────────────────────────────────────────────────

export function About() {
  const { t } = useTranslation();
  const theme = useTheme();
  const isDark = theme.palette.mode === THEME_MODE.DARK;
  const reducedMotion = useReducedMotion();

  const { ref, isRevealed } = useScrollReveal({ threshold: 0.25 });

  const [wordsRevealed, setWordsRevealed] = useState(false);

  useEffect(() => {
    if (isRevealed && !reducedMotion) {
      const timeout = setTimeout(
        () => setWordsRevealed(true),
        REVEAL_ANIMATION.WORD_REVEAL_DELAY,
      );
      return () => clearTimeout(timeout);
    }
    if (isRevealed && reducedMotion) {
      setWordsRevealed(true);
    }
  }, [isRevealed, reducedMotion]);

  const description = t("about.description");
  const description2 = t("about.description2");
  const currentWork = t("about.currentWork");

  const desc1Tokens = splitIntoTokens(description);
  const desc2Tokens = splitIntoTokens(description2);
  const desc3Tokens = splitIntoTokens(currentWork);

  // Word count offsets for stagger continuity across paragraphs
  const desc2Offset = desc1Tokens.length;
  const desc3Offset = desc2Offset + desc2Tokens.length;

  // Pill reveal starts after all words
  const totalWords =
    desc1Tokens.length + desc2Tokens.length + desc3Tokens.length;
  const pillBaseDelay = totalWords * REVEAL_ANIMATION.WORD_STAGGER;

  return (
    <AboutSection
      id={SECTION_ID.ABOUT}
      ref={ref as React.RefCallback<HTMLElement>}
    >
      {!isDark && <CircuitCircle side="right" top="5%" size={850} />}
      {/* Orbit animation (desktop/tablet: absolute, mobile: inline below text) */}
      <TechOrbit
        revealed={wordsRevealed}
        reducedMotion={reducedMotion}
        revealDelay={pillBaseDelay}
      />

      <ContentContainer
        isRevealed={isRevealed}
        reducedMotion={reducedMotion}
        sx={{ position: "relative", zIndex: 1 }}
      >
        {/* Section label */}
        <Typography
          variant="overline"
          sx={{
            display: "block",
            fontSize: 13,
            fontWeight: 600,
            letterSpacing: "4px",
            textTransform: "uppercase",
            color: "accent.muted",
            mb: 3,
          }}
        >
          {t("about.sectionLabel")}
        </Typography>

        {/* Paragraph 1 */}
        <WordRevealParagraph
          text={description}
          revealed={wordsRevealed}
          reducedMotion={reducedMotion}
          wordOffset={0}
        />

        {/* Paragraph 2 */}
        <Box sx={{ mt: "24px" }}>
          <WordRevealParagraph
            text={description2}
            revealed={wordsRevealed}
            reducedMotion={reducedMotion}
            wordOffset={desc2Offset}
          />
        </Box>

        {/* Paragraph 3 */}
        <Box sx={{ mt: "24px" }}>
          <WordRevealParagraph
            text={currentWork}
            revealed={wordsRevealed}
            reducedMotion={reducedMotion}
            wordOffset={desc3Offset}
          />
        </Box>
      </ContentContainer>
    </AboutSection>
  );
}
