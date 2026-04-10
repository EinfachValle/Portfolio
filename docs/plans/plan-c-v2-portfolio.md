# Plan C: V2 Portfolio — Design Spec

## Context

V1 is a functional portfolio (Next.js, MUI, Redux, i18n) but lacks visual impact. V2 aims to be an eye-catching, animated scroll-experience that represents Valentin as a modern Full-Stack Developer — clean, professional, and technically impressive. The monorepo architecture and `@portfolio/shared` package are reused.

**Visual prototype:** `docs/plans/v2-concept-prototype.html`
**Screenshots:** `docs/plans/screenshots/v2-concept-*.png`

---

## Design Decisions

| Decision   | Choice                                                     |
| ---------- | ---------------------------------------------------------- |
| Vibe       | Clean & Professional + Tech & Futuristic                   |
| Theme      | Adaptive Dual-Theme (Dark + Light)                         |
| Structure  | Scroll-Experience main page + Subpages                     |
| Animations | Scroll-Morph + Cinematic Text Reveal + Nexyfi AnimatedGrid |
| Contact    | Real form with email service + reCAPTCHA/Turnstile         |
| Tech Stack | Next.js 15 + MUI 7 + Redux Toolkit + i18next (same as V1)  |
| Legal      | Separate Impressum + Datenschutz pages (DSGVO-compliant)   |

---

## Visual Design

### Dual-Theme System

**Dark Mode (primary):**

- Background: `#0a0a0f` → `#0d1117` → `#0f172a` gradients
- Accent: Cyan `#06b6d4` + Indigo `#6366f1`
- Glass panels: `rgba(255,255,255,0.02)` with `backdrop-filter: blur(8-12px)`, `border: 1px solid rgba(255,255,255,0.04)`
- Grid lines: `rgba(6,182,212,0.04)`
- Text: `#f1f5f9` (primary), `rgba(148,163,184,0.45)` (muted)

**Light Mode:**

- Background: `#fafafa` base
- Accent: Slate `#0f172a` monochrome, geometric shapes
- Strong typography (Swiss Design influence)
- Grid lines: `rgba(15,23,42,0.06)`
- Text: `#0f172a` (primary), `rgba(15,23,42,0.4)` (muted)

### Theme-Flash Prevention (FOUC)

Critical: SSR renders default theme → user may have opposite in localStorage → visible flash.

**Solution:** Blocking inline `<script>` in root `layout.tsx` `<head>` that runs before paint:

- Reads `localStorage.getItem("theme")` and `prefers-color-scheme` media query
- Sets `data-theme="dark|light"` attribute on `<html>` before first paint
- MUI ThemeProvider reads this attribute on mount to select correct theme
- CSS variables for background colors applied via `data-theme` attribute in `globals.css` to prevent background flash

### Typography

- Font: Inter via `next/font/google` (self-hosted at build time — NO Google CDN, see legal section)
- Do NOT use `@fontsource/inter` (V1 has this redundantly — V2 only uses `next/font/google`)
- Hero name: 72px, weight 200/700 split
- Section labels: 10px, letter-spacing 4px, uppercase
- Body: 14-16px, weight 300-400

---

## Page Structure

### Main Scroll Page (`/`)

#### **1. Hero Section**

- Cinematic text reveal: name builds character-by-character
- Subtitle fades in: "Full-Stack Developer"
- Typewriter effect for tagline
- Accent line animates width
- CTA buttons fade up: "Explore Projects" + "Get in Touch"
- Scroll indicator at bottom
- AnimatedGrid background (Nexyfi-style mesh with flowing gradient lines + glowing dots)
- Use `100dvh` instead of `100vh` for correct mobile viewport height

#### **2. About Me Section**

- Word-by-word reveal on scroll (IntersectionObserver)
- Highlighted keywords (cyan accent)
- Tech stack pills animate in with stagger (scale 0.8 → 1)
- Content from i18n translations

#### **3. Projects Preview Section**

- Section header slides up
- 3 featured project cards slide in from left with stagger delay
- Each card: name, description, topic tags, stars/forks, latest tag
- Data from GitHub API via `@portfolio/shared` `fetchGitHubRepositories()`
- "View All Projects →" link to `/projects` subpage
- Loading skeletons during fetch

#### **4. Contact Section**

- "Let's work together" heading with text reveal
- Real contact form: Name, Email, Subject, Message
- **DSGVO consent checkbox** (required): "Ich stimme der Verarbeitung meiner Daten gemäß der [Datenschutzerklärung](/datenschutz) zu."
- **reCAPTCHA v3 / Cloudflare Turnstile** on form submission (invisible, no user friction)
- **Honeypot field** (hidden input, if filled → reject as bot)
- Email service integration (Resend)
- Social links below: GitHub, LinkedIn, Instagram (from `SOCIAL_LINKS`)
- Form validation with Yup
- Success/error toast feedback (Sonner)
- Rate limiting on API endpoint (see API section)

