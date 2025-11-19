import type { RootState } from '@/app/store.ts';
import type { TasksState } from '@/features/todolists/model/tasks-slice.ts';

export const selectTasks = (state: RootState): TasksState => state.tasks;
