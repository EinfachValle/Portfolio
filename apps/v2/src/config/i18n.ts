"use client";

import { initReactI18next } from "react-i18next";

import { DEFAULT_LANGUAGE } from "@portfolio/shared";

import i18n from "i18next";

import DE from "../locales/de.json";
import EN from "../locales/en.json";
import { setLocale } from "../store/actions/ui.actions";
import { store } from "../store/store";

const resources = {
  en: { translation: EN },
  de: { translation: DE },
} as const;

const SUPPORTED = ["en", "de"] as const;
type SupportedCode = (typeof SUPPORTED)[number];

i18n.use(initReactI18next).init({
  resources,
  // Pin the initial language to DEFAULT_LANGUAGE so the server render and the
  // first client render agree. Language detection at init() was the cause of
  // the hydration mismatch (server has no localStorage/navigator → fell back to
  // "en", client detected "de"). The user's real language is applied AFTER
  // mount via applyDetectedLanguage(), while the loader still hides the page.
  lng: DEFAULT_LANGUAGE,
  fallbackLng: DEFAULT_LANGUAGE,
  debug: process.env.NODE_ENV === "development",
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: true,
  },
});

i18n.on("languageChanged", (lng: string) => {
  store.dispatch(setLocale(lng));
  // Keep <html lang> in sync so screen readers / translation tools announce the
  // right language (the document ships as lang="en"; this updates it whenever
  // the language is detected post-mount or toggled). <html> has
  // suppressHydrationWarning, so changing the attribute is safe.
  if (typeof document !== "undefined") {
    document.documentElement.lang = lng;
  }
  try {
    localStorage.setItem("i18nextLng", lng);
  } catch {
    // localStorage unavailable (SSR / private mode) — ignore.
  }
});

/** Read the stored, then browser, language — normalised to a supported code. */
function detectLanguage(): SupportedCode {
  try {
    const stored = localStorage.getItem("i18nextLng")?.slice(0, 2);
    if (stored && (SUPPORTED as readonly string[]).includes(stored)) {
      return stored as SupportedCode;
    }
  } catch {
    // ignore
  }
  const nav = typeof navigator !== "undefined" ? navigator.language : "";
  return nav.slice(0, 2) === "de" ? "de" : "en";
}

/**
 * Switch to the user's stored/browser language. Must be called AFTER mount
 * (from an effect) so the first render still matches the server-rendered HTML.
 */
export function applyDetectedLanguage(): void {
  const detected = detectLanguage();
  if (i18n.language !== detected) {
    void i18n.changeLanguage(detected);
  }
}

export default i18n;
