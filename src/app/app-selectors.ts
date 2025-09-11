import type { RootState } from './store.ts';
import type { ThemeMode } from './app-reducer.ts';

export const selectThemeMode = (state: RootState): ThemeMode => state.app.themeMode;
