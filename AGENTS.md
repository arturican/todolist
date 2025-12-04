# Repository Guidelines

## Project Structure & Module Organization
Vite + React + TypeScript sources live in `src`, split into feature-driven folders. UI wiring starts in `src/main.tsx`, while layout and routing helpers live in `src/app` and `src/common/routing`. Shared UI pieces and hooks reside under `src/common/components` and `src/common/hooks`, and Redux slices plus API clients sit inside `src/features/todolists` and `src/features/auth`. Keep tests co-located in `__tests__` directories beside the slices or hooks they cover. Static assets are served from `index.html` and the `public` root created by Vite during build.

## Build, Test, and Development Commands
Use `pnpm dev` for the Vite dev server with hot reload. `pnpm build` runs TypeScript project references (`tsc -b`) followed by `vite build` to produce `dist/`. `pnpm preview` serves the built bundle for smoke checks. Lint with `pnpm lint` (or `pnpm lint:fix` to apply ESLint autofixes) and format with `pnpm format`. Add or update Husky hooks via `pnpm prepare`. Run the Vitest suite interactively using `pnpm test` or in CI-friendly mode with `pnpm test:run`.

## Coding Style & Naming Conventions
Stick with TypeScript and React function components, using hooks instead of classes. Follow Prettier defaults (2-space indentation, single quotes disabled, semicolons on) and keep imports grouped by scope (external, aliases, relative). Components live in `PascalCase` folders with matching file names; hooks use the `useSomething` prefix; Redux slices and RTK queries stay in `kebab-case` files. Prefer `@/common/...`-style aliases when configured instead of deep relative paths. Run ESLint before pushing to catch accessibility, hooks, and React-specific rules.

## Testing Guidelines
Vitest drives reducer and hook coverage; place specs under `__tests__` adjacent to the module (`src/features/todolists/model/__tests__/tasks-slice.test.ts` is the reference). Name files `*.test.ts` or `*.test.tsx`. Stub network calls via axios mocks and cover every branch that mutates the store. Keep coverage at or above the existing suites (≈80% for reducers) and include regression tests for any bug fix.

## Commit & Pull Request Guidelines
Git history favors short, imperative messages that mention the impacted feature (e.g., `добавил кнопку возврата с компоненты PageNotFound`). Follow that style, optionally in Russian, and group unrelated work into separate commits. PRs should describe motivation, key changes, manual verification (`pnpm test`, `pnpm lint`), and link to the relevant issue. Attach screenshots or GIFs when altering UI states, and call out any breaking changes or new env vars explicitly.
