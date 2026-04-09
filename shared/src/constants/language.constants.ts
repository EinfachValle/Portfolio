import type { Language, LanguageCode } from "../types/language.types.js";

export const DEFAULT_LANGUAGE: LanguageCode = "en";

export const LANGUAGES: Record<LanguageCode, Language> = {
  en: { code: "en", label: "English", nativeLabel: "English" },
  de: { code: "de", label: "German", nativeLabel: "Deutsch" },
} as const;
