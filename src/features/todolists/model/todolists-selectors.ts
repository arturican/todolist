import type { RootState } from '@/app/store.ts';
import type { Todolist } from '@/features/todolists/model/todolists-slice.ts';

export const selectTodolists = (state: RootState): Todolist[] =>
  state.todolists;
