# Release v2.3.0

**Date:** 2026-06-22

## Overview

A correctness-and-polish pass over the v2 portfolio. The page chrome becomes persistent so navigation no longer rebuilds the header and background on every route change; the project cards turn into real, frosted-glass links that finally behave on macOS Safari; and a class of hydration mismatches around language and theme is eliminated. Along the way the Hero heading becomes properly accessible, the legal pages get a readable glass panel over the animated grid, and a reusable themed tooltip lands. No breaking changes and no new configuration.

---

## Persistent chrome: navigation, footer, and the legal frame

Previously every page rendered its own `<Navigation>`, `<Footer>`, and background grid, so each client-side navigation unmounted and re-mounted them — the header replayed its slide-in animation, and moving between the legal pages rebuilt the entire frame (grid + header + tabs), which read as a jarring full reload.

Now the navigation, skip link, and footer live in a single **`SiteShell`** mounted once in the root layout, and the three legal pages share a **`(legal)` route-group layout** that holds the grid, ambient brushes, back link, the `LegalNav` tab group, and a frosted content panel. Switching tabs swaps only the page body — the surrounding frame stays put. The header's entrance animation now plays once on first load and never again on navigation.

## Project cards: real links with a real glass surface

Each project card is now a native `<a href target="_blank" rel="noopener noreferrer">` instead of an `<article>` driven by an `onClick={window.open}` handler. This fixes a **macOS/Safari bug where cards simply didn't open** (the popup blocker swallows `window.open` calls carrying window-features), and it brings cmd-click, middle-click, and keyboard activation for free.

The frosted-glass treatment is also fixed. The old fill was so transparent (≈2% white) that the card read as flat and the bright animated grid dots showed straight through — looking like there was no blur at all, even though `backdrop-filter` was working. The fill is now opaque enough to dampen what's behind it while the blur softens the rest, and the hover state keeps that surface (layering an accent wash + lifted glow over it) instead of going see-through.

## No more hydration mismatches

The server renders with the default language and theme, but the client used to switch immediately to the detected language and the persisted theme — so the language label, the theme icon, and the nav labels all mismatched the server HTML, throwing hydration errors.

Both are now **deferred to after mount**: i18n pins the initial language to `DEFAULT_LANGUAGE`, and the theme provider and toggle render the SSR-default theme until mounted, then apply the real values behind the loader. The console is clean across every theme/language combination, and `<html lang>` is kept in sync with the active language for screen readers and translation tools.

## Accessibility & polish

- The Hero name is now a single `<h1 aria-label="Valentin Röhle">` with the per-character animation spans marked decorative — screen readers announce the full name as one heading instead of spelling out each letter (and the last name is no longer stranded outside the `<h1>`).
- The legal pages gain a **frosted glass panel** behind the copy, so body text stays readable where the animated dot grid runs underneath.
- The Turnstile CAPTCHA now loads **lazily**, only when the contact section scrolls into view — removing a Cloudflare preload warning and deferring the third-party script off the initial load.

---

## Under the hood

- **`SiteShell`** component + **`(legal)` route group** with a shared `layout.tsx`; `Navigation`/`SkipToContent`/`Footer` removed from the individual pages
- **`GeneralTooltip`** — reusable themed tooltip (theme-bound surface, border, soft shadow, no arrow, no enter delay)
- **Projects podium** uses three rank-staggered min-heights (`WINNER`/`SECOND`/`THIRD`) instead of two
- **`AnimatedGrid`** seeds its container size via `getBoundingClientRect` on mount (the `ResizeObserver`'s first callback didn't fire inside the fixed/persistent legal layout, so the animated dots never rendered)

## Migration notes

No breaking changes and no new configuration. Drop-in upgrade from `2.2.0`. The legal routes (`/legal-notice`, `/privacy-policy`, `/accessibility`) keep their URLs — they were moved into a `(legal)` route group, which does not affect the public paths.

## Verification

```bash
yarn workspace @portfolio/v2 format:check  # ✔ all files formatted
yarn workspace @portfolio/v2 lint           # ✔ 0 warnings, 0 errors
yarn workspace @portfolio/v2 test:ts        # ✔ 0 type errors
```

Local Playwright walk-through across light/dark themes and DE/EN: clean console (no hydration errors) with a persisted light theme + German; project cards opening their repositories in a new tab (incl. the frosted surface dampening the grid dots, hover keeping its fill); the rank-staggered podium; the legal tab group switching across `/legal-notice`, `/privacy-policy`, and `/accessibility` without rebuilding the frame; and the animated grid dots present on the legal pages.
