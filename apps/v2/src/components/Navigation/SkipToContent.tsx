"use client";

import { useTranslation } from "react-i18next";

import { styled } from "@mui/material/styles";

const SkipLink = styled("a")(({ theme }) => ({
  position: "fixed",
  top: -100,
  left: 16,
  zIndex: 9999,
  padding: "12px 24px",
  borderRadius: 8,
  backgroundColor: theme.palette.accent.primary,
  color: "#fff",
  fontWeight: 600,
  fontSize: 14,
  textDecoration: "none",
  transition: "top 0.2s ease",
  "&:focus": {
    top: 16,
    outline: `2px solid ${theme.palette.accent.primary}`,
    outlineOffset: 2,
  },
}));

export function SkipToContent() {
  const { t } = useTranslation();

  return (
    <SkipLink href="#main-content" suppressHydrationWarning>
      {t("a11y.skipToContent")}
    </SkipLink>
  );
}
