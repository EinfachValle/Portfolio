import { MetadataRoute } from "next";

const AI_CRAWLERS = [
  "GPTBot",
  "ChatGPT-User",
  "CCBot",
  "Google-Extended",
  "anthropic-ai",
  "ClaudeBot",
  "Bytespider",
  "FacebookBot",
  "PerplexityBot",
  "Applebot-Extended",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      ...AI_CRAWLERS.map((bot) => ({
        userAgent: bot,
        disallow: "/",
      })),
    ],
    sitemap: `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://einfachvalle.de"}/sitemap.xml`,
  };
}
