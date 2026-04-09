"use client";

import React, { memo, useEffect, useRef } from "react";

import { useSelector } from "react-redux";

import { Box, styled } from "@mui/material";

import useDeviceTypeDetection from "@/hooks/useDeviceTypeDetection";
import type { RootState } from "@/store/store";

import AboutMe from "./about-me";
import Epilog from "./epilog";
import Projects from "./projects";
import Templates from "./templates";
import Timeline from "./timeline";

interface SplitViewProps {
  showSplitView: boolean;
}

const RootContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== "showSplitView",
})<SplitViewProps>(({ theme, showSplitView }) => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  alignItems: "flex-end",
  height: "100%",
  width: "100%",
  textAlign: "left",
  padding: showSplitView ? theme.spacing(12, 0) : theme.spacing(8, 0),
}));

const Section = styled(Box)({
  width: "100%",
  marginBottom: "9rem",
  scrollMarginTop: "6rem",
});

const LastSection = styled(Box)({
  width: "100%",
});

const ResumeCard: React.FC = ({ ...otherProps }) => {
  const activeSection = useSelector(
    (state: RootState) => state.ui.activeSection,
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const { isTabletHorizontal, isDesktop } = useDeviceTypeDetection();

  const showSplitView = isTabletHorizontal || isDesktop;

  useEffect(() => {
    if (!showSplitView) return;

    const container = containerRef.current;
    if (!activeSection || !container) return;

    const el = container.querySelector(`#${activeSection}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [activeSection, containerRef, showSplitView]);

  return (
    <RootContainer
      ref={containerRef}
      showSplitView={showSplitView}
      {...otherProps}
    >
      <Section id="aboutMe">
        <AboutMe />
      </Section>
      <Section id="experience">
        <Timeline />
      </Section>
      <Section id="projects">
        <Projects />
      </Section>
      <Section id="templates">
        <Templates />
      </Section>
      <LastSection>
        <Epilog />
      </LastSection>
    </RootContainer>
  );
};

export default memo(ResumeCard);
