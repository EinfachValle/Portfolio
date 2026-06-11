export interface GitHubRepository {
  name: string;
  description: string | null;
  htmlUrl: string;
  language: string | null;
  license: string | null;
  stars: number;
  forks: number;
  topics: string[];
  latestTag: string | null;
  isTemplate: boolean;
  /** ISO timestamp of the last push — drives the recency factor in scoring. */
  pushedAt: string;
  /** Repository size in KB — used as an effort proxy in scoring. */
  sizeKb: number;
  /** Owner login (user or org), e.g. "EinfachValle" or "SoftVentures". */
  owner: string;
}

export interface GitHubApiResponse {
  repositories: GitHubRepository[];
}
