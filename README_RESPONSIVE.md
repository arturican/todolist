# Responsive Guide

## Supported Viewports

### Mobile
- `320x568` (iPhone SE)
- `375x812` (iPhone X / 11 Pro)
- `390x844` (iPhone 12/13/14)
- `414x896` (Plus / Max)

### Tablet
- `768x1024` (iPad portrait)
- `1024x768` (iPad landscape)

### Laptop / Desktop
- `1280x720` (small laptop)
- `1440x900` (laptop)
- `1920x1080` (Full HD)

### 2K Monitors
- `2560x1440` (QHD)
- `3440x1440` (UltraWide QHD)

### 4K Monitors
- `3840x2160` (UHD / 4K)
- `5120x2160` (UltraWide 5K2K, optional via `INCLUDE_5K2K=true`)

## Commands

Install browsers once:

```bash
pnpm exec playwright install chromium
```

Run responsive smoke tests with screenshots:

```bash
pnpm run test:responsive
```

Run smoke tests with optional 5K2K viewport:

```bash
INCLUDE_5K2K=true pnpm run test:responsive
```

Run Storybook with viewport addon:

```bash
pnpm run storybook
```

Build static Storybook:

```bash
pnpm run build-storybook
```

Run Lighthouse reports:

```bash
pnpm run lighthouse
```

## Artifacts

- Responsive screenshots: `artifacts/responsive/{mobile|tablet|desktop|2k|4k}`
- Playwright HTML report: `artifacts/playwright-report`
- Lighthouse reports: `artifacts/lighthouse`

File naming for screenshots:

- `<page>__<width>x<height>.png`
- Example: `main__390x844.png`

## Visual Regression Baseline

Current setup stores fresh screenshots as artifacts (no strict baseline comparison in CI).

If baseline comparison is enabled later with Playwright snapshots:

```bash
pnpm exec playwright test --update-snapshots
```

Then commit updated files from the snapshot directory.

## Responsive Coding Rules for This Project

- Use layout tokens from `src/index.css` (`--space*`, `--containerMaxWidth`, `--tapMinSize`).
- Prefer `rem`/`clamp()` over hard `px` for spacing and typography.
- Keep content centered with `.pageContainer`; do not stretch app content full width on 2K/4K.
- Avoid fixed card/form widths; use `minmax`, `auto-fit`, `flex-wrap`, `min-width: 0`.
- Always test long text wrapping (`overflow-wrap: anywhere`) for titles and labels.
- Keep touch targets at least `var(--tapMinSize)` on mobile.
- Verify no horizontal scroll (`scrollWidth` must not exceed viewport width).
