import { createAction, createReducer } from '@reduxjs/toolkit';

export type ThemeMode = 'dark' | 'light';

const initialState = {
  themeMode: 'light' as ThemeMode,
};

export const changeThemeModeAC = createAction<{ themeMode: ThemeMode }>('app/changeThemeMode');
export const appReducer = createReducer(initialState, builder => {
  builder.addCase(changeThemeModeAC, (state, action) => {
    state.themeMode = action.payload.themeMode;
  });
});
