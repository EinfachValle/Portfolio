"use client";

import { useTranslation } from "react-i18next";

import { CallSplit, Star } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

import { capitalizeFirstLetter } from "@portfolio/shared";
import type { GitHubRepository } from "@portfolio/shared";

import { SCROLL_REVEAL_CONFIG } from "@/constants/animation";

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
  background:
    theme.palette.mode === "dark"
      ? "rgba(255, 255, 255, 0.02)"
      : "rgba(15, 23, 42, 0.02)",
  border:
    theme.palette.mode === "dark"
      ? "1px solid rgba(255, 255, 255, 0.04)"
      : "1px solid rgba(15, 23, 42, 0.06)",
  borderRadius: 14,
  padding: 28,
  cursor: "pointer",
  display: "flex",
  flexDirection: "column",
  gap: 12,
  opacity: isRevealed || reducedMotion ? 1 : 0,
  transform:
    isRevealed || reducedMotion ? "translateX(0)" : "translateX(-40px)",
  transition: reducedMotion
    ? "none"
    : `opacity 0.7s ${SCROLL_REVEAL_CONFIG.EASING} ${delay}ms, transform 0.7s ${SCROLL_REVEAL_CONFIG.EASING} ${delay}ms, border-color 0.2s ease, background-color 0.2s ease`,
  "&:hover": {
    background:
      theme.palette.mode === "dark"
        ? "rgba(255, 255, 255, 0.04)"
        : "rgba(15, 23, 42, 0.04)",
    borderColor:
      theme.palette.mode === "dark"
        ? "rgba(6, 182, 212, 0.15)"
        : "rgba(15, 23, 42, 0.15)",
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
  background:
    theme.palette.mode === "dark"
      ? "rgba(6, 182, 212, 0.06)"
      : "rgba(15, 23, 42, 0.05)",
  color:
    theme.palette.mode === "dark"
      ? "rgba(6, 182, 212, 0.5)"
      : "rgba(15, 23, 42, 0.45)",
  padding: "3px 10px",
  borderRadius: 12,
  fontSize: 10,
  fontFamily: "Inter, sans-serif",
  lineHeight: 1.6,
}));

const TagBadge = styled("span")(() => ({
  display: "inline-block",
  border: "1px solid rgba(6, 182, 212, 0.2)",
  color: "rgba(6, 182, 212, 0.5)",
  padding: "1px 8px",
  borderRadius: 4,
  fontSize: 10,
  fontFamily: "Inter, sans-serif",
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
      aria-label={`${repo.name} — open on GitHub`}
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
            color: "#f1f5f9",
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
            color: "rgba(148, 163, 184, 0.4)",
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
            <Typography
              sx={{ fontSize: 11, color: "rgba(148, 163, 184, 0.3)" }}
            >
              {capitalizeFirstLetter(repo.language)}
            </Typography>
          </Box>
        )}

        <Box sx={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <Star sx={{ fontSize: 13, color: "rgba(148, 163, 184, 0.3)" }} />
          <Typography sx={{ fontSize: 11, color: "rgba(148, 163, 184, 0.3)" }}>
            {repo.stars.toLocaleString()} {t("projects.stars")}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <CallSplit sx={{ fontSize: 13, color: "rgba(148, 163, 184, 0.3)" }} />
          <Typography sx={{ fontSize: 11, color: "rgba(148, 163, 184, 0.3)" }}>
            {repo.forks.toLocaleString()} {t("projects.forks")}
          </Typography>
        </Box>
      </Box>
    </CardRoot>
  );
}
