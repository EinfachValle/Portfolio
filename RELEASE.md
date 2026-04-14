# Release v2.0.0

**Date:** 2026-04-15

## Overview

Complete v2 portfolio — redesigned from scratch with new component architecture, full DSGVO compliance, CAPTCHA spam protection, UA-based responsive design, comprehensive SEO, and Vercel deployment readiness.

## Highlights

- **v2 portfolio** — new design with animated hero (character reveal, typewriter, accent line), tech orbit visualization, glass-morphism project cards, and contact form with Resend email delivery
- **Cloudflare Turnstile** — invisible CAPTCHA for contact form, DSGVO-compliant (no cookies, no tracking), graceful degradation when keys not configured
- **100% responsive** — `device-type-detection` package replaces MUI useMediaQuery with UA-based detection across all components (Navigation, Footer, Contact, ProjectsPreview, TechOrbit, AnimatedGrid, CircuitCircle, Hero)
- **Full DSGVO compliance** — complete Datenschutzerklärung (12 sections), Impressum (TMG §5), no cookies, cookieless analytics, Turnstile disclosure, font loading transparency, DSGVO consent checkbox on contact form
- **SEO optimized** — dynamic OG image via Edge Runtime, JSON-LD Person schema, canonical URLs, sitemap, manifest, AI crawler blocking (GPTBot, CCBot, ClaudeBot, anthropic-ai, Google-Extended, and 5 others)
- **Custom error pages** — branded 404 page and error boundary with retry button
- **Vercel Analytics + Speed Insights** — privacy-friendly, cookieless performance monitoring
- **Playwright test suite** — 156 tests across 8 browser/device profiles

## Changes

### Added

- v2 app under `apps/v2/` with Next.js 15 App Router
- Animated hero section with character reveal, typewriter effect, accent line, CTA buttons, and scroll indicator
- Tech orbit visualization (desktop) / chip grid (mobile) in About section
- Glass-morphism project cards with GitHub API integration via server-side proxy
- Contact form with Yup validation, honeypot, rate limiting (3/hour), DSGVO consent checkbox
- Cloudflare Turnstile CAPTCHA integration (client widget + server verification)
- Resend email delivery for contact form submissions
- `device-type-detection` hook for responsive layouts (port from v1, UA-based)
- Custom `not-found.tsx` (404 page with gradient heading and back link)
- Custom `error.tsx` (error boundary with retry button and back link)
- `opengraph-image.tsx` — dynamically generated 1200x630 OG image via Edge Runtime
- `@vercel/analytics` and `@vercel/speed-insights` integration
- AI crawler blocking in `robots.ts` (GPTBot, CCBot, ClaudeBot, anthropic-ai, Google-Extended, Bytespider, FacebookBot, PerplexityBot, Applebot-Extended, ChatGPT-User)
- Full SEO metadata: `metadataBase`, canonical URL, icons, manifest, OG images, Twitter card
- JSON-LD Person schema with image, description, sameAs links
- Dynamic site URL via `NEXT_PUBLIC_SITE_URL` env var
- Responsive Playwright tests across 6 device profiles (Pixel 7, iPhone 14, iPad Pro portrait/landscape, Desktop Firefox, Desktop Safari)
- `css.d.ts` type declaration for CSS module imports
- Flexible IMPRESSUM env vars (street, house nr, zip, city, country) with shared `formatAddressLine()` / `formatCityLine()` helpers
- `.env.example` with sections, source links, and Turnstile test keys

### Changed

- Privacy policy: Cloudflare Turnstile disclosure, font loading clarification (build-time Google download, self-hosted at runtime), Analytics + Speed Insights section merged
- Contact form: real Turnstile server-side verification replaces TODO placeholder, submit disabled until CAPTCHA solved (when keys configured)
- All Playwright tests rewritten to use `data-testid` selectors instead of text matching
- Mobile overlay menu uses opaque background (`alpha(background.default, 0.96)`) instead of transparent glass effect
- Scroll indicator hidden in mobile landscape (viewport too short)

### Fixed

- `device-type-detection` v2.1.3: desktop browsers at 1025-1366px no longer classified as tablet
- Contact form checkbox hover ripple shape (was oval, now circular with symmetric padding)
- Prettier version aligned to 3.8.2 (matches `@react-email/render` dependency)

## Environment Variables

All variables are documented in `.env.example`. Required for production:

| Variable                       | Purpose                                                           |
| ------------------------------ | ----------------------------------------------------------------- |
| `IMPRESSUM_*` (8 vars)         | Legal notice personal data                                        |
| `GITHUB_TOKEN`                 | GitHub API access for project cards                               |
| `GITHUB_USERNAME`              | GitHub username for API queries                                   |
| `RESEND_API_KEY`               | Email delivery for contact form                                   |
| `CONTACT_TO_EMAIL`             | Recipient email address                                           |
| `NEXT_PUBLIC_CAPTCHA_SITE_KEY` | Cloudflare Turnstile site key                                     |
| `CAPTCHA_SECRET_KEY`           | Cloudflare Turnstile secret key                                   |
| `NEXT_PUBLIC_SITE_URL`         | Site URL for SEO metadata (defaults to <https://einfachvalle.de>) |

## Test Coverage

- 156 Playwright E2E tests total
- 96 passed, 60 correctly skipped (viewport-conditional)
- 8 browser/device profiles: Chromium, Firefox, WebKit, Pixel 7, iPhone 14, iPad Pro (portrait + landscape), Desktop Firefox, Desktop Safari
- v1 regression tests included (12 tests)
