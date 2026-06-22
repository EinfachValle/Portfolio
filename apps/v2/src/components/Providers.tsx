"use client";

import { useEffect, useMemo, useState } from "react";

import { Provider } from "react-redux";

import { I18nextProvider } from "react-i18next";

import { CssBaseline } from "@mui/material";
import { ThemeProvider, alpha } from "@mui/material/styles";

import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Toaster } from "sonner";

import { TIMING } from "@/constants/api";
import { THEME_MODE } from "@/constants/elements";

import i18n, { applyDetectedLanguage } from "../config/i18n";
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
  const persistedMode = useAppSelector((state) => state.ui.themeMode);
  const [mounted, setMounted] = useState(false);
  const persistReady = usePersistReady();
  // Until mounted, render the SSR default theme (THEME_MODE.DARK = the ui
  // reducer's initial state) regardless of what redux-persist may have already
  // rehydrated. A persisted light theme would otherwise mismatch the
  // server-rendered dark HTML and trip a hydration error. The loader (page is
  // opacity:0) hides the swap to the persisted theme after mount.
  const themeMode = mounted ? persistedMode : THEME_MODE.DARK;
  const theme = useMemo(() => getTheme(themeMode), [themeMode]);

  // Sync document theme attribute whenever Redux state changes
  useEffect(() => {
    if (!persistReady) return;
    document.documentElement.dataset.theme = themeMode;
    document.documentElement.style.colorScheme = themeMode;
  }, [themeMode, persistReady]);

  // After mount: apply the user's stored/browser language (deferred from i18n
  // init to avoid a hydration mismatch) and flag client-only UI as ready.
  useEffect(() => {
    applyDetectedLanguage();
    setMounted(true);
  }, []);

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
        <SpeedInsights />
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
