// ── UI Action Types ────────────────────────────────────────────────

export const SET_THEME_MODE = "SET_THEME_MODE";
export const SET_LOCALE = "SET_LOCALE";
export const SET_ACTIVE_SECTION = "SET_ACTIVE_SECTION";
export const SET_SCROLL_TARGET = "SET_SCROLL_TARGET";

// ── Contact Action Types ───────────────────────────────────────────

export const CONTACT_SUBMIT_REQUEST = "CONTACT_SUBMIT_REQUEST";
export const CONTACT_SUBMIT_SUCCESS = "CONTACT_SUBMIT_SUCCESS";
export const CONTACT_SUBMIT_FAILURE = "CONTACT_SUBMIT_FAILURE";
export const CONTACT_RESET_STATUS = "CONTACT_RESET_STATUS";

// ── GitHub Action Types ────────────────────────────────────────────

export const GITHUB_FETCH_REQUEST = "GITHUB_FETCH_REQUEST";
export const GITHUB_FETCH_SUCCESS = "GITHUB_FETCH_SUCCESS";
export const GITHUB_FETCH_FAILURE = "GITHUB_FETCH_FAILURE";

// ── Generic Action Interface ───────────────────────────────────────

export interface AppAction {
  type: string;
  payload?: unknown;
  [key: string]: unknown;
}
