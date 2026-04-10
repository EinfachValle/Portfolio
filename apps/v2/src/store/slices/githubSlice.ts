import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { GitHubRepository } from "@portfolio/shared";

interface GithubState {
  repositories: GitHubRepository[];
  isLoading: boolean;
  error: string | null;
}

const initialState: GithubState = {
  repositories: [],
  isLoading: false,
  error: null,
};

export const fetchGithubRepos = createAsyncThunk(
  "github/fetchRepos",
  async () => {
    const response = await fetch("/api/github");
    if (!response.ok) {
      throw new Error(`Failed to fetch repositories: ${response.statusText}`);
    }
    const data = await response.json();
    return data.repositories as GitHubRepository[];
  },
);

const githubSlice = createSlice({
  name: "github",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGithubRepos.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchGithubRepos.fulfilled, (state, action) => {
        state.repositories = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchGithubRepos.rejected, (state, action) => {
        state.error = action.error.message ?? "Unknown error";
        state.isLoading = false;
      });
  },
});

export default githubSlice.reducer;
