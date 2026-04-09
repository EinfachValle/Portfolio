import type { GitHubRepository } from "@portfolio/shared";

import { ActionTypes } from "../types";

export interface UiState {
  documentDraggedOver: boolean;
  appTouched: boolean;
  theme: "dark" | "light";
  locale: string | null;
  section: string;
  activeSection: string;
  repositories: GitHubRepository[];
  isGithubLoading: boolean;
  error: string | null;
}

const initialUIState: UiState = {
  documentDraggedOver: false,
  appTouched: false,
  theme: "dark",
  locale: null,
  section: "aboutMe",
  activeSection: "aboutMe",
  repositories: [],
  isGithubLoading: false,
  error: null,
};

interface UiAction {
  type: string;
  payload?: unknown;
}

const uiReducer = (
  state: UiState = initialUIState,
  action: UiAction,
): UiState => {
  switch (action.type) {
    case ActionTypes.SET_DOCUMENT_DRAGGED_OVER:
      return {
        ...state,
        documentDraggedOver: action.payload as boolean,
      };
    case ActionTypes.SET_APP_TOUCHED:
      return {
        ...state,
        appTouched: action.payload as boolean,
      };
    case ActionTypes.CHANGE_APPLICATION_THEME:
      return {
        ...state,
        theme: action.payload as "dark" | "light",
      };
    case ActionTypes.CHANGE_APPLICATION_LOCALE:
      return {
        ...state,
        locale: action.payload as string | null,
      };
    case ActionTypes.SET_SCROLL_TARGET:
      return {
        ...state,
        section: action.payload as string,
        activeSection: action.payload as string,
      };
    case ActionTypes.GITHUB_API_LOADING:
      return {
        ...state,
        isGithubLoading: true,
      };
    case ActionTypes.GITHUB_API_SUCCESS:
      return {
        ...state,
        isGithubLoading: false,
        repositories: action.payload as GitHubRepository[],
      };
    case ActionTypes.GITHUB_API_FAILURE:
      return {
        ...state,
        isGithubLoading: false,
        error: action.payload as string,
      };
    default:
      return state;
  }
};

export default uiReducer;
