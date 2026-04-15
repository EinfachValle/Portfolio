"use client";

import { useTranslation } from "react-i18next";

import { CallSplit, Star } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import { alpha, styled } from "@mui/material/styles";

import { capitalizeFirstLetter } from "@portfolio/shared";
import type { GitHubRepository } from "@portfolio/shared";

import {
  REVEAL_ANIMATION,
  SCROLL_REVEAL_CONFIG,
  TRANSITION,
} from "@/constants/animation";
import { CARD } from "@/constants/layout";
import { FONT_FAMILY } from "@/constants/typography";

// ── Styled components ──────────────────────────────────────────────────

interface CardRootProps {
  isRevealed: boolean;
  reducedMotion: boolean;
  delay: number;
}

const CardRoot = styled("article", {
  shouldForwardProp: (prop) =>
    prop !== "isRevealed" && prop !== "reducedMotion" && prop !== "delay",
})<CardRootProps>(({ theme, isRevealed, reducedMotion, delay }) => ({
  position: "relative",
  background: theme.palette.glass.background,
  border: `1px solid ${theme.palette.glass.border}`,
  borderRadius: CARD.BORDER_RADIUS,
  padding: CARD.PADDING,
  cursor: "pointer",
  display: "flex",
  flexDirection: "column",
  gap: CARD.GAP,
  opacity: isRevealed || reducedMotion ? 1 : 0,
  transform:
    isRevealed || reducedMotion ? "translateX(0)" : "translateX(-40px)",
  transition: reducedMotion
    ? "none"
    : `opacity ${REVEAL_ANIMATION.CARD_DURATION} ${SCROLL_REVEAL_CONFIG.EASING} ${delay}ms, transform ${REVEAL_ANIMATION.CARD_DURATION} ${SCROLL_REVEAL_CONFIG.EASING} ${delay}ms, background-color ${TRANSITION.FAST}`,
  // Gradient border on hover: draw a 1px gradient ring via a pseudo-element
  // (border-image doesn't respect border-radius, so this is the standard
  // workaround that keeps rounded corners intact).
  "&::before": {
    content: '""',
    position: "absolute",
    inset: -1,
    borderRadius: "inherit",
    padding: "1px",
    background: `linear-gradient(135deg, ${theme.palette.accent.primary}, ${theme.palette.accent.secondary})`,
    WebkitMask:
      "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
    WebkitMaskComposite: "xor",
    maskComposite: "exclude",
    opacity: 0,
    transition: reducedMotion ? "none" : `opacity ${TRANSITION.FAST}`,
    pointerEvents: "none",
  },
  "&:hover": {
    // Subtle accent-tinted lift + glass blur that matches the gradient border.
    // glass.border was dark-navy in light mode, making the card visually heavy.
    background: alpha(theme.palette.accent.primary, 0.06),
    backdropFilter: "blur(8px)",
    WebkitBackdropFilter: "blur(8px)",
    borderColor: "transparent",
  },
  "&:hover::before": {
    opacity: 1,
  },
}));

const LanguageDot = styled("span")<{ color: string }>(({ color }) => ({
  display: "inline-block",
  width: 10,
  height: 10,
  borderRadius: "50%",
  backgroundColor: color,
  flexShrink: 0,
}));

const TopicChip = styled("span")(({ theme }) => ({
  display: "inline-block",
  border: "none",
  background: alpha(theme.palette.accent.primary, 0.06),
  color: alpha(theme.palette.accent.primary, 0.5),
  padding: "3px 10px",
  borderRadius: 12,
  fontSize: 10,
  fontFamily: FONT_FAMILY.SANS,
  lineHeight: 1.6,
}));

const TagBadge = styled("span")(({ theme }) => ({
  display: "inline-block",
  border: `1px solid ${alpha(theme.palette.accent.primary, 0.2)}`,
  color: alpha(theme.palette.accent.primary, 0.5),
  padding: "1px 8px",
  borderRadius: 4,
  fontSize: 10,
  fontFamily: FONT_FAMILY.SANS,
  fontWeight: 500,
}));

// ── Language color map ─────────────────────────────────────────────────

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f0db4f",
  Python: "#3572a5",
  Rust: "#dea584",
  Go: "#00add8",
  Java: "#b07219",
  "C#": "#178600",
  "C++": "#f34b7d",
  CSS: "#563d7c",
  HTML: "#e34c26",
  Vue: "#41b883",
  Svelte: "#ff3e00",
  Shell: "#89e051",
  Kotlin: "#a97bff",
  Swift: "#f05138",
};

function getLanguageColor(language: string): string {
  return LANGUAGE_COLORS[language] ?? "#8b949e";
}

// ── Props ──────────────────────────────────────────────────────────────

export interface ProjectCardProps {
  repo: GitHubRepository;
  index?: number;
  isRevealed?: boolean;
  reducedMotion?: boolean;
}

// ── Component ──────────────────────────────────────────────────────────

export function ProjectCard({
  repo,
  index = 0,
  isRevealed = false,
  reducedMotion = false,
}: ProjectCardProps) {
  const { t } = useTranslation();
  const delay = reducedMotion ? 0 : index * SCROLL_REVEAL_CONFIG.STAGGER_DELAY;

  function handleClick() {
    window.open(repo.htmlUrl, "_blank", "noopener,noreferrer");
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick();
    }
  }

  return (
    <CardRoot
      isRevealed={isRevealed}
      reducedMotion={reducedMotion}
      delay={delay}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="link"
      tabIndex={0}
      aria-label={t("a11y.projectCardLabel", { name: repo.name })}
    >
      {/* Header: name + optional tag badge */}
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 1,
        }}
      >
        <Typography
          sx={{
            fontSize: 16,
            fontWeight: 600,
            color: "text.primary",
            lineHeight: 1.3,
          }}
        >
          {repo.name}
        </Typography>
        {repo.latestTag && <TagBadge>{repo.latestTag}</TagBadge>}
      </Box>

      {/* Description */}
      {repo.description && (
        <Typography
          sx={{
            fontSize: 12,
            color: "text.muted",
            lineHeight: 1.6,
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {repo.description}
        </Typography>
      )}

      {/* Topic chips */}
      {repo.topics.length > 0 && (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
          {repo.topics.slice(0, 5).map((topic) => (
            <TopicChip key={topic}>{topic}</TopicChip>
          ))}
        </Box>
      )}

      {/* Footer: language + stars + forks */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          mt: "auto",
          flexWrap: "wrap",
        }}
      >
        {repo.language && (
          <Box sx={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <LanguageDot color={getLanguageColor(repo.language)} />
            <Typography sx={{ fontSize: 11, color: "text.muted" }}>
              {capitalizeFirstLetter(repo.language)}
            </Typography>
          </Box>
        )}

        <Box sx={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <Star sx={{ fontSize: 13, color: "text.muted" }} />
          <Typography sx={{ fontSize: 11, color: "text.muted" }}>
            {repo.stars.toLocaleString()}{" "}
            {t(repo.stars === 1 ? "projects.star" : "projects.stars")}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <CallSplit sx={{ fontSize: 13, color: "text.muted" }} />
          <Typography sx={{ fontSize: 11, color: "text.muted" }}>
            {repo.forks.toLocaleString()}{" "}
            {t(repo.forks === 1 ? "projects.fork" : "projects.forks")}
          </Typography>
        </Box>
      </Box>
    </CardRoot>
  );
}
