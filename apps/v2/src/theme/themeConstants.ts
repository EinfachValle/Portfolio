import { DARK_COLORS, LIGHT_COLORS, SHARED_COLORS } from "@/constants/colors";
import { THEME_MODE } from "@/constants/elements";

// ── Glass palette ───────────────────────────────────────────────────

export interface GlassPalette {
  background: string;
  border: string;
  blur: number;
}

// ── Grid palette ────────────────────────────────────────────────────

export interface GridPalette {
  lines: string;
  dots: string;
  dotsSecondary: string;
}

// ── Accent palette ──────────────────────────────────────────────────

export interface AccentPalette {
  primary: string;
  secondary: string;
  tertiary: string;
  warm: string;
  muted: string;
  subtle: string;
}

// ── Surface interface (simplified from V1) ──────────────────────────

export interface SurfaceInterfacePalette {
  base: string;
  background: string;
  overlay: string;
}

export interface SurfacePalette {
  interface: SurfaceInterfacePalette;
}

// ── Icon palette ────────────────────────────────────────────────────

export interface IconPalette {
  primary: string;
  secondary: string;
}

// ── Border palette ──────────────────────────────────────────────────

export interface BorderPalette {
  default: string;
  separator: string;
}

// ── Circuit palette (light-mode decorative traces) ─────────────────

export interface CircuitPalette {
  trace: string;
  node: string;
  pad: string;
}

// ── Selection palette ──────────────────────────────────────────────

export interface SelectionPalette {
  background: string;
  text: string;
}

// ── Assembled palette per mode ──────────────────────────────────────

export const DARK_PALETTE = {
  mode: THEME_MODE.DARK,

  background: {
    default: DARK_COLORS.BG_PRIMARY,
    paper: DARK_COLORS.BG_SECONDARY,
  },

  text: {
    primary: DARK_COLORS.TEXT_PRIMARY,
    secondary: DARK_COLORS.TEXT_MUTED,
    default: DARK_COLORS.TEXT_PRIMARY,
    link: DARK_COLORS.ACCENT_PRIMARY,
    muted: DARK_COLORS.TEXT_MUTED,
    body: DARK_COLORS.TEXT_BODY,
    faint: DARK_COLORS.TEXT_FAINT,
    onAccent: SHARED_COLORS.WHITE,
  },

  primary: {
    main: DARK_COLORS.ACCENT_PRIMARY,
    light: SHARED_COLORS.CYAN,
    dark: "#0891b2", // cyan-600
  },

  secondary: {
    main: DARK_COLORS.ACCENT_SECONDARY,
    light: "#818cf8", // indigo-400
    dark: "#4f46e5", // indigo-600
  },

  success: { main: SHARED_COLORS.SUCCESS },
  warning: { main: SHARED_COLORS.WARNING },
  error: { main: SHARED_COLORS.ERROR },
  info: { main: SHARED_COLORS.INFO },

  glass: {
    background: DARK_COLORS.GLASS_BG,
    border: DARK_COLORS.GLASS_BORDER,
    blur: DARK_COLORS.GLASS_BLUR,
  } satisfies GlassPalette,

  grid: {
    lines: DARK_COLORS.GRID_LINES,
    dots: DARK_COLORS.GRID_DOTS,
    dotsSecondary: DARK_COLORS.GRID_DOTS_SECONDARY,
  } satisfies GridPalette,

  accent: {
    primary: DARK_COLORS.ACCENT_PRIMARY,
    secondary: DARK_COLORS.ACCENT_SECONDARY,
    tertiary: DARK_COLORS.ACCENT_TERTIARY,
    warm: DARK_COLORS.ACCENT_WARM,
    muted: "rgba(6,182,212,0.4)",
    subtle: "rgba(6,182,212,0.12)",
  } satisfies AccentPalette,

  surface: {
    interface: {
      base: DARK_COLORS.SURFACE_BASE,
      background: DARK_COLORS.SURFACE_BG,
      overlay: DARK_COLORS.SURFACE_OVERLAY,
    },
  } satisfies SurfacePalette,

  icon: {
    primary: DARK_COLORS.ICON_PRIMARY,
    secondary: DARK_COLORS.ICON_SECONDARY,
  } satisfies IconPalette,

  border: {
    default: DARK_COLORS.BORDER_DEFAULT,
    separator: DARK_COLORS.BORDER_SEPARATOR,
  } satisfies BorderPalette,

  circuit: {
    trace: DARK_COLORS.CIRCUIT_TRACE,
    node: DARK_COLORS.CIRCUIT_NODE,
    pad: DARK_COLORS.CIRCUIT_PAD,
  } satisfies CircuitPalette,

  selection: {
    background: DARK_COLORS.ACCENT_PRIMARY,
    text: DARK_COLORS.BG_PRIMARY,
  } satisfies SelectionPalette,
} as const;

