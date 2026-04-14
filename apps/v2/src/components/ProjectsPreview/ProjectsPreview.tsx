"use client";

import { useEffect, useRef } from "react";

import { useTranslation } from "react-i18next";

import { Box, Skeleton, Typography } from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";

import { REVEAL_ANIMATION, SCROLL_REVEAL_CONFIG } from "@/constants/animation";
import { SECTION_ID, THEME_MODE } from "@/constants/elements";
import {
  CARD as CARD_LAYOUT,
  CONTENT_MAX_WIDTH,
  SECTION,
} from "@/constants/layout";
import { FONT_FAMILY } from "@/constants/typography";
import useDeviceTypeDetection from "@/hooks/useDeviceTypeDetection";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { fetchGithubRepos } from "@/store/actions/github.actions";
import { useAppDispatch, useAppSelector } from "@/store/store";

import { CircuitCircle } from "../CircuitCircle";
import { ProjectCard } from "../ProjectCard";

// ── Styled components ──────────────────────────────────────────────────

const ProjectsSection = styled("section")(({ theme }) => ({
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: `${SECTION.PADDING_Y}px ${SECTION.PADDING_X}px`,
  position: "relative",
  overflow: "hidden",
  [theme.breakpoints.down("sm")]: {
    padding: `${SECTION.PADDING_Y}px ${SECTION.PADDING_X_MOBILE}px`,
  },
}));

interface HeaderBoxProps {
  isRevealed: boolean;
  reducedMotion: boolean;
}

const HeaderBox = styled(Box, {
  shouldForwardProp: (prop) =>
    prop !== "isRevealed" && prop !== "reducedMotion",
})<HeaderBoxProps>(({ isRevealed, reducedMotion }) => ({
  position: "relative",
  zIndex: 1,
  opacity: isRevealed || reducedMotion ? 1 : 0,
  transform: isRevealed || reducedMotion ? "translateY(0)" : "translateY(40px)",
  transition: reducedMotion
    ? "none"
    : `opacity ${REVEAL_ANIMATION.HEADER_DURATION} ${SCROLL_REVEAL_CONFIG.EASING}, transform ${REVEAL_ANIMATION.HEADER_DURATION} ${SCROLL_REVEAL_CONFIG.EASING}`,
}));

const CardsGrid = styled(Box)(({ theme }) => ({
  position: "relative",
  zIndex: 1,
  display: "grid",
  gridTemplateColumns: "1fr",
  gap: CARD_LAYOUT.GRID_GAP,
  maxWidth: CONTENT_MAX_WIDTH.CARDS,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    gridTemplateColumns: "repeat(2, 1fr)",
  },
  [theme.breakpoints.up("md")]: {
    gridTemplateColumns: "repeat(3, 1fr)",
  },
}));

// ── Skeleton card ──────────────────────────────────────────────────────

