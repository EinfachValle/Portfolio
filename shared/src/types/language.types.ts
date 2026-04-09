export type LanguageCode = "en" | "de";

export interface Language {
  code: LanguageCode;
  label: string;
  nativeLabel: string;
}