### Subpages

**`/projects`** — Full projects grid

- All GitHub repos (projects + templates combined), same card design
- Filter tabs: All / Projects / Templates (`isTemplate` flag)
- Sort options (by language, stars, recent)
- AnimatedGrid background (subtle, reduced intensity)

**`/impressum`** — Legal notice (DDG §5, ehemals TMG §5)

- Full name from `IMPRESSUM.fullName`
- Postal address from `IMPRESSUM.address` + `IMPRESSUM.city`
- Email from `IMPRESSUM.email`
- **Telefonnummer** (neues Feld `IMPRESSUM.phone` — erforderlich für "schnelle elektronische Kontaktaufnahme")
- Hinweis auf Kontaktformular als alternativen Kontaktweg
- Haftungsausschluss (Haftung für Inhalte, Links, Urheberrecht)
- Copyright notice
- Clean, minimal design matching portfolio theme

**`/datenschutz`** — Privacy policy (DSGVO/GDPR)

- **Verantwortlicher**: Name, Adresse, Email, Telefon aus `IMPRESSUM`
- **Erhobene Daten durch Kontaktformular**: Name, Email, Betreff, Nachricht — Rechtsgrundlage Art. 6 Abs. 1 lit. a DSGVO (Einwilligung)
- **Auftragsverarbeiter**: Resend Inc. als Email-Dienst — Serverstandort, DPA/AVV-Verweis, Rechtsgrundlage (EU-US Data Privacy Framework)
- **reCAPTCHA/Turnstile**: Datenschutzhinweis zum gewählten CAPTCHA-Dienst
- **GitHub API**: Serverseitige Abfrage, keine Client-Daten an GitHub übermittelt
- **Vercel Analytics**: Cookie-frei, keine personenbezogenen Daten, Verweis auf Vercel Privacy Policy
- **localStorage/Cookies**: Technisch notwendige Speicherung (Sprachpräferenz `i18nextLng`, Theme-Präferenz `theme`) — kein Cookie-Banner nötig da technisch notwendig (§25 Abs. 2 TDDDG)
- **Fonts**: Self-hosted via `next/font/google` (Build-Time-Download) — keine Runtime-Requests an Google-Server (LG München I, Urteil v. 20.01.2022, Az. 3 O 17493/20)
- **Betroffenenrechte**: Auskunft, Berichtigung, Löschung, Einschränkung, Datenübertragbarkeit, Widerspruch
- **Speicherdauer**: Kontaktformular-Daten werden nach Bearbeitung der Anfrage gelöscht, max. 6 Monate
- **Beschwerderecht**: Hinweis auf zuständige Aufsichtsbehörde
- Sowohl auf **Deutsch** als auch **Englisch** (i18n)

### Persistent Elements

**Navigation bar (fixed top):**

- Logo "VR" left
- Links: Home, About, Projects, Contact
  - Auf Hauptseite: smooth-scroll zu Sektion
  - Auf Subpages: Navigation zu `/#section-id` (URL-Hash → scroll nach Page-Load)
- Right: Language switch (DE/EN), Theme toggle (sun/moon icon)
- Glass background with backdrop blur
- Appears after hero animation completes
- **Skip-to-content link** (Accessibility: erstes fokussierbares Element, visuell hidden bis fokussiert)

**Footer:**

- Copyright notice
- Links to Impressum + Datenschutz

---

## Animations

### 1. AnimatedGrid Background (Nexyfi-inspired)

- **Source reference:** `D:\Organizations\SoftVentures\LandingPage\client\src\components\molecules\AnimatedGrid\index.tsx`
- Must be `"use client"` component (Canvas + useRef + useEffect for Next.js SSR)
- Static CSS grid: 80px cells (desktop), 60px (mobile)
- 8-10 animated lines flowing along grid paths (horizontal + vertical)
- Leading dots with glow effect (`box-shadow` layers)
- Gradient trails behind dots
- Colors: Cyan `#06b6d4` + Indigo `#6366f1` (dark), Slate tones (light)
- **Theme-aware**: Canvas colors must sync with MUI theme — read from theme constants, not hardcoded. Pass colors as props or read from a shared constants file used by both Canvas and MUI theme.
- Canvas-based rendering for performance
- Fade mask at top/bottom edges via CSS `mask-image`
- Reduced dot count on mobile (5 vs 10)
- **Performance: Pause canvas when not visible** — use IntersectionObserver on the canvas container. When off-screen, cancel `requestAnimationFrame` loop. Resume when visible again.

