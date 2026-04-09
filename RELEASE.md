# Release v1.0.0

**Date:** 2026-04-09

## Overview

First release of my portfolio monorepo. This version introduces v1 — my first developer portfolio — converted to TypeScript and embedded in a monorepo structure designed to support future portfolio iterations.

## Highlights

- **Portfolio v1** — My first portfolio, fully converted from JavaScript to TypeScript. Built with Next.js 15, MUI 7, Redux Toolkit, and i18next for bilingual support (DE/EN).
- **Monorepo architecture** — Yarn Workspaces with a stack-agnostic shared package. Future portfolio versions (v2, v3, ...) can use entirely different frameworks without touching shared code.
- **Shared package** — Pure TypeScript with zero framework dependencies. Exports types, constants, utilities, GitHub API integration, and i18n translations reusable across all versions.
- **E2E test suite** — 9 Playwright tests covering homepage, language switching, project pages, social links, navigation, and mobile viewport. Tests auto-start the dev server.
- **Developer tooling** — Prettier, ESLint flat config, TypeScript strict mode, and Husky pre-commit hooks enforcing quality on every commit.

## What's in v1

- Personal info page with about section, experience timeline, projects, and templates
- GitHub repository integration (fetches repos via API, displays as project cards)
- Language switch (German/English) with persistent locale
- Responsive layout with device detection via `device-type-detection`
- Dark theme with custom MUI palette (surface, icon, border extensions)

## Tech Stack

| Package       | Version   |
| ------------- | --------- |
| Next.js       | 15.3.5    |
| React         | 19.1.0    |
| MUI           | 7.2.0     |
| Redux Toolkit | 2.8.2     |
| TypeScript    | 5.9.3     |
| Playwright    | 1.52.0    |
| Node.js       | >= 22.0.0 |
| Yarn          | 1.22.22   |

## Getting Started

```bash
git clone <repo-url>
cd portfolio
cp .env.example .env        # Fill in GITHUB_TOKEN + GITHUB_USERNAME
yarn install                # Installs all workspaces + builds shared
yarn dev:v1                 # Start dev server on localhost:3000
yarn test:e2e               # Run E2E tests
yarn build:v1               # Production build
```
