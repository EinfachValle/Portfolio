"use client";

import { useEffect, useState } from "react";

import { useTranslation } from "react-i18next";

import { DarkMode, LightMode } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import { GeneralTooltip } from "@/components/GeneralTooltip";
import { THEME_MODE } from "@/constants/elements";
import { setThemeMode } from "@/store/actions/ui.actions";
import { useAppDispatch, useAppSelector } from "@/store/store";

export function ThemeToggle() {
  const { t } = useTranslation();
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const persistedMode = useAppSelector((state) => state.ui.themeMode);
  // Until mounted, reflect the SSR default (dark) so the icon/label match the
  // server-rendered HTML even when a light theme is persisted. Mirrors the
  // deferral in ThemeWrapper; the loader hides the post-mount swap.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const themeMode = mounted ? persistedMode : THEME_MODE.DARK;

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
    <GeneralTooltip title={label}>
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
    </GeneralTooltip>
  );
}
