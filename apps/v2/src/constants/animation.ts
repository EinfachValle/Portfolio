/**
 * V2 Animation Constants
 *
 * Plain TypeScript, NO framework imports.
 * Consumed by AnimatedGrid, scroll reveal, and hero animations.
 */

export const MESH_GRID_CONFIG = {
  CELL_SIZE_DESKTOP: 80,
  CELL_SIZE_MOBILE: 60,
  LINE_WIDTH: 1,
  DOT_COUNT_DESKTOP: 10,
  DOT_COUNT_TABLET: 7,
  DOT_COUNT_MOBILE: 5,
  DOT_SIZE: 4,
  DOT_GLOW_SIZE: 12,
  LINE_LENGTH: 60,
  DOT_MIN_DURATION: 15,
  DOT_MAX_DURATION: 35,
} as const;

export const SCROLL_REVEAL_CONFIG = {
  THRESHOLD: 0.25,
  EASING: "cubic-bezier(0.16, 1, 0.3, 1)",
  STAGGER_DELAY: 120, // ms between items
} as const;

export const ORBIT_CONFIG = {
  /** Seconds for one full orbit rotation — higher = slower */
  FULL_ROTATION_SECONDS: 150,
  RADIUS_X: 480, // px, desktop ellipse half-width
  RADIUS_Y: 260, // px, desktop ellipse half-height
  TILT_DEG: -15, // degrees, ellipse tilt
  TABLET_RADIUS_X: 320,
  TABLET_RADIUS_Y: 180,
  TABLET_TILT_DEG: -12,
  ICON_SIZE_DESKTOP: 20,
  ICON_SIZE_TABLET: 18,
  ICON_SIZE_MOBILE: 16,
  REVEAL_STAGGER: 100, // ms between each icon reveal
  REVEAL_FADE_MS: 600, // ms for each icon's initial fade-in
  FLOAT_DURATION: 3, // seconds for mobile float
  TRACK_OPACITY: 0.35, // base opacity of the gradient track
  // Depth perception (sigmoid-based continuous fade)
  DEPTH_STEEPNESS: 2.5, // higher = sharper front/behind boundary
  BEHIND_CENTER: 1.0, // center of behind zone (× PI) — 1.0 = left side of ellipse
  MIN_OPACITY: 0.06, // opacity when fully behind text
  MAX_OPACITY: 0.92, // opacity when fully in front
  MIN_SCALE: 0.92, // scale when behind (subtle depth cue)
  MAX_SCALE: 1.0,
  BLUR_FRONT: 12, // px, static backdrop-filter blur
} as const;

export const HERO_TIMING = {
  CHAR_REVEAL_STAGGER: 50, // ms per character
  TYPEWRITER_MIN_SPEED: 40, // ms
  TYPEWRITER_MAX_SPEED: 70, // ms
  CTA_DELAY: 2500, // ms
  SCROLL_INDICATOR_DELAY: 3000, // ms
} as const;

// ── Hero animation sequence ────────────────────────────────────────

export const HERO_ANIMATION = {
  NAME_DELAY: 0.3, // s — first name char reveal base
  LASTNAME_DELAY: 0.7, // s — last name char reveal base
  SUBTITLE_DELAY: 300, // ms — subtitle fade-in
  ACCENT_DELAY: 1100, // ms — accent line appear
  TYPEWRITER_DELAY: 1300, // ms — tagline typewriter start
  ACCENT_LINE_WIDTH: 64, // px — accent line target width
  ACCENT_LINE_HEIGHT: 2, // px
  SCROLL_PULSE_HEIGHT: 32, // px
  CURSOR_BLINK_DURATION: 1.06, // s
  SCROLL_PULSE_DURATION: 2, // s
} as const;

// ── Reveal animations (scroll-triggered sections) ──────────────────

export const REVEAL_ANIMATION = {
  SECTION_DURATION: "1s",
  WORD_DURATION: "0.5s",
  WORD_STAGGER: 30, // ms between words
  WORD_REVEAL_DELAY: 200, // ms before words start
  FORM_DURATION: "0.8s",
  CARD_DURATION: "0.7s",
  HEADER_DURATION: "0.8s",
  CHAR_DURATION: "0.6s",
  RING_REVEAL_OFFSET: 200, // ms — outer orbit ring delay
  MOBILE_FLOAT_STAGGER: 0.3, // s between mobile chips
} as const;

// ── Common transitions ─────────────────────────────────────────────

export const TRANSITION = {
  FAST: "0.2s ease",
  MEDIUM: "0.3s ease",
} as const;
