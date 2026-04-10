"use client";

import React, { memo } from "react";

import { useTranslation } from "react-i18next";

import { Box, styled } from "@mui/material";

import Link from "next/link";
import { usePathname } from "next/navigation";

import LanguageSwitch from "./LanguageSwitch";

interface VerticalLinkProps {
  active: boolean;
}

const SideColumn = styled(Box)({
  position: "fixed",
  bottom: 16,
  right: 16,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "16px",
  zIndex: 999,
});

const VerticalLink = styled(Link, {
  shouldForwardProp: (prop) => prop !== "active",
})<VerticalLinkProps>(({ theme, active }) => ({
  writingMode: "vertical-rl",
  textOrientation: "mixed",
  fontSize: "12px",
  fontWeight: 600,
  letterSpacing: "1px",
  color: active
    ? theme.palette.primary.main
    : theme.palette.text.informationLight,
  textDecoration: "none",
  opacity: active ? 1 : 0.5,
  transition: "all 0.3s ease-in-out",
  "&:hover": {
    color: theme.palette.primary.main,
    opacity: 1,
  },
}));

const Dot = styled(Box)({
  width: "3px",
  height: "3px",
  borderRadius: "50%",
  background: "rgba(255, 255, 255, 0.25)",
});

const Divider = styled(Box)({
  width: "1px",
  height: "24px",
  background: "rgba(255, 255, 255, 0.04)",
});

const SideMenu: React.FC = () => {
  const { t } = useTranslation();
  const pathname = usePathname();

  return (
    <SideColumn>
      <VerticalLink href="/legal-notice" active={pathname === "/legal-notice"}>
        {t("footer.impressum")}
      </VerticalLink>
      <Dot />
      <VerticalLink
        href="/privacy-policy"
        active={pathname === "/privacy-policy"}
      >
        {t("footer.datenschutz")}
      </VerticalLink>
      <Divider />
      <LanguageSwitch />
    </SideColumn>
  );
};

export default memo(SideMenu);
