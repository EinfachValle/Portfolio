import { fetchGitHubRepositories } from "@portfolio/shared";

import { NextResponse } from "next/server";

export async function GET() {
  try {
    const repos = await fetchGitHubRepositories();
    return NextResponse.json({ repositories: repos });
  } catch {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}
