import type { RequestStatus } from '@/common/types/types.ts';
import { createAppSlice } from '@/common/utils';

export type ThemeMode = 'dark' | 'light';
export const THEME_MODE_STORAGE_KEY = 'todolist-theme-mode';

const getInitialThemeMode = (): ThemeMode => {
  if (typeof window === 'undefined') {
    return 'light';
  }

  const storedThemeMode = window.localStorage.getItem(THEME_MODE_STORAGE_KEY);
  return storedThemeMode === 'dark' ? 'dark' : 'light';
};

export const appSlice = createAppSlice({
  name: 'app',
  initialState: {
    themeMode: getInitialThemeMode(),
    status: 'idle' as RequestStatus,
    error: null as string | null,
  },
  reducers: create => ({
    changeThemeModeAC: create.reducer<{ themeMode: ThemeMode }>(
      (state, action) => {
        state.themeMode = action.payload.themeMode;
      },
    ),
    setAppStatusAC: create.reducer<{ status: RequestStatus }>(
      (state, action) => {
        state.status = action.payload.status;
      },
    ),
    setAppErrorAC: create.reducer<{ error: null | string }>((state, action) => {
      state.error = action.payload.error;
    }),
  }),
  selectors: {
    selectThemeMode: state => state.themeMode,
    selectStatus: state => state.status,
    selectAppError: state => state.error,
  },
});

export const { changeThemeModeAC, setAppStatusAC, setAppErrorAC } =
  appSlice.actions;
export const appReducer = appSlice.reducer;
export const { selectThemeMode, selectStatus, selectAppError } =
  appSlice.selectors;
