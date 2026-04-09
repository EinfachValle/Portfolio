# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Architecture

Yarn Workspaces monorepo (`"workspaces": ["apps/*", "shared", "tests"]`) for multiple portfolio versions. Each version (v1, v2, ...) is a standalone Next.js app under `apps/`.

**Core principle:** `shared/` is **stack-agnostic** — pure TypeScript/JavaScript only, zero framework dependencies (no React, MUI, Redux, i18next). Future versions may use Vue, Svelte, etc. without touching shared.

### Workspace Dependency Graph

```text
@portfolio/shared    ← standalone, no internal deps
@portfolio/v1        ← depends on @portfolio/shared
@portfolio/v2        ← depends on @portfolio/shared
@portfolio/tests     ← E2E tests against running app
```

### Shared Package (`shared/`)

Barrel-exported from `shared/src/index.ts`. Contains:

- **Types:** `GitHubRepository`, `Language`, `LanguageCode`
- **Constants:** `IMPRESSUM`, `SOCIAL_LINKS`, `GITHUB_CONFIG` (from `process.env`), `LANGUAGES`, `DEFAULT_LANGUAGE`
- **Utils:** `capitalizeFirstLetter`
- **Lib:** `fetchGitHubRepositories` (GitHub API fetch + transform)
- **Locales:** Shared i18n JSON files (`en.json`, `de.json`)

Builds to `shared/dist/` with `.js`, `.d.ts`, `.d.ts.map`. Auto-built on `yarn install` via `postinstall`.

### TSConfig Hierarchy

All workspaces extend `tsconfig.base.json` (ES2022, strict, NodeNext, noUncheckedIndexedAccess). Shared adds `composite: true` + declarations. Apps add `jsx: react-jsx` + path alias `@/*`.

### What stays app-specific (NOT in shared)

Color/theme constants, React components/hooks, MUI theme, Redux store, i18next config, `device-type-detection` (npm package, added per-app).

## Commands

```bash
yarn install              # Install deps + auto-build shared
yarn shared:build         # Rebuild shared package
yarn dev:v1               # Start v1 dev server
yarn dev:v2               # Start v2 dev server
yarn build:v1             # Production build v1
yarn build:v2             # Production build v2

# Quality checks (per workspace)
yarn workspace @portfolio/shared format:check
yarn workspace @portfolio/shared lint
yarn workspace @portfolio/shared test:ts

# Root-level (chains shared + v1)
yarn format:check         # Prettier check
yarn lint                 # ESLint
yarn test:ts              # TypeScript type check
yarn format               # Auto-fix formatting

yarn test:e2e             # Playwright E2E tests
```

Pre-commit hook (Husky) runs: `format:check` → `lint` → `test:ts`.

## Conventions

- **ES Modules** everywhere (`"type": "module"`). Use `.js` extensions in all TypeScript import paths within shared (e.g., `from "./types/index.js"`).
- **Prettier:** 80 chars, double quotes, 2 spaces, trailing commas, LF line endings. Import sorting via `@trivago/prettier-plugin-sort-imports`.
- **ESLint:** Flat config (v9+), typescript-eslint, react-hooks, react-refresh.
- **Env config:** Root `.env` holds impressum/social/API data. Shared exposes them via `env.constants.ts`. Template in `.env.example`.
- **Barrel exports:** Every subdirectory in shared has an `index.ts` re-exporting its modules.
