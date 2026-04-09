import type { Dispatch } from "redux";

import type { GitHubRepository } from "@portfolio/shared";

import axios from "axios";

import { ActionTypes } from "../types";

interface UiAction {
  type: string;
  payload?: unknown;
}

export const setDocumentDraggedOver =
  (status: boolean) =>
  (dispatch: Dispatch<UiAction>): void => {
    dispatch({
      type: ActionTypes.SET_DOCUMENT_DRAGGED_OVER,
      payload: status,
    });
  };

export const setApplicationTouched =
  () =>
  (dispatch: Dispatch<UiAction>): void => {
    dispatch({
      type: ActionTypes.SET_APP_TOUCHED,
      payload: true,
    });
  };

export const changeApplicationTheme =
  (theme: "dark" | "light") =>
  (dispatch: Dispatch<UiAction>): void => {
    dispatch({
      type: ActionTypes.CHANGE_APPLICATION_THEME,
      payload: theme,
    });
  };

export const changeApplicationLocale =
  (locale: string) =>
  (dispatch: Dispatch<UiAction>): void => {
    dispatch({
      type: ActionTypes.CHANGE_APPLICATION_LOCALE,
      payload: locale,
    });
  };

export const setScrollTarget =
  (section: string) =>
  (dispatch: Dispatch<UiAction>): void => {
    dispatch({
      type: ActionTypes.SET_SCROLL_TARGET,
      payload: section,
    });
  };

export const fetchGithubRepos =
  () =>
  async (dispatch: Dispatch<UiAction>): Promise<void> => {
    dispatch({ type: ActionTypes.GITHUB_API_LOADING });

    try {
      const response = await axios.get<{ repositories: GitHubRepository[] }>(
        "/api/github",
      );
      dispatch({
        type: ActionTypes.GITHUB_API_SUCCESS,
        payload: response.data.repositories,
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unknown error";
      dispatch({ type: ActionTypes.GITHUB_API_FAILURE, payload: message });
    }
  };
