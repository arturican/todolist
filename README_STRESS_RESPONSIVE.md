# Stress Responsive Guide

## What This Covers

This project has a stress mode for large ToDo datasets and automated screenshot checks to prevent layout regressions on different screens.

For frontend screenshot tests, stress fixtures are loaded with query params (`?stress=1&dataset=<single-list|ten-lists|many-lists>`).

## Stress Datasets

Backend stress seed supports these datasets:

- `single`: 1 todolist with 300 tasks (heavy single-list case)
- `ten`: 10 todolists with 80 tasks each
- `many`: 30 todolists with 30 tasks each
- `all`: combined profile (`single` + `ten` + `many`)

## Generate Stress Data

Run backend seed profiles:

```bash
pnpm run seed:stress
pnpm run seed:stress:single
pnpm run seed:stress:ten
pnpm run seed:stress:many
```

Then run backend + frontend:

```bash
pnpm backend:dev
pnpm dev
```

Demo credentials remain:

- login: `admin`
- password: `admin`

## Automated UI Stress Screenshots

Run stress responsive test:

```bash
pnpm run test:responsive
```

Run all Playwright UI tests:

```bash
pnpm run test:ui
```

Run only regression checks introduced for this issue:

```bash
pnpm exec playwright test -c playwright.config.ts tests/responsive/add-task-last-list.spec.ts
pnpm run test:layout
```

Run previous lightweight smoke (optional):

```bash
pnpm run test:responsive:smoke
```

## Required Viewports

Mobile:

- `320x568`
- `375x812`
- `390x844`
- `414x896`

Tablet:

- `768x1024`
- `1024x768`

Desktop:

- `1280x720`
- `1440x900`
- `1920x1080`

2K:

- `2560x1440`
- `3440x1440`

4K:

- `3840x2160`
- `5120x2160` (optional, enabled with `INCLUDE_5K2K=true`)

## Artifacts

- Stress responsive screenshots:
  - `artifacts/responsive/stress/{mobile|tablet|desktop|2k|4k}`
- Screenshot naming:
  - `<page>__<dataset>__<width>x<height>.png`
  - examples:
    - `lists__single-list__390x844.png`
    - `heavy-todolist__ten-lists__1024x768.png`
    - `heavy-todolist-scrolled__many-lists__1920x1080.png`

## CI

GitHub Actions workflow `responsive-check.yml` runs:

- install
- build
- `pnpm run test:responsive`
- uploads screenshot artifacts
