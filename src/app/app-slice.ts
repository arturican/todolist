import { createSlice } from '@reduxjs/toolkit';
import type { RequestStatus } from '@/common/types/types.ts';
export type ThemeMode = 'dark' | 'light';

export const appSlice = createSlice({
  name: 'app',
  initialState: {
    themeMode: 'light' as ThemeMode,
    status: 'idle' as RequestStatus,
    error: 'testasdasdasdasdasdasdasdasdasdasdasd' as string | null,
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
