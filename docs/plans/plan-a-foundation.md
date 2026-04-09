# Plan A: Monorepo Foundation

## Goal

Set up the complete monorepo foundation: root config, shared package, tests skeleton, tooling. After this plan, `yarn install` and `yarn shared:build` run successfully.

---

## 1. Root package.json

```json
{
  "name": "portfolio",
  "version": "0.1.0",
  "private": true,
  "description": "Portfolio Monorepo covering all portfolio versions.",
  "type": "module",
  "scripts": {
    "dev": "yarn workspace @portfolio/v1 dev",
    "build": "yarn workspace @portfolio/v1 build",
    "dev:v1": "yarn workspace @portfolio/v1 dev",
    "dev:v2": "yarn workspace @portfolio/v2 dev",
    "build:v1": "yarn workspace @portfolio/v1 build",
    "build:v2": "yarn workspace @portfolio/v2 build",
    "build:all": "yarn workspaces foreach run build",
    "shared:build": "yarn workspace @portfolio/shared build",
    "lint": "yarn workspace @portfolio/shared lint && yarn workspace @portfolio/v1 lint",
    "format": "yarn workspace @portfolio/shared format && yarn workspace @portfolio/v1 format",
    "format:check": "yarn workspace @portfolio/shared format:check && yarn workspace @portfolio/v1 format:check",
    "test:ts": "yarn workspace @portfolio/shared test:ts && yarn workspace @portfolio/v1 test:ts",
    "test:e2e": "yarn workspace @portfolio/tests test:e2e",
    "prepare": "husky",
    "postinstall": "yarn workspace @portfolio/shared build"
  },
  "workspaces": ["apps/*", "shared", "tests"],
  "devDependencies": {
    "husky": "^9.1.7",
    "typescript": "^5.9.3"
  },
  "author": "Valentin Roehle",
  "license": "MIT",
  "engines": {
    "node": ">=22.0.0",
    "yarn": "1.22.22"
  }
}
```

**Note:** `dev` and `build` point to v1 initially since v2 doesn't exist yet. Will be adjusted in Plan C once v2 is active.

---

## 2. tsconfig.base.json

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM"],
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "forceConsistentCasingInFileNames": true,
    "skipLibCheck": true,
    "resolveJsonModule": true
  }
}
```

Identical to Nexyfi. Base config for all workspace TSConfigs.

---

## 3. .prettierrc

```json
{
  "singleQuote": false,
  "semi": true,
  "useTabs": false,
  "tabWidth": 2,
  "trailingComma": "all",
  "printWidth": 80,
  "endOfLine": "lf",
  "plugins": ["@trivago/prettier-plugin-sort-imports"],
  "importOrderParserPlugins": ["typescript", "jsx"],
  "importOrder": [
    "^react$",
    "^react-dom",
    "^react-redux$",
    "^react-router",
    "^react-",
    "^@mui/",
    "^@reduxjs/toolkit",
    "^redux",
    "^@portfolio/shared",
    "<THIRD_PARTY_MODULES>",
    "^@/",
    "^\\.",
    "^.+\\.css$"
  ],
  "importOrderSeparation": true,
  "importOrderSortSpecifiers": true
}
```

Same as Nexyfi, with `@nexyfi/shared` replaced by `@portfolio/shared`.

---

## 4. eslint.config.mjs

```javascript
import js from "@eslint/js";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["**/dist", "**/node_modules", "**/.next"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
      "no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      eqeqeq: ["warn", "smart"],
    },
  },
);
```

Root-level ESLint config. Apps can add their own overrides if needed.

---

## 5. .husky/pre-commit

Follows Nexyfi pattern: format check -> lint -> type check.

```sh
#!/bin/sh
echo "Running pre-commit checks..."
echo ""

echo "  Checking formatting..."
yarn format:check || {
  echo "Formatting check failed! Run: yarn format"
  exit 1
}
echo "  Formatting OK"
echo ""

echo "  Running ESLint..."
yarn lint || {
  echo "Linting failed! Fix errors before committing."
  exit 1
}
echo "  ESLint OK"
echo ""

echo "  Running TypeScript type checks..."
yarn test:ts || {
  echo "Type check failed! Fix TypeScript errors."
  exit 1
}
echo "  TypeScript OK"
echo ""

echo "All pre-commit checks passed!"
```

---

## 6. .env.example

```env
# Impressum / Personal
IMPRESSUM_FULL_NAME=
IMPRESSUM_EMAIL=
IMPRESSUM_ADDRESS=
IMPRESSUM_CITY=

# Social Links
GITHUB_URL=
LINKEDIN_URL=

# API Keys
GITHUB_TOKEN=
GITHUB_USERNAME=
```

---

## 7. .gitignore Update

Add the following entries:

```text
# Workspace dist
**/dist/

