"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { useTranslation } from "react-i18next";

import { ArrowBack } from "@mui/icons-material";
import { Box, Button, Skeleton, Typography } from "@mui/material";
import { alpha, styled, useTheme } from "@mui/material/styles";

import type { GitHubRepository } from "@portfolio/shared";

import Link from "next/link";

import { AmbientBrush } from "@/components/AmbientBrush";
import { AnimatedGrid } from "@/components/AnimatedGrid";
import { Footer } from "@/components/Footer";
import { Navigation, SkipToContent } from "@/components/Navigation";
import { ProjectCard } from "@/components/ProjectCard";
import { TRANSITION } from "@/constants/animation";
import { ELEMENT_ID } from "@/constants/elements";
import {
  CARD as CARD_LAYOUT,
  CONTENT_MAX_WIDTH,
  SECTION,
} from "@/constants/layout";
import { FONT_FAMILY } from "@/constants/typography";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { fetchGithubRepos } from "@/store/actions/github.actions";
import { useAppDispatch, useAppSelector } from "@/store/store";

// ── Types ──────────────────────────────────────────────────────────────

type FilterType = "all" | "projects" | "templates";
type SortType = "stars" | "recent" | "language";

// ── Styled components ──────────────────────────────────────────────────

const PageWrapper = styled(Box)({
  position: "relative",
  minHeight: "100dvh",
  display: "flex",
  flexDirection: "column",
});

const MainContent = styled("main")(({ theme }) => ({
  flex: 1,
  display: "flex",
  justifyContent: "center",
  padding: `120px ${SECTION.PADDING_X}px 80px`,
  [theme.breakpoints.down("sm")]: {
    padding: `120px ${SECTION.PADDING_X_MOBILE}px 80px`,
  },
}));

const GradientPageTitle = styled("h1")(({ theme }) => ({
  margin: "0 0 16px 0",
  fontSize: 36,
  fontWeight: 700,
  letterSpacing: "-0.5px",
  lineHeight: 1,
  backgroundImage: `linear-gradient(135deg, ${theme.palette.accent.primary}, ${theme.palette.accent.secondary})`,
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
  color: "transparent",
  [theme.breakpoints.up("md")]: {
    fontSize: 48,
  },
}));

const ContentContainer = styled(Box)({
  maxWidth: CONTENT_MAX_WIDTH.PROJECTS_PAGE,
  width: "100%",
  position: "relative",
  zIndex: 1,
});

const BackLink = styled(Link)(({ theme }) => ({
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  color: theme.palette.text.muted,
  textDecoration: "none",
  fontSize: 14,
  fontFamily: FONT_FAMILY.SANS,
  fontWeight: 500,
  marginBottom: 32,
  transition: `color ${TRANSITION.FAST}`,
  "&:hover": {
    color: theme.palette.accent.primary,
  },
}));

interface FilterButtonProps {
  active: boolean;
}

const FilterButton = styled("button", {
  shouldForwardProp: (prop) => prop !== "active",
})<FilterButtonProps>(({ theme, active }) => ({
  display: "inline-flex",
  alignItems: "center",
  padding: "6px 16px",
  borderRadius: 20,
  fontSize: 13,
  fontFamily: FONT_FAMILY.SANS,
  fontWeight: 500,
  cursor: "pointer",
  border: "none",
  transition:
    "background-color 0.2s ease, color 0.2s ease, box-shadow 0.2s ease",
  backgroundColor: active ? theme.palette.accent.primary : "transparent",
  color: active ? theme.palette.text.onAccent : theme.palette.text.muted,
  boxShadow: active
    ? `0 0 12px ${alpha(theme.palette.accent.primary, 0.38)}`
    : "none",
  "&:hover": {
    backgroundColor: active
      ? theme.palette.accent.primary
      : alpha(theme.palette.accent.primary, 0.094),
    color: active ? theme.palette.text.onAccent : theme.palette.accent.primary,
  },
}));

const SortButton = styled("button", {
  shouldForwardProp: (prop) => prop !== "active",
})<FilterButtonProps>(({ theme, active }) => ({
  display: "inline-flex",
  alignItems: "center",
  padding: "5px 12px",
  borderRadius: 6,
  fontSize: 12,
  fontFamily: FONT_FAMILY.SANS,
  fontWeight: 500,
  cursor: "pointer",
  border: `1px solid ${active ? theme.palette.accent.primary : theme.palette.border.default}`,
  transition: "border-color 0.2s ease, color 0.2s ease",
  backgroundColor: "transparent",
  color: active ? theme.palette.accent.primary : theme.palette.text.muted,
  "&:hover": {
    borderColor: theme.palette.accent.primary,
    color: theme.palette.accent.primary,
  },
}));

const CardsGrid = styled(Box)(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "1fr",
  gap: CARD_LAYOUT.GRID_GAP_FULL,
  [theme.breakpoints.up("sm")]: {
    gridTemplateColumns: "repeat(2, 1fr)",
  },
  [theme.breakpoints.up("lg")]: {
    gridTemplateColumns: "repeat(3, 1fr)",
  },
}));

