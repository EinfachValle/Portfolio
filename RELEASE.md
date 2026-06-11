# Release v2.2.0

**Date:** 2026-06-11

## Overview

A section-by-section refinement pass over the v2 portfolio, plus a real data integration underneath. The Hero name becomes a monochrome 3D piece, the About skills animation is reborn as two calm counter-flowing lanes, and the Projects preview turns into a relevance podium that now pulls in public repositories from a GitHub organization and ranks everything by a composite "effort" score — not just raw stars. The legal pages gain a tab switcher and a new WCAG-aligned accessibility statement. No breaking changes; the only new (optional) configuration is a single environment variable.

---

## Projects: a relevance podium

The Projects preview is now a proper winner's podium. Instead of sorting by stars alone, repositories are ranked by a composite **relevance score**:

```
score = stars·10 + forks·6 + recency + size-based effort
  recency: pushed <7d:+12 · <30d:+8 · <90d:+4 · <180d:+2 · else 0
  effort:  min(log10(sizeKb + 1)·2, 6)
```

This surfaces an actively-developed, substantial project over one that merely has a star or two more. The top three are laid out with their bottoms aligned: the winner sits **centered and taller**, ranks 2 and 3 share one identical height (with free space rather than cramped content). The winner carries an always-on gradient border, a soft glow, a faint background rank numeral, and a **"Top Reference"** badge that straddles the top border line. The release version and the owner/source are shown on every card.

The scoring lives in `@portfolio/shared` as a pure `computeRelevanceScore` function, so it stays stack-agnostic and testable.

## GitHub organization repositories

The project list now merges **public repos from a configured organization** alongside the personal account, and ranks them together — so an org's flagship project can legitimately take the podium's center.

The interesting wrinkle: the personal access token is a fine-grained PAT scoped to the personal account. Sending it to another owner's resources returns `403`. The fix is per-owner authentication — the token authenticates only the user's own requests, while the organization's public data (repo list and tags) is fetched **unauthenticated**. The org profile repo (`.github`) is filtered out.

## About: two calm conveyor lanes

The cluttered orbiting tech icons are gone. Frontend and backend skills now drift in **two counter-flowing lanes** — frontend right-to-left, backend left-to-right — reusing the existing chip design with equal spacing. A resolution-independent edge fade makes chips dissolve smoothly on both sides (the earlier asymmetry, where chips popped on the left and arrived late at the bottom, is fixed by pushing the wrap seam fully off-screen). The animation now also runs on mobile, and the body copy is left-aligned there. The text itself was updated: the apprenticeship is complete, and the closing paragraph now reads as a full-time employee at AimWay GmbH working on Sonar.

## Hero: monochrome 3D name

The name is now a monochrome, subtly extruded 3D treatment — white→slate in dark mode, anthracite in light — with no colored glow. The "Full-Stack Developer" eyebrow keeps its gradient. The name is always rendered "Valentin Röhle" (with ö) in both languages, and the light-mode gradient was darkened at the top so the umlaut dots stay legible. The CTA buttons became frosted glass (backdrop blur over an opaque base with an accent tint), the tagline copy was rewritten, and it now switches language live instead of only after a reload.

## Legal pages: tab switcher + accessibility statement

Every legal page now has a **pill tab group** at the top — Legal Notice / Privacy Policy / Accessibility — so visitors switch directly instead of scrolling to the footer. It uses a `<nav aria-label>` with `aria-current="page"` on the active tab.

A new **`/accessibility`** page provides an accessibility statement aligned with **WCAG 2.1 AA** (DE/EN): conformance status, the site's actual accessibility features (reduced-motion support, full keyboard operability, skip link, semantic HTML + ARIA, light/dark themes, responsive scaling, bilingual content), scope, known limitations, a BFSG legal note (voluntary — a private portfolio is not legally obligated), a feedback contact, and a review date.

---

## Under the hood

- **`computeRelevanceScore`** added to `@portfolio/shared` (pure, `now` injectable for tests)
- **`GitHubRepository`** gained `pushedAt`, `sizeKb`, and `owner`
- **Skill categories** (`frontend` / `backend`) added to every skill in shared
- **Instagram handle** updated to `einfachvalle.tsx`
- **Projects podium** keys off the `md` breakpoint (matching the three-column grid) instead of the device-type hook, so the winner stays centered; topic chips no longer wrap inside a pill
- **Logo click** scrolls smoothly to the top on the home page; **"View all projects"** uses client-side navigation, dropping the loader flash

## Migration notes

No breaking changes. One new, **optional** environment variable:

```bash
# .env — fetch a GitHub organization's public repos into the project list
GITHUB_ORG=SoftVentures
```

If `GITHUB_ORG` is unset, behavior is unchanged (personal repos only). No other env-var or config changes. Drop-in upgrade from `2.1.0`.

## Verification

```bash
yarn lint          # ✔ shared + v1 + v2 — 0 warnings, 0 errors
yarn format:check  # ✔ all files formatted
yarn test:ts       # ✔ shared + v1 + v2 — 0 type errors
```

Local Playwright walk-through in both light and dark themes: the Projects podium (winner centered/taller, ranks 2 & 3 equal height, badge on the top line), Recrest correctly ranked into the center via the org fetch, the About conveyor fading symmetrically, and the legal tab group switching across `/legal-notice`, `/privacy-policy`, and the new `/accessibility` page with the correct active state.
