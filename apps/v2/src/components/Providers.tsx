"use client";

import { useEffect, useMemo, useState } from "react";

import { Provider } from "react-redux";

import { I18nextProvider } from "react-i18next";

import { CssBaseline } from "@mui/material";
import { ThemeProvider, alpha } from "@mui/material/styles";

import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import { Analytics } from "@vercel/analytics/next";
import { Toaster } from "sonner";

import { TIMING } from "@/constants/api";
import { THEME_MODE } from "@/constants/elements";

import i18n from "../config/i18n";
import { persistor, store, useAppSelector } from "../store/store";
import getTheme from "../theme";

// Stable Emotion cache — avoids insertBefore crash on theme switch
const emotionCache = createCache({ key: "mui", prepend: true });

// Wait for redux-persist to rehydrate before rendering theme-dependent UI
function usePersistReady() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    persistor.persist();
    const unsubscribe = persistor.subscribe(() => {
      const { bootstrapped } = persistor.getState();
      if (bootstrapped) {
        setReady(true);
        unsubscribe();
      }
    });
    // Already bootstrapped (fast path)
    if (persistor.getState().bootstrapped) {
      setReady(true);
    }
    return unsubscribe;
  }, []);
  return ready;
}

// ── Inner component that can use Redux hooks ───────────────────────

function ThemeWrapper({ children }: { children: React.ReactNode }) {
  const themeMode = useAppSelector((state) => state.ui.themeMode);
  const theme = useMemo(() => getTheme(themeMode), [themeMode]);
  const [mounted, setMounted] = useState(false);
  const persistReady = usePersistReady();

  // Sync document theme attribute whenever Redux state changes
  useEffect(() => {
    if (!persistReady) return;
    document.documentElement.dataset.theme = themeMode;
    document.documentElement.style.colorScheme = themeMode;
  }, [themeMode, persistReady]);

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
            duration={TIMING.TOASTER_DURATION}
            expand
            toastOptions={{
              style: {
                backgroundColor: alpha(
                  theme.palette.background.default,
                  themeMode === THEME_MODE.DARK ? 0.3 : 0.8,
                ),
                backdropFilter: "blur(15px)",
                boxShadow: `0 4px 6px ${alpha(theme.palette.background.default, 0.1)}`,
                border: `1px solid ${theme.palette.border.default}`,
                borderRadius: "8px",
                color: theme.palette.text.primary,
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