# Env
.env
.env.local

# Next.js
**/.next/
**/out/

# Playwright
**/test-results/
**/playwright-report/

# OS
.DS_Store
Thumbs.db
```

---

## 8. Shared Package

### shared/package.json

```json
{
  "name": "@portfolio/shared",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "license": "MIT",
  "scripts": {
    "build": "tsc -p tsconfig.json",
    "clean": "rm -rf dist",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "lint": "eslint src --ext .ts",
    "test:ts": "tsc --noEmit"
  },
  "devDependencies": {
    "@trivago/prettier-plugin-sort-imports": "^6.0.0",
    "@typescript-eslint/eslint-plugin": "^8.46.3",
    "@typescript-eslint/parser": "^8.46.3",
    "eslint": "^9.39.1",
    "prettier": "^3.6.2",
    "typescript": "^5.9.3",
    "typescript-eslint": "^8.46.3"
  }
}
```

### shared/tsconfig.json

```json
{
  "extends": "../tsconfig.base.json",
  "compilerOptions": {
    "rootDir": "src",
    "outDir": "dist",
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "composite": true
  },
  "include": ["src"],
  "exclude": ["src/**/*.test.ts", "src/**/*.spec.ts"]
}
```

### shared/src/index.ts (Barrel Export)

```typescript
// Types
export * from "./types/index.js";

// Constants
export * from "./constants/index.js";

// Utils
export * from "./utils/index.js";

// Lib
export * from "./lib/github.js";
```

### shared/src/types/github.types.ts

Extracted from portfolio-next `src/app/api/github/route.js`:

```typescript
export interface GitHubRepository {
  name: string;
  description: string | null;
  htmlUrl: string;
  language: string | null;
  license: string | null;
  stars: number;
  forks: number;
  topics: string[];
  latestTag: string | null;
}

export interface GitHubApiResponse {
  repositories: GitHubRepository[];
}
```

### shared/src/types/language.types.ts

```typescript
export type LanguageCode = "en" | "de";

export interface Language {
  code: LanguageCode;
  label: string;
  nativeLabel: string;
}
```

### shared/src/types/index.ts

```typescript
export * from "./github.types.js";
export * from "./language.types.js";
```

### shared/src/constants/env.constants.ts

```typescript
export const IMPRESSUM = {
  fullName: process.env.IMPRESSUM_FULL_NAME ?? "",
  email: process.env.IMPRESSUM_EMAIL ?? "",
  address: process.env.IMPRESSUM_ADDRESS ?? "",
  city: process.env.IMPRESSUM_CITY ?? "",
} as const;

export const SOCIAL_LINKS = {
  github: process.env.GITHUB_URL ?? "",
  linkedin: process.env.LINKEDIN_URL ?? "",
} as const;

export const GITHUB_CONFIG = {
  token: process.env.GITHUB_TOKEN ?? "",
  username: process.env.GITHUB_USERNAME ?? "",
} as const;
```

### shared/src/constants/language.constants.ts

```typescript
import type { Language, LanguageCode } from "../types/language.types.js";

export const DEFAULT_LANGUAGE: LanguageCode = "en";

export const LANGUAGES: Record<LanguageCode, Language> = {
  en: { code: "en", label: "English", nativeLabel: "English" },
  de: { code: "de", label: "German", nativeLabel: "Deutsch" },
} as const;
```

### shared/src/constants/index.ts

```typescript
export * from "./env.constants.js";
export * from "./language.constants.js";
```

### shared/src/utils/string.utils.ts

Extracted from portfolio-next:

```typescript
export function capitalizeFirstLetter(value: string): string {
  if (!value) return value;
  return value.charAt(0).toUpperCase() + value.slice(1);
}
```

### shared/src/utils/index.ts

```typescript
export * from "./string.utils.js";
```

### shared/src/lib/github.ts

Extracted from portfolio-next `src/app/api/github/route.js` and `src/store/actions/uiActions.js`:

```typescript
import type { GitHubRepository } from "../types/github.types.js";
import { GITHUB_CONFIG } from "../constants/env.constants.js";

interface GitHubApiRepo {
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  license: { spdx_id: string } | null;
  stargazers_count: number;
  forks_count: number;
  topics: string[];
}

interface GitHubApiTag {
  name: string;
}

