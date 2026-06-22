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
import { THEME_MODE } from "@/constants/elements";
import { CARD, PODIUM } from "@/constants/layout";
import { FONT_FAMILY } from "@/constants/typography";

// ── Styled components ──────────────────────────────────────────────────

interface CardRootProps {
  isRevealed: boolean;
  reducedMotion: boolean;
  delay: number;
  featured: boolean;
  podium: boolean;
  cardRank?: number;
}

// Podium min-height per rank — only applied when `podium` is on (md+ preview).
function podiumHeight(rank?: number): number {
  if (rank === 1) return PODIUM.WINNER_MIN_HEIGHT;
  if (rank === 2) return PODIUM.SECOND_MIN_HEIGHT;
  return PODIUM.THIRD_MIN_HEIGHT;
}

// The whole card is a real anchor (not an article + window.open): native links
// can't be swallowed by Safari/macOS popup blockers, support cmd/middle-click,
// and are keyboard-activatable for free.
const CardRoot = styled("a", {
  shouldForwardProp: (prop) =>
    prop !== "isRevealed" &&
    prop !== "reducedMotion" &&
    prop !== "delay" &&
    prop !== "featured" &&
    prop !== "podium" &&
    prop !== "cardRank",
})<CardRootProps>(({
  theme,
  isRevealed,
  reducedMotion,
  delay,
  featured,
  podium,
  cardRank,
}) => {
  const isDark = theme.palette.mode === THEME_MODE.DARK;
  // Frosted fill. The old glass.background (≈2% white) was so transparent the
  // card read as flat AND let the bright animated grid dots shine straight
  // through — which looked like "no blur" even though backdrop-filter was
  // working. This fill is opaque enough to dampen those dots while
  // backdrop-filter softens whatever still shows through. Dark uses a
  // lightened slate so the card lifts off the near-black section background
  // (background.paper sits too close to it to register).
  const glassFill = isDark ? "rgba(28,36,50,0.62)" : "rgba(255,255,255,0.72)";
  const glassEdge = isDark
    ? "rgba(255,255,255,0.1)"
    : theme.palette.glass.border;
  // Winner: accent wash layered over the same opaque base (not a bare
  // translucent accent, which would let the dots through again).
  const featuredFill = `linear-gradient(135deg, ${alpha(theme.palette.accent.primary, 0.18)}, ${alpha(theme.palette.accent.secondary, 0.12)}), ${glassFill}`;
  return {
    position: "relative",
    background: featured ? featuredFill : glassFill,
    // Frosted glass: blur whatever (grid dots / ambient brush) sits behind the
    // card so it reads as a translucent pane, not a flat fill.
    backdropFilter: "blur(16px)",
    WebkitBackdropFilter: "blur(16px)",
    border: `1px solid ${featured ? theme.palette.glass.border : glassEdge}`,
    borderRadius: CARD.BORDER_RADIUS,
    padding: CARD.PADDING,
    cursor: "pointer",
    textDecoration: "none",
    color: "inherit",
    display: "flex",
    flexDirection: "column",
    gap: CARD.GAP,
    // Podium: bottoms aligned (grid align-items:end); taller min-height rises
    // higher → rank 1 tallest, rank 2 mid, rank 3 shortest.
    ...(podium && {
      minHeight: podiumHeight(cardRank),
    }),
    ...(featured && {
      boxShadow: `0 18px 50px ${alpha(theme.palette.accent.primary, 0.16)}`,
    }),
    opacity: isRevealed || reducedMotion ? 1 : 0,
    transform:
      isRevealed || reducedMotion ? "translateX(0)" : "translateX(-40px)",
    transition: reducedMotion
      ? "none"
      : `opacity ${REVEAL_ANIMATION.CARD_DURATION} ${SCROLL_REVEAL_CONFIG.EASING} ${delay}ms, transform ${REVEAL_ANIMATION.CARD_DURATION} ${SCROLL_REVEAL_CONFIG.EASING} ${delay}ms, background-color ${TRANSITION.FAST}, box-shadow ${TRANSITION.FAST}`,
    // Gradient border: drawn as a 1px ring via a pseudo-element (border-image
    // doesn't respect border-radius). Always on for the featured winner,
    // otherwise revealed on hover.
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
      opacity: featured ? 1 : 0,
      transition: reducedMotion ? "none" : `opacity ${TRANSITION.FAST}`,
      pointerEvents: "none",
    },
    "&:hover": {
      // Accent wash layered over the SAME opaque frosted base — swapping to a
      // bare translucent accent made the card turn see-through on hover (lost
      // its glass fill, dots bled back in). Plus a lifted glow so it's clearly
      // clickable.
      background: `linear-gradient(135deg, ${alpha(theme.palette.accent.primary, 0.16)}, ${alpha(theme.palette.accent.secondary, 0.1)}), ${glassFill}`,
      borderColor: "transparent",
      boxShadow: `0 16px 40px ${alpha(theme.palette.accent.primary, 0.22)}`,
    },
    "&:hover::before": {
      opacity: 1,
    },
    // Keyboard focus parity with hover so the focus ring reads as "actionable".
    "&:focus-visible": {
      outline: `2px solid ${theme.palette.accent.primary}`,
      outlineOffset: 3,
    },
  };
});

