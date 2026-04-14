/**
 * V2 SEO Constants
 *
 * JSON-LD structured data for search engines.
 */

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://einfachvalle.de";

export const JSON_LD_PERSON = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Valentin Röhle",
  jobTitle: "Full-Stack Developer",
  url: SITE_URL,
  image: `${SITE_URL}/logo.png`,
  description:
    "Full-Stack Developer specializing in accessible, performant web interfaces with React, Next.js, TypeScript, and Node.js.",
  sameAs: [
    "https://github.com/EinfachValle",
    "https://linkedin.com/in/valentin-roehle",
  ],
} as const;