// ── Skeleton card ──────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <Box
      sx={{
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

// ── Filter + sort logic ────────────────────────────────────────────────

function filterAndSort(
  repos: GitHubRepository[],
  filter: FilterType,
  sort: SortType,
): GitHubRepository[] {
  let result = [...repos];

  // Filter
  if (filter === "projects") {
    result = result.filter((r) => !r.isTemplate);
  } else if (filter === "templates") {
    result = result.filter((r) => r.isTemplate);
  }

  // Sort
  if (sort === "stars") {
    result.sort((a, b) => b.stars - a.stars);
  } else if (sort === "recent") {
    result.sort((a, b) => {
      const aKey = a.latestTag ?? a.name;
      const bKey = b.latestTag ?? b.name;
      return bKey.localeCompare(aKey);
    });
  } else if (sort === "language") {
    result.sort((a, b) => {
      const aLang = a.language ?? "zzz";
      const bLang = b.language ?? "zzz";
      return aLang.localeCompare(bLang);
    });
  }

  return result;
}

// ── Component ──────────────────────────────────────────────────────────

export default function ProjectsContent() {
  const { t } = useTranslation();
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const reducedMotion = useReducedMotion();

  const [filter, setFilter] = useState<FilterType>("all");
  const [sort, setSort] = useState<SortType>("stars");

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

  const displayedRepos = useMemo(
    () => filterAndSort(repositories, filter, sort),
    [repositories, filter, sort],
  );

  const filterOptions: { key: FilterType; label: string }[] = [
    { key: "all", label: t("projects.filterAll") },
    { key: "projects", label: t("projects.filterProjects") },
    { key: "templates", label: t("projects.filterTemplates") },
  ];

  const sortOptions: { key: SortType; label: string }[] = [
    { key: "stars", label: t("projects.sortByStars") },
    { key: "recent", label: t("projects.sortByRecent") },
    { key: "language", label: t("projects.sortByLanguage") },
  ];

  return (
    <PageWrapper>
      <AmbientBrush side="right" top="10%" size={600} pulseDelay={0} />
      <AmbientBrush
        side="left"
        top="55%"
        size={550}
        color="primary"
        pulseDelay={4}
      />
      <SkipToContent />
      <Navigation />

      <Box
        sx={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}
      >
        <AnimatedGrid intensity="subtle" />
      </Box>

      <MainContent id={ELEMENT_ID.MAIN_CONTENT}>
        <ContentContainer>
          {/* Back link */}
          <BackLink href="/">
            <ArrowBack sx={{ fontSize: 16 }} />
            {t("errors.backHome")}
          </BackLink>

          {/* Page title — gradient text */}
          <GradientPageTitle>{t("nav.projects")}</GradientPageTitle>

          {/* Filter + sort controls */}
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 2,
              mb: 4,
            }}
          >
            {/* Filter tabs */}
            <Box
              sx={{
                display: "flex",
                gap: 1,
                p: "4px",
                borderRadius: 24,
                border: `1px solid ${theme.palette.border.default}`,
                backgroundColor: theme.palette.glass.background,
              }}
            >
              {filterOptions.map((opt) => (
                <FilterButton
                  key={opt.key}
                  data-testid={`filter-${opt.key}`}
                  active={filter === opt.key}
                  onClick={() => setFilter(opt.key)}
                >
                  {opt.label}
                </FilterButton>
              ))}
            </Box>

            {/* Sort buttons */}
            <Box sx={{ display: "flex", gap: 1 }}>
              {sortOptions.map((opt) => (
                <SortButton
                  key={opt.key}
                  active={sort === opt.key}
                  onClick={() => setSort(opt.key)}
                >
                  {opt.label}
                </SortButton>
              ))}
            </Box>
          </Box>

          {/* Cards grid */}
          <CardsGrid data-testid="projects-page-grid">
            {isLoading &&
              Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}

            {!isLoading &&
              !error &&
              displayedRepos.length > 0 &&
              displayedRepos.map((repo, i) => (
                <ProjectCard
                  key={repo.name}
                  repo={repo}
                  index={i}
                  isRevealed={true}
                  reducedMotion={reducedMotion}
                />
              ))}

            {!isLoading && !error && displayedRepos.length === 0 && (
              <Box sx={{ gridColumn: "1 / -1" }}>
                <Typography sx={{ fontSize: 14, color: "text.muted" }}>
                  {t("projects.noResults")}
                </Typography>
              </Box>
            )}

            {!isLoading && error && (
              <Box
                sx={{
                  gridColumn: "1 / -1",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  gap: 2,
                }}
              >
                <Typography sx={{ fontSize: 14, color: "text.muted" }}>
                  {t("projects.loadError")}
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => void dispatch(fetchGithubRepos())}
                  sx={{
                    borderColor: "accent.primary",
                    color: "accent.primary",
                    "&:hover": {
                      borderColor: "accent.primary",
                      backgroundColor: "transparent",
                      filter: "brightness(1.2)",
                    },
                  }}
                >
                  {t("projects.retry")}
                </Button>
              </Box>
            )}
          </CardsGrid>
        </ContentContainer>
      </MainContent>

      <Footer />
    </PageWrapper>
  );
}
