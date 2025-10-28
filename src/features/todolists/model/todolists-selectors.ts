import type { Todolist } from '../../../app/App.tsx';
import type { RootState } from '../../../app/store.ts';

export const selectTodolists = (state: RootState): Todolist[] => state.todolists;
