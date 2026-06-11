import { GITHUB_CONFIG } from "../constants/env.constants.js";
import type { GitHubRepository } from "../types/github.types.js";

interface GitHubApiRepo {
  name: string;
  full_name: string;
  owner: { login: string };
  description: string | null;
  html_url: string;
  language: string | null;
  license: { spdx_id: string } | null;
  stargazers_count: number;
  forks_count: number;
  topics: string[];
  is_template: boolean;
  pushed_at: string;
  size: number;
}

interface GitHubApiTag {
  name: string;
}

/** Repos that are never shown (org profile readme, etc.). */
const EXCLUDED_NAMES = new Set([".github"]);

async function fetchRepoList(
  url: string,
  headers: HeadersInit,
): Promise<GitHubApiRepo[]> {
  const response = await fetch(url, { headers });
  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status}`);
  }
  return response.json();
}

export async function fetchGitHubRepositories(): Promise<GitHubRepository[]> {
  const { token, username, org } = GITHUB_CONFIG;

  if (!token || !username) {
    throw new Error("GitHub token or username not configured");
  }

  const accept = "application/vnd.github.v3+json";
  // The token is a fine-grained PAT scoped to the personal account — sending it
  // to another owner's (org) resources yields 403. Public org data needs no
  // token, so we authenticate only requests for the user's own repos.
  const authHeaders: HeadersInit = {
    Authorization: `token ${token}`,
    Accept: accept,
  };
  const publicHeaders: HeadersInit = { Accept: accept };
  const ownerHeaders = (owner: string): HeadersInit =>
    owner.toLowerCase() === username.toLowerCase()
      ? authHeaders
      : publicHeaders;

  // Personal repos (authenticated) + the organization's public repos (public).
  const [userRepos, orgRepos] = await Promise.all([
    fetchRepoList(
      `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`,
      authHeaders,
    ),
    org
      ? fetchRepoList(
          `https://api.github.com/orgs/${org}/repos?per_page=100&sort=updated`,
          publicHeaders,
        )
      : Promise.resolve([]),
  ]);

  const isOwnProfileRepo = (repo: GitHubApiRepo): boolean =>
    repo.owner.login.toLowerCase() === username.toLowerCase() &&
    repo.name.toLowerCase() === username.toLowerCase();

  const filtered = [...userRepos, ...orgRepos].filter(
    // Drop the personal profile-readme repo (user/<username>) and org meta
    // repos like ".github" — but never an org repo that merely shares the name.
    (repo) => !isOwnProfileRepo(repo) && !EXCLUDED_NAMES.has(repo.name),
  );

  const withTags = await Promise.all(
    filtered.map(async (repo) => {
      const tagsResponse = await fetch(
        `https://api.github.com/repos/${repo.full_name}/tags?per_page=1`,
        { headers: ownerHeaders(repo.owner.login) },
      );
      const tags: GitHubApiTag[] = tagsResponse.ok
        ? await tagsResponse.json()
        : [];

      return {
        name: repo.name,
        description: repo.description,
        htmlUrl: repo.html_url,
        language: repo.language,
        license: repo.license?.spdx_id ?? null,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        topics: repo.topics,
        latestTag: tags[0]?.name ?? null,
        isTemplate: repo.is_template ?? false,
        pushedAt: repo.pushed_at,
        sizeKb: repo.size,
        owner: repo.owner.login,
      };
    }),
  );

  return withTags;
}
