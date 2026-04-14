import type { ThemeMode } from "@/store/reducers/ui";

import type { AppThunk } from "../store";
import * as TYPES from "../types";

export const setThemeMode =
  (mode: ThemeMode): AppThunk =>
  (dispatch) => {
    dispatch({ type: TYPES.SET_THEME_MODE, payload: mode });
  };

export const setLocale =
  (locale: string): AppThunk =>
  (dispatch) => {
    dispatch({ type: TYPES.SET_LOCALE, payload: locale });
  };

export const setActiveSection =
  (section: string): AppThunk =>
  (dispatch) => {
    dispatch({ type: TYPES.SET_ACTIVE_SECTION, payload: section });
  };

export const setScrollTarget =
  (target: string | null): AppThunk =>
  (dispatch) => {
    dispatch({ type: TYPES.SET_SCROLL_TARGET, payload: target });
  };