export const LIGHT_PALETTE = {
  mode: THEME_MODE.LIGHT,

  background: {
    default: LIGHT_COLORS.BG_PRIMARY,
    paper: LIGHT_COLORS.SURFACE_BASE,
  },

  text: {
    primary: LIGHT_COLORS.TEXT_PRIMARY,
    secondary: LIGHT_COLORS.TEXT_MUTED,
    default: LIGHT_COLORS.TEXT_PRIMARY,
    link: LIGHT_COLORS.ACCENT_PRIMARY,
    muted: LIGHT_COLORS.TEXT_MUTED,
    body: LIGHT_COLORS.TEXT_BODY,
    faint: LIGHT_COLORS.TEXT_FAINT,
    onAccent: SHARED_COLORS.WHITE,
  },

  primary: {
    main: LIGHT_COLORS.ACCENT_PRIMARY,
    light: "#f97316", // orange-500
    dark: "#c2410c", // orange-700
  },

  secondary: {
    main: LIGHT_COLORS.ACCENT_SECONDARY,
    light: "#ef4444", // red-500
    dark: "#b91c1c", // red-700
  },

  success: { main: SHARED_COLORS.SUCCESS },
  warning: { main: SHARED_COLORS.WARNING },
  error: { main: SHARED_COLORS.ERROR },
  info: { main: SHARED_COLORS.INFO },

  glass: {
    background: LIGHT_COLORS.GLASS_BG,
    border: LIGHT_COLORS.GLASS_BORDER,
    blur: LIGHT_COLORS.GLASS_BLUR,
  } satisfies GlassPalette,

  grid: {
    lines: LIGHT_COLORS.GRID_LINES,
    dots: LIGHT_COLORS.GRID_DOTS,
    dotsSecondary: LIGHT_COLORS.GRID_DOTS_SECONDARY,
  } satisfies GridPalette,

  accent: {
    primary: LIGHT_COLORS.ACCENT_PRIMARY,
    secondary: LIGHT_COLORS.ACCENT_SECONDARY,
    tertiary: LIGHT_COLORS.ACCENT_TERTIARY,
    warm: LIGHT_COLORS.ACCENT_WARM,
    muted: "rgba(234,88,12,0.5)",
    subtle: "rgba(234,88,12,0.08)",
  } satisfies AccentPalette,

  surface: {
    interface: {
      base: LIGHT_COLORS.SURFACE_BASE,
      background: LIGHT_COLORS.SURFACE_BG,
      overlay: LIGHT_COLORS.SURFACE_OVERLAY,
    },
  } satisfies SurfacePalette,

  icon: {
    primary: LIGHT_COLORS.ICON_PRIMARY,
    secondary: LIGHT_COLORS.ICON_SECONDARY,
  } satisfies IconPalette,

  border: {
    default: LIGHT_COLORS.BORDER_DEFAULT,
    separator: LIGHT_COLORS.BORDER_SEPARATOR,
  } satisfies BorderPalette,

  circuit: {
    trace: LIGHT_COLORS.CIRCUIT_TRACE,
    node: LIGHT_COLORS.CIRCUIT_NODE,
    pad: LIGHT_COLORS.CIRCUIT_PAD,
  } satisfies CircuitPalette,

  selection: {
    background: LIGHT_COLORS.ACCENT_PRIMARY,
    text: SHARED_COLORS.WHITE,
  } satisfies SelectionPalette,
} as const;
