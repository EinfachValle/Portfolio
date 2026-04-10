import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export type ThemeMode = "dark" | "light";

interface UiState {
  themeMode: ThemeMode;
  locale: string;
  activeSection: string;
  scrollTarget: string | null;
}

const initialState: UiState = {
  themeMode: "dark",
  locale: "en",
  activeSection: "hero",
  scrollTarget: null,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setThemeMode(state, action: PayloadAction<ThemeMode>) {
      state.themeMode = action.payload;
    },
    setLocale(state, action: PayloadAction<string>) {
      state.locale = action.payload;
    },
    setActiveSection(state, action: PayloadAction<string>) {
      state.activeSection = action.payload;
    },
    setScrollTarget(state, action: PayloadAction<string | null>) {
      state.scrollTarget = action.payload;
    },
  },
});

export const { setThemeMode, setLocale, setActiveSection, setScrollTarget } =
  uiSlice.actions;
export default uiSlice.reducer;
