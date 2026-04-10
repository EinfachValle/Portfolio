import { fetchGitHubRepositories } from "@portfolio/shared";

import { NextResponse } from "next/server";

export async function GET() {
  try {
    const repositories = await fetchGitHubRepositories();
    return NextResponse.json(
      { repositories },
      {
        headers: {
          "Cache-Control":
            "public, s-maxage=3600, stale-while-revalidate=86400",
        },
      },
    );
  } catch {
    return NextResponse.json(
      { repositories: [], error: "Failed to fetch repositories" },
      { status: 200 }, // graceful degradation, client shows fallback
    );
  }
}
