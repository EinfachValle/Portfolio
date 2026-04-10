"use client";

import { useEffect, useRef } from "react";

import { useTranslation } from "react-i18next";

import { Box, Skeleton, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

import { SCROLL_REVEAL_CONFIG } from "@/constants/animation";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { fetchGithubRepos } from "@/store/slices/githubSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";

import { ProjectCard } from "../ProjectCard";

// ── Styled components ──────────────────────────────────────────────────

const ProjectsSection = styled("section")(({ theme }) => ({
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: "80px 40px",
  position: "relative",
  [theme.breakpoints.down("sm")]: {
    padding: "80px 16px",
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
  opacity: isRevealed || reducedMotion ? 1 : 0,
  transform: isRevealed || reducedMotion ? "translateY(0)" : "translateY(40px)",
  transition: reducedMotion
    ? "none"
    : `opacity 0.8s ${SCROLL_REVEAL_CONFIG.EASING}, transform 0.8s ${SCROLL_REVEAL_CONFIG.EASING}`,
}));

const CardsGrid = styled(Box)(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "1fr",
  gap: 20,
  maxWidth: 960,
  width: "100%",
  [theme.breakpoints.up("md")]: {
    gridTemplateColumns: "repeat(3, 1fr)",
  },
}));

// ── Skeleton card ──────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <Box
      sx={{
        background: "glass.background",
        border: "1px solid",
        borderColor: "glass.border",
        borderRadius: "8px",
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
      }}
    >
      <Skeleton variant="text" width="60%" height={28} />
      <Skeleton variant="text" width="100%" />
      <Skeleton variant="text" width="85%" />
      <Skeleton variant="text" width="75%" />
      <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
        <Skeleton variant="rounded" width={60} height={22} />
        <Skeleton variant="rounded" width={70} height={22} />
      </Box>
      <Box sx={{ display: "flex", gap: 2, mt: "auto" }}>
        <Skeleton variant="text" width={60} />
        <Skeleton variant="text" width={50} />
      </Box>
    </Box>
  );
}

// ── Component ──────────────────────────────────────────────────────────

export function ProjectsPreview() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
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

  const featuredRepos = repositories.filter((r) => !r.isTemplate).slice(0, 3);

  return (
    <ProjectsSection id="projects" ref={ref as React.RefCallback<HTMLElement>}>
      {/* Section header */}
      <HeaderBox isRevealed={isRevealed} reducedMotion={reducedMotion}>
        <Typography
          variant="overline"
          sx={{
            display: "block",
            fontSize: 10,
            letterSpacing: "4px",
            textTransform: "uppercase",
            color: "rgba(6, 182, 212, 0.4)",
            mb: 3,
            textAlign: "center",
          }}
        >
          {t("projects.sectionLabel")}
        </Typography>
        <Typography
          component="h2"
          sx={{
            fontSize: 36,
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
              background: "linear-gradient(135deg, #06b6d4, #a855f7)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {t("projects.headingHighlight")}
          </Typography>
        </Typography>
      </HeaderBox>

      {/* Cards grid */}
      <CardsGrid>
        {!isLoading && !error && featuredRepos.length > 0
          ? featuredRepos.map((repo, i) => (
              <ProjectCard
                key={repo.name}
                repo={repo}
                index={i}
                isRevealed={isRevealed}
                reducedMotion={reducedMotion}
              />
            ))
          : Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
      </CardsGrid>

      {/* View all link */}
      {!error && (
        <Box
          sx={{
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
              fontFamily: "Inter, sans-serif",
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