function SkeletonCard() {
  const shimmer: React.CSSProperties = {
    animationDirection: "normal",
  };

  return (
    <Box
      sx={(theme) => ({
        background: theme.palette.glass.background,
        backdropFilter: `blur(${theme.palette.glass.blur}px)`,
        WebkitBackdropFilter: `blur(${theme.palette.glass.blur}px)`,
        border: `1px solid ${theme.palette.glass.border}`,
        borderRadius: `${CARD_LAYOUT.BORDER_RADIUS}px`,
        padding: `${CARD_LAYOUT.PADDING}px`,
        display: "flex",
        flexDirection: "column",
        gap: `${CARD_LAYOUT.GAP}px`,
      })}
    >
      {/* Header: name + tag */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 1,
        }}
      >
        <Skeleton variant="text" width="55%" height={24} style={shimmer} />
        <Skeleton variant="rounded" width={42} height={20} style={shimmer} />
      </Box>

      {/* Description (3 lines) */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        <Skeleton variant="text" width="100%" height={16} style={shimmer} />
        <Skeleton variant="text" width="90%" height={16} style={shimmer} />
        <Skeleton variant="text" width="60%" height={16} style={shimmer} />
      </Box>

      {/* Topic chips */}
      <Box sx={{ display: "flex", gap: "6px", mt: "4px" }}>
        <Skeleton
          variant="rounded"
          width={58}
          height={22}
          sx={{ borderRadius: "12px" }}
          style={shimmer}
        />
        <Skeleton
          variant="rounded"
          width={72}
          height={22}
          sx={{ borderRadius: "12px" }}
          style={shimmer}
        />
        <Skeleton
          variant="rounded"
          width={50}
          height={22}
          sx={{ borderRadius: "12px" }}
          style={shimmer}
        />
      </Box>

      {/* Footer: language dot + stars + forks */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: "auto" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <Skeleton variant="circular" width={10} height={10} style={shimmer} />
          <Skeleton variant="text" width={50} height={14} style={shimmer} />
        </Box>
        <Skeleton variant="text" width={55} height={14} style={shimmer} />
        <Skeleton variant="text" width={48} height={14} style={shimmer} />
      </Box>
    </Box>
  );
}

// ── Component ──────────────────────────────────────────────────────────

export function ProjectsPreview() {
  const { t } = useTranslation();
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const { isMobile, isTablet } = useDeviceTypeDetection();
  const reducedMotion = useReducedMotion();

  const { ref, isRevealed } = useScrollReveal({ threshold: 0.15 });

  const repositories = useAppSelector((state) => state.github.repositories);
  const isLoading = useAppSelector((state) => state.github.isLoading);
  const error = useAppSelector((state) => state.github.error);

  const fetchedRef = useRef(false);
  useEffect(() => {
    if (!fetchedRef.current && repositories.length === 0 && !isLoading) {
      fetchedRef.current = true;
      void dispatch(fetchGithubRepos());
    }
  }, [dispatch, repositories.length, isLoading]);

  // Top 3 by stars, with the most-starred repo in the center position
  const top3 = [...repositories]
    .filter((r) => !r.isTemplate)
    .sort((a, b) => b.stars - a.stars)
    .slice(0, 3);
  // Reorder: [2nd, 1st, 3rd] so the top-starred is in the middle
  const featuredRepos =
    top3.length === 3 ? [top3[1]!, top3[0]!, top3[2]!] : top3;

  return (
    <ProjectsSection
      id={SECTION_ID.PROJECTS}
      ref={ref as React.RefCallback<HTMLElement>}
    >
      {theme.palette.mode === THEME_MODE.LIGHT && (
        <CircuitCircle side="left" top="15%" size={750} />
      )}
      {/* Section header */}
      <HeaderBox isRevealed={isRevealed} reducedMotion={reducedMotion}>
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
            textAlign: "center",
          }}
        >
          {t("projects.sectionLabel")}
        </Typography>
        <Typography
          component="h2"
          sx={{
            fontSize: { xs: 28, md: 36 },
            fontWeight: 200,
            color: "text.primary",
            mb: 5,
            textAlign: "center",
          }}
        >
          {t("projects.headingPrefix")}
          <Typography
            component="span"
            sx={{
              fontWeight: 700,
              background: `linear-gradient(135deg, ${theme.palette.accent.primary}, ${theme.palette.accent.tertiary})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {t("projects.headingHighlight")}
          </Typography>
        </Typography>
      </HeaderBox>

      {/* Cards grid */}
      <CardsGrid data-testid="projects-grid">
        {!isLoading && !error && featuredRepos.length > 0
          ? featuredRepos.map((repo, i) => (
              <Box
                key={repo.name}
                sx={
                  i === 1 && !isMobile && !isTablet
                    ? {
                        transform: "translateY(-12px)",
                        "& > article": { minHeight: "calc(100% + 24px)" },
                      }
                    : undefined
                }
              >
                <ProjectCard
                  repo={repo}
                  index={i}
                  isRevealed={isRevealed}
                  reducedMotion={reducedMotion}
                />
              </Box>
            ))
          : Array.from({ length: 3 }).map((_, i) => (
              <Box
                key={i}
                sx={
                  i === 1 && !isMobile && !isTablet
                    ? {
                        transform: "translateY(-12px)",
                        "& > div": { minHeight: "calc(100% + 24px)" },
                      }
                    : undefined
                }
              >
                <SkeletonCard />
              </Box>
            ))}
      </CardsGrid>

      {/* View all link */}
      {!error && (
        <Box
          sx={{
            position: "relative",
            zIndex: 1,
            mt: 2,
            textAlign: "center",
            opacity: isRevealed || reducedMotion ? 1 : 0,
            transform:
              isRevealed || reducedMotion
                ? "translateY(0)"
                : "translateY(10px)",
            transition: reducedMotion
              ? "none"
              : `opacity 0.5s ${SCROLL_REVEAL_CONFIG.EASING} ${3 * SCROLL_REVEAL_CONFIG.STAGGER_DELAY + 200}ms, transform 0.5s ${SCROLL_REVEAL_CONFIG.EASING} ${3 * SCROLL_REVEAL_CONFIG.STAGGER_DELAY + 200}ms`,
          }}
        >
          <Typography
            component="a"
            href="/projects"
            sx={{
              fontSize: 14,
              fontWeight: 500,
              color: "accent.primary",
              textDecoration: "none",
              fontFamily: FONT_FAMILY.SANS,
              transition: "opacity 0.2s ease",
              "&:hover": {
                opacity: 0.75,
              },
            }}
          >
            {t("projects.viewAll")}
          </Typography>
        </Box>
      )}
    </ProjectsSection>
  );
}
