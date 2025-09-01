import type { TasksState } from '../App';
import type { CreateTodolistAction, DeleteTodolistAction } from './todolists-reducer.ts';
import { v1 } from 'uuid';

const initialState: TasksState = {};

export const tasksReducer = (state: TasksState = initialState, action: Actions): TasksState => {
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
    default:
      return state;
  }
};

type Actions = CreateTodolistAction | DeleteTodolistAction | DeleteTaskAction | CreateTaskAction;

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

export type DeleteTaskAction = ReturnType<typeof deleteTaskAC>;
export type CreateTaskAction = ReturnType<typeof createTaskAC>;
