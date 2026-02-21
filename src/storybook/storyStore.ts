import { configureStore } from '@reduxjs/toolkit';
import { appReducer } from '@/app/app-slice.ts';
import { authReducer } from '@/features/auth/model/auth-slice.ts';
import { todolistsReducer } from '@/features/todolists/model/todolists-slice.ts';
import { tasksReducer } from '@/features/todolists/model/tasks-slice.ts';
import { TaskPriority, TaskStatus } from '@/common/enums/enums.ts';

export const storyTodolist = {
  id: 'storybook-todolist',
  title: 'Storybook list with long title to check wrapping behavior',
  addedDate: '2025-03-10T12:00:00',
  order: 0,
  filter: 'all' as const,
  entityStatus: 'idle' as const,
};

export const storyTasks = [
  {
    id: 'storybook-task-1',
    todoListId: storyTodolist.id,
    title: 'Plan responsive QA pass for all supported viewport sizes',
    description: null,
    status: TaskStatus.New,
    priority: TaskPriority.Middle,
    startDate: null,
    deadline: null,
    order: 0,
    addedDate: '2025-03-10T12:05:00',
  },
  {
    id: 'storybook-task-2',
    todoListId: storyTodolist.id,
    title: 'Fix task title overflow in compact mobile cards',
    description: null,
    status: TaskStatus.Completed,
    priority: TaskPriority.Hi,
    startDate: null,
    deadline: null,
    order: 1,
    addedDate: '2025-03-10T12:15:00',
  },
];

export const createStoryStore = () =>
  configureStore({
    reducer: {
      app: appReducer,
      auth: authReducer,
      todolists: todolistsReducer,
      tasks: tasksReducer,
    },
    preloadedState: {
      app: {
        themeMode: 'light' as const,
        status: 'idle' as const,
        error: null,
      },
      auth: {
        name: 'storybook@example.com',
        isLoggedIn: true,
      },
      todolists: [storyTodolist],
      tasks: {
        [storyTodolist.id]: storyTasks,
      },
    },
  });
