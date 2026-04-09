"use client";

import React, { memo } from "react";

import { useTranslation } from "react-i18next";

import { Button, styled } from "@mui/material";

import { LANGUAGES } from "@portfolio/shared";

const StyledButton = styled(Button)(({ theme }) => ({
  minWidth: "40px",
  width: "40px",
  height: "40px",
  padding: 0,
  background: "transparent",
  backdropFilter: "blur(4px)",
  WebkitBackdropFilter: "blur(4px)",
  transition: "all 0.3s ease-in-out",
  borderRadius: "8px",
  fontSize: "14px",
  fontWeight: "700",
  "&:hover": {
    backgroundColor: "rgba(30, 41, 59, 0.5)",
    color: theme.palette.text.default,
    boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
  },
}));

const LanguageSwitch: React.FC = () => {
  const { i18n } = useTranslation();

  const handleLanguageChange = (): void => {
    const nextLanguage =
      i18n.language === LANGUAGES.en.code
        ? LANGUAGES.de.code
        : LANGUAGES.en.code;
    i18n.changeLanguage(nextLanguage);
  };

  return (
    <StyledButton
      variant="outlined"
      size="small"
      onClick={handleLanguageChange}
    >
      {i18n.language === LANGUAGES.en.code
        ? LANGUAGES.de.code.toUpperCase()
        : LANGUAGES.en.code.toUpperCase()}
    </StyledButton>
  );
};

export default memo(LanguageSwitch);
