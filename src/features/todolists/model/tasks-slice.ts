import {
  createTodolistAC,
  deleteTodolistAC,
} from '@/features/todolists/model/todolists-slice.ts';
import { createSlice, nanoid } from '@reduxjs/toolkit';
import type { TaskType } from '@/features/todolists/ui/Todolists/TodolistItem/Tasks/Task.tsx';

export type TasksState = {
  [key: string]: TaskType[];
};

export const tasksSlice = createSlice({
  name: 'tasks',
  initialState: {} as TasksState,
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
        console.log(state);
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
  selectors: {
    selectTasks: state => state,
  },
});
export const {
  deleteTaskAC,
  changeTaskStatusAC,
  changeTaskTitleAC,
  createTaskAC,
} = tasksSlice.actions;
export const tasksReducer = tasksSlice.reducer;
export const { selectTasks } = tasksSlice.selectors;
