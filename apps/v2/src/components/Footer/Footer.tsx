"use client";

import { useTranslation } from "react-i18next";

import { Box, Typography } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { TRANSITION } from "@/constants/animation";
import { SECTION, Z_INDEX } from "@/constants/layout";
import { FONT_FAMILY } from "@/constants/typography";
import useDeviceTypeDetection from "@/hooks/useDeviceTypeDetection";

import { Logo } from "../Logo";

export function Footer() {
  const { t } = useTranslation();
  const pathname = usePathname();
  const { isMobile } = useDeviceTypeDetection();

  function linkSx(href: string): SxProps<Theme> {
    const isActive = pathname === href;
    return {
      color: isActive ? "accent.primary" : "text.muted",
      textDecoration: "none",
      fontSize: 11,
      fontFamily: FONT_FAMILY.SANS,
      transition: `color ${TRANSITION.MEDIUM}`,
      "&:hover": {
        color: "accent.primary",
      },
    };
  }

  return (
    <Box
      component="footer"
      sx={{
        position: "relative",
        zIndex: Z_INDEX.FOOTER,
        backgroundColor: "background.default",
        padding: "0 0 32px",
      }}
    >
      {/* Border line with logo */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          width: "100%",
          mb: "12px",
        }}
      >
        <Box
          sx={{
            flex: 1,
            height: "1px",
            backgroundColor: "border.separator",
          }}
        />
        <Box
          component="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Scroll to top"
          sx={{
            mx: 3,
            display: "flex",
            background: "none",
            border: "none",
            padding: 0,
            cursor: "pointer",
            transition: "transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
            transform: "rotate(0deg)",
            "&:hover": {
              transition: "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
              transform: "rotate(180deg)",
            },
          }}
        >
          <Logo size={32} />
        </Box>
        <Box
          sx={{
            flex: 1,
            height: "1px",
            backgroundColor: "border.separator",
          }}
        />
      </Box>

      {/* Footer content */}
      <Box
        data-testid="footer-content"
        sx={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          justifyContent: isMobile ? "center" : "space-between",
          alignItems: "center",
          gap: isMobile ? 1.5 : 0,
          padding: `0 ${isMobile ? SECTION.PADDING_X_MOBILE : SECTION.PADDING_X}px`,
        }}
      >
        <Typography
          sx={{
            fontSize: 11,
            fontFamily: FONT_FAMILY.SANS,
            color: "text.muted",
          }}
        >
          {t("footer.copyright", { year: new Date().getFullYear() })}
        </Typography>

        <Box sx={{ display: "flex", gap: 3 }}>
          <Typography
            component={Link}
            href="/legal-notice"
            sx={linkSx("/legal-notice")}
          >
            {t("footer.legalNotice")}
          </Typography>
          <Typography
            component={Link}
            href="/privacy-policy"
            sx={linkSx("/privacy-policy")}
          >
            {t("footer.privacyPolicy")}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
