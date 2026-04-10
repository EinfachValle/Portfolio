"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { useTranslation } from "react-i18next";

import { Box, useMediaQuery, useTheme } from "@mui/material";

import { MESH_GRID_CONFIG } from "@/constants/animation";
import { useReducedMotion } from "@/hooks/useReducedMotion";

// ── Types ──────────────────────────────────────────────────────────

interface GridLine {
  id: number;
  horizontal: boolean;
  lineIndex: number;
  duration: number;
  delay: number;
  direction: 1 | -1;
  colorIndex: 0 | 1;
  length: number;
}

interface AnimatedGridProps {
  intensity?: "full" | "subtle";
}

// ── Line generation (Nexyfi pattern) ───────────────────────────────

function generateLines(count: number): GridLine[] {
  const usedHorizontal = new Set<number>();
  const usedVertical = new Set<number>();

  return Array.from({ length: count }, (_, i) => {
    const horizontal = Math.random() > 0.4;
    const used = horizontal ? usedHorizontal : usedVertical;

    let lineIndex: number;
    do {
      lineIndex = Math.floor(Math.random() * 30);
    } while (used.has(lineIndex));
    used.add(lineIndex);

    return {
      id: i,
      horizontal,
      lineIndex,
      duration:
        MESH_GRID_CONFIG.DOT_MIN_DURATION +
        Math.random() *
          (MESH_GRID_CONFIG.DOT_MAX_DURATION -
            MESH_GRID_CONFIG.DOT_MIN_DURATION),
      delay: Math.random() * -20,
      direction: (Math.random() > 0.5 ? 1 : -1) as 1 | -1,
      colorIndex: (Math.random() > 0.7 ? 1 : 0) as 0 | 1,
      length:
        MESH_GRID_CONFIG.LINE_LENGTH * 0.6 +
        Math.random() * MESH_GRID_CONFIG.LINE_LENGTH * 0.8,
    };
  });
}

// ── Component ──────────────────────────────────────────────────────

