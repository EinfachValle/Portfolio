"use client";

import { useCallback, useEffect, useRef } from "react";

import { Box } from "@mui/material";
import {
  type Theme,
  alpha,
  keyframes,
  styled,
  useTheme,
} from "@mui/material/styles";

import { SKILLS } from "@portfolio/shared";

import { TechIcon, getBrandHex } from "@/components/About/icons";
import {
  CONVEYOR_CONFIG,
  ORBIT_CONFIG,
  REVEAL_ANIMATION,
  SCROLL_REVEAL_CONFIG,
} from "@/constants/animation";
import { THEME_MODE } from "@/constants/elements";
import { CONTENT_MAX_WIDTH } from "@/constants/layout";
import { FONT_FAMILY } from "@/constants/typography";
import useDeviceTypeDetection from "@/hooks/useDeviceTypeDetection";

// ── Types ──────────────────────────────────────────────────────────

interface TechOrbitProps {
  revealed: boolean;
  reducedMotion: boolean;
  revealDelay: number;
}

// Split once at module level — SKILLS is a static constant.
const FRONTEND_SKILLS = SKILLS.filter((s) => s.category === "frontend");
const BACKEND_SKILLS = SKILLS.filter((s) => s.category === "backend");

// ── Keyframes ──────────────────────────────────────────────────────

const floatUp = keyframes`
  0%, 100% { transform: translateY(0); }
  50%      { transform: translateY(-3px); }
`;

// ── Shared chip styling (unchanged design: frosted glass + gradient border) ──

const chipBase = (theme: Theme) =>
  ({
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "6px 12px",
    borderRadius: 12,
    whiteSpace: "nowrap",
    background: alpha(theme.palette.accent.primary, 0.06),
    border: "none",
    // Gradient border via static pseudo-element (mask trick)
    "&::before": {
      content: '""',
      position: "absolute",
      inset: 0,
      borderRadius: 12,
      padding: "1px",
      background: `linear-gradient(135deg, ${theme.palette.accent.primary}, ${theme.palette.accent.secondary})`,
      WebkitMask:
        "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
      WebkitMaskComposite: "xor",
      mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
      maskComposite: "exclude",
      pointerEvents: "none",
    },
    "& svg": {
      flexShrink: 0,
      color: "var(--brand-color, currentColor)",
    },
    "& span": {
      fontSize: 11,
      fontWeight: 600,
      letterSpacing: "0.5px",
      color: theme.palette.text.primary,
      fontFamily: FONT_FAMILY.SANS,
    },
  }) as const;

// ── Conveyor (desktop / tablet) ────────────────────────────────────

const LanesWrap = styled(Box)({
  position: "relative",
  zIndex: 1,
  width: "100%",
  maxWidth: CONTENT_MAX_WIDTH.CARDS,
  marginTop: 40,
  display: "flex",
  flexDirection: "column",
  gap: CONVEYOR_CONFIG.LANE_GAP,
});

const ConveyorBand = styled(Box)({
  position: "relative",
  width: "100%",
  height: CONVEYOR_CONFIG.BAND_HEIGHT,
  overflow: "hidden",
  pointerEvents: "none",
  // Edge fade is handled per-chip in JS (resolution-independent) — see the
  // animation loop. No CSS mask here so it stays smooth on narrow viewports.
});

/**
 * ConveyorChip — same visual design as before (frosted-glass tint + gradient
 * border). NO backdrop-filter: blurring ~12 moving elements every frame is the
 * main jank source, and over the near-flat section background it adds almost
 * nothing visually. Dropping it keeps the loop perfectly fluid and matches the
 * mobile chips (which never had blur). Only `transform` + `opacity` change per
 * frame, set directly in JS for jitter-free GPU compositing.
 */
const ConveyorChip = styled(Box)(({ theme }) => ({
  position: "absolute",
  left: 0,
  top: "50%",
  willChange: "transform, opacity",
  backfaceVisibility: "hidden",
  opacity: 0,
  transform: "translate3d(0,0,0)",
  transition: "none",
  ...chipBase(theme),
}));

// ── Mobile chip (static grid with float) ───────────────────────────

interface MobileChipProps {
  revealed: boolean;
  reducedMotion: boolean;
  delay: number;
  floatDelay: number;
}

