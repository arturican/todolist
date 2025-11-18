import type { RootState } from './store.ts';
import type { ThemeMode } from './app-slice.ts';

export const selectThemeMode = (state: RootState): ThemeMode =>
  state.app.themeMode;
