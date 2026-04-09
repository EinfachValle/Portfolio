# Portfolio Monorepo — Architekturplan

## Context

Aktuelles Portfolio (Next.js 15, JS, MUI, Redux) wird in ein neues Monorepo ueberfuehrt. V1 wird zu TypeScript konvertiert, v2 wird neu gebaut (gleicher Stack, neueste Versionen). Zukuenftige Versionen (v3+) koennten auf anderem Stack laufen — daher ist das Shared-Package **stack-agnostisch** (kein React, kein MUI, kein Redux).

Orientierung an Nexyfi-Monorepo-Patterns (Yarn Workspaces, TSConfig-Hierarchie, Husky, Barrel Exports).

Deployment auf Vercel — jede App ein eigenes Vercel-Projekt.

## Kernprinzip

Shared enthaelt ausschliesslich pure TypeScript/JavaScript ohne Framework-Dependencies. Wenn v3 auf Vue oder Svelte laeuft, aendert sich an shared nichts.

## Struktur

```text
portfolio/
├── apps/
│   ├── v1/                        <- Aktueller Code, TS-konvertiert
│   └── v2/                        <- Neues Portfolio
├── shared/                        <- Stack-agnostisch: pure TS/JS only
├── tests/                         <- E2E Tests (Playwright)
├── package.json                   <- Yarn Workspaces: ["app/*", "shared", "tests"]
├── tsconfig.base.json             <- Basis-TSConfig (ES2022, strict, NodeNext)
├── .prettierrc                    <- 80 chars, @trivago import sorting
├── eslint.config.mjs              <- Flat Config, typescript-eslint
├── .husky/pre-commit              <- Format-Check, Lint, Type-Check
├── .env                           <- ACTIVE_VERSION, Impressum, Socials, API Keys
├── .env.example                   <- Template ohne sensible Werte
└── .github/
```

## shared/ — Was wird geteilt (stack-agnostisch)

```text
shared/
├── src/
│   ├── index.ts                   <- Barrel Export
│   ├── types/
│   │   ├── github.types.ts        <- Repository, Tag Interfaces
│   │   └── language.types.ts      <- Language, LanguageCode
│   ├── constants/
│   │   ├── env.constants.ts       <- Impressum, Socials aus process.env
│   │   └── language.constants.ts  <- LANGUAGES (EN/DE), Default
│   ├── utils/
│   │   └── string.utils.ts        <- capitalizeFirstLetter etc.
│   ├── lib/
│   │   └── github.ts              <- GitHub-Fetch + Datentransformation
│   └── locales/
│       ├── en.json                <- Geteilte EN-Uebersetzungen
│       └── de.json                <- Geteilte DE-Uebersetzungen
├── package.json                   <- "@portfolio/shared", type: "module"
└── tsconfig.json                  <- extends: ../tsconfig.base.json
```

**Keine Framework-Dependencies in shared.** `device-type-detection` wird direkt in jeder App als Dependency gefuehrt.

**Build:** TypeScript -> dist/ mit .js, .d.ts, Declaration Maps. Root postinstall baut shared zuerst.

## Was NICHT in shared gehoert

- Farb-Konstanten / MUI Theme (app-spezifisch, jede Version hat eigene Farben)
- React Hooks, i18n-Config, Redux Store (framework-spezifisch)
- React Components (framework-spezifisch)

## Was bleibt app-spezifisch (v1/v2/...)

- Seiten & Komponenten (src/)
- MUI Theme + Overrides + Farb-Tokens
- Redux Store (actions, reducers, types)
- i18n-Konfiguration + app-spezifische Locales
- React Hooks (useDeviceDetection Wrapper etc.)
- Public Assets (public/)
- next.config.mjs

## App-Struktur (je Version)

```text
apps/vX/
├── src/               <- Seiten, Komponenten, Theme, Hooks, Redux, i18n
├── public/            <- Assets
├── locales/           <- App-spezifische Uebersetzungen
├── package.json       <- "@portfolio/vX"
├── next.config.mjs
└── tsconfig.json      <- extends: ../../tsconfig.base.json, jsx: react-jsx
```

## Root .env

```env
ACTIVE_VERSION=v2              # Bestimmt welche App yarn dev/build startet

IMPRESSUM_FULL_NAME=...        # Impressumsdaten
IMPRESSUM_EMAIL=...
IMPRESSUM_ADDRESS=...
IMPRESSUM_CITY=...

GITHUB_URL=...                 # Social Links
LINKEDIN_URL=...

GITHUB_TOKEN=...               # API Keys
GITHUB_USERNAME=...
```

## Root Scripts

```json
{
  "dev": "yarn workspace @portfolio/$ACTIVE_VERSION dev",
  "build": "yarn workspace @portfolio/$ACTIVE_VERSION build",
  "dev:v1": "yarn workspace @portfolio/v1 dev",
  "dev:v2": "yarn workspace @portfolio/v2 dev",
  "build:all": "yarn workspaces foreach run build",
  "shared:build": "yarn workspace @portfolio/shared build",
  "lint": "yarn workspaces foreach run lint",
  "format": "prettier --write .",
  "format:check": "prettier --check .",
  "test:ts": "yarn workspaces foreach run test:ts",
  "test:e2e": "yarn workspace @portfolio/tests test",
  "postinstall": "yarn shared:build"
}
```

## Vercel Routing

- `domain.dev` -> apps/v2 (aktuellste Version)
- `v1.domain.dev` -> apps/v1

## Reihenfolge

1. Root initialisieren (package.json, tsconfig.base.json, Prettier, ESLint, Husky, .env)
2. shared aufsetzen (Types, Constants mit env.constants.ts, Utils, GitHub-Lib, Locales)
3. app/v1 — portfolio-next Code rein, zu TypeScript konvertieren, Imports auf @portfolio/shared
4. app/v2 — neues Projekt aufsetzen (Next.js 15 + MUI, neueste Versionen)
5. tests — Playwright-Workspace aufsetzen
6. Vercel: zwei Projekte aus einem Repo, Domains zuweisen
