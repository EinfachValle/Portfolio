"use client";

import { useEffect, useState } from "react";

import { useTranslation } from "react-i18next";

import { Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

import { SCROLL_REVEAL_CONFIG } from "@/constants/animation";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useScrollReveal } from "@/hooks/useScrollReveal";

// ── Constants ───────────────────────────────────────────────────────

const TECH_STACK = [
  "TypeScript",
  "React",
  "Next.js",
  "Node.js",
  "MUI",
  "Redux",
  "PostgreSQL",
  "MongoDB",
  "Docker",
  "Git",
];

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
  padding: "80px 40px",
  [theme.breakpoints.down("sm")]: {
    padding: "80px 16px",
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
  maxWidth: 700,
  width: "100%",
  opacity: isRevealed || reducedMotion ? 1 : 0,
  transform: isRevealed || reducedMotion ? "translateY(0)" : "translateY(60px)",
  transition: reducedMotion ? "none" : "all 1s cubic-bezier(0.16, 1, 0.3, 1)",
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
    : `opacity 0.5s ${SCROLL_REVEAL_CONFIG.EASING} ${delay}ms, transform 0.5s ${SCROLL_REVEAL_CONFIG.EASING} ${delay}ms`,
  whiteSpace: "pre",
}));

interface PillProps {
  revealed: boolean;
  reducedMotion: boolean;
  delay: number;
}

const TechPill = styled("span", {
  shouldForwardProp: (prop) =>
    prop !== "revealed" && prop !== "reducedMotion" && prop !== "delay",
})<PillProps>(({ theme, revealed, reducedMotion, delay }) => ({
  display: "inline-block",
  border:
    theme.palette.mode === "dark"
      ? "1px solid rgba(255, 255, 255, 0.05)"
      : "1px solid rgba(15, 23, 42, 0.08)",
  color:
    theme.palette.mode === "dark"
      ? "rgba(148, 163, 184, 0.4)"
      : "rgba(15, 23, 42, 0.4)",
  padding: "6px 14px",
  borderRadius: 20,
  fontSize: 11,
  fontFamily: "Inter, sans-serif",
  letterSpacing: "0.5px",
  opacity: revealed || reducedMotion ? 1 : 0,
  transform: revealed || reducedMotion ? "scale(1)" : "scale(0.8)",
  transition: reducedMotion
    ? "none"
    : `opacity 0.35s ${SCROLL_REVEAL_CONFIG.EASING} ${delay}ms, transform 0.35s ${SCROLL_REVEAL_CONFIG.EASING} ${delay}ms`,
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
  const tokens = splitIntoTokens(text);

  return (
    <Typography
      component="p"
      sx={{
        fontSize: 20,
        fontWeight: 300,
        lineHeight: 1.7,
        color: "rgba(226, 232, 240, 0.7)",
        m: 0,
      }}
    >
      {tokens.map((token, i) => {
        const delay = (wordOffset + i) * 30;
        const highlighted = isHighlighted(token);
        return (
          <WordSpan
            key={i}
            revealed={revealed}
            reducedMotion={reducedMotion}
            delay={delay}
            style={
              highlighted ? { color: "#06b6d4", fontWeight: 500 } : undefined
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
  const reducedMotion = useReducedMotion();

  const { ref, isRevealed } = useScrollReveal({ threshold: 0.25 });

  const [wordsRevealed, setWordsRevealed] = useState(false);

  useEffect(() => {
    if (isRevealed && !reducedMotion) {
      const timeout = setTimeout(() => setWordsRevealed(true), 200);
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
  const pillBaseDelay = totalWords * 30;

  return (
    <AboutSection id="about" ref={ref as React.RefCallback<HTMLElement>}>
      <ContentContainer isRevealed={isRevealed} reducedMotion={reducedMotion}>
        {/* Section label */}
        <Typography
          variant="overline"
          sx={{
            display: "block",
            fontSize: 10,
            letterSpacing: "4px",
            textTransform: "uppercase",
            color: "rgba(6, 182, 212, 0.4)",
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

        {/* Tech Stack */}
        <Box sx={{ mt: "40px" }}>
          <Typography
            variant="overline"
            sx={{
              display: "block",
              fontSize: 10,
              letterSpacing: "4px",
              textTransform: "uppercase",
              color: "rgba(6, 182, 212, 0.4)",
              mb: 2,
            }}
          >
            {t("about.techStack")}
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: "8px",
            }}
          >
            {TECH_STACK.map((tech, i) => (
              <TechPill
                key={tech}
                revealed={wordsRevealed}
                reducedMotion={reducedMotion}
                delay={reducedMotion ? 0 : pillBaseDelay + i * 80}
              >
                {tech}
              </TechPill>
            ))}
          </Box>
        </Box>
      </ContentContainer>
    </AboutSection>
  );
}
