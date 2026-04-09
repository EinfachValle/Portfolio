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
}

export interface GitHubApiResponse {
  repositories: GitHubRepository[];
}
