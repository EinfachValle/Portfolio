/**
 * V2 Color Constants
 *
 * Plain TypeScript, NO MUI imports.
 * Used by both the MUI theme and the AnimatedGrid DOM component.
 */

// ── Dark mode (void + glass) ────────────────────────────────────────

export const DARK_COLORS = {
  BG_PRIMARY: "#0a0a0f",
  BG_SECONDARY: "#0d1117",
  BG_TERTIARY: "#0f172a",

  TEXT_PRIMARY: "#f1f5f9",
  TEXT_MUTED: "rgba(148,163,184,0.45)",

  ACCENT_PRIMARY: "#06b6d4", // cyan
  ACCENT_SECONDARY: "#6366f1", // indigo

  GLASS_BG: "rgba(255,255,255,0.02)",
  GLASS_BORDER: "rgba(255,255,255,0.04)",
  GLASS_BLUR: 10, // px

  GRID_LINES: "rgba(6,182,212,0.04)",
  GRID_DOTS: "#06b6d4",
  GRID_DOTS_SECONDARY: "#6366f1",

  SURFACE_BASE: "#0d1117",
  SURFACE_BG: "#0a0a0f",
  SURFACE_OVERLAY: "rgba(10,10,15,0.60)",

  ICON_PRIMARY: "#f1f5f9",
  ICON_SECONDARY: "rgba(148,163,184,0.6)",

  BORDER_DEFAULT: "rgba(255,255,255,0.08)",
  BORDER_SEPARATOR: "rgba(255,255,255,0.04)",
} as const;

// ── Light mode (Swiss monochrome) ───────────────────────────────────

export const LIGHT_COLORS = {
  BG_PRIMARY: "#fafafa",
  BG_SECONDARY: "#f5f5f5",
  BG_TERTIARY: "#eeeeee",

  TEXT_PRIMARY: "#0f172a",
  TEXT_MUTED: "rgba(15,23,42,0.4)",

  ACCENT_PRIMARY: "#0f172a", // slate monochrome
  ACCENT_SECONDARY: "#334155", // slate-700

  GLASS_BG: "rgba(255,255,255,0.7)",
  GLASS_BORDER: "rgba(15,23,42,0.08)",
  GLASS_BLUR: 8, // px

  GRID_LINES: "rgba(15,23,42,0.06)",
  GRID_DOTS: "#0f172a",
  GRID_DOTS_SECONDARY: "#334155",

  SURFACE_BASE: "#ffffff",
  SURFACE_BG: "#fafafa",
  SURFACE_OVERLAY: "rgba(250,250,250,0.60)",

  ICON_PRIMARY: "#0f172a",
  ICON_SECONDARY: "rgba(15,23,42,0.5)",

  BORDER_DEFAULT: "rgba(15,23,42,0.12)",
  BORDER_SEPARATOR: "rgba(15,23,42,0.06)",
} as const;

// ── Shared (mode-independent) ───────────────────────────────────────

export const SHARED_COLORS = {
  WHITE: "#ffffff",
  BLACK: "#000000",
  TRANSPARENT: "transparent",

  CYAN: "#06b6d4",
  INDIGO: "#6366f1",
  SLATE_900: "#0f172a",
  SLATE_700: "#334155",

  SUCCESS: "#22c55e",
  WARNING: "#eab308",
  ERROR: "#ef4444",
  INFO: "#3b82f6",
} as const;