### 2. Scroll-Driven Section Transitions

- IntersectionObserver with threshold 0.25
- About: content slides up from 60px, word-by-word text reveal with stagger
- Projects: header slides up, cards slide in from left with 120ms stagger
- Contact: content + form slide up with 200ms delay between
- All transitions: `cubic-bezier(0.16, 1, 0.3, 1)` easing
- **One-shot animations**: Each element animates once. Mark as "revealed" after first trigger. Do NOT re-trigger on scroll-up or language change.

### 3. Cinematic Text Reveal (Hero)

- Character-by-character reveal with 50ms stagger
- Each char: `translateY(100%) → translateY(0)` + `opacity 0 → 1`
- Accent line width animation: `0 → 64px`
- Typewriter: 40-70ms per character with cursor blink
- CTA buttons fade up after 2.5s delay

### 4. Micro-interactions

- Nav links: color transition on hover
- Project cards: background + border-color transition on hover
- CTA buttons: gradient background shift on hover
- Tech pills: subtle scale on hover
- Scroll indicator: pulse animation

### 5. Accessibility: `prefers-reduced-motion`

**All animations must respect `prefers-reduced-motion: reduce`:**

- Canvas AnimatedGrid: Show static grid only, no flowing lines/dots
- Scroll transitions: Elements appear instantly (opacity 1, no transform)
- Text reveal: Show text immediately, no character-by-character
- Typewriter: Show full text immediately, no typing effect
- Micro-interactions: Keep color transitions (fast), remove transform animations

Implementation: CSS `@media (prefers-reduced-motion: reduce)` for CSS animations. JS: check `window.matchMedia('(prefers-reduced-motion: reduce)').matches` for Canvas and JS-driven animations. Custom hook `useReducedMotion()` that returns boolean.

---

## Tech Architecture

### Workspace Setup

```text
apps/v2/                          ← New Next.js 15 app
├── src/
│   ├── app/
│   │   ├── layout.tsx            ← Root layout + metadata + theme-flash script
│   │   ├── page.tsx              ← Main scroll page
│   │   ├── projects/page.tsx     ← Full projects page
│   │   ├── impressum/page.tsx    ← Legal notice
│   │   ├── datenschutz/page.tsx  ← Privacy policy
│   │   ├── globals.css           ← Global styles, theme vars, reduced-motion
│   │   └── api/
│   │       ├── github/route.ts   ← GitHub API proxy (cached, revalidating)
│   │       └── contact/route.ts  ← Contact form endpoint (rate-limited)
│   ├── components/
│   │   ├── AnimatedGrid/         ← Nexyfi-inspired grid ("use client", Canvas)
│   │   ├── Navigation/           ← Fixed nav bar + skip-to-content
│   │   ├── Hero/                 ← Hero with text reveal
│   │   ├── About/                ← About section
│   │   ├── ProjectsPreview/      ← Featured projects
│   │   ├── Contact/              ← Contact form + DSGVO consent + CAPTCHA
│   │   ├── ProjectCard/          ← Project card component
│   │   ├── Footer/               ← Footer component
│   │   ├── ThemeToggle/          ← Dark/Light switch
│   │   └── Providers.tsx         ← Redux + i18n + MUI ThemeProvider
│   ├── theme/
│   │   ├── index.ts              ← Theme factory (dark + light)
│   │   └── themeConstants.ts     ← Color definitions (shared with Canvas)
│   ├── store/
│   │   ├── store.ts              ← Redux store (RTK configureStore)
│   │   └── slices/               ← RTK createSlice (statt V1-manual reducers)
│   │       ├── uiSlice.ts        ← theme, locale, activeSection
│   │       ├── githubSlice.ts    ← repositories, isLoading, error
│   │       └── contactSlice.ts   ← form state, submission status
│   ├── config/
│   │   └── i18n.ts               ← i18next setup (localStorage only, NO cookies)
│   ├── locales/
│   │   ├── en.json               ← English translations (V2-specific)
│   │   └── de.json               ← German translations (V2-specific)
│   ├── hooks/
│   │   ├── useScrollReveal.ts    ← IntersectionObserver + one-shot animation
│   │   ├── useTypewriter.ts      ← Typewriter effect with cursor
│   │   ├── useCharReveal.ts      ← Character-by-character animation
│   │   └── useReducedMotion.ts   ← prefers-reduced-motion detection
│   └── constants/
│       ├── colors.ts             ← All colors (used by MUI theme AND Canvas)
│       └── animation.ts          ← Grid config, timing, easing constants
├── package.json                  ← depends on @portfolio/shared
├── next.config.mjs               ← transpilePackages, env loading from root
├── tsconfig.json                 ← extends ../../tsconfig.base.json
└── eslint.config.js              ← flat config, extends root patterns
```

