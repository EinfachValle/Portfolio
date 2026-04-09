"use client";

import React, { memo } from "react";

import GitHubIcon from "@mui/icons-material/GitHub";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import { Box, styled } from "@mui/material";

import { SOCIAL_LINKS } from "@portfolio/shared";

import Link from "next/link";

import useDeviceTypeDetection from "@/hooks/useDeviceTypeDetection";

import GeneralTooltip from "../../components/GeneralTooltip";

interface SplitViewProps {
  showSplitView: boolean;
}

const MenuRoot = styled(Box, {
  shouldForwardProp: (prop) => prop !== "showSplitView",
})<SplitViewProps>(({ theme, showSplitView }) => ({
  width: "100%",
  maxHeight: "140px",
  marginTop: showSplitView ? theme.spacing(10) : theme.spacing(4),
  marginLeft: theme.spacing(0.5),
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-start",
  flexDirection: "row",
  gap: theme.spacing(2.5),
}));

const StyledBox = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: 1,
  cursor: "pointer",
  color: theme.palette.text.default,
  "&:hover": {
    color: theme.palette.text.primary,
  },
}));

interface SocialItem {
  key: number;
  url: string;
  name: string;
  icon: React.ReactNode;
}

const socials: SocialItem[] = [
  {
    key: 0,
    url: SOCIAL_LINKS.github,
    name: "GitHub",
    icon: <GitHubIcon style={{ fontSize: "24px" }} />,
  },
  {
    key: 1,
    url: SOCIAL_LINKS.linkedin,
    name: "LinkedIn",
    icon: <LinkedInIcon style={{ fontSize: "24px" }} />,
  },
  {
    key: 2,
    url: SOCIAL_LINKS.instagram,
    name: "Instagram",
    icon: <InstagramIcon style={{ fontSize: "24px" }} />,
  },
];

const SocialsMenu: React.FC = () => {
  const { isTabletHorizontal, isDesktop } = useDeviceTypeDetection();

  const showSplitView = isTabletHorizontal || isDesktop;

  return (
    <MenuRoot showSplitView={showSplitView}>
      {socials.map((social) => (
        <GeneralTooltip placement="top" title={social.name} key={social.key}>
          <Link
            href={social.url}
            target="_blank"
            style={{ textDecoration: "none" }}
            passHref
          >
            <StyledBox>{social.icon}</StyledBox>
          </Link>
        </GeneralTooltip>
      ))}
    </MenuRoot>
  );
};

export default memo(SocialsMenu);
