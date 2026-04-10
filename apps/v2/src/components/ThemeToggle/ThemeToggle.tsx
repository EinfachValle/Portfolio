"use client";

import { useTranslation } from "react-i18next";

import { DarkMode, LightMode } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import { setThemeMode } from "@/store/slices/uiSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";

export function ThemeToggle() {
  const { t } = useTranslation();
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const themeMode = useAppSelector((state) => state.ui.themeMode);

  const handleToggle = () => {
    const next = themeMode === "dark" ? "light" : "dark";
    dispatch(setThemeMode(next));
    localStorage.setItem("theme", next);
    document.documentElement.dataset.theme = next;
    document.documentElement.style.backgroundColor =
      next === "dark" ? "#0a0a0f" : "#fafafa";
  };

  const label = themeMode === "dark" ? "Dark" : "Light";

  return (
    <Tooltip title={label} arrow>
      <IconButton
        onClick={handleToggle}
        aria-label={t("a11y.toggleTheme")}
        sx={{
          width: 36,
          height: 36,
          borderRadius: "8px",
          border:
            theme.palette.mode === "dark"
              ? "1px solid rgba(255, 255, 255, 0.06)"
              : "1px solid rgba(15, 23, 42, 0.08)",
          background:
            theme.palette.mode === "dark"
              ? "rgba(255, 255, 255, 0.02)"
              : "rgba(15, 23, 42, 0.02)",
          color:
            theme.palette.mode === "dark"
              ? "rgba(148, 163, 184, 0.4)"
              : "rgba(15, 23, 42, 0.4)",
        }}
      >
        {themeMode === "dark" ? (
          <DarkMode fontSize="small" />
        ) : (
          <LightMode fontSize="small" />
        )}
      </IconButton>
    </Tooltip>
  );
}
