/**
 * V2 SEO Constants
 *
 * JSON-LD structured data for search engines.
 */

export const JSON_LD_PERSON = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Valentin Röhle",
  jobTitle: "Full-Stack Developer",
  url: "https://valentin-roehle.de",
  sameAs: [
    "https://github.com/Valentin-Roehle",
    "https://linkedin.com/in/valentin-roehle",
  ],
} as const;
