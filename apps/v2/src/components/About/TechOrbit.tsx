"use client";

import { useCallback, useEffect, useRef } from "react";

import { Box } from "@mui/material";
import { alpha, keyframes, styled, useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

import { SKILLS } from "@portfolio/shared";

import { TechIcon, getBrandHex } from "@/components/About/icons";
import {
  ORBIT_CONFIG,
  REVEAL_ANIMATION,
  SCROLL_REVEAL_CONFIG,
} from "@/constants/animation";
import { THEME_MODE } from "@/constants/elements";
import { FONT_FAMILY } from "@/constants/typography";

// ── Types ──────────────────────────────────────────────────────────

interface TechOrbitProps {
  revealed: boolean;
  reducedMotion: boolean;
  revealDelay: number;
}

// ── Keyframes ──────────────────────────────────────────────────────

const floatUp = keyframes`
  0%, 100% { transform: translateY(0); }
  50%      { transform: translateY(-6px); }
`;

// ── Styled components ──────────────────────────────────────────────

const OrbitContainer = styled(Box)({
  position: "absolute",
  inset: 0,
  pointerEvents: "none",
});

const OrbitTrackSvg = styled("svg")({
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  overflow: "visible",
  pointerEvents: "none",
  maskImage:
    "linear-gradient(to right, rgba(0,0,0,0.04) 0%, rgba(0,0,0,0.25) 30%, rgba(0,0,0,1) 55%, rgba(0,0,0,1) 100%)",
  WebkitMaskImage:
    "linear-gradient(to right, rgba(0,0,0,0.04) 0%, rgba(0,0,0,0.25) 30%, rgba(0,0,0,1) 55%, rgba(0,0,0,1) 100%)",
});

/**
 * OrbitIcon — ALL visual styles are STATIC (never transition).
 * Only `transform` (position + scale) and `opacity` change per frame,
 * both set directly in JS. These are the only two GPU-compositor-safe
 * properties, eliminating all layout/paint-triggered jitter.
 */
const OrbitIcon = styled(Box)(({ theme }) => ({
  position: "absolute",
  left: 0,
  top: 0,
  display: "flex",
  alignItems: "center",
  gap: 6,
  padding: "6px 12px",
  borderRadius: 12,
  whiteSpace: "nowrap",
  pointerEvents: "none",

  // GPU layer promotion — critical for jitter-free animation
  willChange: "transform, opacity",
  backfaceVisibility: "hidden",

  // Start hidden; JS drives opacity + transform directly
  opacity: 0,
  transform: "translate3d(0, 0, 0)",
  transition: "none",

  // Static frosted glass background — NEVER changes at runtime
  background: alpha(theme.palette.accent.primary, 0.06),
  backdropFilter: `blur(${ORBIT_CONFIG.BLUR_FRONT}px)`,
  WebkitBackdropFilter: `blur(${ORBIT_CONFIG.BLUR_FRONT}px)`,
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

  // Static icon + text styling — color via CSS variable
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
}));

// ── Mobile chip ────────────────────────────────────────────────────

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
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "8px 14px",
    borderRadius: 12,
    background: theme.palette.glass.background,
    border: `1px solid ${theme.palette.border.separator}`,
    opacity: revealed || reducedMotion ? 1 : 0,
    transform: revealed || reducedMotion ? "scale(1)" : "scale(0.8)",
    transition: reducedMotion
      ? "none"
      : `opacity 0.35s ${SCROLL_REVEAL_CONFIG.EASING} ${delay}ms, transform 0.35s ${SCROLL_REVEAL_CONFIG.EASING} ${delay}ms`,
    animation:
      !reducedMotion && revealed
        ? `${floatUp} ${ORBIT_CONFIG.FLOAT_DURATION}s ease-in-out ${floatDelay}s infinite`
        : "none",
    "& svg": {
      color: alpha(theme.palette.accent.primary, 0.6),
      flexShrink: 0,
    },
    "& span": {
      fontSize: 11,
      letterSpacing: "0.5px",
      color: theme.palette.text.muted,
      fontFamily: FONT_FAMILY.SANS,
    },
  }),
);

// ── Depth computation ─────────────────────────────────────────────

/**
 * Continuous depth factor: 0.0 = fully behind, 1.0 = fully in front.
 * Uses a sigmoid for smooth, jitter-free transitions without any
 * hard boundary that could cause flickering.
 */
function computeDepthFactor(angle: number): number {
  const TWO_PI = Math.PI * 2;
  const normalized = ((angle % TWO_PI) + TWO_PI) % TWO_PI;
  const cosDepth = Math.cos(normalized - ORBIT_CONFIG.BEHIND_CENTER * Math.PI);
  return 1 / (1 + Math.exp(ORBIT_CONFIG.DEPTH_STEEPNESS * cosDepth));
}

