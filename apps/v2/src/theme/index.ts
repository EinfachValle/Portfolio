import { type Theme, createTheme, responsiveFontSizes } from "@mui/material";

import { THEME_MODE } from "@/constants/elements";
import type { ThemeMode } from "@/store/reducers/ui";

import {
  type AccentPalette,
  type BorderPalette,
  type CircuitPalette,
  DARK_PALETTE,
  type GlassPalette,
  type GridPalette,
  type IconPalette,
  LIGHT_PALETTE,
  type SelectionPalette,
  type SurfacePalette,
} from "./themeConstants";

// ── MUI Module Augmentation ─────────────────────────────────────────

declare module "@mui/material/styles" {
  interface Palette {
    glass: GlassPalette;
    grid: GridPalette;
    accent: AccentPalette;
    surface: SurfacePalette;
    icon: IconPalette;
    border: BorderPalette;
    circuit: CircuitPalette;
    selection: SelectionPalette;
  }

  interface PaletteOptions {
    glass?: Partial<GlassPalette>;
    grid?: Partial<GridPalette>;
    accent?: Partial<AccentPalette>;
    surface?: Partial<SurfacePalette>;
    icon?: Partial<IconPalette>;
    border?: Partial<BorderPalette>;
    circuit?: Partial<CircuitPalette>;
    selection?: Partial<SelectionPalette>;
  }

  interface TypeText {
    default: string;
    link: string;
    muted: string;
    body: string;
    faint: string;
    onAccent: string;
  }

  interface TypographyVariants {
    body3: React.CSSProperties;
    subtle1: React.CSSProperties;
    subtle2: React.CSSProperties;
  }

  interface TypographyVariantsOptions {
    body3?: React.CSSProperties;
    subtle1?: React.CSSProperties;
    subtle2?: React.CSSProperties;
  }
}

declare module "@mui/material/Typography" {
  interface TypographyPropsVariantOverrides {
    body3: true;
    subtle1: true;
    subtle2: true;
  }
}

// ── Base theme (shared between modes) ───────────────────────────────

const baseTheme = {
  typography: {
    fontFamily: "Inter, sans-serif",
    fontSize: 14,
    h1: { fontSize: 72, fontWeight: 700 },
    h2: { fontSize: 48, fontWeight: 700 },
    h3: { fontSize: 36, fontWeight: 600 },
    h4: { fontSize: 28, fontWeight: 600 },
    h5: { fontSize: 20, fontWeight: 400 },
    h6: { fontSize: 16, fontWeight: 500 },
    body1: { fontSize: 16, fontWeight: 400 },
    body2: { fontSize: 14, fontWeight: 300 },
    body3: { fontSize: 14, fontWeight: 400 },
    subtle1: { fontSize: 16, fontWeight: 300 },
    subtle2: { fontSize: 14, fontWeight: 500 },
    overline: {
      fontSize: 10,
      fontWeight: 500,
      letterSpacing: "4px",
      textTransform: "uppercase" as const,
    },
    caption: { fontSize: 12, fontWeight: 400 },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
  spacing: 8,
  shape: {
    borderRadius: 4,
  },
};

// ── Theme factory ───────────────────────────────────────────────────

export const getTheme = (mode: ThemeMode): Theme => {
  const isDark = mode === THEME_MODE.DARK;
  const palette = isDark ? DARK_PALETTE : LIGHT_PALETTE;

  const theme = createTheme({
    ...baseTheme,
    palette: {
      mode: palette.mode,
      primary: palette.primary,
      secondary: palette.secondary,
      success: palette.success,
      warning: palette.warning,
      error: palette.error,
      info: palette.info,
      background: palette.background,
      text: palette.text,
      glass: palette.glass,
      grid: palette.grid,
      accent: palette.accent,
      surface: palette.surface,
      icon: palette.icon,
      border: palette.border,
      circuit: palette.circuit,
      selection: palette.selection,
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: "var(--bg-primary)",
            color: "var(--text-primary)",
          },
        },
      },
    },
  });

  return responsiveFontSizes(theme);
};

export default getTheme;
