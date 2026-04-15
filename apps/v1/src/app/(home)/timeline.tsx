"use client";

import React, { memo, useEffect, useRef, useState } from "react";

import { useTranslation } from "react-i18next";

import { Box, styled } from "@mui/material";

import AnimatedLink from "@/components/animated-link";
import useDeviceTypeDetection from "@/hooks/useDeviceTypeDetection";

import resume from "./resume";
import SectionHeader from "./section-header";
import TimelineCard from "./timeline-card";

const RootContainer = styled(Box)({
  height: "100%",
  width: "100%",
  textAlign: "justify",
});

const Content = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  alignItems: "flex-start",
  height: "100%",
  width: "100%",
  textAlign: "justify",
  gap: theme.spacing(2),
}));

const TimeLine: React.FC = () => {
  const { t } = useTranslation();
  const { isMobileVertical } = useDeviceTypeDetection();
  const resumeData = resume(t).sort((a, b) => Number(b.to) - Number(a.to));

  const [hoveredCardIndex, setHoveredCardIndex] = useState<number | null>(null);
  const [inViewCardIndex, setInViewCardIndex] = useState<number | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!isMobileVertical) {
      setInViewCardIndex(null);
      return;
    }

    const observer = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
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

    const refs = cardRefs.current;
    refs.forEach((el) => el && observer.observe(el));
    return () => refs.forEach((el) => el && observer.unobserve(el));
  }, [isMobileVertical, inViewCardIndex]);

  if (!resumeData || resumeData.length === 0) {
    return (
      <RootContainer>
        <Box>No data available</Box>
      </RootContainer>
    );
  }

  return (
    <RootContainer>
      <SectionHeader>{t("sectionMenu.experience")}</SectionHeader>
      <Content>
        {resumeData.map((item, index) => {
          const isHovered =
            hoveredCardIndex === index ||
            (isMobileVertical && inViewCardIndex === index);
          const hasHoveredCard =
            hoveredCardIndex !== null ||
            (isMobileVertical && inViewCardIndex !== null);

          return (
            <TimelineCard
              ref={(el: HTMLDivElement | null) => {
                cardRefs.current[index] = el;
              }}
              data={item}
              key={index}
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
        <AnimatedLink href="/">{t("resume.View full resume")}</AnimatedLink>
      </Content>
    </RootContainer>
  );
};

export default memo(TimeLine);
