import type { TasksState } from '../../../app/App.tsx';
import type { RootState } from '../../../app/store.ts';

export const selectTasks = (state: RootState): TasksState => state.tasks;
