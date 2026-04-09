# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-04-09

### Added

- **Monorepo foundation** with Yarn Workspaces (`apps/*`, `shared`, `tests`)
- **`@portfolio/shared`** — stack-agnostic shared package (types, constants, utils, GitHub lib, locales)
- **`@portfolio/v1`** — portfolio-next converted from JavaScript to TypeScript (40+ files)
- **`@portfolio/tests`** — Playwright E2E test suite (9 tests, auto-starts dev server)
- Root tooling: Prettier with `@trivago/prettier-plugin-sort-imports`, ESLint flat config (v9+), Husky pre-commit hooks
- TSConfig hierarchy: base config (ES2022, strict, NodeNext) extended by all workspaces
- Root `.env` for impressum and GitHub API configuration
- `socials.constants.ts` for social link URLs (GitHub, LinkedIn, Instagram)
- `device-type-detection` package replaces `react-device-detect` in v1
- GitHub API route delegates to shared `fetchGitHubRepositories`
- Shared constants wired into v1: `SOCIAL_LINKS`, `LANGUAGES`, `DEFAULT_LANGUAGE`
- Redux store fully typed with `RootState`, `AppDispatch`, `UiState`
- MUI module augmentation for custom palette extensions (surface, icon, border)

### Fixed

- `documnetDraggedOver` typo corrected to `documentDraggedOver` in Redux reducer
- `THEME.LIGHT` constant fixed (was incorrectly set to `"dark"`)
- Hydration warning suppressed on `<body>` for browser extension compatibility

### Removed

- `react-device-detect`, `redux-logger`, `redux-form`, `socket.io-client`, `@mui/styles` dependencies
- WebSocket action types (dead code after socket.io removal)
- `capitalizeFirstLetter` from v1 utils (now imported from shared)
