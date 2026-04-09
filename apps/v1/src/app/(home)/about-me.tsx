"use client";

import React, { memo } from "react";

import { Trans, useTranslation } from "react-i18next";

import { Box, Typography, styled } from "@mui/material";

import Link from "next/link";

import SectionHeader from "./section-header";

const RootContainer = styled(Box)({
  height: "100%",
  width: "100%",
  textAlign: "left",
});

const Content = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  height: "100%",
  width: "100%",
  overflow: "hidden",
  textAlign: "left",
  gap: theme.spacing(2),
}));

const AboutText = styled(Typography)(({ theme }) => ({
  fontSize: "1rem !important",
  fontWeight: "400 !important",
  lineHeight: "1.625",
  color: theme.palette.text.information,
  textAlign: "left",
}));

const StyledLink = styled(Link)(({ theme }) => ({
  fontSize: "1rem !important",
  fontWeight: "400 !important",
  lineHeight: "1.625",
  color: theme.palette.text.default,
  textAlign: "left",
  textDecoration: "none",
  "&:hover": {
    color: theme.palette.text.primary,
  },
}));

const AboutMe: React.FC = () => {
  const { t } = useTranslation();

  return (
    <RootContainer>
      <SectionHeader>{t("sectionMenu.aboutMe")}</SectionHeader>
      <Content>
        <AboutText>{t("about.short description")}</AboutText>
        <AboutText>{t("about.short description 2")}</AboutText>
        <AboutText>
          <Trans
            i18nKey="about.what now"
            components={{
              aimway: (
                <StyledLink
                  href="https://aimway.de"
                  target="_blank"
                  rel="noopener noreferrer"
                  passHref
                />
              ),
              benova: (
                <StyledLink
                  href="https://benova.eu"
                  target="_blank"
                  rel="noopener noreferrer"
                  passHref
                />
              ),
            }}
          />
        </AboutText>
      </Content>
    </RootContainer>
  );
};

export default memo(AboutMe);
