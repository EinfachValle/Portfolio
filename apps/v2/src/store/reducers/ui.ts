import { DEFAULT_LANGUAGE } from "@portfolio/shared";

import { SECTION_ID, THEME_MODE } from "@/constants/elements";

import type { AppAction } from "../types";
import * as TYPES from "../types";

export type ThemeMode = (typeof THEME_MODE)[keyof typeof THEME_MODE];

export interface UiState {
  themeMode: ThemeMode;
  locale: string;
  activeSection: string;
  scrollTarget: string | null;
}

const initialState: UiState = {
  themeMode: THEME_MODE.DARK,
  locale: DEFAULT_LANGUAGE,
  activeSection: SECTION_ID.HERO,
  scrollTarget: null,
};

const uiReducer = (state = initialState, action: AppAction): UiState => {
  switch (action.type) {
    case TYPES.SET_THEME_MODE:
      return { ...state, themeMode: action.payload as ThemeMode };
    case TYPES.SET_LOCALE:
      return { ...state, locale: action.payload as string };
    case TYPES.SET_ACTIVE_SECTION:
      return { ...state, activeSection: action.payload as string };
    case TYPES.SET_SCROLL_TARGET:
      return { ...state, scrollTarget: action.payload as string | null };
    default:
      return state;
  }
};

export default uiReducer;
