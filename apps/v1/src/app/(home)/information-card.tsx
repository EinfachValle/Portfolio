"use client";

import React, { memo } from "react";

import { useTranslation } from "react-i18next";

import { Box, Typography, styled } from "@mui/material";

import Link from "next/link";

import useDeviceTypeDetection from "@/hooks/useDeviceTypeDetection";

import SectionMenu from "./section-menu";
import SocialsMenu from "./socials-menu";

interface SplitViewProps {
  showSplitView: boolean;
}

interface MobileProps {
  isMobile: boolean;
}

const RootContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== "showSplitView",
})<SplitViewProps>(({ theme, showSplitView }) => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: showSplitView ? "space-between" : undefined,
  alignItems: "flex-start",
  height: "100%",
  width: "100%",
  overflow: "hidden",
  textAlign: "left",
  padding: showSplitView ? theme.spacing(12, 0) : theme.spacing(8, 0),
}));

const Section = styled(Box, {
  shouldForwardProp: (prop) => prop !== "showSplitView",
})<Partial<SplitViewProps>>(({ showSplitView }) => ({
  width: "100%",
  height: !showSplitView ? "100%" : undefined,
}));

const Name = styled(Typography, {
  shouldForwardProp: (prop) => prop !== "isMobile",
})<MobileProps>(({ theme, isMobile }) => ({
  fontSize: isMobile ? "2.25rem !important" : "3rem !important",
  letterSpacing: "-0.9px !important",
  fontWeight: "700 !important",
  lineHeight: isMobile ? "2.5rem !important" : "1 !important",
  color: theme.palette.text.default,
}));

const Designation = styled(Typography, {
  shouldForwardProp: (prop) => prop !== "isMobile",
})<MobileProps>(({ theme, isMobile }) => ({
  fontSize: isMobile ? "1.125rem !important" : "1.25rem !important",
  lineHeight: "1.75rem !important",
  fontWeight: "500 !important",
  letterSpacing: "-0.9px !important",
  color: theme.palette.text.default,
  marginTop: theme.spacing(1.5),
}));

const Description = styled(Typography, {
  shouldForwardProp: (prop) => prop !== "isMobile",
})<MobileProps>(({ theme, isMobile }) => ({
  fontSize: "1rem !important",
  lineHeight: isMobile ? "1.5" : "1.5 !important",
  fontWeight: "500 !important",
  color: theme.palette.text.information,
  marginTop: theme.spacing(2),
  maxWidth: "20rem",
}));

const InformationCard: React.FC = (otherProps) => {
  const { t } = useTranslation();
  const { isTabletHorizontal, isDesktop, isMobile } = useDeviceTypeDetection();

  const showSplitView = isTabletHorizontal || isDesktop;

  return (
    <RootContainer showSplitView={showSplitView} {...otherProps}>
      <Section>
        <Link
          href="https://valentinroe.com"
          target="_blank"
          style={{ textDecoration: "none" }}
          passHref
        >
          <Name isMobile={isMobile}>{t("info.name")}</Name>
        </Link>
        <Designation isMobile={isMobile}>{t("info.designation")}</Designation>
        <Description isMobile={isMobile}>{t("info.description")}</Description>
        {(isTabletHorizontal || isDesktop) && <SectionMenu />}
      </Section>
      <Section showSplitView={showSplitView}>
        <SocialsMenu />
      </Section>
    </RootContainer>
  );
};

export default memo(InformationCard);
