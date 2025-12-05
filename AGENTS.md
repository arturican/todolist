# Repository Guidelines

## Stack & Architecture
- Vite + React 19 + TypeScript power the UI; Redux Toolkit stores global state and React Router v7 drives navigation from `src/main.tsx` through `src/common/routing/Routing.tsx`.
- `src/app` hosts the layout shell (`App.tsx`), the landing screen (`Main.tsx`), and the Redux store that wires slices from `src/features`.
- Material UI provides theming and layout primitives; `app-slice.ts` controls light/dark mode which is applied via `getTheme` and `ThemeProvider`.
- Feature APIs in `src/features/todolists/api` share the Axios `instance` from `src/common/instance/instance.ts`, which injects `VITE_API_TOKEN`, `VITE_API_KEY`, and `VITE_BASE_URL`.
- Validation lives next to the APIs (`tasksApi.types.ts` uses Zod). Keep schemas and DTOs colocated with the HTTP client they protect.

## Module Layout & Naming
- Organize code feature-first under `src/features` (currently `auth` and `todolists`), with `api`, `model`, `lib`, and `ui` folders mirroring the slice structure.
- Shared UI, hooks, theme helpers, and routing live in `src/common/*`; reuse components through `src/common/components/index.ts` exports.
- Keep Redux slices and RTK Query-style clients in `kebab-case` files (`tasks-slice.ts`, `todolistsApi.ts`). Components, hooks, and utilities follow the existing PascalCase/useSomething patterns.
- Tests stay beside the modules they cover inside `__tests__` folders (see `src/features/todolists/model/__tests__` for reference). Mirror the folder structure when adding coverage.
- CSS Modules (`*.module.css`) style component-scoped UI (e.g., `Login`), while global resets live in `src/index.css` and `src/app/App.css`.
- Use the configured alias (`@/` -> `src/`) instead of long relative paths so imports remain readable and consistent.

## Development & Build Commands
- `pnpm dev` starts the Vite dev server. Use `pnpm doppler:dev` to boot it with secrets pulled from the Doppler `dev` config.
- `pnpm build` runs `tsc -b` then `vite build`; `pnpm deploy` wraps that build inside `doppler run` for production secrets. Serve the bundle locally via `pnpm preview`.
- Run `pnpm test` for watch mode or `pnpm test:run` in CI. Pair with `pnpm doppler:test` if the tests need live secrets.
- Lint and format via `pnpm lint`, `pnpm lint:fix`, and `pnpm format`. Install Husky hooks with `pnpm prepare`.
- Fetch environment files for automation using `pnpm doppler:env:dev` or `pnpm doppler:env:prod`. `pnpm doppler:build` mirrors the production deploy path without the helper script.

## Coding Style & Patterns
- Stick to strict TypeScript, functional React components, and hooks (`useAppDispatch`, `useAppSelector`). Avoid React classes or untyped selectors.
- Build Redux Toolkit slices with `createAppSlice` so async thunk creators and selectors stay typed. Always export the reducer, actions, and selectors from each slice module.
- Async thunks should dispatch `setAppStatusAC`, inspect `ResultCode`, and funnel failures through `handleServerAppError` / `handleServerNetworkError`. Keep optimistic state mutations inside the `fulfilled` case definitions.
- Validate external data immediately (e.g., `domainTaskSchema.array().parse(res.data.items)`) and extend the Zod schemas whenever the API changes.
- Keep API requests inside the feature `api` layer and reuse the shared Axios `instance`; never sprinkle bare `axios.create` calls in UI or slice code.
- Build UI with Material UI primitives and theme tokens instead of ad-hoc inline styles. When collecting form data, prefer React Hook Form plus `zodResolver` as shown in the login flow.
- Route definitions live in `src/common/routing/Routing.tsx`; add new paths to the `Path` map and update the main router rather than hardcoding strings across components.

## Testing
- Vitest covers reducers, hooks, and utility logic. Follow the pattern in `src/features/todolists/model/__tests__/tasks-slice.test.ts` and `todolists-slice.test.ts` when adding new thunks or reducers.
- Tests belong next to the slice/hook they verify. Use descriptive `*.test.ts`/`*.test.tsx` filenames and keep state fixtures in the same folder to avoid duplication.
- Mock API modules or the shared Axios instance when exercising async thunks; assert both state mutations and status transitions (`setAppStatusAC`, `changeTodolistStatusAC`, etc.).
- Maintain at least the current reducer coverage (~80%). Every bug fix should include a regression spec reproducing the failure path.

## Environment & Secrets
- Required Vite variables: `VITE_API_TOKEN`, `VITE_API_KEY`, `VITE_BASE_URL`. They power the Axios `instance` headers/URL—missing values will break all API calls.
- Secrets are managed through Doppler (`doppler.yaml` defines the project/configs). Prefer `doppler run -- pnpm <command>` locally and in CI (`pnpm doppler:env:prod` is available for workflows that need a file).
- Never commit `.env` with real values. Anything outside the `VITE_` prefix will never reach the browser bundle and should stay server-side.

## Git & PR Workflow
- Use short, imperative commit messages that mention the touched feature (Russian phrasing is welcome, e.g., `добавил фильтры todolists`). Keep unrelated work in separate commits.
- Before opening a PR, run `pnpm lint`, `pnpm test:run`, and `pnpm build` (or the Doppler equivalents) to ensure CI parity.
- PRs should outline motivation, key changes, manual verification steps, and any new Doppler secrets or breaking changes. Attach screenshots/GIFs for UI tweaks like header/theme updates.
- Install Husky (`pnpm prepare`) after dependency installs so local hooks stay active, and keep the branch history linear unless the maintainer asks otherwise.
