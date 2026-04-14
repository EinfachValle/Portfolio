/**
 * V2 Form Constants
 *
 * Validation limits and form element IDs.
 */

// ── Validation ─────────────────────────────────────────────────────

export const VALIDATION = {
  MESSAGE_MIN_LENGTH: 10,
  MESSAGE_MAX_LENGTH: 5000,
} as const;

// ── Form error element IDs (for aria-describedby) ──────────────────

export const FORM_ERROR_ID = {
  NAME: "contact-name-error",
  EMAIL: "contact-email-error",
  SUBJECT: "contact-subject-error",
  MESSAGE: "contact-message-error",
  CONSENT: "contact-consent-error",
} as const;
