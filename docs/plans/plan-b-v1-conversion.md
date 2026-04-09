# Plan B: Convert and Integrate V1

## Goal

Bring portfolio-next (D:/Personal/portfolio-next/) into `apps/v1`, convert from JavaScript to TypeScript, and rewire imports to `@portfolio/shared`. After this plan, `yarn dev:v1` starts the portfolio successfully.

## Prerequisite

Plan A must be completed (`yarn shared:build` works).

---

## 1. Copy Code

From `D:/Personal/portfolio-next/` to `apps/v1/`:

```text
Copy:
  src/              -> apps/v1/src/
  public/           -> apps/v1/public/
  next.config.mjs   -> apps/v1/next.config.mjs
```

**Do NOT copy:** node_modules, .next, .git, package.json (will be recreated), jsconfig.json (replaced by tsconfig.json), yarn.lock, README.md, CLAUDE.md, .prettierrc (use root config), eslint.config.mjs (use root config)

---

## 2. apps/v1/package.json

New package.json based on portfolio-next dependencies:

```json
{
  "name": "@portfolio/v1",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "format": "prettier --write src/",
    "format:check": "prettier --check src/",
    "test:ts": "tsc --noEmit"
  },
  "dependencies": {
    "@portfolio/shared": "*",
    "@emotion/react": "^11.14.0",
    "@emotion/styled": "^11.14.1",
    "@fontsource/inter": "^5.2.6",
    "@mui/icons-material": "^7.2.0",
    "@mui/material": "^7.2.0",
    "@reduxjs/toolkit": "^2.8.2",
    "@vercel/analytics": "^1.5.0",
    "axios": "^1.10.0",
    "device-type-detection": "^2.1.2",
    "i18next": "^25.3.1",
    "i18next-browser-languagedetector": "^8.2.0",
    "i18next-http-backend": "^3.0.2",
    "next": "^15.3.5",
    "react": "^19.1.0",
    "react-dom": "^19.1.0",
    "react-i18next": "^15.6.0",
    "react-intersection-observer": "^9.16.0",
    "react-redux": "^9.2.0",
    "redux-persist": "^6.0.0",
    "redux-thunk": "^3.1.0",
    "sonner": "^2.0.6",
    "web-vitals": "^5.0.3",
    "yup": "^1.6.1"
  },
  "devDependencies": {
    "@trivago/prettier-plugin-sort-imports": "^6.0.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "@types/node": "^22.0.0",
    "eslint": "^9.39.1",
    "eslint-config-next": "^15.3.5",
    "prettier": "^3.6.2",
    "typescript": "^5.9.3",
    "typescript-eslint": "^8.46.3"
  }
}
```

**Removed vs. portfolio-next:**

- `redux-logger` (dev-only, can add back later)
- `redux-form` (unused)
- `redux-mock-store` (unused)
- `socket.io-client` (unused)
- `react-device-detect` (replaced by `device-type-detection`)
- `@mui/styles` (deprecated, use emotion instead)
- `source-map-explorer` (optional, add later)

---

