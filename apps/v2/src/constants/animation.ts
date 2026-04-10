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

export const HERO_TIMING = {
  CHAR_REVEAL_STAGGER: 50, // ms per character
  TYPEWRITER_MIN_SPEED: 40, // ms
  TYPEWRITER_MAX_SPEED: 70, // ms
  CTA_DELAY: 2500, // ms
  SCROLL_INDICATOR_DELAY: 3000, // ms
} as const;
