import type { RootState } from '@/app/store.ts';
import type { Todolist } from '@/features/todolists/model/todolists-reducer.ts';

export const selectTodolists = (state: RootState): Todolist[] => state.todolists;