export async function fetchGitHubRepositories(): Promise<GitHubRepository[]> {
  const { token, username } = GITHUB_CONFIG;

  if (!token || !username) {
    throw new Error("GitHub token or username not configured");
  }

  const headers: HeadersInit = {
    Authorization: `token ${token}`,
    Accept: "application/vnd.github.v3+json",
  };

  const reposResponse = await fetch(
    `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`,
    { headers },
  );

  if (!reposResponse.ok) {
    throw new Error(`GitHub API error: ${reposResponse.status}`);
  }

  const repos: GitHubApiRepo[] = await reposResponse.json();

  const filtered = repos.filter((repo) => repo.name !== username);

  const withTags = await Promise.all(
    filtered.map(async (repo) => {
      const tagsResponse = await fetch(
        `https://api.github.com/repos/${username}/${repo.name}/tags?per_page=1`,
        { headers },
      );
      const tags: GitHubApiTag[] = tagsResponse.ok
        ? await tagsResponse.json()
        : [];

      return {
        name: repo.name,
        description: repo.description,
        htmlUrl: repo.html_url,
        language: repo.language,
        license: repo.license?.spdx_id ?? null,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        topics: repo.topics,
        latestTag: tags[0]?.name ?? null,
      };
    }),
  );

  return withTags;
}
```

### shared/src/locales/en.json

Shared translations (extracted from portfolio-next, only keys used across versions):

```json
{
  "general": {
    "language": "Language",
    "english": "English",
    "german": "German"
  }
}
```

### shared/src/locales/de.json

```json
{
  "general": {
    "language": "Sprache",
    "english": "Englisch",
    "german": "Deutsch"
  }
}
```

**Note:** Shared locales are kept minimal. App-specific texts stay in the respective app.

---

## 9. Tests Skeleton

### tests/package.json

```json
{
  "name": "@portfolio/tests",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "test:e2e": "playwright test",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "lint": "eslint src --ext .ts",
    "test:ts": "tsc --noEmit"
  },
  "devDependencies": {
    "@playwright/test": "^1.52.0",
    "@trivago/prettier-plugin-sort-imports": "^6.0.0",
    "eslint": "^9.39.1",
    "prettier": "^3.6.2",
    "typescript": "^5.9.3",
    "typescript-eslint": "^8.46.3"
  }
}
```

### tests/tsconfig.json

```json
{
  "extends": "../tsconfig.base.json",
  "compilerOptions": {
    "noEmit": true
  },
  "include": ["src"],
  "exclude": ["node_modules"]
}
```

### tests/playwright.config.ts

```typescript
import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./src/e2e",
  timeout: 30000,
  retries: 0,
  workers: 1,
  reporter: [["html"], ["list"]],
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
});
```

### tests/src/ Directories

```text
tests/src/
├── e2e/          (empty placeholder)
├── fixtures/     (empty placeholder)
├── helpers/      (empty placeholder)
└── setup/        (empty placeholder)
```

Each with an empty `.gitkeep` file so Git tracks the directories.

---

## 10. Directory Structure to Create

```text
portfolio/
├── apps/                          <- Directory for all app versions
├── shared/src/types/
├── shared/src/constants/
├── shared/src/utils/
├── shared/src/lib/
├── shared/src/locales/
├── tests/src/e2e/
├── tests/src/fixtures/
├── tests/src/helpers/
├── tests/src/setup/
├── .husky/
└── docs/plans/
```

---

## Verification

1. `yarn install` — All workspaces resolve, no errors
2. `yarn shared:build` — `shared/dist/` is created with `.js`, `.d.ts`, `.d.ts.map`
3. `yarn format:check` — All files properly formatted
4. `yarn test:ts` — No TypeScript errors in shared

---

## File Checklist

| File                                         | Action |
| -------------------------------------------- | ------ |
| `package.json`                               | Create |
| `tsconfig.base.json`                         | Create |
| `.prettierrc`                                | Create |
| `eslint.config.mjs`                          | Create |
| `.husky/pre-commit`                          | Create |
| `.env.example`                               | Create |
| `.gitignore`                                 | Update |
| `shared/package.json`                        | Create |
| `shared/tsconfig.json`                       | Create |
| `shared/src/index.ts`                        | Create |
| `shared/src/types/github.types.ts`           | Create |
| `shared/src/types/language.types.ts`         | Create |
| `shared/src/types/index.ts`                  | Create |
| `shared/src/constants/env.constants.ts`      | Create |
| `shared/src/constants/language.constants.ts` | Create |
| `shared/src/constants/index.ts`              | Create |
| `shared/src/utils/string.utils.ts`           | Create |
| `shared/src/utils/index.ts`                  | Create |
| `shared/src/lib/github.ts`                   | Create |
| `shared/src/locales/en.json`                 | Create |
| `shared/src/locales/de.json`                 | Create |
| `tests/package.json`                         | Create |
| `tests/tsconfig.json`                        | Create |
| `tests/playwright.config.ts`                 | Create |
| `tests/src/e2e/.gitkeep`                     | Create |
| `tests/src/fixtures/.gitkeep`                | Create |
| `tests/src/helpers/.gitkeep`                 | Create |
| `tests/src/setup/.gitkeep`                   | Create |
