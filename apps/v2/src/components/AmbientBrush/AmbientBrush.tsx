"use client";

import { Box } from "@mui/material";
import { alpha, keyframes, useTheme } from "@mui/material/styles";

import { THEME_MODE } from "@/constants/elements";
import useDeviceTypeDetection from "@/hooks/useDeviceTypeDetection";

/**
 * Ambient brush decoration for dark mode sections.
 * Mirrors the CircuitCircle pattern (light mode counterpart): per-section,
 * absolutely positioned within a relative parent, scrolls with the page.
 * Adds a slow pulse for a breathing, ambient feel.
 */

const drift = keyframes`
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(1.5%, -1%); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.65; }
`;

const BRUSH_BLUR = "100px";

type Side = "left" | "right";
type ColorVariant = "primary" | "secondary";

interface AmbientBrushProps {
  side: Side;
  top?: string;
  size?: number;
  color?: ColorVariant;
  /** Multiplier for brush opacity. Default 1. */
  intensity?: number;
  /** Pulse animation duration in seconds. Default 8. */
  pulseDuration?: number;
  /** Pulse animation delay in seconds (offset for asynchronous breathing). Default 0. */
  pulseDelay?: number;
}

export function AmbientBrush({
  side,
  top = "10%",
  size = 500,
  color = "secondary",
  intensity = 1,
  pulseDuration = 8,
  pulseDelay = 0,
}: AmbientBrushProps) {
  const theme = useTheme();
  const { isMobile } = useDeviceTypeDetection();

  if (theme.palette.mode !== THEME_MODE.DARK) return null;
  if (isMobile) return null;

  const brushColor =
    color === "primary"
      ? theme.palette.accent.primary
      : theme.palette.accent.secondary;

  const isLeft = side === "left";

  return (
    <Box
      aria-hidden="true"
      sx={{
        position: "absolute",
        zIndex: 0,
        width: size,
        height: size,
        borderRadius: "50%",
        pointerEvents: "none",
        top,
        ...(isLeft ? { left: -size * 0.3 } : { right: -size * 0.3 }),
        backgroundColor: alpha(brushColor, 0.05 * intensity),
        filter: `blur(${BRUSH_BLUR})`,
        animation: `${drift} 25s ease-in-out infinite, ${pulse} ${pulseDuration}s ease-in-out infinite`,
        animationDelay: `0s, ${pulseDelay}s`,
        willChange: "opacity, transform",
      }}
    />
  );
}
