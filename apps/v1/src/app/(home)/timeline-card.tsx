"use client";

import React, { forwardRef, memo } from "react";

import { Box, Typography, styled } from "@mui/material";

import useDeviceTypeDetection from "@/hooks/useDeviceTypeDetection";

import type { ResumeItem } from "./resume";

interface HoverProps {
  isHovered: boolean;
  hasHoveredCard: boolean;
}

interface VerticalDeviceProps {
  isVerticalDevice: boolean;
}

const RootContainer = styled(Box, {
  shouldForwardProp: (prop) =>
    prop !== "isHovered" && prop !== "hasHoveredCard",
})<HoverProps>(({ theme, isHovered, hasHoveredCard }) => ({
  position: "relative",
  width: "100%",
  transition: "opacity 0.3s ease-in-out",
  opacity: hasHoveredCard && !isHovered ? 0.4 : 1,
  margin: theme.spacing(2, 0),
  overflow: "visible",
  cursor: isHovered ? "pointer" : undefined,
}));

const BackgroundCard = styled(Box, {
  shouldForwardProp: (prop) => prop !== "isHovered",
})<{ isHovered: boolean }>(({ isHovered }) => ({
  position: "absolute",
  transition: "all 0.3s ease-in-out",
  borderRadius: "8px",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  ...(isHovered && {
    cursor: "pointer",
    backgroundColor: "rgba(30, 41, 59, 0.5)",
    backdropFilter: "blur(4px)",
    WebkitBackdropFilter: "blur(4px)",
    boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
    top: "-16px",
    left: "-16px",
    right: "-16px",
    bottom: "-16px",
  }),
}));

const ContentContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== "isVerticalDevice",
})<VerticalDeviceProps>(({ theme, isVerticalDevice }) => ({
  position: "relative",
  display: "flex",
  flexDirection: isVerticalDevice ? "column" : "row",
  justifyContent: "flex-start",
  alignItems: "flex-start",
  gap: isVerticalDevice ? theme.spacing(2) : theme.spacing(6),
}));

const LeftSide = styled(Box)(({ theme }) => ({
  fontSize: ".75rem !important",
  fontWeight: "600 !important",
  lineHeight: "1rem",
  textTransform: "uppercase",
  letterSpacing: ".025em",
  color: theme.palette.text.informationLight,
  paddingTop: theme.spacing(0.5),
}));

const RightSide = styled(Box)({
  width: "100%",
  maxWidth: "440px",
});

const Title = styled(Typography, {
  shouldForwardProp: (prop) => prop !== "isHovered",
})<{ isHovered: boolean }>(({ theme, isHovered }) => ({
  fontSize: "1rem !important",
  fontWeight: "500 !important",
  lineHeight: "1.25",
  color: isHovered ? theme.palette.text.primary : theme.palette.text.default,
  textAlign: "left",
  transition: "color 0.3s ease-in-out",
}));

const Description = styled(Typography)(({ theme }) => ({
  fontSize: "0.875rem !important",
  fontWeight: "400 !important",
  lineHeight: "1.5",
  color: theme.palette.text.information,
  textAlign: "left",
  marginTop: theme.spacing(1),
}));

const TagsArea = styled(Box)(({ theme }) => ({
  minHeight: "50px",
  width: "100%",
  maxWidth: "450px",
  display: "flex",
  flexDirection: "row",
  justifyContent: "flex-start",
  alignItems: "center",
  flexWrap: "wrap",
  gap: theme.spacing(1.5),
  marginTop: theme.spacing(1),
}));

const Tag = styled(Box)(({ theme }) => ({
  minHeight: "25px",
  maxWidth: "450px",
  fontSize: "0.75rem !important",
  fontWeight: "500 !important",
  lineHeight: "1.25rem",
  color: theme.palette.text.primary,
  backgroundColor: "rgba(45, 212, 191, .1)",
  padding: theme.spacing(0.5, 1.5),
  borderRadius: "8px",
}));

interface TimelineCardProps {
  data: ResumeItem;
  isHovered: boolean;
  hasHoveredCard: boolean;
}

const TimelineCard = forwardRef<HTMLDivElement, TimelineCardProps>(
  ({ data, isHovered, hasHoveredCard, ...otherProps }, ref) => {
    const { isMobileVertical } = useDeviceTypeDetection();

    if (!data) return null;

    const isDataTags =
      data?.keys && Array.isArray(data?.keys) && data?.keys.length > 0;

    const isVerticalDevice = isMobileVertical;

    return (
      <RootContainer
        ref={ref}
        isHovered={isHovered}
        hasHoveredCard={hasHoveredCard}
        {...otherProps}
      >
        <BackgroundCard isHovered={isHovered} />
        <ContentContainer isVerticalDevice={isVerticalDevice}>
          <LeftSide>{`${data?.from} — ${data?.to}`}</LeftSide>
          <RightSide>
            <Title
              isHovered={isHovered}
            >{`${data?.title} · ${data?.company}`}</Title>
            <Description>{data?.description}</Description>
            {isDataTags && (
              <TagsArea>
                {data?.keys?.map((tag: string, index: number) => (
                  <Tag key={index}>{tag}</Tag>
                ))}
              </TagsArea>
            )}
          </RightSide>
        </ContentContainer>
      </RootContainer>
    );
  },
);

TimelineCard.displayName = "TimelineCard";

export default memo(TimelineCard);