### Shared Package Changes

**Existing (reuse as-is):**

- `GitHubRepository` type + `fetchGitHubRepositories()` for project data
- `SOCIAL_LINKS` for social media links
- `LANGUAGES`, `DEFAULT_LANGUAGE`, `LanguageCode` for i18n
- `capitalizeFirstLetter()` utility
- Shared locale base strings (`general.*`)

**Must be updated:**

- `IMPRESSUM` constant: Add `phone` field (`process.env.IMPRESSUM_PHONE`)
- `.env.example`: Add `IMPRESSUM_PHONE=`, `RESEND_API_KEY=`, `CONTACT_TO_EMAIL=`, `CAPTCHA_SECRET_KEY=`, `NEXT_PUBLIC_CAPTCHA_SITE_KEY=`

### Key Dependencies (beyond V1's stack)

- `resend` — contact form email delivery (server-side only)
- `@google-cloud/recaptcha-enterprise` or `cloudflare-turnstile` — spam protection
- `device-type-detection` — responsive behavior (per-app, like V1)
- Do NOT add `@fontsource/inter` — use `next/font/google` only

### i18n Configuration

- Use `i18next-browser-languagedetector` with **localStorage only** (no cookies)
- Detection order: `["localStorage", "navigator"]` — simplified from V1
- Cache: `["localStorage"]` only (V1 also caches to cookies → unnecessary)
- **Language change must NOT reset scroll position or re-trigger animations**
- Animation state tracked separately via refs, not reactive state

### API Routes

**`/api/github` — GitHub repos (cached):**

- Use Next.js `fetch` with `next: { revalidate: 3600 }` (ISR, 1 hour cache)
- Alternatively: Route Handler with `Cache-Control: public, s-maxage=3600, stale-while-revalidate=86400`
- **Fallback**: If GitHub API fails, return empty array + error flag. UI shows "Projects konnten nicht geladen werden" with retry button.

**`/api/contact` — Contact form (protected):**

- **Rate limiting**: Max 3 submissions per IP per hour (in-memory Map or Vercel KV)
- **Honeypot validation**: Reject if hidden `website` field is filled
- **CAPTCHA validation**: Verify reCAPTCHA/Turnstile token server-side before processing
- **Input validation**: Yup schema server-side (name, email format, message length 10-5000 chars)
- **Resend API**: Send email to `CONTACT_TO_EMAIL` with form data
- **Response**: 200 (success), 400 (validation), 429 (rate limit), 500 (server error)

---

## Responsive Behavior

| Breakpoint        | Behavior                                                                                        |
| ----------------- | ----------------------------------------------------------------------------------------------- |
| Desktop (≥1280px) | Full grid, all animations, 80px grid cells                                                      |
| Tablet (≥768px)   | 2-column project grid, reduced dot count (7)                                                    |
| Mobile (<768px)   | Single column, 60px grid cells, 5 grid dots, simplified scroll animations, `100dvh` for heights |

**Mobile-specific:**

- Use `100dvh` instead of `100vh` (accounts for browser chrome)
- No hover effects (touch devices) — card press states instead
- Typewriter cursor hidden on touch devices
- Canvas animation reduced (fewer dots, lower framerate via throttled rAF)

---

## SEO & Meta

**Per-page metadata** (Next.js `generateMetadata`):\*\*

| Page           | Title                                 | Description                                  |
| -------------- | ------------------------------------- | -------------------------------------------- |
| `/`            | Valentin Röhle — Full-Stack Developer | Portfolio & Projekte von Valentin Röhle      |
| `/projects`    | Projects — Valentin Röhle             | Open-Source Projekte und GitHub Repositories |
| `/impressum`   | Impressum — Valentin Röhle            | Impressum gemäß §5 DDG                       |
| `/datenschutz` | Datenschutz — Valentin Röhle          | Datenschutzerklärung gemäß DSGVO             |

**Open Graph tags** auf jeder Seite (og:title, og:description, og:image, og:url, og:type)
**Twitter Card tags** (twitter:card, twitter:title, twitter:description)
**Structured Data**: JSON-LD `Person` schema auf Hauptseite
**`robots.txt`**: Allow all, sitemap reference
**`sitemap.xml`**: Auto-generated via `next-sitemap` or manual

---

## Accessibility

