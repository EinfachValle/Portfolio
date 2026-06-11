# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.2.0] - 2026-06-11

### Added

- **Relevance podium on the Projects preview** — the top three repositories are ranked by a composite relevance score (`stars·10 + forks·6 + recency + size-based effort`). The winner sits centered and taller; ranks 2 & 3 share one height with bottoms aligned. The winner gets an always-on gradient border, a soft glow, a "Top Reference" badge straddling the top edge, and a faint background rank numeral (1/2/3). Release version and owner/source are shown on every card.
- **`computeRelevanceScore`** — pure, stack-agnostic scoring utility in `@portfolio/shared` (injectable `now` for deterministic tests)
- **GitHub organization repos merged into the project list** — public repos from a configured org are fetched alongside personal repos and ranked together. Per-owner auth: the personal fine-grained token authenticates only the user's own requests; org public data is fetched unauthenticated (sending the token to another owner's resources returns `403`). The org profile repo (`.github`) is excluded.
- **`GITHUB_ORG` env var** (optional) and `pushedAt`, `sizeKb`, `owner` fields on `GitHubRepository`
- **`/accessibility` page** — accessibility statement aligned with WCAG 2.1 AA (DE/EN): conformance status, feature list (reduced motion, keyboard operability, skip link, semantic/ARIA, themes, responsive scaling, bilingual), scope, known limitations, BFSG legal note, feedback contact, and a review date
- **`LegalNav` pill tab group** — switch between Legal Notice / Privacy Policy / Accessibility from the top of every legal page, instead of scrolling to the footer (`<nav aria-label>` + `aria-current="page"`)
- **Two-lane depth conveyor in the About section** — frontend and backend skills flow in opposite directions with a resolution-independent edge fade, replacing the orbiting tech icons; runs on mobile too
- **Skill categories** — `frontend` / `backend` on every skill in `@portfolio/shared`
- **3D metallic Hero name** — monochrome extruded treatment (white→slate in dark, anthracite in light) with no colored glow; gradient eyebrow retained
- **Glass Hero CTA buttons** — frosted `backdrop-filter` blur over an opaque base with an accent tint
- New Hero tagline (DE/EN)

### Changed

- **Hero name is always "Valentin Röhle"** (with ö) in both languages
- **Tagline switches language live** instead of only after a reload (removed the permanent typewriter guard)
- **Logo click scrolls smoothly to the top** on the home page
- **"View all projects" uses client-side navigation** — no pre-hydration loader animation
- **About copy updated** — apprenticeship completed; now a full-time employee at AimWay GmbH working on Sonar, with accent highlights in the closing paragraph; body text left-aligned on mobile
- **Instagram handle** updated to `einfachvalle.tsx`
- Projects podium engages on the `md` breakpoint (matching the three-column grid) rather than the device-type hook, keeping the winner centered
- Topic chips no longer wrap inside a pill (`white-space: nowrap`)

### Fixed

- **Umlaut (ö) hard to read in the light-mode Hero name** — darkened the top of the light vertical gradient where the dots sit
- **About conveyor edge-fade asymmetry** — chips popped on the left and appeared late at the bottom; fixed by pushing the modulo wrap seam fully off-screen on both edges
- **GitHub org fetch returned `403`** — a fine-grained PAT cannot read another owner's resources; org public repos and their tags are now fetched unauthenticated

## [2.1.0] - 2026-04-15

### Added

- **`AmbientBrush` component** — per-section ambient decoration (analog to `CircuitCircle` for light mode) with subtle pulse + drift animations, configurable side/top/size/color/intensity/pulseDelay, mobile-hidden
- **`Mascot` component** — playful illustrated character for status pages with two variants: `lost` (404) with shrug pose, question-mark antenna and "o" mouth, `broken` (error) with X eyes, panic arms, sparking bent antenna; bob/wobble + blink animations, respects `prefers-reduced-motion`
- **Section labels with nav icons + full gradient** — overline labels (About, Projects, Contact) now match active-nav-link style: accent-colored icon + gradient text
- **Section h2 titles with full gradient** — entire heading (not just highlight word) now uses `accent.primary → accent.tertiary` gradient
- **Hero CTA buttons** — start icons (CodeOutlined, MailOutlined) matching their target sections
- **Project card gradient-border hover** — animated cyan→indigo / orange→red border via `::before` pseudo-element with `mask-composite: exclude` (preserves border-radius, which `border-image` cannot)
- **Glass-morphism card hover** — `backdrop-filter: blur(8px)` + accent-tinted background tint
- **`/projects` page gradient h1** — page title with full gradient (no icon, per design choice)
- **Singular/plural i18n for stars/forks** — `1 Star` / `0 Stars`, `1 Stern` / `0 Sterne`, `1 Fork` / `0 Forks`
- **Social links with icons** — LinkedIn / GitHub / Instagram with MUI brand icons in `accent.primary` color, reordered (LinkedIn left, GitHub center, Instagram right)
- **DE translation** for sort-menu "Stars" → "Sterne"
- ESLint flat configs in `apps/v1` and `apps/v2` with `eslint-config-next` integrated via `FlatCompat`
- Sticky-footer + `overflow-x: hidden` `PageWrapper` pattern on `/error` and `/not-found` pages
- Vertically centered status-page content (flex-column with `align-items: center`)
- `prebuild` hook in `apps/v2/package.json` that builds `@portfolio/shared` before `next build` (Vercel compatibility — root `postinstall` not triggered when Vercel installs from app directory)

