"use client";

import { initReactI18next } from "react-i18next";

import { DEFAULT_LANGUAGE } from "@portfolio/shared";

import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import DE from "../locales/de.json";
import EN from "../locales/en.json";
import { setLocale } from "../store/slices/uiSlice";
import { store } from "../store/store";

const resources = {
  en: { translation: EN },
  de: { translation: DE },
} as const;

const detection = {
  order: ["localStorage", "navigator"],
  lookupLocalStorage: "i18nextLng",
  caches: ["localStorage"],
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    detection,

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
  localStorage.setItem("i18nextLng", lng);
});

export default i18n;
