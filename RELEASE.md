# Release v1.1.0

**Date:** 2026-04-10

## Overview

Legal compliance release. Adds legally required Impressum and Datenschutz pages for German law (DDG §5, DSGVO), introduces a global side navigation menu, removes unnecessary cookies, and adds project documentation.

## Highlights

- **Legal Notice page** (`/legal-notice`) — Full Impressum with contact details, liability disclaimers, and copyright notice as required by DDG §5.
- **Privacy Policy page** (`/privacy-policy`) — Complete Datenschutzerklärung covering hosting, analytics, data storage, fonts, GitHub API, user rights, and complaint procedures per DSGVO.
- **Global SideMenu** — Fixed vertical navigation at bottom-right on every page with links to legal pages (highlighted when active) and language switch. Replaces per-page LanguageSwitch components.
- **Cookie removal** — i18n no longer sets cookies; language preference stored only in localStorage (technically necessary, no consent required per TDDDG §25).
- **Architecture docs** — New `docs/ARCHITECTURE.md` documenting the monorepo structure.

## Changes

### Added

- `/legal-notice` page with full DDG §5 compliant Impressum
- `/privacy-policy` page with full DSGVO compliant Datenschutzerklärung
- `SideMenu` component — global fixed navigation with vertical rotated legal links, separator dot, divider, and language switch
- `IMPRESSUM.phone` field in shared package for legally required phone contact
- i18n translations for all legal content (German + English)
- E2E tests for legal notice page, privacy policy page, and side menu links
- `docs/ARCHITECTURE.md` — monorepo architecture documentation
- `IMPRESSUM_PHONE` environment variable in `.env.example`

### Changed

- LanguageSwitch moved from individual pages to global `SideMenu` in `AppLayout`
- i18n detection simplified to `["localStorage", "navigator"]` — cookie caching removed
- Legal pages use same layout pattern as `/projects` (consistent with AppLayout, MouseGlow visible)

### Removed

- `@fontsource/inter` dependency (redundant — `next/font/google` already self-hosts Inter)
- Per-page `LanguageSwitch` + `AbsoluteSide` from home, projects, templates, legal-notice, privacy-policy
- i18n cookie storage (`caches: ["localStorage", "cookie"]` → `caches: ["localStorage"]`)

## Files Added

| File                                      | Purpose                    |
| ----------------------------------------- | -------------------------- |
| `apps/v1/src/app/legal-notice/page.tsx`   | Impressum page             |
| `apps/v1/src/app/privacy-policy/page.tsx` | Datenschutz page           |
| `apps/v1/src/components/SideMenu.tsx`     | Global side navigation     |
| `docs/ARCHITECTURE.md`                    | Monorepo architecture docs |

## Files Modified

| File                                     | Change                                          |
| ---------------------------------------- | ----------------------------------------------- |
| `shared/src/constants/env.constants.ts`  | Added `phone` to IMPRESSUM                      |
| `.env.example`                           | Added `IMPRESSUM_PHONE`                         |
| `apps/v1/package.json`                   | Removed `@fontsource/inter`                     |
| `apps/v1/src/app/AppLayout.tsx`          | Added SideMenu                                  |
| `apps/v1/src/app/(home)/page.tsx`        | Removed LanguageSwitch + side menu (now global) |
| `apps/v1/src/app/(home)/resume-card.tsx` | Removed footer                                  |
| `apps/v1/src/app/projects/page.tsx`      | Removed LanguageSwitch                          |
| `apps/v1/src/app/templates/page.tsx`     | Removed LanguageSwitch                          |
| `apps/v1/src/config/i18n.ts`             | Removed cookie caching                          |
| `apps/v1/src/locales/en.json`            | Added legal + footer translations               |
| `apps/v1/src/locales/de.json`            | Added legal + footer translations               |
| `tests/src/e2e/v1.spec.ts`               | Added legal page tests                          |
