/**
 * V2 Element Constants
 *
 * DOM IDs, event names, localStorage keys, CSS class names.
 * Single source of truth for cross-component string identifiers.
 */

// ── Section IDs (navigation targets) ───────────────────────────────

export const SECTION_ID = {
  HERO: "hero",
  ABOUT: "about",
  PROJECTS: "projects",
  CONTACT: "contact",
} as const;

// ── Element IDs ────────────────────────────────────────────────────

export const ELEMENT_ID = {
  APP_CONTENT: "app-content",
  MAIN_CONTENT: "main-content",
  LOADER: "v-loader",
} as const;

// ── Theme modes ────────────────────────────────────────────────────

export const THEME_MODE = {
  DARK: "dark",
  LIGHT: "light",
} as const;

// ── localStorage keys ──────────────────────────────────────────────

export const STORAGE_KEY = {
  THEME: "theme",
} as const;

// ── Custom DOM events ──────────────────────────────────────────────

export const EVENT = {
  LOADER_DONE: "loaderDone",
} as const;

// ── CSS class names (used in blocking script / loader) ─────────────

export const CSS_CLASS = {
  FADE_OUT: "fade-out",
  READY: "ready",
} as const;