// ── Component ──────────────────────────────────────────────────────

export function TechOrbit({
  revealed,
  reducedMotion,
  revealDelay,
}: TechOrbitProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<SVGEllipseElement>(null);
  const iconRefs = useRef<(HTMLDivElement | null)[]>([]);
  const rafRef = useRef<number>(0);
  const startTimeRef = useRef<number | null>(null);
  const dimensionsRef = useRef({ centerX: 0, centerY: 0 });

  const iconSize = isMobile
    ? ORBIT_CONFIG.ICON_SIZE_MOBILE
    : isTablet
      ? ORBIT_CONFIG.ICON_SIZE_TABLET
      : ORBIT_CONFIG.ICON_SIZE_DESKTOP;

  const radiusX = isTablet
    ? ORBIT_CONFIG.TABLET_RADIUS_X
    : ORBIT_CONFIG.RADIUS_X;
  const radiusY = isTablet
    ? ORBIT_CONFIG.TABLET_RADIUS_Y
    : ORBIT_CONFIG.RADIUS_Y;
  const tiltDeg = isTablet
    ? ORBIT_CONFIG.TABLET_TILT_DEG
    : ORBIT_CONFIG.TILT_DEG;

  const setIconRef = useCallback(
    (index: number) => (el: HTMLDivElement | null) => {
      iconRefs.current[index] = el;
    },
    [],
  );

  const updateDimensions = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const { width, height } = container.getBoundingClientRect();
    dimensionsRef.current = { centerX: width / 2, centerY: height / 2 };

    const track = trackRef.current;
    if (track) {
      const cx = width / 2;
      const cy = height / 2;
      track.setAttribute("cx", String(cx));
      track.setAttribute("cy", String(cy));
      track.setAttribute("rx", String(radiusX));
      track.setAttribute("ry", String(radiusY));
      track.setAttribute("transform", `rotate(${tiltDeg}, ${cx}, ${cy})`);
    }
  }, [radiusX, radiusY, tiltDeg]);

  // ── Animation loop ──
  useEffect(() => {
    if (isMobile || !revealed) return;

    updateDimensions();

    const container = containerRef.current;
    let observer: ResizeObserver | null = null;
    if (container) {
      observer = new ResizeObserver(updateDimensions);
      observer.observe(container);
    }

    // Pre-compute tilt trig values (once, not every frame)
    const tiltRad = (tiltDeg * Math.PI) / 180;
    const cosTilt = Math.cos(tiltRad);
    const sinTilt = Math.sin(tiltRad);
    const count = SKILLS.length;

    if (reducedMotion) {
      const { centerX, centerY } = dimensionsRef.current;
      for (let i = 0; i < count; i++) {
        const el = iconRefs.current[i];
        if (!el) continue;
        const baseAngle = (i / count) * Math.PI * 2;
        const ex = radiusX * Math.cos(baseAngle);
        const ey = radiusY * Math.sin(baseAngle);
        const x = centerX + ex * cosTilt - ey * sinTilt;
        const y = centerY + ex * sinTilt + ey * cosTilt;
        const depth = computeDepthFactor(baseAngle);
        const opacity =
          ORBIT_CONFIG.MIN_OPACITY +
          depth * (ORBIT_CONFIG.MAX_OPACITY - ORBIT_CONFIG.MIN_OPACITY);
        const scale =
          ORBIT_CONFIG.MIN_SCALE +
          depth * (ORBIT_CONFIG.MAX_SCALE - ORBIT_CONFIG.MIN_SCALE);
        el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) scale(${scale})`;
        el.style.opacity = String(opacity);
        el.style.zIndex = depth > 0.5 ? "3" : "0";
      }
      return () => {
        observer?.disconnect();
      };
    }

    const speed = (2 * Math.PI) / (ORBIT_CONFIG.FULL_ROTATION_SECONDS * 1000);

    // Track previous z-index to avoid unnecessary style writes
    const prevZIndex = new Array<string>(count).fill("");

    function animate(timestamp: number) {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const { centerX, centerY } = dimensionsRef.current;

      for (let i = 0; i < count; i++) {
        const el = iconRefs.current[i];
        if (!el) continue;

        // ── Staggered reveal ──
        const iconRevealMs = revealDelay + i * ORBIT_CONFIG.REVEAL_STAGGER;
        if (elapsed < iconRevealMs) {
          if (el.style.opacity !== "0") el.style.opacity = "0";
          continue;
        }
        const revealElapsed = elapsed - iconRevealMs;
        const revealProgress = Math.min(
          revealElapsed / ORBIT_CONFIG.REVEAL_FADE_MS,
          1,
        );
        // Ease-out cubic for smooth reveal
        const revealFactor = 1 - Math.pow(1 - revealProgress, 3);

        // ── Position on tilted ellipse ──
        const baseAngle = (i / count) * Math.PI * 2;
        const currentAngle = baseAngle + elapsed * speed;
        const ex = radiusX * Math.cos(currentAngle);
        const ey = radiusY * Math.sin(currentAngle);
        const x = centerX + ex * cosTilt - ey * sinTilt;
        const y = centerY + ex * sinTilt + ey * cosTilt;

        // ── Continuous depth (sigmoid) ──
        const depth = computeDepthFactor(currentAngle);
        const targetOpacity =
          ORBIT_CONFIG.MIN_OPACITY +
          depth * (ORBIT_CONFIG.MAX_OPACITY - ORBIT_CONFIG.MIN_OPACITY);
        const scale =
          ORBIT_CONFIG.MIN_SCALE +
          depth * (ORBIT_CONFIG.MAX_SCALE - ORBIT_CONFIG.MIN_SCALE);

        // ── Set ONLY compositor-safe properties ──
        el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) scale(${scale})`;
        el.style.opacity = String(targetOpacity * revealFactor);

        // z-index: only write when value changes
        const newZ = depth > 0.5 ? "3" : "0";
        if (prevZIndex[i] !== newZ) {
          el.style.zIndex = newZ;
          prevZIndex[i] = newZ;
        }
      }

      rafRef.current = requestAnimationFrame(animate);
    }

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      startTimeRef.current = null;
      observer?.disconnect();
    };
  }, [
    revealed,
    reducedMotion,
    isMobile,
    isTablet,
    radiusX,
    radiusY,
    tiltDeg,
    revealDelay,
    updateDimensions,
  ]);

  // ── Mobile: static grid with float animation ──
  if (isMobile) {
    return (
      <Box
        role="img"
        aria-label={SKILLS.map((t) => t.name).join(", ")}
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: "8px",
          justifyContent: "center",
          mt: "32px",
        }}
      >
        {SKILLS.map((skill, i) => (
          <MobileChip
            key={skill.name}
            revealed={revealed}
            reducedMotion={reducedMotion}
            delay={revealDelay + i * ORBIT_CONFIG.REVEAL_STAGGER}
            floatDelay={i * REVEAL_ANIMATION.MOBILE_FLOAT_STAGGER}
          >
            <TechIcon slug={skill.slug} size={iconSize} />
            <span>{skill.name}</span>
          </MobileChip>
        ))}
      </Box>
    );
  }

  // ── Desktop / Tablet: single orbital path ──
  const isDark = theme.palette.mode === THEME_MODE.DARK;
  const accentPrimary = theme.palette.accent.primary;
  const accentSecondary = theme.palette.accent.secondary;
  const trackOpacity = ORBIT_CONFIG.TRACK_OPACITY;

  // Resolve brand color: swap near-black for white in dark mode
  function resolvedBrandColor(slug: string): string {
    const hex = getBrandHex(slug);
    if (!isDark) return `#${hex}`;
    // Parse luminance: if too dark, use white
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
    return luminance < 60 ? "#ffffff" : `#${hex}`;
  }

  return (
    <OrbitContainer
      ref={containerRef}
      role="img"
      aria-label={SKILLS.map((s) => s.name).join(", ")}
    >
      <OrbitTrackSvg>
        <defs>
          <linearGradient
            id="orbit-track-gradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            <stop
              offset="0%"
              stopColor={accentPrimary}
              stopOpacity={trackOpacity}
            />
            <stop
              offset="50%"
              stopColor={accentSecondary}
              stopOpacity={trackOpacity * 0.85}
            />
            <stop
              offset="100%"
              stopColor={accentPrimary}
              stopOpacity={trackOpacity}
            />
          </linearGradient>
        </defs>
        <ellipse
          ref={trackRef}
          fill="none"
          stroke="url(#orbit-track-gradient)"
          strokeWidth="1.5"
          style={{
            opacity: revealed || reducedMotion ? 1 : 0,
            transition: reducedMotion
              ? "none"
              : `opacity 0.8s ${SCROLL_REVEAL_CONFIG.EASING} ${revealDelay}ms`,
          }}
        />
      </OrbitTrackSvg>

      {SKILLS.map((skill, i) => (
        <OrbitIcon
          key={skill.name}
          ref={setIconRef(i)}
          style={
            {
              "--brand-color": resolvedBrandColor(skill.slug),
            } as React.CSSProperties
          }
        >
          <TechIcon slug={skill.slug} size={iconSize} />
          <span>{skill.name}</span>
        </OrbitIcon>
      ))}
    </OrbitContainer>
  );
}
