"use client";

import React, { memo } from "react";

import { Trans } from "react-i18next";

import { Box, Typography, styled } from "@mui/material";

import Link from "next/link";

const RootContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  alignItems: "flex-start",
  height: "100%",
  width: "100%",
  maxWidth: "450px",
  overflow: "hidden",
  textAlign: "justify",
  gap: theme.spacing(2),
}));

const AboutText = styled(Typography)(({ theme }) => ({
  fontSize: "14px !important",
  fontWeight: "400 !important",
  lineHeight: "1.25",
  color: theme.palette.text.informationLight,
  textAlign: "left",
}));

const StyledLink = styled(Link)(({ theme }) => ({
  fontSize: "14px !important",
  fontWeight: "400 !important",
  lineHeight: "1.25",
  color: theme.palette.text.default,
  textAlign: "justify",
  textDecoration: "none",
  "&:hover": {
    color: theme.palette.text.primary,
  },
}));

const Epilog: React.FC = () => {
  return (
    <RootContainer>
      <AboutText>
        <Trans
          i18nKey="about.epilog"
          components={{
            vsc: (
              <StyledLink
                href="https://code.visualstudio.com/"
                target="_blank"
                rel="noopener noreferrer"
                passHref
              />
            ),
            next: (
              <StyledLink
                href="https://nextjs.org/"
                target="_blank"
                rel="noopener noreferrer"
                passHref
              />
            ),
            mui: (
              <StyledLink
                href="https://mui.com/"
                target="_blank"
                rel="noopener noreferrer"
                passHref
              />
            ),
            vercel: (
              <StyledLink
                href="https://vercel.com/"
                target="_blank"
                rel="noopener noreferrer"
                passHref
              />
            ),
          }}
        />
      </AboutText>
    </RootContainer>
  );
};

export default memo(Epilog);