## 3. apps/v1/tsconfig.json

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "jsx": "preserve",
    "noEmit": true,
    "incremental": true,
    "isolatedModules": true,
    "allowJs": false,
    "paths": {
      "@/*": ["./src/*"]
    },
    "plugins": [{ "name": "next" }]
  },
  "include": [
    "next-env.d.ts",
    "src/**/*.ts",
    "src/**/*.tsx",
    ".next/types/**/*.ts"
  ],
  "exclude": ["node_modules"]
}
```

---

## 4. JS to TS Conversion

### File Renames

| Old (.js/.jsx)                        | New (.ts/.tsx)                                              |
| ------------------------------------- | ----------------------------------------------------------- |
| `src/app/layout.js`                   | `src/app/layout.tsx`                                        |
| `src/app/error.jsx`                   | `src/app/error.tsx`                                         |
| `src/app/ClientLayout.jsx`            | `src/app/ClientLayout.tsx`                                  |
| `src/app/AppLayout.jsx`               | `src/app/AppLayout.tsx`                                     |
| `src/app/Providers.jsx`               | `src/app/Providers.tsx`                                     |
| `src/app/(home)/page.jsx`             | `src/app/(home)/page.tsx`                                   |
| `src/app/(home)/about-me.jsx`         | `src/app/(home)/about-me.tsx`                               |
| `src/app/(home)/epilog.jsx`           | `src/app/(home)/epilog.tsx`                                 |
| `src/app/(home)/information-card.jsx` | `src/app/(home)/information-card.tsx`                       |
| `src/app/(home)/projects.jsx`         | `src/app/(home)/projects.tsx`                               |
| `src/app/(home)/resume-card.jsx`      | `src/app/(home)/resume-card.tsx`                            |
| `src/app/(home)/resume.js`            | `src/app/(home)/resume.ts`                                  |
| `src/app/(home)/section-header.jsx`   | `src/app/(home)/section-header.tsx`                         |
| `src/app/(home)/section-menu.jsx`     | `src/app/(home)/section-menu.tsx`                           |
| `src/app/(home)/socials-menu.jsx`     | `src/app/(home)/socials-menu.tsx`                           |
| `src/app/(home)/templates.jsx`        | `src/app/(home)/templates.tsx`                              |
| `src/app/(home)/timeline-card.jsx`    | `src/app/(home)/timeline-card.tsx`                          |
| `src/app/(home)/timeline.jsx`         | `src/app/(home)/timeline.tsx`                               |
| `src/app/projects/page.jsx`           | `src/app/projects/page.tsx`                                 |
| `src/app/api/github/route.js`         | `src/app/api/github/route.ts`                               |
| `src/components/animated-link.jsx`    | `src/components/animated-link.tsx`                          |
| `src/components/GeneralTooltip.jsx`   | `src/components/GeneralTooltip.tsx`                         |
| `src/components/LanguageSwitch.jsx`   | `src/components/LanguageSwitch.tsx`                         |
| `src/components/MouseGlow.jsx`        | `src/components/MouseGlow.tsx`                              |
| `src/components/ProjectCard.jsx`      | `src/components/ProjectCard.tsx`                            |
| `src/config/i18n.js`                  | `src/config/i18n.ts`                                        |
| `src/config/AppInitializer.js`        | `src/config/AppInitializer.ts`                              |
| `src/config/Logger.js`                | `src/config/Logger.ts`                                      |
| `src/constants/generalConstants.js`   | `src/constants/generalConstants.ts`                         |
| `src/constants/themeConstants.js`     | `src/constants/themeConstants.ts`                           |
| `src/constants/deviceConstants.js`    | Remove (use device-type-detection)                          |
| `src/hooks/useDeviceTypeDetection.js` | Remove or rewrite as thin wrapper for device-type-detection |
| `src/store/store.js`                  | `src/store/store.ts`                                        |
| `src/store/types.js`                  | `src/store/types.ts`                                        |
| `src/store/actions/uiActions.js`      | `src/store/actions/uiActions.ts`                            |
| `src/store/reducers/index.js`         | `src/store/reducers/index.ts`                               |
| `src/store/reducers/uiReducer.js`     | `src/store/reducers/uiReducer.ts`                           |
| `src/theme/index.js`                  | `src/theme/index.ts`                                        |
| `src/theme/overrides/index.js`        | `src/theme/overrides/index.ts`                              |
| `src/theme/overrides/MuiDivider.js`   | `src/theme/overrides/MuiDivider.ts`                         |
| `src/utils/stylingUtils.js`           | `src/utils/stylingUtils.ts`                                 |

---

## 5. Rewire Imports to @portfolio/shared

### GitHub API Route (`src/app/api/github/route.ts`)

Remove GitHub fetch logic, replace with shared import:

```typescript
import { NextResponse } from "next/server";
import { fetchGitHubRepositories } from "@portfolio/shared";

export async function GET() {
  try {
    const repos = await fetchGitHubRepositories();
    return NextResponse.json({ repositories: repos });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}
```

### Types

Import GitHub/Language types from shared wherever used:

```typescript
import type { GitHubRepository, LanguageCode } from "@portfolio/shared";
```

### Constants

- Import `IMPRESSUM` and `SOCIAL_LINKS` from shared where needed
- Import `LANGUAGES`, `DEFAULT_LANGUAGE` from shared

### Utils

Import shared utilities:

```typescript
import { capitalizeFirstLetter } from "@portfolio/shared";
```

### Locales

- Shared locale keys loaded from `@portfolio/shared/src/locales/`
- App-specific locales stay in `apps/v1/src/locales/`
- i18n config merges both sources

### Device Detection

- Remove `useDeviceTypeDetection` hook and `deviceConstants.js`
- Use `device-type-detection` package directly instead
- Create a thin wrapper hook if needed

---

## 6. Known Fixes During Conversion

- **Typo:** `documnetDraggedOver` -> `documentDraggedOver` in uiReducer
- **Remove unused imports:** socket.io-client, redux-form references
- **Type annotations:** Add props types for all components
- **Store typing:** Define RootState and AppDispatch types:

  ```typescript
  export type RootState = ReturnType<typeof store.getState>;
  export type AppDispatch = typeof store.dispatch;
  ```

---

## 7. next.config.mjs

Adjust for monorepo (transpile shared package):

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@portfolio/shared"],
};

export default nextConfig;
```

---

## Verification

1. `yarn install` — No errors, v1 workspace resolves
2. `yarn shared:build` — shared/dist/ exists
3. `yarn dev:v1` — App starts on localhost:3000, pages load
4. `yarn build:v1` — Production build succeeds
5. `yarn test:ts` — No TypeScript errors
6. `yarn format:check` — Properly formatted
7. `yarn lint` — No linting errors
8. Manual check: GitHub repos load, language switch works, responsive layout correct

---

## File Checklist

| File                                          | Action                             |
| --------------------------------------------- | ---------------------------------- |
| `apps/v1/package.json`                        | Create                             |
| `apps/v1/tsconfig.json`                       | Create                             |
| `apps/v1/next.config.mjs`                     | Create/Adjust                      |
| `apps/v1/src/**/*.{ts,tsx}`                   | Convert from JS                    |
| `apps/v1/public/`                             | Copy from portfolio-next           |
| `apps/v1/src/locales/`                        | Copy, remove shared keys           |
| `apps/v1/src/app/api/github/route.ts`         | Rewrite to use shared              |
| `apps/v1/src/constants/deviceConstants.js`    | Remove                             |
| `apps/v1/src/hooks/useDeviceTypeDetection.js` | Replace with device-type-detection |