// Faint oversized rank numeral watermark in the corner (podium only).
const RankWatermark = styled("span")(({ theme }) => ({
  position: "absolute",
  bottom: 12,
  right: 18,
  fontSize: 56,
  fontWeight: 800,
  lineHeight: 1,
  color: alpha(theme.palette.text.primary, 0.06),
  pointerEvents: "none",
  userSelect: "none",
}));

// "Top reference" pill on the winner card — centered on the top edge so it
// straddles the border line (half above the card, half inside).
const TopBadge = styled("span")(({ theme }) => ({
  position: "absolute",
  top: 0,
  left: "50%",
  transform: "translate(-50%, -50%)",
  fontSize: 10,
  fontWeight: 600,
  letterSpacing: "0.5px",
  textTransform: "uppercase",
  padding: "4px 14px",
  borderRadius: 999,
  whiteSpace: "nowrap",
  color: theme.palette.text.onAccent,
  background: `linear-gradient(135deg, ${theme.palette.accent.primary}, ${theme.palette.accent.secondary})`,
  boxShadow: `0 4px 14px ${alpha(theme.palette.accent.primary, 0.45)}`,
}));

// Repository owner / source (e.g. "SOFTVENTURES").
const SourceLabel = styled("span")(({ theme }) => ({
  fontSize: 10,
  letterSpacing: "1px",
  textTransform: "uppercase",
  color: alpha(theme.palette.text.muted, 0.8),
  marginTop: -6,
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
  whiteSpace: "nowrap",
  flexShrink: 0,
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
  /** Podium rank (1-based). When set, a faint rank numeral is shown. */
  rank?: number;
  /** Winner styling: always-on gradient border + glow + accent tint. */
  featured?: boolean;
  /** Apply podium min-heights (taller winner, equal sides). */
  podium?: boolean;
  /** Pill label for the winner card, e.g. "Top reference". */
  topLabel?: string;
  /** Owner/source label shown under the name (e.g. "SoftVentures"). */
  source?: string;
}

// ── Component ──────────────────────────────────────────────────────────

export function ProjectCard({
  repo,
  index = 0,
  isRevealed = false,
  reducedMotion = false,
  rank,
  featured = false,
  podium = false,
  topLabel,
  source,
}: ProjectCardProps) {
  const { t } = useTranslation();
  const delay = reducedMotion ? 0 : index * SCROLL_REVEAL_CONFIG.STAGGER_DELAY;

  return (
    <CardRoot
      href={repo.htmlUrl}
      target="_blank"
      rel="noopener noreferrer"
      isRevealed={isRevealed}
      reducedMotion={reducedMotion}
      delay={delay}
      featured={featured}
      podium={podium}
      cardRank={rank}
      aria-label={t("a11y.projectCardLabel", { name: repo.name })}
    >
      {topLabel && <TopBadge>{topLabel}</TopBadge>}
      {rank != null && <RankWatermark aria-hidden="true">{rank}</RankWatermark>}

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
            fontSize: featured ? 18 : 16,
            fontWeight: 600,
            color: "text.primary",
            lineHeight: 1.3,
          }}
        >
          {repo.name}
        </Typography>
        {repo.latestTag && <TagBadge>{repo.latestTag}</TagBadge>}
      </Box>

      {source && <SourceLabel>{source}</SourceLabel>}

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
