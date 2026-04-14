/**
 * V2 API & Timing Constants
 *
 * API endpoints and application-level delays/timeouts.
 */

// ── API endpoints ──────────────────────────────────────────────────

export const API = {
  CONTACT: "/api/contact",
  GITHUB: "/api/github",
} as const;

// ── Application-level timing ───────────────────────────────────────

export const TIMING = {
  CONTACT_RESET_DELAY: 5000,
  TYPEWRITER_CURSOR_HIDE: 3000,
  TOASTER_DURATION: 4000,
  NAV_APPEAR_DELAY: 300,
  LOADER_ANIM_DURATION: 2800,
  LOADER_FALLBACK_MAX: 6000,
  LOADER_FADE_WAIT: 300,
  LOADER_REMOVE_DELAY: 600,
} as const;