### Changed

- **`AmbientBackground` → `AmbientBrush` refactor** — from a single globally-mounted `position: fixed` container with 4 hard-coded brushes to per-section `position: absolute` instances. Brushes now scroll with the page and are configurable per location. Aurora effect now uses solid color + heavy blur (true Gaussian falloff) instead of multi-stop radial gradient (visible halo ring at higher opacities)
- **Section labels use `nav.*` keys** (`Home`, `About`, `Projects`, `Contact`) instead of section-specific labels (`FEATURED WORK`, `ABOUT ME`, `GET IN TOUCH`)
- **Hero CTAs `<a href="#section">` → `<button>`** — no more URL hash pollution
- **Hero ScrollIndicator** rewritten as `<button>`
- **Navigation from sub-pages** uses `sessionStorage` to stash target section + `router.push("/")` instead of `router.push("/#section")` — keeps URL clean
- **Project card hover background** uses `alpha(accent.primary, 0.06)` instead of `glass.border` (which was dark-navy in light mode and made the card visually heavy)
- v1 `Logger.ts` — file-level `eslint-disable no-console` with rationale comment (deliberate console wrapper)
- v1 `error.tsx` — underscore convention for unused props (`_error`, `_reset`)
- v1 `useEffect` cleanups — `cardRefs.current` copied to local variable to avoid stale-ref warning (5 files)
- v1 `AppLayout.tsx` — `dispatch` added to `useEffect` deps array
- v1 `GeneralTooltip.tsx` — `displayName` set on `memo()`-wrapped component
- v2 `globals.css` — `html, body, #root` use `min-height: 100%` instead of `height: 100%` so the document is scrollable

### Fixed

- **Nav scroll-background not appearing on long sub-pages** (`/legal-notice`, `/privacy-policy`) — root cause: `html { height: 100%; overflow-x: hidden; }` made `html` the scroll container, `window.scrollY` stayed `0`, scroll listener never fired. Fix: removed `height: 100%` (kept `min-height` on body and `overflow-x: hidden`)
- **Section title gradients not rendering** — root cause: `background: linear-gradient(...)` shorthand was parsed as `background-color` by Emotion and the gradient was discarded. Fix: explicit `backgroundImage: linear-gradient(...)` (matching active-nav-link pattern)
- **Hero primary CTA flicker on hover** — `linear-gradient → solid color` background transition cannot be smoothly interpolated by browsers. Fix: gradient kept on hover, only alpha values increase
- **Hero secondary CTA invisible hover in light mode** — only `borderColor` changed; light-mode delta too small. Fix: subtle `alpha(text.primary, 0.04)` background tint added on hover
- **`@next/next` ESLint plugin not detected warning** — added explicit `eslint-config-next` integration to v1 + v2 configs
- **`Module not found: '@portfolio/shared'` on Vercel build** — root `postinstall` did not run because Vercel installs from `apps/v2/`. Fix: `prebuild` hook in v2 builds shared explicitly
- **Yarn engine constraint `"yarn": "1.22.22"` failed Vercel install** — Vercel's image ships 1.22.19. Fix: loosened to `">=1.22.0 <2.0.0"`
- **AmbientBrush halo ring artifact** at higher opacities — replaced two-stop radial gradient with solid disc + 100 px blur (Gaussian falloff)
- **Footer mid-page on `/error` + `/not-found`** — short content didn't fill viewport. Fix: sticky-footer pattern (flex-column wrapper with `min-height: 100dvh`, main with `flex: 1`)
- **Horizontal scroll on pages with ambient brushes** — `right: -size*0.3` brushes overflowed viewport. Fix: global `overflow-x: hidden` on `html, body, #root`
- **Stars/Forks count showing plural for `1`** — singular/plural keys + ternary in `ProjectCard.tsx`
- **`<img>` linter warning in pre-hydration loader** (`apps/v2/src/app/layout.tsx`) — added `eslint-disable-next-line @next/next/no-img-element` with rationale
- v2 `no-console` rule now allows `console.error` / `console.warn` (legitimate server-side error logs in `api/contact/route.ts`)

### Removed

- `AmbientBackground` component (folder + index) — replaced by `AmbientBrush`
- Globally mounted `<AmbientBackground>` from `page.tsx`, `ProjectsContent.tsx`, `error.tsx`, `not-found.tsx`, `LegalNoticeContent.tsx`, `PrivacyPolicyContent.tsx`
- `react-refresh/only-export-components` ESLint rule (Vite-specific, not relevant for Next.js)
- Hash URLs (`#projects`, `#contact`, `#about`) from CTA buttons, scroll indicator, and sub-page nav clicks

## [2.0.0] - 2026-04-15

### Added

