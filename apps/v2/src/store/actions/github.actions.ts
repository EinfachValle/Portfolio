import { API } from "@/constants/api";

import type { AppThunk } from "../store";
import * as TYPES from "../types";

export const fetchGithubRepos =
  (): AppThunk<Promise<void>> => async (dispatch) => {
    dispatch({ type: TYPES.GITHUB_FETCH_REQUEST });

    try {
      const response = await fetch(API.GITHUB);

      if (!response.ok) {
        throw new Error(`${response.statusText}`);
      }

      const data = await response.json();
      dispatch({
        type: TYPES.GITHUB_FETCH_SUCCESS,
        payload: data.repositories,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      dispatch({ type: TYPES.GITHUB_FETCH_FAILURE, payload: message });
    }
  };
