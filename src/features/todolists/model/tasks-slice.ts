/*
import {
  createTodolistAC,
  deleteTodolistAC,
  todolistId1,
  todolistId2,
} from './todolists-slice.ts';
import { createAction, createReducer, nanoid } from '@reduxjs/toolkit';
import type { TaskType } from '@/features/todolists/ui/Todolists/TodolistItem/Tasks/Task.tsx';

export const initialTaskState: TasksState = {
  [todolistId1]: [
    { id: nanoid(), title: 'HTML & CSS', isDone: true },
    { id: nanoid(), title: 'JavaScript', isDone: false },
  ],
  [todolistId2]: [
    { id: nanoid(), title: 'Milk', isDone: true },
    { id: nanoid(), title: 'Bread', isDone: false },
  ],
};
export type TasksState = {
  [key: string]: TaskType[];
};

export const deleteTaskAC = createAction<{
  todolistId: string;
  taskId: string;
}>('tasks/deleteTask');
export const createTaskAC = createAction<{ id: string; title: string }>(
  'tasks/createTask',
);
export const changeTaskStatusAC = createAction<{
  todolistId: string;
  taskId: string;
  isDone: boolean;
}>('tasks/changeTaskStatus');
export const changeTaskTitleAC = createAction<{
  todolistId: string;
  taskId: string;
  title: string;
}>('tasks/changeTaskTitle');

export const tasksReducer = createReducer(initialTaskState, builder => {
  builder
    .addCase(createTodolistAC, (state, action) => {
      state[action.payload.id] = [];
    })
    .addCase(deleteTodolistAC, (state, action) => {
      delete state[action.payload.id];
    })
    .addCase(deleteTaskAC, (state, action) => {
      const task = state[action.payload.todolistId];
      const index = task.findIndex(task => task.id === action.payload.taskId);
      if (index !== -1) {
        task.splice(index, 1);
      }
    })
    .addCase(createTaskAC, (state, action) => {
      state[action.payload.id].unshift({
        id: nanoid(),
        title: action.payload.title,
        isDone: false,
      });
    })
    .addCase(changeTaskStatusAC, (state, action) => {
      const task = state[action.payload.todolistId].find(
        task => task.id === action.payload.taskId,
      );
      if (task) {
        task.isDone = action.payload.isDone;
      }
    })
    .addCase(changeTaskTitleAC, (state, action) => {
      const task = state[action.payload.todolistId].find(
        task => task.id === action.payload.taskId,
      );
      if (task) {
        task.title = action.payload.title;
      }
    });
});
*/
import {
  createTodolistAC,
  deleteTodolistAC,
  todolistId1,
  todolistId2,
} from '@/features/todolists/model/todolists-slice.ts';
import { createSlice, nanoid } from '@reduxjs/toolkit';
import type { TaskType } from '@/features/todolists/ui/Todolists/TodolistItem/Tasks/Task.tsx';

export type TasksState = {
  [key: string]: TaskType[];
};

export const tasksSlice = createSlice({
  name: 'tasks',
  initialState: {
    [todolistId1]: [
      { id: nanoid(), title: 'HTML & CSS', isDone: true },
      { id: nanoid(), title: 'JavaScript', isDone: false },
    ],
    [todolistId2]: [
      { id: nanoid(), title: 'Milk', isDone: true },
      { id: nanoid(), title: 'Bread', isDone: false },
    ],
  },
  reducers: create => ({
    deleteTaskAC: create.reducer<{ todolistId: string; taskId: string }>(
      (state, action) => {
        const task = state[action.payload.todolistId];
        const index = task.findIndex(task => task.id === action.payload.taskId);
        if (index !== -1) {
          task.splice(index, 1);
        }
      },
    ),
    createTaskAC: create.reducer<{ todolistId: string; title: string }>(
      (state, action) => {
        state[action.payload.todolistId].unshift({
          id: nanoid(),
          title: action.payload.title,
          isDone: false,
        });
      },
    ),
    changeTaskStatusAC: create.reducer<{
      todolistId: string;
      taskId: string;
      isDone: boolean;
    }>((state, action) => {
      const task = state[action.payload.todolistId].find(
        task => task.id === action.payload.taskId,
      );
      if (task) {
        task.isDone = action.payload.isDone;
      }
    }),
    changeTaskTitleAC: create.reducer<{
      todolistId: string;
      taskId: string;
      title: string;
    }>((state, action) => {
      const task = state[action.payload.todolistId].find(
        task => task.id === action.payload.taskId,
      );
      if (task) {
        task.title = action.payload.title;
      }
    }),
  }),
  extraReducers: builder => {
    builder
      .addCase(createTodolistAC, (state, action) => {
        state[action.payload.id] = [];
      })
      .addCase(deleteTodolistAC, (state, action) => {
        delete state[action.payload.id];
      });
  },
});
export const {
  deleteTaskAC,
  changeTaskStatusAC,
  changeTaskTitleAC,
  createTaskAC,
} = tasksSlice.actions;
export const tasksReducer = tasksSlice.reducer;
