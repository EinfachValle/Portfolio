/**
 * V2 Layout Constants
 *
 * Z-index scale, section layout, navigation, card, and form dimensions.
 */

// ── Z-Index scale ──────────────────────────────────────────────────

export const Z_INDEX = {
  BACKGROUND: 0,
  CONTENT: 1,
  FOOTER: 2,
  MOBILE_OVERLAY: 999,
  NAVBAR: 1000,
  SKIP_LINK: 9999,
  LOADER: 99999,
} as const;

// ── Section layout ─────────────────────────────────────────────────

export const SECTION = {
  PADDING_Y: 80,
  PADDING_X: 40,
  PADDING_X_MOBILE: 16,
} as const;

// ── Content max widths ─────────────────────────────────────────────

export const CONTENT_MAX_WIDTH = {
  ABOUT: 700,
  HERO: 800,
  CARDS: 960,
  PROJECTS_PAGE: 1100,
  FORM: 480,
  TAGLINE: 560,
  DESCRIPTION: 440,
} as const;

// ── Navigation ─────────────────────────────────────────────────────

export const NAV = {
  HEIGHT: 64,
  LOGO_SIZE: 28,
  SCROLL_THRESHOLD: 10,
  OBSERVER_MARGIN: "-40% 0px -55% 0px",
  BACKDROP_BLUR: 12,
} as const;

// ── Cards ──────────────────────────────────────────────────────────

export const CARD = {
  PADDING: 28,
  GAP: 12,
  BORDER_RADIUS: 14,
  GRID_GAP: 20,
  GRID_GAP_FULL: 24,
} as const;

// ── Projects podium (preview) ──────────────────────────────────────
// Bottoms are aligned (grid align-items:end), so a taller min-height makes a
// card rise higher above the shared floor. Staggering the three heights turns
// the row into a real podium: rank 1 (center) tallest, rank 2 (left) mid,
// rank 3 (right) shortest.
// THIRD_MIN_HEIGHT is the floor that must still cover the shortest card's
// content — bump all three together if a future project's card grows past it.
export const PODIUM = {
  WINNER_MIN_HEIGHT: 360,
  SECOND_MIN_HEIGHT: 310,
  THIRD_MIN_HEIGHT: 260,
} as const;

// ── Form layout ────────────────────────────────────────────────────

export const FORM_LAYOUT = {
  FIELD_GAP: 14,
  INPUT_BORDER_RADIUS: 10,
  TEXTAREA_MIN_HEIGHT: 120,
  SUBMIT_BORDER_RADIUS: 10,
} as const;

// ── Circuit board decoration ───────────────────────────────────────

export const CIRCUIT_DECOR = {
  OFFSET: -40,
} as const;
