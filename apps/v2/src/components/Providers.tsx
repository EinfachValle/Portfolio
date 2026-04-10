"use client";

import { useEffect, useLayoutEffect, useMemo, useState } from "react";

import { Provider } from "react-redux";

import { I18nextProvider } from "react-i18next";

import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";

import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import { Analytics } from "@vercel/analytics/next";
import { Toaster } from "sonner";

import i18n from "../config/i18n";
import { type ThemeMode, setThemeMode } from "../store/slices/uiSlice";
import { store, useAppDispatch, useAppSelector } from "../store/store";
import getTheme from "../theme";

// Stable Emotion cache — avoids insertBefore crash on theme switch
const emotionCache = createCache({ key: "mui", prepend: true });

// ── Inner component that can use Redux hooks ───────────────────────

function ThemeWrapper({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const themeMode = useAppSelector((state) => state.ui.themeMode);
  const theme = useMemo(() => getTheme(themeMode), [themeMode]);
  const [mounted, setMounted] = useState(false);

  // Sync Redux with blocking script result before first paint
  useLayoutEffect(() => {
    const stored = localStorage.getItem("theme") as ThemeMode | null;
    const resolved: ThemeMode =
      (document.documentElement.dataset.theme as ThemeMode) || stored || "dark";

    if (resolved !== themeMode) {
      dispatch(setThemeMode(resolved));
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Toaster is client-only to avoid hydration mismatch
  useEffect(() => setMounted(true), []);

  return (
    <CacheProvider value={emotionCache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {mounted && (
          <Toaster
            position="top-right"
            richColors
            theme={themeMode}
            duration={4000}
            expand
            toastOptions={{
              style: {
                backgroundColor:
                  themeMode === "dark"
                    ? "rgba(0, 0, 0, 0.3)"
                    : "rgba(255, 255, 255, 0.8)",
                backdropFilter: "blur(15px)",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                border:
                  themeMode === "dark"
                    ? "1px solid rgba(255,255,255,0.08)"
                    : "1px solid rgba(15,23,42,0.12)",
                borderRadius: "8px",
                color: themeMode === "dark" ? "#f1f5f9" : "#0f172a",
              },
            }}
          />
        )}
        <Analytics />
        {children}
      </ThemeProvider>
    </CacheProvider>
  );
}

// ── Root Providers ─────────────────────────────────────────────────

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <I18nextProvider i18n={i18n}>
        <ThemeWrapper>{children}</ThemeWrapper>
      </I18nextProvider>
    </Provider>
  );
}
