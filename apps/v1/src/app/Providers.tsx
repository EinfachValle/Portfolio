"use client";

import { Provider } from "react-redux";

import { I18nextProvider } from "react-i18next";

import { StyledEngineProvider, ThemeProvider } from "@mui/material/styles";

import i18n from "../config/i18n";
import { store } from "../store/store";
import getTheme from "../theme";

export default function Providers({ children }: { children: React.ReactNode }) {
  const theme = getTheme("dark");

  return (
    <Provider store={store}>
      <I18nextProvider i18n={i18n}>
        <StyledEngineProvider injectFirst>
          <ThemeProvider theme={theme}>{children}</ThemeProvider>
        </StyledEngineProvider>
      </I18nextProvider>
    </Provider>
  );
}
