# Architecture

This document describes the structural layout of the portfolio monorepo. For
development conventions (code style, module system, ESLint/Prettier config, env
setup, branching), see [CLAUDE.md](../CLAUDE.md).

## Overview

Yarn Workspaces monorepo hosting multiple portfolio versions under a single
repository. Each portfolio version is an independent Next.js app. All versions
share a common stack-agnostic package for types, constants, utilities, and
locale base files.

## Workspace Structure

```text
portfolio/
├── apps/
│   ├── v1/                 ← Active portfolio (Next.js 15, MUI 7, Redux)
│   └── v2/                 ← Planned (not yet created)
├── shared/                 ← Stack-agnostic shared package
├── tests/                  ← Playwright E2E tests
├── docs/                   ← Documentation and plans
│   ├── ARCHITECTURE.md     ← This file
│   └── plans/              ← Design specs and implementation plans
├── .env                    ← Environment variables (not committed)
├── .env.example            ← Template for .env
├── CLAUDE.md               ← AI assistant and developer conventions
└── package.json            ← Root workspace config
```

## Core Principle

`shared/` is **stack-agnostic** — pure TypeScript/JavaScript only, zero
framework dependencies (no React, MUI, Redux, i18next). Future versions may
use Vue, Svelte, or any other framework without modifying shared.

## Dependency Graph

```text
@portfolio/shared    ← standalone, no internal deps
@portfolio/v1        ← depends on @portfolio/shared
@portfolio/v2        ← depends on @portfolio/shared (planned)
@portfolio/tests     ← E2E tests against running app
```

## Shared Package (`shared/`)

Barrel-exported from `shared/src/index.ts`. Builds to `shared/dist/`.
Auto-built on `yarn install` via `postinstall`.

Exports:

| Category  | Exports                                                                       |
| --------- | ----------------------------------------------------------------------------- |
| Types     | `GitHubRepository`, `Language`, `LanguageCode`                                |
| Constants | `IMPRESSUM`, `GITHUB_CONFIG`, `SOCIAL_LINKS`, `LANGUAGES`, `DEFAULT_LANGUAGE` |
| Utils     | `capitalizeFirstLetter`                                                       |
| Lib       | `fetchGitHubRepositories`                                                     |
| Locales   | `en.json`, `de.json` (base translation files)                                 |

What stays app-specific (not in shared): color/theme constants, React
components and hooks, MUI theme, Redux store, i18next config,
`device-type-detection`.

## V1 App (`apps/v1/`)

**Tech stack:** Next.js 15 (App Router, Turbopack), React 19, MUI 7,
Redux Toolkit + redux-persist, i18next, TypeScript.

**Pages:**

| Route          | Description                                          |
| -------------- | ---------------------------------------------------- |
| `/`            | Home — sections: About, Experience, Projects, Skills |
| `/projects`    | Full GitHub repository listing                       |
| `/templates`   | Template showcase                                    |
| `/impressum`   | Legal notice (DDG §5)                                |
| `/datenschutz` | Privacy policy (DSGVO/GDPR)                          |

**Key patterns:**

- MUI `sx` prop and `styled` for theming and layout
- Redux slice per feature; state persisted via `redux-persist`
- i18next with `i18next-browser-languagedetector` and `i18next-http-backend`;
  base translations come from `@portfolio/shared`, per-app overrides live in
  `apps/v1/src/locales/`
- `device-type-detection` for responsive rendering decisions
- `@vercel/analytics` included for production metrics

## Environment Variables

Defined in `.env` at monorepo root (never committed). Template: `.env.example`.
Apps load this file in `next.config.mjs` via `process.loadEnvFile()` (Node 22+).

| Variable              | Description                              |
| --------------------- | ---------------------------------------- |
| `IMPRESSUM_FULL_NAME` | Full legal name for the Impressum page   |
| `IMPRESSUM_EMAIL`     | Contact email for the Impressum page     |
| `IMPRESSUM_PHONE`     | Contact phone for the Impressum page     |
| `IMPRESSUM_ADDRESS`   | Street address for the Impressum page    |
| `IMPRESSUM_CITY`      | City for the Impressum page              |
| `GITHUB_TOKEN`        | GitHub personal access token (API calls) |
| `GITHUB_USERNAME`     | GitHub username (repository fetching)    |

`shared/src/constants/env.constants.ts` exposes these as typed constants
(`IMPRESSUM`, `GITHUB_CONFIG`) with empty-string fallbacks.

## Scripts

See `package.json` at the root for all scripts. Key commands:

| Command             | Description                                   |
| ------------------- | --------------------------------------------- |
| `yarn install`      | Install deps and auto-build shared            |
| `yarn shared:build` | Rebuild shared package only                   |
| `yarn dev:v1`       | Start v1 dev server (Turbopack)               |
| `yarn build:v1`     | Production build for v1                       |
| `yarn format`       | Auto-fix formatting across shared + v1        |
| `yarn format:check` | Check formatting (used in pre-commit hook)    |
| `yarn lint`         | ESLint across shared + v1                     |
| `yarn test:ts`      | TypeScript type check across shared + v1      |
| `yarn test:e2e`     | Playwright E2E tests (auto-starts dev server) |

## Quality Checks

Pre-commit hook (Husky) runs the following chain in order:

1. `format:check` — Prettier
2. `lint` — ESLint (flat config v9+)
3. `test:ts` — TypeScript type check

See CLAUDE.md for Prettier and ESLint configuration details.

## Testing

Playwright E2E tests live in `tests/src/e2e/`. Configuration is in
`tests/playwright.config.ts`.

- Runs against Chromium (Desktop Chrome)
- Dev server starts automatically on port `3100` (configurable via `TEST_PORT`)
- Retries: 2 on CI, 0 locally
- Current test coverage for v1: homepage, sections, language switch, projects
  page, templates page, GitHub API integration, social links, navigation,
  mobile viewport, Impressum page, Datenschutz page, footer legal links

## Deployment

Each app is deployed as a separate Vercel project pointing to its subdirectory
(`apps/v1`, `apps/v2`, etc.). The root `.env` variables must be configured as
environment variables in each Vercel project. No root-level Vercel config is
needed — Vercel auto-detects Next.js when the project root is set to the app
subdirectory.