const MobileChip = styled(Box, {
  shouldForwardProp: (prop) =>
    !["revealed", "reducedMotion", "delay", "floatDelay"].includes(
      prop as string,
    ),
})<MobileChipProps>(
  ({ theme, revealed, reducedMotion, delay, floatDelay }) => ({
    position: "relative",
    opacity: revealed || reducedMotion ? 1 : 0,
    transform: revealed || reducedMotion ? "scale(1)" : "scale(0.8)",
    transition: reducedMotion
      ? "none"
      : `opacity 0.35s ${SCROLL_REVEAL_CONFIG.EASING} ${delay}ms, transform 0.35s ${SCROLL_REVEAL_CONFIG.EASING} ${delay}ms`,
    animation:
      !reducedMotion && revealed
        ? `${floatUp} ${ORBIT_CONFIG.FLOAT_DURATION}s ease-in-out ${floatDelay}s infinite`
        : "none",
    ...chipBase(theme),
  }),
);

// ── Component ──────────────────────────────────────────────────────

export function TechOrbit({
  revealed,
  reducedMotion,
  revealDelay,
}: TechOrbitProps) {
  const theme = useTheme();
  const { isMobile, isTablet } = useDeviceTypeDetection();
  const isDark = theme.palette.mode === THEME_MODE.DARK;

  const frontBandRef = useRef<HTMLDivElement>(null);
  const backBandRef = useRef<HTMLDivElement>(null);
  const frontRefs = useRef<(HTMLDivElement | null)[]>([]);
  const backRefs = useRef<(HTMLDivElement | null)[]>([]);
  const rafRef = useRef<number>(0);
  const startTimeRef = useRef<number | null>(null);

  const iconSize = isMobile
    ? ORBIT_CONFIG.ICON_SIZE_MOBILE
    : isTablet
      ? ORBIT_CONFIG.ICON_SIZE_TABLET
      : ORBIT_CONFIG.ICON_SIZE_DESKTOP;

  const setFrontRef = useCallback(
    (index: number) => (el: HTMLDivElement | null) => {
      frontRefs.current[index] = el;
    },
    [],
  );
  const setBackRef = useCallback(
    (index: number) => (el: HTMLDivElement | null) => {
      backRefs.current[index] = el;
    },
    [],
  );

  // Resolve brand color (swap near-black for white in dark mode)
  function resolvedBrandColor(slug: string): string {
    const hex = getBrandHex(slug);
    if (!isDark) return `#${hex}`;
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
    return luminance < 60 ? "#ffffff" : `#${hex}`;
  }

  // ── Two-lane conveyor loop (all sizes, motion enabled) ──
  useEffect(() => {
    if (reducedMotion || !revealed) return;

    const gap = CONVEYOR_CONFIG.CARD_GAP;
    const speed = CONVEYOR_CONFIG.SPEED;

    // Frontend flows right→left (dir 1), backend left→right (dir -1).
    const lanes = [
      { band: frontBandRef.current, chips: frontRefs.current, dir: 1 },
      { band: backBandRef.current, chips: backRefs.current, dir: -1 },
    ];

    // Measured lazily on the first frame (chips laid out, fonts applied) so
    // spacing is based on each card's real width → constant gap between EDGES
    // regardless of label length.
    let layouts:
      | {
          widths: number[];
          offsets: number[];
          total: number;
          maxWidth: number;
        }[]
      | null = null;

    function measure() {
      return lanes.map((l) => {
        const widths = l.chips.map((c) => c?.offsetWidth ?? 0);
        const offsets: number[] = [];
        let acc = 0;
        for (const w of widths) {
          offsets.push(acc);
          acc += w + gap;
        }
        return {
          widths,
          offsets,
          total: acc,
          maxWidth: Math.max(0, ...widths),
        };
      });
    }

    function animate(timestamp: number) {
      if (!layouts) {
        layouts = measure();
        // Widths not ready yet (pre-paint / pre-font) — retry next frame.
        if (layouts.some((l) => l.total <= 0)) {
          layouts = null;
          rafRef.current = requestAnimationFrame(animate);
          return;
        }
      }
      if (startTimeRef.current === null) startTimeRef.current = timestamp;
      const elapsed = (timestamp - startTimeRef.current) / 1000;

      for (let li = 0; li < lanes.length; li++) {
        const lane = lanes[li];
        const band = lane?.band;
        const layout = layouts[li];
        if (!band || !lane || !layout || layout.total <= 0) continue;

        const width = band.clientWidth;
        const centerX = width / 2;
        const { widths, offsets, total, maxWidth } = layout;

        // Fade zone at each edge, and a lead offset that shifts the wrap seam
        // fully OFF-SCREEN on both sides (a chip is invisible once its left edge
        // passes the lead). Without this the modulo seam sits on the left edge,
        // making chips pop/teleport there while flowing smoothly on the right.
        const fadeZone = Math.min(CONVEYOR_CONFIG.EDGE_FADE_PX, width * 0.4);
        const lead = maxWidth + 8;

        for (let i = 0; i < lane.chips.length; i++) {
          const el = lane.chips[i];
          const off = offsets[i];
          if (!el || off === undefined) continue;

          // Position on the track, then shift by `lead` so the wrap happens
          // off-screen left; with total > width + lead the right seam is off too.
          const raw =
            (((off - lane.dir * elapsed * speed) % total) + total) % total;
          const x = raw - lead;
          const center = x + (widths[i] ?? 0) / 2;

          // Depth focus: 1.0 at the lane center, 0.0 at the edges
          const k = 1 - Math.min(1, Math.abs(center - centerX) / centerX);
          const scale =
            CONVEYOR_CONFIG.SCALE_MIN + k * CONVEYOR_CONFIG.SCALE_RANGE;

          // Smooth edge fade: opacity ramps to 0 as a chip's center nears either
          // band edge (identical behaviour left and right now the seam is hidden).
          const edgeDist = Math.min(center, width - center);
          const edgeFade = Math.max(0, Math.min(1, edgeDist / fadeZone));
          const opacity =
            (CONVEYOR_CONFIG.OPACITY_MIN + k * CONVEYOR_CONFIG.OPACITY_RANGE) *
            edgeFade;

          el.style.transform = `translate(${x}px, -50%) scale(${scale})`;
          el.style.opacity = String(opacity);
          const z = k > 0.6 ? "3" : "0";
          if (el.style.zIndex !== z) el.style.zIndex = z;
        }
      }

      rafRef.current = requestAnimationFrame(animate);
    }

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      startTimeRef.current = null;
    };
    // isMobile/isTablet are in deps so the loop re-measures when the icon
    // size (and thus chip widths) changes across breakpoints.
  }, [isMobile, isTablet, reducedMotion, revealed]);

  // ── Reduced motion: static wrapped chip grid (no animation) ──
  if (reducedMotion) {
    return (
      <Box
        role="img"
        aria-label={SKILLS.map((s) => s.name).join(", ")}
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: "8px",
          justifyContent: "center",
          mt: "32px",
          position: "relative",
          zIndex: 1,
          maxWidth: CONTENT_MAX_WIDTH.CARDS,
        }}
      >
        {SKILLS.map((skill, i) => (
          <MobileChip
            key={skill.name}
            revealed={revealed}
            reducedMotion={reducedMotion}
            delay={revealDelay + i * ORBIT_CONFIG.REVEAL_STAGGER}
            floatDelay={i * REVEAL_ANIMATION.MOBILE_FLOAT_STAGGER}
            style={
              {
                "--brand-color": resolvedBrandColor(skill.slug),
              } as React.CSSProperties
            }
          >
            <TechIcon slug={skill.slug} size={iconSize} />
            <span>{skill.name}</span>
          </MobileChip>
        ))}
      </Box>
    );
  }

  // ── Desktop / Tablet: two counter-flowing depth-conveyor lanes ──
  return (
    <LanesWrap
      role="img"
      aria-label={SKILLS.map((s) => s.name).join(", ")}
      sx={{
        opacity: revealed ? 1 : 0,
        transition: `opacity ${CONVEYOR_CONFIG.REVEAL_FADE} ${SCROLL_REVEAL_CONFIG.EASING} ${revealDelay}ms`,
      }}
    >
      <ConveyorBand ref={frontBandRef}>
        {FRONTEND_SKILLS.map((skill, i) => (
          <ConveyorChip
            key={skill.name}
            ref={setFrontRef(i)}
            style={
              {
                "--brand-color": resolvedBrandColor(skill.slug),
              } as React.CSSProperties
            }
          >
            <TechIcon slug={skill.slug} size={iconSize} />
            <span>{skill.name}</span>
          </ConveyorChip>
        ))}
      </ConveyorBand>

      <ConveyorBand ref={backBandRef}>
        {BACKEND_SKILLS.map((skill, i) => (
          <ConveyorChip
            key={skill.name}
            ref={setBackRef(i)}
            style={
              {
                "--brand-color": resolvedBrandColor(skill.slug),
              } as React.CSSProperties
            }
          >
            <TechIcon slug={skill.slug} size={iconSize} />
            <span>{skill.name}</span>
          </ConveyorChip>
        ))}
      </ConveyorBand>
    </LanesWrap>
  );
}
