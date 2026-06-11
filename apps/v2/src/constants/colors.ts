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

  ACCENT_TERTIARY: "#a855f7", // purple-500 (gradient endpoint)
  ACCENT_WARM: "#06b6d4", // same as ACCENT_PRIMARY (dark mode unchanged)

  TEXT_BODY: "rgba(226,232,240,0.7)",
  TEXT_FAINT: "rgba(148,163,184,0.2)",

  CIRCUIT_TRACE: "rgba(255,255,255,0.04)",
  CIRCUIT_NODE: "rgba(255,255,255,0.06)",
  CIRCUIT_PAD: "rgba(255,255,255,0.05)",

  // Hero name — calm white→slate metallic gradient + subtle 3D extrusion, NO
  // colored glow (kept restrained so dark mode doesn't get too much primary).
  NAME_GRADIENT: "linear-gradient(180deg, #f1f5f9, #93a4bd)",
  NAME_FILTER:
    "drop-shadow(1px 1px 0 rgba(255,255,255,0.06)) drop-shadow(2px 3px 0 rgba(40,44,70,0.6)) drop-shadow(0 6px 12px rgba(0,0,0,0.5))",

  // Hero CTA buttons — frosted glass lift shadows + frosting base
  // (the base must be opaque enough that the animated grid dots behind the
  // button get frosted out instead of bleeding through the translucent tint)
  CTA_PRIMARY_SHADOW:
    "0 8px 24px rgba(0,0,0,0.45), 0 0 18px rgba(6,182,212,0.18)",
  CTA_GHOST_SHADOW: "0 8px 24px rgba(0,0,0,0.4)",
  CTA_PRIMARY_FROST: "rgba(13,17,23,0.8)",
  CTA_GHOST_BG: "rgba(13,17,23,0.86)",
} as const;

// ── Light mode (Swiss monochrome) ───────────────────────────────────

export const LIGHT_COLORS = {
  BG_PRIMARY: "#ffffff",
  BG_SECONDARY: "#f8fafc",
  BG_TERTIARY: "#f1f5f9",

  TEXT_PRIMARY: "#0f172a",
  TEXT_MUTED: "rgba(15,23,42,0.6)",

  ACCENT_PRIMARY: "#ea580c", // orange-600
  ACCENT_SECONDARY: "#dc2626", // red-600

  GLASS_BG: "rgba(255,255,255,0.85)",
  GLASS_BORDER: "rgba(15,23,42,0.12)",
  GLASS_BLUR: 10, // px

  GRID_LINES: "rgba(15,23,42,0.08)",
  GRID_DOTS: "#0f172a",
  GRID_DOTS_SECONDARY: "#334155",

  SURFACE_BASE: "#ffffff",
  SURFACE_BG: "#ffffff",
  SURFACE_OVERLAY: "rgba(255,255,255,0.80)",

  ICON_PRIMARY: "#0f172a",
  ICON_SECONDARY: "rgba(15,23,42,0.6)",

  BORDER_DEFAULT: "rgba(15,23,42,0.15)",
  BORDER_SEPARATOR: "rgba(15,23,42,0.08)",

  ACCENT_TERTIARY: "#b91c1c", // red-700
  ACCENT_WARM: "#f59e0b", // amber-500 (gradient start point)

  TEXT_BODY: "rgba(15,23,42,0.7)",
  TEXT_FAINT: "rgba(15,23,42,0.2)",

  CIRCUIT_TRACE: "rgba(15,23,42,0.08)",
  CIRCUIT_NODE: "rgba(15,23,42,0.12)",
  CIRCUIT_PAD: "rgba(15,23,42,0.10)",

  // Hero name — anthracite metallic gradient + subtle 3D extrusion, no glow
  // (light-mode counterpart to the dark white→slate metallic). Top stop kept
  // dark enough that the umlaut dots (which sit at the lightest top of the
  // gradient) stay legible on the white background.
  NAME_GRADIENT: "linear-gradient(180deg, #2f353f, #0d1218)",
  NAME_FILTER:
    "drop-shadow(1px 1px 0 rgba(15,23,42,0.18)) drop-shadow(2px 3px 0 rgba(15,23,42,0.22)) drop-shadow(0 6px 12px rgba(15,23,42,0.16))",

  // Hero CTA buttons — frosted glass lift shadows + frosting base
  CTA_PRIMARY_SHADOW: "0 8px 22px rgba(15,23,42,0.14)",
  CTA_GHOST_SHADOW: "0 8px 22px rgba(15,23,42,0.12)",
  CTA_PRIMARY_FROST: "rgba(255,255,255,0.88)",
  CTA_GHOST_BG: "rgba(255,255,255,0.88)",
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

  SELECTION_BG: "#5eead4",
  SELECTION_TEXT: "#134e4a",
} as const;
