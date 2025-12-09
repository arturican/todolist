# Agent Guide

## Purpose
- SPA for managing todo lists and tasks with authentication.
- Users log in, view their todo lists, create/update/delete lists and tasks, filter tasks, and toggle light/dark theme.

## Architecture Overview
- Frontend-only React/Vite app; API calls go to an external backend via Axios instance configured from Vite env vars (`VITE_BASE_URL`, `VITE_API_KEY`, `VITE_API_TOKEN` for bearer).
- State management: Redux Toolkit with custom `createAppSlice` wrapper (adds `create.asyncThunk`).
- Routing: `react-router` v7 (Routes/Route, BrowserRouter).
- The app initializes by calling `authApi.me` (`initializeAppTC`); shows a spinner until init completes.

## Frontend Structure
- Entry: `src/main.tsx` renders `<App />` with `BrowserRouter` + Redux `Provider`.
- App shell: `src/app/App.tsx` wraps content in MUI `ThemeProvider`, renders `Header`, `Routing`, and global `ErrorSnackbar`; tracks `isInitialized` to show spinner.
- Routing: `src/common/routing/Routing.tsx` defines `Path.Main` (`/`), `Path.Login` (`/login`), `Path.NotFound` (`*`).
- Pages:
  - `Main` (`src/app/Main.tsx`): Protected route; redirects to login if not authed. Renders `CreateItemForm` for new todolist and `Todolists` list.
  - `Login` (`src/features/auth/ui/Login/Login.tsx`): React Hook Form + Zod validation; dispatches `loginTC`; redirects to `/` if already logged in.
- UI components: `Header` (theme toggle, sign out, status bar), `CreateItemForm`, `EditableSpan`, `NavButton`, `ErrorSnackbar`, `PageNotFound`, etc. Styles via MUI + minimal CSS modules.
- Feature UI: `Todolists` → `TodolistItem` → `Tasks` → `TaskItem`, plus filter buttons and title editor.
- Filtering: `FilterButtons` switch todolist `filter` between `all/active/completed`; `Tasks` filters tasks accordingly.

## State & Slices
- `app-slice`: `themeMode`, global `status` (`idle/loading/succeeded/failed`), `error`. Actions: `changeThemeModeAC`, `setAppStatusAC`, `setAppErrorAC`. Selectors: `selectThemeMode`, `selectStatus`, `selectAppError`.
- `auth-slice`: `isLoggedIn`; thunks `initializeAppTC`, `loginTC`, `logoutTC`. Uses `authApi` and sets `localStorage` token. Selector: `selectIsLoggedIn`.
- `todolists-slice`: array of `DomainTodolist` (todolist + `filter` + `entityStatus`). Thunks: `fetchTodolistsTC`, `createTodolistTC`, `deleteTodolistTC`, `changeTodolistTitleTC`. Reducers: `changeTodolistFilterAC`, `changeTodolistStatusAC`. Selector: `selectTodolists`.
- `tasks-slice`: `TasksState` (record `todolistId` → `DomainTask[]`). Thunks: `fetchTasksTC`, `createTaskTC`, `deleteTaskTC`, `updateTaskTC`. Extra reducers respond to todolist create/delete. Selector: `selectTasks`.
- Custom slice helper: `createAppSlice` from `@reduxjs/toolkit` `buildCreateSlice` with `asyncThunkCreator`.
- Typed hooks: `useAppDispatch`, `useAppSelector`.

## API Layer
- Axios instance: `src/common/instance/instance.ts`
  - Base URL from `VITE_BASE_URL`, `API-KEY` header from `VITE_API_KEY`.
  - Request interceptor adds `Authorization: Bearer <localStorage token>`.
- Auth endpoints (`src/features/auth/api/authApi.ts`):
  - `login(payload)` → `POST /auth/login` returns `{ userId, token }`; token stored in `localStorage`.
  - `logout()` → `DELETE /auth/login`.
  - `me()` → `GET /auth/me`.
- Todolists endpoints (`src/features/todolists/api/todolistsApi.ts`):
  - `getTodolists()`, `createTodolist(title)`, `deleteTodolist(id)`, `changeTodolistTitle({ id, title })`.
  - Types validated with Zod schema `todolistSchema`.
- Tasks endpoints (`src/features/todolists/api/tasksApi.ts`):
  - `getTasks(todolistId)`, `createTask({ todolistId, title })`, `updateTask({ todolistId, taskId, model })`, `deleteTask({ todolistId, taskId })`.
  - Task items validated with Zod schema `domainTaskSchema`; `UpdateTaskModel` defines updatable fields.
- Result codes: `ResultCode.Success | Error | CaptchaError`; task status/priority enums in `src/common/enums/enums.ts`.

## Error & Status Handling
- `handleServerAppError`: dispatches first error message (or fallback) and sets app status to `failed`.
- `handleServerNetworkError`: distinguishes Axios/Zod/native errors; dispatches `setAppErrorAC` and `setAppStatusAC('failed')`.
- Global UI: `Header` shows `LinearProgress` when `status === 'loading'`; `ErrorSnackbar` shows `app.error`.

## Tech Stack
- React 19, TypeScript, Vite.
- Redux Toolkit with RTK async thunks via `createAppSlice`.
- React Router v7.
- MUI v7 + Emotion for styling; some CSS modules.
- Form validation: React Hook Form + Zod.
- Testing: Vitest (unit tests for slices).
- Lint/format: ESLint (with eslint-plugin-react, hooks, refresh), Prettier.

## Coding Style & Constraints
- Path aliases: `@/*` → `src/*`; imports often include `.ts/.tsx` extensions due to `allowImportingTsExtensions`.
- Strict TS enabled; keep types explicit.
- Avoid non-ASCII unless already present; project uses some Russian text in UI.
- Reducers mutate draft state (Immer).
- UI theme toggled via MUI theme; prefer using theme palette over hardcoded colors.
- Keep API responses parsed/validated via Zod where applicable; handle errors through shared helpers and app status.

## Flow Notes for Agents
- Initialization: `App` dispatches `initializeAppTC`; show spinner until resolved; after login, token stored in `localStorage` and sent via interceptor.
- Protected main page: `Main` redirects to `/login` when `isLoggedIn` is false.
- Data fetching: `Todolists` dispatches `fetchTodolistsTC` on mount; each `Tasks` dispatches `fetchTasksTC(todolist.id)` on mount. Ensure state keys exist when creating/updating tasks.
- Filtering: task list respects `todolist.filter` (`all/active/completed`).
- Duplicates caution: `fetchTodolistsTC.fulfilled` currently pushes into state; re-fetch may append duplicates unless you reset state.

## Potential Gotchas
- `handleServerNetworkError` signature is `(dispatch, error)`; call sites must match.
- `loginSchema` should use `z.string().email({ message: ... })`; adjust if modifying validation.
- Async init: make sure `isInitialized` reflects completion of `initializeAppTC`.
- Tasks may be `undefined` before fetch; guard before filtering.
