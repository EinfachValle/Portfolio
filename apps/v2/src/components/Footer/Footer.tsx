"use client";

import { useTranslation } from "react-i18next";

import { Box, Typography } from "@mui/material";

import Link from "next/link";

export function Footer() {
  const { t } = useTranslation();

  const linkSx = {
    color: "rgba(148, 163, 184, 0.3)",
    textDecoration: "none",
    fontSize: 11,
    fontFamily: "Inter, sans-serif",
    transition: "color 0.3s ease",
    "&:hover": {
      color: "rgba(6, 182, 212, 0.5)",
    },
  };

  return (
    <Box
      component="footer"
      sx={{
        padding: "32px 40px",
        borderTop: "1px solid rgba(255, 255, 255, 0.03)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        position: "relative",
        zIndex: 2,
      }}
    >
      <Typography
        sx={{
          fontSize: 11,
          fontFamily: "Inter, sans-serif",
          color: "rgba(148, 163, 184, 0.2)",
        }}
      >
        {t("footer.copyright", { year: new Date().getFullYear() })}
      </Typography>

      <Box sx={{ display: "flex", gap: 3 }}>
        <Typography component={Link} href="/legal-notice" sx={linkSx}>
          {t("footer.legalNotice")}
        </Typography>
        <Typography component={Link} href="/privacy-policy" sx={linkSx}>
          {t("footer.privacyPolicy")}
        </Typography>
      </Box>
    </Box>
  );
}
