import type { TasksState } from '../app/App.tsx';
import {
  createTodolistAC,
  deleteTodolistAC,
  todolistId1,
  todolistId2,
} from './todolists-reducer.ts';
import { v1 } from 'uuid';
import { createReducer } from '@reduxjs/toolkit';

export const initialTaskState: TasksState = {
  [todolistId1]: [
    { id: v1(), title: 'HTML & CSS', isDone: true },
    { id: v1(), title: 'JavaScript', isDone: false },
  ],
  [todolistId2]: [
    { id: v1(), title: 'Milk', isDone: true },
    { id: v1(), title: 'Bread', isDone: false },
  ],
};

/*export const _tasksReducer = (state: TasksState = initialTaskState, action: Actions): TasksState => {
  switch (action.type) {
    case 'create_todolist': {
      return { ...state, [action.payload.id]: [] };
    }
    case 'delete_todolist': {
      const newState = { ...state };
      delete newState[action.payload.id];
      return newState;
    }
    case 'delete_task': {
      return {
        ...state,
        [action.payload.todolistId]: state[action.payload.todolistId].filter(
          task => task.id !== action.payload.taskId,
        ),
      };
    }
    case 'create_task': {
      const newTask = { id: v1().toString(), title: action.payload.title, isDone: false };
      return {
        ...state,
        [action.payload.todolistId]: [newTask, ...state[action.payload.todolistId]],
      };
    }
    case 'change_task': {
      return {
        ...state,
        [action.payload.todolistId]: state[action.payload.todolistId].map(task =>
          task.id === action.payload.taskId ? { ...task, isDone: action.payload.isDone } : task,
        ),
      };
    }
    case 'change_task_title': {
      return {
        ...state,
        [action.payload.todolistId]: state[action.payload.todolistId].map(task =>
          task.id === action.payload.taskId ? { ...task, title: action.payload.title } : task,
        ),
      };
    }
    default:
      return state;
  }
};*/

export const tasksReducer = createReducer(initialTaskState, builder => {
  builder
    .addCase(createTodolistAC, (state, action) => {
      state[action.payload.id] = [];
    })
    .addCase(deleteTodolistAC, (state, action) => {
      delete state[action.payload.id];
    });
});

export const deleteTaskAC = (payload: { todolistId: string; taskId: string }) => {
  return {
    type: 'delete_task',
    payload,
  } as const;
};

export const createTaskAC = (payload: { todolistId: string; title: string }) => {
  return {
    type: 'create_task',
    payload,
  } as const;
};

export const changeTaskStatusAC = (payload: {
  todolistId: string;
  taskId: string;
  isDone: boolean;
}) => {
  return {
    type: 'change_task',
    payload,
  } as const;
};

export const changeTaskTitleAC = (payload: {
  todolistId: string;
  taskId: string;
  title: string;
}) => {
  return {
    type: 'change_task_title',
    payload,
  } as const;
};

export type DeleteTaskAction = ReturnType<typeof deleteTaskAC>;
export type CreateTaskAction = ReturnType<typeof createTaskAC>;
export type ChangeTaskStatusAction = ReturnType<typeof changeTaskStatusAC>;
export type ChangeTaskTitleAction = ReturnType<typeof changeTaskTitleAC>;

console.log(initialTaskState);
