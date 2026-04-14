"use client";

import { Box } from "@mui/material";
import { alpha, keyframes, useTheme } from "@mui/material/styles";

import { THEME_MODE } from "@/constants/elements";
import { Z_INDEX } from "@/constants/layout";

const drift1 = keyframes`
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(0.8%, -0.5%); }
`;

const drift2 = keyframes`
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(-0.6%, 0.8%); }
`;

const drift3 = keyframes`
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(0.5%, 0.6%); }
`;

const drift4 = keyframes`
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(-0.7%, -0.4%); }
`;

interface AmbientBackgroundProps {
  /** Multiplier for brush opacity. Default 1 (subtle). Use 2–3 for more visible brushes. */
  intensity?: number;
}

export function AmbientBackground({ intensity = 1 }: AmbientBackgroundProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === THEME_MODE.DARK;

  if (!isDark) return null;

  const s = intensity; // shorthand

  return (
    <Box
      aria-hidden="true"
      sx={{
        position: "fixed",
        inset: 0,
        zIndex: Z_INDEX.BACKGROUND,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: "-20%",
          left: "-20%",
          width: "70vw",
          height: "70vw",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${alpha(theme.palette.accent.secondary, 0.02 * s)} 0%, transparent 50%)`,
          animation: `${drift1} 80s ease-in-out infinite`,
          willChange: "transform",
        }}
      />

      <Box
        sx={{
          position: "absolute",
          top: "10%",
          right: "-25%",
          width: "80vw",
          height: "80vw",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${alpha(theme.palette.accent.primary, 0.015 * s)} 0%, transparent 45%)`,
          animation: `${drift2} 90s ease-in-out infinite`,
          willChange: "transform",
        }}
      />

      <Box
        sx={{
          position: "absolute",
          top: "40%",
          left: "-25%",
          width: "85vw",
          height: "85vw",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${alpha(theme.palette.accent.secondary, 0.015 * s)} 0%, transparent 45%)`,
          animation: `${drift3} 100s ease-in-out infinite`,
          willChange: "transform",
        }}
      />

      <Box
        sx={{
          position: "absolute",
          bottom: "-10%",
          right: "0%",
          width: "65vw",
          height: "65vw",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${alpha(theme.palette.accent.primary, 0.012 * s)} 0%, transparent 45%)`,
          animation: `${drift4} 85s ease-in-out infinite`,
          willChange: "transform",
        }}
      />
    </Box>
  );
}
