# Release v2.1.0

**Date:** 2026-04-15

## Overview

A polish release that takes v2 from "shipped" to "delightful". The headliners are a refactored ambient-light system that breathes per section instead of sitting fixed behind every page, a friendly mascot character that makes 404 and error pages feel hand-crafted, a unified visual language across nav links and section headings, and a glass-morphism gradient-border interaction on the project cards. Underneath the visual work, the entire monorepo reaches a 100% lint-clean state and the Vercel deployment path is fully verified end-to-end.

---

## Ambient brushes, reimagined

The previous `AmbientBackground` was one fixed container with four hard-coded brushes that stayed put no matter where you scrolled. The new `AmbientBrush` lives per section — every prominent area (Hero, About, ProjectsPreview, Contact, plus all the sub-pages) gets its own brushes with configurable position, size, color and pulse rhythm. As you scroll through the page, brushes drift in and out of view, each pulsing on its own schedule for a slow, asynchronous breathing effect.

The aurora rendering switched from a multi-stop radial gradient to a solid disc with heavy CSS blur. That's a real Gaussian falloff instead of a linear approximation, which removes the visible "halo ring" that appeared at higher opacities.

## Mascot character on status pages

`/404` and `/error` now feature a `Mascot` SVG character with two variants:

- **`lost`** (404) — shrug pose, question-mark antenna, "o" mouth, eyes searching to one side, gentle bob animation
- **`broken`** (error) — X eyes, panic arms reaching up, sparking bent antenna, anxious wobble animation

Both share the same body silhouette and respect `prefers-reduced-motion`. They give the empty-state pages personality without sliding into kitsch.

## A unified visual language

Section overlines and the active nav link now speak the same dialect. Every section heading carries the matching nav icon (`PersonOutlined` for About, `CodeOutlined` for Projects, `MailOutlined` for Contact) followed by gradient-clipped text using the accent gradient. Section h2s now apply the gradient over the entire heading rather than just the highlight word. The `/projects` page h1 follows the same pattern.

## Project card hover

Hovering a project card now produces:

- An animated cyan→indigo (dark) / orange→red (light) gradient border, drawn via a `::before` pseudo-element with `mask-composite: exclude` — a workaround for the fact that `border-image` does not respect `border-radius`
- A subtle accent-tinted background lift
- A glass-morphism `backdrop-filter: blur(8px)` so content behind the card softens

The previous `glass.border` hover background was dark-navy in light mode, which made the card visually heavy. The new accent-tinted lift looks correct in both modes.

## Hash-free in-page navigation

Hero CTAs ("Explore Projects", "Get in Touch") and the scroll indicator no longer push `#projects`, `#contact`, `#about` into the address bar. They are now real `<button>` elements that call `scrollIntoView` directly. Cross-page nav clicks (e.g. clicking "About" from `/legal-notice`) stash the target section in `sessionStorage`, navigate to `/`, and the homepage scrolls on mount via `useEffect`.

## Sticky-footer status pages

`/error` and `/not-found` had their footer floating mid-page when the content was short. They now use a flex-column `PageWrapper` with `min-height: 100dvh` and a `flex: 1` main, so the footer always pins to the viewport bottom and the content is vertically centered.

## Singular / plural i18n

Star and fork counts now use the correct grammatical number:

| Count | EN                    | DE                     |
| ----- | --------------------- | ---------------------- |
| 1     | `1 Star`, `1 Fork`    | `1 Stern`, `1 Fork`    |
| ≠ 1   | `0 Stars`, `12 Forks` | `0 Sterne`, `12 Forks` |

The sort menu also got the missing DE translation: **Stars → Sterne**.

## Social links

LinkedIn, GitHub and Instagram in the contact section now show their brand icons in the section accent color, in a deliberate order: **LinkedIn left, GitHub center, Instagram right**.

---

## Under the hood

- **100% lint-clean** across `shared`, `v1`, and `v2`. Zero warnings, zero errors. ESLint, Prettier and TypeScript all pass.
- **Next.js ESLint plugin** properly integrated in `apps/v1` and `apps/v2` via `FlatCompat` (was missing — the build was emitting a warning every run).
- **`@portfolio/shared` build order on Vercel** fixed via a `prebuild` hook in `apps/v2/package.json`. Vercel runs `yarn install` from inside `apps/v2/`, which means the root `postinstall` doesn't fire and `shared/dist/` was never built before `next build`.
- **Yarn engine constraint** loosened from the exact `1.22.22` to `">=1.22.0 <2.0.0"`. Vercel's build image ships `1.22.19`, which previously failed the install validation.
- **Nav scroll-background bug** on long sub-pages traced to a CSS root cause: combining `height: 100%` with `overflow-x: hidden` on `html` made `html` itself the scroll container, so `window.scrollY` was always `0` and the listener never fired. Removed `height: 100%`, kept `min-height: 100%` on body and `overflow-x: hidden` for ambient-brush containment.
- v1 housekeeping: Logger console-wrapper file-level disable, `_error`/`_reset` underscore convention, `cardRefs.current` copied to local var in 5 useEffect cleanups, `displayName` on the memo'd `GeneralTooltip`, `dispatch` added to `AppLayout` deps array.

## Migration notes

None — no breaking changes, no env-var changes, no required config updates. Drop-in upgrade from `2.0.0`.

## Verification

```bash
yarn lint          # ✔ shared + v1 + v2 — 0 warnings, 0 errors
yarn format:check  # ✔ all files formatted
yarn test:ts       # ✔ shared + v1 + v2 — 0 type errors
```

Local Playwright walk-through completed in both light and dark themes across the homepage, `/projects`, `/legal-notice`, `/privacy-policy`, `/error`, and `/404`. Section headings render the gradient correctly, ambient brushes pulse asynchronously, the project-card hover shows the gradient border + glass blur in both modes, the nav scroll background appears on every page, and no in-page interaction pushes a hash into the URL.
