"use client";

import { Fragment, memo, useEffect, useRef, useState } from "react";

import { useSelector } from "react-redux";

import { useTranslation } from "react-i18next";

import { Box, Skeleton, Typography, styled } from "@mui/material";

import LanguageSwitch from "@/components/LanguageSwitch";
import ProjectCard from "@/components/ProjectCard";
import AnimatedLink from "@/components/animated-link";
import useDeviceTypeDetection from "@/hooks/useDeviceTypeDetection";
import type { RootState } from "@/store/store";

const RootContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
  alignItems: "flex-start",
  width: "100%",
  height: "100%",
  marginTop: theme.spacing(12),
}));

const Header = styled(Box)(() => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
  alignItems: "flex-start",
  width: "100%",
  textAlign: "left",
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: "700 !important",
  fontSize: "48px !important",
  lineHeight: "1",
  letterSpacing: "-1.2px",
  marginTop: theme.spacing(1),
}));

const CardsContainer = styled(Box)(({ theme }) => ({
  display: "grid",
  // auto-fit will create as many columns as fit, each at least 280px
  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
  gap: theme.spacing(4),
  width: "100%",
  marginTop: theme.spacing(4),
}));

const AbsoluteSide = styled(Box)(({ theme }) => ({
  position: "absolute",
  bottom: 16,
  right: 16,
  color: theme.palette.text.default,
  zIndex: 999,
}));

const Templates: React.FC = () => {
  const { t } = useTranslation();

  const { isMobileVertical } = useDeviceTypeDetection();
  const [hoveredCardIndex, setHoveredCardIndex] = useState<number | null>(null);
  const [inViewCardIndex, setInViewCardIndex] = useState<number | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const reposLoading = useSelector(
    (state: RootState) => state.ui.isGithubLoading,
  );
  const repos = useSelector((state: RootState) => state.ui.repositories);
  const templates = repos.filter((repo) => repo.isTemplate).slice(0, 3);

  useEffect(() => {
    if (reposLoading || !isMobileVertical) {
      setInViewCardIndex(null);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length === 0) return;

        const best = visible.reduce((a, b) =>
          a.intersectionRatio > b.intersectionRatio ? a : b,
        );
        const newIndex = cardRefs.current.indexOf(
          best.target as HTMLDivElement,
        );
        if (newIndex !== inViewCardIndex) {
          setInViewCardIndex(newIndex);
        }
      },
      {
        threshold: Array.from({ length: 101 }, (_, i) => i / 100),
        rootMargin: "0px 0px -50% 0px",
      },
    );

    cardRefs.current.forEach((el) => el && observer.observe(el));
    return () => cardRefs.current.forEach((el) => el && observer.unobserve(el));
  }, [isMobileVertical, reposLoading, inViewCardIndex]);

  if (reposLoading) {
    return (
      <RootContainer>
        <CardsContainer>
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} variant="rectangular" width="100%" height={150} />
          ))}
        </CardsContainer>
      </RootContainer>
    );
  }

  return (
    <Fragment>
      <RootContainer>
        <Header>
          <AnimatedLink withIcon={false} goBackIcon={true}>
            {t("info.name")}
          </AnimatedLink>
          <SectionTitle>{t("sectionMenu.All Templates")}</SectionTitle>
        </Header>
        <CardsContainer>
          {templates.map((item, index) => {
            const isHovered =
              hoveredCardIndex === index ||
              (isMobileVertical && inViewCardIndex === index);
            const hasHoveredCard =
              hoveredCardIndex !== null ||
              (isMobileVertical && inViewCardIndex !== null);

            return (
              <ProjectCard
                ref={(el) => {
                  cardRefs.current[index] = el;
                }}
                key={index}
                data={item}
                isHovered={isHovered}
                hasHoveredCard={hasHoveredCard}
                {...(!isMobileVertical
                  ? {
                      onMouseEnter: () => setHoveredCardIndex(index),
                      onMouseLeave: () => setHoveredCardIndex(null),
                    }
                  : {})}
              />
            );
          })}
        </CardsContainer>
      </RootContainer>
      <AbsoluteSide>
        <LanguageSwitch />
      </AbsoluteSide>
    </Fragment>
  );
};

export default memo(Templates);
