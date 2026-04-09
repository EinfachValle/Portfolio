import { GITHUB_CONFIG } from "../constants/env.constants.js";
import type { GitHubRepository } from "../types/github.types.js";

interface GitHubApiRepo {
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  license: { spdx_id: string } | null;
  stargazers_count: number;
  forks_count: number;
  topics: string[];
  is_template: boolean;
}

interface GitHubApiTag {
  name: string;
}

export async function fetchGitHubRepositories(): Promise<GitHubRepository[]> {
  const { token, username } = GITHUB_CONFIG;

  if (!token || !username) {
    throw new Error("GitHub token or username not configured");
  }

  const headers: HeadersInit = {
    Authorization: `token ${token}`,
    Accept: "application/vnd.github.v3+json",
  };

  const reposResponse = await fetch(
    `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`,
    { headers },
  );

  if (!reposResponse.ok) {
    throw new Error(`GitHub API error: ${reposResponse.status}`);
  }

  const repos: GitHubApiRepo[] = await reposResponse.json();

  const filtered = repos.filter((repo) => repo.name !== username);

  const withTags = await Promise.all(
    filtered.map(async (repo) => {
      const tagsResponse = await fetch(
        `https://api.github.com/repos/${username}/${repo.name}/tags?per_page=1`,
        { headers },
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
      };
    }),
  );

  return withTags;
}
