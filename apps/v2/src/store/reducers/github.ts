import type { GitHubRepository } from "@portfolio/shared";

import type { AppAction } from "../types";
import * as TYPES from "../types";
import {
  type AsyncState,
  asyncFailure,
  asyncRequest,
  asyncSuccess,
} from "../utils/reducerHelpers";

export interface GithubState extends AsyncState {
  repositories: GitHubRepository[];
}

const initialState: GithubState = {
  repositories: [],
  isLoading: false,
  error: null,
};

const githubReducer = (
  state = initialState,
  action: AppAction,
): GithubState => {
  switch (action.type) {
    case TYPES.GITHUB_FETCH_REQUEST:
      return asyncRequest(state);
    case TYPES.GITHUB_FETCH_SUCCESS:
      return {
        ...asyncSuccess(state),
        repositories: action.payload as GitHubRepository[],
      };
    case TYPES.GITHUB_FETCH_FAILURE:
      return asyncFailure(state, action.payload as string);
    default:
      return state;
  }
};

export default githubReducer;
