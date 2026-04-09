"use client";

import React, { memo } from "react";

import { useDispatch, useSelector } from "react-redux";

import { useTranslation } from "react-i18next";

import { Box, Typography, styled } from "@mui/material";

import useDeviceTypeDetection from "@/hooks/useDeviceTypeDetection";
import type { AppDispatch, RootState } from "@/store/store";

import { setScrollTarget } from "../../store/actions/uiActions";

interface ActiveProps {
  active: boolean;
}

const MenuRoot = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
  alignItems: "flex-start",
  width: "100%",
  height: "100%",
  maxHeight: "140px",
  marginTop: theme.spacing(10),
}));

const MenuItem = styled(Box, {
  shouldForwardProp: (prop) => prop !== "active",
})<ActiveProps>(({ theme, active }) => ({
  display: "flex",
  alignItems: "center",
  gap: "8px",
  cursor: "pointer",
  color: active
    ? theme.palette.text.default
    : theme.palette.text.informationLight,
  padding: theme.spacing(1.5, 0),
  "&:hover span": {
    width: "64px",
    backgroundColor: theme.palette.text.default,
  },
  "&:hover p": {
    color: theme.palette.text.default,
    fontWeight: 700,
  },
}));

const Line = styled("span", {
  shouldForwardProp: (prop) => prop !== "active",
})<ActiveProps>(({ theme, active }) => ({
  display: "block",
  width: active ? "64px" : "32px",
  height: "1px",
  backgroundColor: active
    ? theme.palette.text.default
    : theme.palette.text.informationLight,
  transition: "width 0.3s ease",
}));

const SectionText = styled(Typography, {
  shouldForwardProp: (prop) => prop !== "active",
})<ActiveProps>(({ active }) => ({
  fontWeight: active ? "700 !important" : "500 !important",
  fontSize: "12px !important",
  lineHeight: "1rem",
  letterSpacing: "1px",
  transition: "color 0.3s",
  textTransform: "uppercase",
}));

interface SectionItem {
  id: string;
  label: string;
}

const SectionMenu: React.FC = ({ ...otherProps }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const { activeSection } = useSelector((state: RootState) => state.ui);
  const { isMobile, isTablet } = useDeviceTypeDetection();

  const sections: SectionItem[] = [
    { id: "aboutMe", label: t("sectionMenu.aboutMe") },
    { id: "experience", label: t("sectionMenu.experience") },
    { id: "projects", label: t("sectionMenu.projects") },
  ];

  const onSetScrollTarget = (id: string): void => {
    dispatch(setScrollTarget(id));
  };

  const eventProps = (item: SectionItem) =>
    isMobile || isTablet
      ? { onTouchStart: () => onSetScrollTarget(item.id) }
      : { onClick: () => onSetScrollTarget(item.id) };

  return (
    <MenuRoot {...otherProps}>
      {sections.map((item) => (
        <MenuItem
          key={item.id}
          active={activeSection === item.id}
          {...eventProps(item)}
        >
          <Line active={activeSection === item.id} />
          <SectionText active={activeSection === item.id}>
            {item.label}
          </SectionText>
        </MenuItem>
      ))}
    </MenuRoot>
  );
};

export default memo(SectionMenu);
