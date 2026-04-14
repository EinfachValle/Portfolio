"use client";

import { useTranslation } from "react-i18next";

import { DarkMode, LightMode } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import { THEME_MODE } from "@/constants/elements";
import { setThemeMode } from "@/store/actions/ui.actions";
import { useAppDispatch, useAppSelector } from "@/store/store";

export function ThemeToggle() {
  const { t } = useTranslation();
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const themeMode = useAppSelector((state) => state.ui.themeMode);

  const handleToggle = () => {
    const next =
      themeMode === THEME_MODE.DARK ? THEME_MODE.LIGHT : THEME_MODE.DARK;
    document.documentElement.classList.add("theme-transitioning");
    dispatch(setThemeMode(next));
    document.documentElement.dataset.theme = next;
    setTimeout(() => {
      document.documentElement.classList.remove("theme-transitioning");
    }, 400);
  };

  const label =
    themeMode === THEME_MODE.DARK ? t("theme.darkMode") : t("theme.lightMode");

  return (
    <Tooltip title={label} arrow>
      <IconButton
        data-testid="theme-toggle"
        onClick={handleToggle}
        aria-label={t("a11y.toggleTheme")}
        sx={{
          width: 36,
          height: 36,
          borderRadius: "8px",
          border: `1px solid ${theme.palette.border.default}`,
          background: theme.palette.glass.background,
          color: theme.palette.icon.secondary,
        }}
      >
        {themeMode === THEME_MODE.DARK ? (
          <DarkMode fontSize="small" />
        ) : (
          <LightMode fontSize="small" />
        )}
      </IconButton>
    </Tooltip>
  );
}
