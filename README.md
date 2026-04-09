# Portfolio

A monorepo for all versions of my developer portfolio. Each version lives as its own app, sharing types, constants, and utilities through a stack-agnostic shared package.

The monorepo is designed so that future portfolio versions can be built with entirely different frameworks — Vue, Svelte, Astro — without modifying the shared core.

## Versions

| Version | Description        | Stack                            | Status |
| ------- | ------------------ | -------------------------------- | ------ |
| **v1**  | My first portfolio | Next.js 15, MUI 7, Redux Toolkit | Active |
| v2      | _Planned_          | TBD                              | -      |

## Monorepo Structure

```text
portfolio/
  apps/
    v1/              My first portfolio (Next.js 15, TypeScript)
  shared/            Stack-agnostic shared package (pure TS, zero framework deps)
  tests/             Playwright E2E tests
```

### Shared Package

The shared package contains only pure TypeScript — no React, no MUI, no framework-specific code. This ensures any future version on any stack can consume it without changes.

- **Types** — `GitHubRepository`, `Language`, `LanguageCode`
- **Constants** — Social links, language configuration, impressum data, GitHub API config
- **Utilities** — String helpers, GitHub API fetch + data transformation
- **Locales** — Shared i18n translations (German, English)

### V1 Portfolio

My first developer portfolio. Features:

- Personal info, about section, and experience timeline
- GitHub repository integration with project cards
- Bilingual support (German/English) with persistent locale
- Responsive layout with live device detection
- Dark theme with custom MUI palette extensions

## Getting Started

```bash
cp .env.example .env        # Fill in GITHUB_TOKEN and GITHUB_USERNAME
yarn install                # Installs all workspaces and builds shared
yarn dev:v1                 # Starts dev server on localhost:3000
```

## Development

```bash
yarn dev:v1               # Dev server with Turbopack
yarn build:v1             # Production build
yarn test:ts              # TypeScript type checking (shared + v1)
yarn format:check         # Prettier formatting check
yarn lint                 # ESLint
yarn test:e2e             # Playwright E2E tests (auto-starts dev server)
```

## Tech Stack

| Technology    | Version   |
| ------------- | --------- |
| Next.js       | 15.3.5    |
| React         | 19.1.0    |
| MUI           | 7.2.0     |
| Redux Toolkit | 2.8.2     |
| TypeScript    | 5.9.3     |
| Playwright    | 1.52.0    |
| Node.js       | >= 22.0.0 |
| Yarn          | 1.22.22   |
