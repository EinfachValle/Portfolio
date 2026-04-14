"use client";

import { useTranslation } from "react-i18next";

import { styled } from "@mui/material/styles";

import { TRANSITION } from "@/constants/animation";
import { ELEMENT_ID } from "@/constants/elements";
import { Z_INDEX } from "@/constants/layout";

const SkipLink = styled("a")(({ theme }) => ({
  position: "fixed",
  top: -100,
  left: 16,
  zIndex: Z_INDEX.SKIP_LINK,
  padding: "12px 24px",
  borderRadius: 8,
  backgroundColor: theme.palette.accent.primary,
  color: theme.palette.text.onAccent,
  fontWeight: 600,
  fontSize: 14,
  textDecoration: "none",
  transition: `top ${TRANSITION.FAST}`,
  "&:focus": {
    top: 16,
    outline: `2px solid ${theme.palette.accent.primary}`,
    outlineOffset: 2,
  },
}));

export function SkipToContent() {
  const { t } = useTranslation();

  return (
    <SkipLink href={`#${ELEMENT_ID.MAIN_CONTENT}`} suppressHydrationWarning>
      {t("a11y.skipToContent")}
    </SkipLink>
  );
}