export function AnimatedGrid({ intensity = "full" }: AnimatedGridProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  const reducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isTablet = useMediaQuery(theme.breakpoints.between("md", "lg"));

  const cellSize = isMobile
    ? MESH_GRID_CONFIG.CELL_SIZE_MOBILE
    : MESH_GRID_CONFIG.CELL_SIZE_DESKTOP;

  const dotCount = isMobile
    ? MESH_GRID_CONFIG.DOT_COUNT_MOBILE
    : isTablet
      ? MESH_GRID_CONFIG.DOT_COUNT_TABLET
      : MESH_GRID_CONFIG.DOT_COUNT_DESKTOP;

  const effectiveDotCount =
    intensity === "subtle" ? Math.ceil(dotCount / 2) : dotCount;
  const opacityMultiplier = intensity === "subtle" ? 0.5 : 1;

  // Track container dimensions via ResizeObserver
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        setContainerSize({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  // Generate lines once (stable across renders)
  const lines = useMemo(
    () => generateLines(effectiveDotCount),
    [effectiveDotCount],
  );

  // Theme colors
  const gridLines = theme.palette.grid.lines;
  const dotColor = theme.palette.grid.dots;
  const dotSecondaryColor = theme.palette.grid.dotsSecondary;

  // Static grid background (CSS linear-gradient pattern)
  const gridBackground = `
    linear-gradient(to right, ${gridLines} ${MESH_GRID_CONFIG.LINE_WIDTH}px, transparent ${MESH_GRID_CONFIG.LINE_WIDTH}px),
    linear-gradient(to bottom, ${gridLines} ${MESH_GRID_CONFIG.LINE_WIDTH}px, transparent ${MESH_GRID_CONFIG.LINE_WIDTH}px)
  `;

  return (
    <Box
      ref={containerRef}
      role="img"
      aria-label={t("a11y.animatedGrid")}
      sx={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        maskImage:
          "linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)",
        WebkitMaskImage:
          "linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)",
        zIndex: 0,
      }}
    >
      {/* Static grid lines */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          backgroundImage: gridBackground,
          backgroundSize: `${cellSize}px ${cellSize}px`,
          opacity: opacityMultiplier,
        }}
      />

      {/* Animated travelling lines + dots */}
      {!reducedMotion &&
        containerSize.width > 0 &&
        lines.map((line) => {
          const color = line.colorIndex === 0 ? dotColor : dotSecondaryColor;
          const travelLength = line.horizontal
            ? containerSize.width
            : containerSize.height;
          const position = line.lineIndex * cellSize;

          // Clamp position so lines stay within the grid
          const maxPosition = line.horizontal
            ? containerSize.height
            : containerSize.width;
          if (position > maxPosition) return null;

          const trailLength = line.length;

          // Keyframe name unique per line
          const keyframeName = `grid-line-${line.id}`;

          // Start and end values for the animation
          const startTranslate =
            line.direction === 1 ? -trailLength : travelLength + trailLength;
          const endTranslate =
            line.direction === 1 ? travelLength + trailLength : -trailLength;

          const translateProp = line.horizontal ? "translateX" : "translateY";

          // Trail gradient direction
          const gradientDirection = line.horizontal
            ? line.direction === 1
              ? "to right"
              : "to left"
            : line.direction === 1
              ? "to bottom"
              : "to top";

          return (
            <Box
              key={line.id}
              sx={{
                position: "absolute",
                ...(line.horizontal
                  ? {
                      top: position - MESH_GRID_CONFIG.DOT_SIZE / 2,
                      left: 0,
                      width: `${trailLength}px`,
                      height: `${MESH_GRID_CONFIG.DOT_SIZE}px`,
                    }
                  : {
                      left: position - MESH_GRID_CONFIG.DOT_SIZE / 2,
                      top: 0,
                      height: `${trailLength}px`,
                      width: `${MESH_GRID_CONFIG.DOT_SIZE}px`,
                    }),
                opacity: opacityMultiplier,
                [`@keyframes ${keyframeName}`]: {
                  "0%": {
                    transform: `${translateProp}(${startTranslate}px)`,
                  },
                  "100%": {
                    transform: `${translateProp}(${endTranslate}px)`,
                  },
                },
                animation: `${keyframeName} ${line.duration}s linear ${line.delay}s infinite`,
                willChange: "transform",
              }}
            >
              {/* Gradient trail */}
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  background: `linear-gradient(${gradientDirection}, transparent 0%, ${color}50 60%, ${color} 100%)`,
                  borderRadius: `${MESH_GRID_CONFIG.DOT_SIZE / 2}px`,
                }}
              />

              {/* Leading dot with glow */}
              <Box
                sx={{
                  position: "absolute",
                  ...(line.horizontal
                    ? {
                        right: line.direction === 1 ? 0 : "auto",
                        left: line.direction === -1 ? 0 : "auto",
                        top: "50%",
                        transform: "translateY(-50%)",
                      }
                    : {
                        bottom: line.direction === 1 ? 0 : "auto",
                        top: line.direction === -1 ? 0 : "auto",
                        left: "50%",
                        transform: "translateX(-50%)",
                      }),
                  width: `${MESH_GRID_CONFIG.DOT_SIZE * 2.5}px`,
                  height: `${MESH_GRID_CONFIG.DOT_SIZE * 2.5}px`,
                  borderRadius: "50%",
                  backgroundColor: color,
                  boxShadow: [
                    `0 0 ${MESH_GRID_CONFIG.DOT_GLOW_SIZE}px ${color}`,
                    `0 0 ${MESH_GRID_CONFIG.DOT_GLOW_SIZE * 2}px ${color}80`,
                    `0 0 ${MESH_GRID_CONFIG.DOT_GLOW_SIZE * 3}px ${color}40`,
                  ].join(", "),
                }}
              />
            </Box>
          );
        })}
    </Box>
  );
}
