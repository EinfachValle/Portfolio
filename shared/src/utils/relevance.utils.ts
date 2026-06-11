import type { GitHubRepository } from "../types/github.types.js";

const DAY_MS = 86_400_000;

/**
 * Composite relevance score for a repository.
 *
 * Combines community signals (stars, forks) with effort/activity signals
 * (how recently it was pushed, how large it is) so that an actively-developed,
 * substantial project outranks a repo that merely has one more star. Pure
 * function — `now` is injectable for deterministic tests.
 *
 *   score = stars·10 + forks·6 + recencyBoost + effortBoost
 *     recencyBoost: pushed <7d:+12 · <30d:+8 · <90d:+4 · <180d:+2 · else 0
 *     effortBoost:  min(log10(sizeKb + 1)·2, 6)
 */
export function computeRelevanceScore(
  repo: GitHubRepository,
  now: number = Date.now(),
): number {
  const stars = repo.stars * 10;
  const forks = repo.forks * 6;

  const days = (now - new Date(repo.pushedAt).getTime()) / DAY_MS;
  const recency =
    days < 7 ? 12 : days < 30 ? 8 : days < 90 ? 4 : days < 180 ? 2 : 0;

  const effort = Math.min(Math.log10(repo.sizeKb + 1) * 2, 6);

  return stars + forks + recency + effort;
}
