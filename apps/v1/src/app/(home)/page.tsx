"use client";

import React, { Fragment, memo, useEffect, useState } from "react";

import { Box, CircularProgress, styled } from "@mui/material";

import LanguageSwitch from "@/components/LanguageSwitch";
import useDeviceTypeDetection from "@/hooks/useDeviceTypeDetection";

import InformationCard from "./information-card";
import ResumeCard from "./resume-card";

interface SplitViewProps {
  showSplitView: boolean;
}

const RootContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== "showSplitView",
})<SplitViewProps>(({ theme, showSplitView }) => ({
  display: "flex",
  flexDirection: showSplitView ? "row" : "column",
  minHeight: "100vh",
  height: "100%",
  width: "100%",
  padding: "0",
  gap: theme.spacing(2),
}));

const ScrollableSide = styled(Box, {
  shouldForwardProp: (prop) => prop !== "showSplitView",
})<SplitViewProps>(({ theme, showSplitView }) => ({
  display: "flex",
  flexDirection: "column",
  flexGrow: showSplitView ? 1 : undefined,
  height: "100%",
  width: showSplitView ? "52%" : "100%",
  minHeight: "100vh",
  gap: theme.spacing(1),
  background: theme.palette.surface.interface.base,
  color: theme.palette.text.default,
  zIndex: 999,
}));

const StaticSide = styled(Box, {
  shouldForwardProp: (prop) => prop !== "showSplitView",
})<SplitViewProps>(({ theme, showSplitView }) => ({
  display: "flex",
  flexDirection: "column",
  flexShrink: showSplitView ? 0 : undefined,
  height: showSplitView ? "100vh" : undefined,
  width: showSplitView ? "48%" : "100%",
  position: showSplitView ? "sticky" : undefined,
  top: showSplitView ? 0 : undefined,
  gap: theme.spacing(1),
  overflow: "hidden",
  background: theme.palette.surface.interface.base,
  color: theme.palette.text.default,
  zIndex: 999,
}));

const LoaderContainer = styled(Box)({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "100vh",
  width: "100%",
});

const AbsoluteSide = styled(Box)(({ theme }) => ({
  position: "absolute",
  bottom: 16,
  right: 16,
  color: theme.palette.text.default,
  zIndex: 999,
}));

const Home: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { isTabletHorizontal, isDesktop } = useDeviceTypeDetection();

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const showSplitView = isTabletHorizontal || isDesktop;

  if (isLoading) {
    return (
      <LoaderContainer>
        <CircularProgress />
      </LoaderContainer>
    );
  }

  return (
    <Fragment>
      <RootContainer showSplitView={showSplitView}>
        <StaticSide showSplitView={showSplitView}>
          <InformationCard />
        </StaticSide>
        <ScrollableSide showSplitView={showSplitView}>
          <ResumeCard />
        </ScrollableSide>
      </RootContainer>
      <AbsoluteSide>
        <LanguageSwitch />
      </AbsoluteSide>
    </Fragment>
  );
};

export default memo(Home);