- **Skip-to-content link**: First focusable element, visually hidden until focused
- **Keyboard navigation**: All interactive elements reachable via Tab, logical tab order
- **Focus indicators**: Visible focus ring on all interactive elements (not just browser default)
- **ARIA labels**: Canvas (`role="img"`, `aria-label="Animated background grid"`), nav sections, form inputs
- **Color contrast**: Verify WCAG AA minimum (4.5:1 for text, 3:1 for large text) — particularly cyan on dark bg
- **Screen reader**: All scroll-revealed content accessible without scrolling (content in DOM from start, only visual animation deferred)
- **Form accessibility**: Proper `<label>` elements, `aria-required`, `aria-invalid`, error messages linked via `aria-describedby`

---

## i18n

Extends shared locale base. V2-specific keys in `apps/v2/src/locales/`:

- Hero tagline, about text, section labels
- Contact form labels + placeholders + success/error messages
- DSGVO consent checkbox text
- Impressum full legal text (DE + EN)
- Datenschutz full legal text (DE + EN)
- Navigation labels
- Project section strings
- Error/fallback messages ("Projekte konnten nicht geladen werden")

---

## Monorepo Integration

### Root `package.json` Updates

Add V2 to chained quality scripts:

```json
"lint": "yarn workspace @portfolio/shared lint && yarn workspace @portfolio/v1 lint && yarn workspace @portfolio/v2 lint",
"format:check": "yarn workspace @portfolio/shared format:check && yarn workspace @portfolio/v1 format:check && yarn workspace @portfolio/v2 format:check",
"test:ts": "yarn workspace @portfolio/shared test:ts && yarn workspace @portfolio/v1 test:ts && yarn workspace @portfolio/v2 test:ts"
```

`dev:v2` and `build:v2` already exist — no changes needed.

### Husky Pre-Commit

Runs `format:check → lint → test:ts` from root — automatically covers V2 after script update.

### E2E Tests

**`tests/playwright.config.ts`** — add V2 project:

```typescript
projects: [
  { name: "v1-chromium", use: { ...devices["Desktop Chrome"] } },
  { name: "v2-chromium", use: { ...devices["Desktop Chrome"] } },
],
webServer: [
  { command: "yarn workspace @portfolio/v1 dev -- --port 3100", url: "http://localhost:3100" },
  { command: "yarn workspace @portfolio/v2 dev -- --port 3200", url: "http://localhost:3200" },
]
```

**`tests/src/e2e/v2.spec.ts`** — new test file covering:

- Homepage loads, all 4 sections render
- Theme toggle works (dark ↔ light persists in localStorage)
- Language switch works (DE ↔ EN without scroll reset)
- Projects load from GitHub API
- Contact form validation (empty fields, invalid email)
- Contact form submission (mock API)
- Impressum page loads with required legal content
- Datenschutz page loads with required legal content
- Mobile viewport renders correctly
- Navigation from subpage back to main page sections
- `prefers-reduced-motion` respects user preference

### Vercel Deploy

Monorepo with two apps requires separate Vercel projects:

- V1: Root directory `apps/v1`, build command `cd ../.. && yarn build:v1`
- V2: Root directory `apps/v2`, build command `cd ../.. && yarn build:v2`
- Shared env vars (IMPRESSUM, GITHUB) set on both projects
- V2-specific env vars (RESEND, CAPTCHA) only on V2 project

---

## Verification

1. `yarn dev:v2` — starts dev server, verify all 4 main sections render
2. Scroll through main page — verify all animations trigger correctly (one-shot, no replay)
3. Toggle theme — verify dark ↔ light transitions, no FOUC on reload
4. Switch language — verify DE ↔ EN translations, scroll position preserved
5. Enable `prefers-reduced-motion` in DevTools — verify all animations disabled
6. Submit contact form — verify CAPTCHA, validation, honeypot, email delivery
7. Submit contact form 4x rapidly — verify rate limiting kicks in
8. Navigate to `/projects` — verify GitHub repos load, verify cached responses
9. Kill network → reload `/projects` — verify graceful fallback
10. Navigate to `/impressum` — verify all legally required fields present
11. Navigate to `/datenschutz` — verify all DSGVO sections present
12. Test on mobile viewport (375px) — verify `100dvh`, responsive layout, no horizontal scroll
13. Run keyboard-only navigation — verify all content reachable via Tab
14. Run Lighthouse — verify accessibility score ≥ 95
15. `yarn build:v2` — verify production build succeeds
16. `yarn lint && yarn format:check && yarn test:ts` — verify V2 included in quality checks
17. `yarn test:e2e` — run E2E tests for both V1 and V2