- **v2 portfolio app** — complete redesign with new component architecture, animated hero, tech orbit, project cards, and contact form
- **Cloudflare Turnstile CAPTCHA** — spam protection for contact form (DSGVO-compliant, no cookies)
- **Vercel Analytics + Speed Insights** — privacy-friendly, cookieless analytics
- **device-type-detection** responsive system — replaces MUI useMediaQuery with UA-based detection across all components
- **Custom error pages** — `error.tsx` (error boundary with retry) and `not-found.tsx` (branded 404)
- **Dynamic OG image** — `opengraph-image.tsx` generates social preview via Edge Runtime
- **AI crawler blocking** — robots.txt blocks GPTBot, CCBot, ClaudeBot, anthropic-ai, and 6 others
- **Full SEO metadata** — canonical URL, icons, manifest, OpenGraph images, JSON-LD Person schema
- **Responsive Playwright tests** — 6 device profiles (Pixel 7, iPhone 14, iPad Pro, Desktop Firefox/Safari), 96 passing tests
- **Flexible IMPRESSUM** — granular env vars (street, house nr, zip, city, country) with shared format helpers
- Dynamic site URL via `NEXT_PUBLIC_SITE_URL` env var (Vercel-ready)

### Changed

- Privacy policy updated: Cloudflare Turnstile disclosure, font loading clarification (build-time download), Analytics + Speed Insights section
- Contact form: server-side Turnstile verification, honeypot, rate limiting (3/hour)
- All Playwright tests rewritten to use `data-testid` selectors (no text matching)
- `.env.example` restructured with sections, links, and Turnstile test keys

### Fixed

- `device-type-detection` viewport cascade bug — desktop browsers at 1025–1366px no longer classified as tablet (fixed in v2.1.3)
- Contact form checkbox hover ripple shape (was oval, now circular)

## [1.1.0] - 2026-04-10

### Added

- `/legal-notice` page — Impressum (DDG §5) with contact details, liability disclaimers, copyright
- `/privacy-policy` page — Datenschutzerklärung (DSGVO) with 9 sections covering hosting, analytics, storage, fonts, GitHub API, user rights
- `SideMenu` component — global fixed vertical nav at bottom-right with rotated legal links (active-highlighted), separator dot, divider, and language switch
- `IMPRESSUM.phone` field in shared package for legally required phone contact
- `IMPRESSUM_PHONE` environment variable
- i18n translations for all legal content (German + English)
- E2E tests for legal notice page, privacy policy page, and side menu links
- `docs/ARCHITECTURE.md` — monorepo architecture documentation
- `docs/plans/plan-c-v2-portfolio.md` — V2 portfolio design spec
- `docs/plans/v2-concept-prototype.html` — interactive V2 concept prototype

### Changed

- LanguageSwitch moved from per-page to global `SideMenu` in `AppLayout`
- i18n detection simplified to `["localStorage", "navigator"]` — cookie caching removed
- Legal pages follow same layout pattern as `/projects` (AppLayout, MouseGlow visible)

### Removed

- `@fontsource/inter` dependency (redundant — `next/font/google` already self-hosts Inter)
- Per-page `LanguageSwitch` + `AbsoluteSide` wrappers from home, projects, templates
- i18n cookie storage (`caches: ["localStorage", "cookie"]` → `caches: ["localStorage"]`)

## [1.0.0] - 2026-04-09

### Added

- **Monorepo foundation** with Yarn Workspaces (`apps/*`, `shared`, `tests`)
- **`@portfolio/shared`** — stack-agnostic shared package (types, constants, utils, GitHub lib, locales)
- **`@portfolio/v1`** — portfolio-next converted from JavaScript to TypeScript (40+ files)
- **`@portfolio/tests`** — Playwright E2E test suite (9 tests, auto-starts dev server)
- Root tooling: Prettier with `@trivago/prettier-plugin-sort-imports`, ESLint flat config (v9+), Husky pre-commit hooks
- TSConfig hierarchy: base config (ES2022, strict, NodeNext) extended by all workspaces
- Root `.env` for impressum and GitHub API configuration
- `socials.constants.ts` for social link URLs (GitHub, LinkedIn, Instagram)
- `device-type-detection` package replaces `react-device-detect` in v1
- GitHub API route delegates to shared `fetchGitHubRepositories`
- Shared constants wired into v1: `SOCIAL_LINKS`, `LANGUAGES`, `DEFAULT_LANGUAGE`
- Redux store fully typed with `RootState`, `AppDispatch`, `UiState`
- MUI module augmentation for custom palette extensions (surface, icon, border)

### Fixed

- `documnetDraggedOver` typo corrected to `documentDraggedOver` in Redux reducer
- `THEME.LIGHT` constant fixed (was incorrectly set to `"dark"`)
- Hydration warning suppressed on `<body>` for browser extension compatibility

### Removed

- `react-device-detect`, `redux-logger`, `redux-form`, `socket.io-client`, `@mui/styles` dependencies
- WebSocket action types (dead code after socket.io removal)
- `capitalizeFirstLetter` from v1 utils (now imported from shared)
