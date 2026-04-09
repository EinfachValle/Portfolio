"use client";

import React, { forwardRef, memo } from "react";

import ForkLeftRoundedIcon from "@mui/icons-material/ForkLeftRounded";
import StarBorderRoundedIcon from "@mui/icons-material/StarBorderRounded";
import { Box, Typography, styled } from "@mui/material";

import { capitalizeFirstLetter } from "@portfolio/shared";
import type { GitHubRepository } from "@portfolio/shared";

import useDeviceTypeDetection from "@/hooks/useDeviceTypeDetection";

interface ProjectCardProps {
  data: GitHubRepository;
  isHovered: boolean;
  hasHoveredCard: boolean;
}

interface RootContainerProps {
  isHovered: boolean;
  hasHoveredCard: boolean;
}

interface HoveredProps {
  isHovered: boolean;
}

const RootContainer = styled(Box, {
  shouldForwardProp: (prop) =>
    prop !== "isHovered" && prop !== "hasHoveredCard",
})<RootContainerProps>(({ theme, isHovered, hasHoveredCard }) => ({
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
})<HoveredProps>(({ isHovered }) => ({
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

const ContentContainer = styled(Box)(() => ({
  position: "relative",
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
  alignItems: "flex-start",
}));

const Title = styled(Typography, {
  shouldForwardProp: (prop) => prop !== "isHovered",
})<HoveredProps>(({ theme, isHovered }) => ({
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

const IconsContainer = styled(Box)(({ theme }) => ({
  position: "relative",
  display: "flex",
  flexDirection: "row",
  justifyContent: "flex-start",
  alignItems: "flex-start",
  marginTop: theme.spacing(2),
  gap: theme.spacing(2),
}));

const Icon = styled(Box)(({ theme }) => ({
  position: "relative",
  display: "flex",
  flexDirection: "row",
  justifyContent: "flex-start",
  alignItems: "center",
  gap: theme.spacing(0.75),
}));

const ProjectCard = forwardRef<HTMLDivElement, ProjectCardProps>(
  ({ data, isHovered, hasHoveredCard, ...otherProps }, ref) => {
    const { isMobile, isTablet } = useDeviceTypeDetection();

    const handleClick = (): void => {
      if (data?.htmlUrl) {
        window.open(data.htmlUrl, "_blank", "noopener,noreferrer");
      }
    };

    const eventProps =
      isMobile || isTablet
        ? { onTouchStart: handleClick }
        : { onClick: handleClick };

    if (!data) return null;

    const isDataTopics =
      data?.topics && Array.isArray(data?.topics) && data?.topics.length > 0;

    const starCount = data?.stars || 0;
    const forkCount = data?.forks || 0;

    const isAnyCountThere = starCount > 0 || forkCount > 0;

    return (
      <RootContainer
        ref={ref}
        isHovered={isHovered}
        hasHoveredCard={hasHoveredCard}
        {...eventProps}
        {...otherProps}
      >
        <BackgroundCard isHovered={isHovered} />
        <ContentContainer>
          <Title isHovered={isHovered}>
            {capitalizeFirstLetter(data?.name)}
            {data?.latestTag && ` · ${data.latestTag}`}
            {data?.license && ` · ${data.license}`}
          </Title>
          <Description>
            {data?.description || "No description available."}
          </Description>
          {isDataTopics && (
            <TagsArea>
              {data?.topics.map((tag: string, index: number) => (
                <Tag key={index}>{tag}</Tag>
              ))}
            </TagsArea>
          )}
          {isAnyCountThere && (
            <IconsContainer>
              {starCount > 0 && (
                <Icon>
                  <StarBorderRoundedIcon fontSize="small" />
                  <Typography variant="body2">{starCount}</Typography>
                </Icon>
              )}
              {forkCount > 0 && (
                <Icon>
                  <ForkLeftRoundedIcon fontSize="small" />
                  <Typography variant="body2">{forkCount}</Typography>
                </Icon>
              )}
            </IconsContainer>
          )}
        </ContentContainer>
      </RootContainer>
    );
  },
);

ProjectCard.displayName = "ProjectCard";

export default memo(ProjectCard);
