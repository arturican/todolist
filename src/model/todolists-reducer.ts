import type { Todolist } from '../App.tsx';
import { v1 } from 'uuid';

export type DeleteTodolistAction = ReturnType<typeof deleteTodlistAC>;
export type CreateTodolistAction = ReturnType<typeof createTodolistAC>;
type Actions = DeleteTodolistAction | CreateTodolistAction;
const initialState: Todolist[] = [];
export const todolistsReducer = (state: Todolist[] = initialState, action: Actions): Todolist[] => {
  switch (action.type) {
    case 'delete_todolist': {
      return state.filter(todolist => todolist.id !== action.payload.id);
    }
    case 'create_todolist': {
      const newTodolist: Todolist = {
        id: action.payload.id,
        title: action.payload.title,
        filter: 'all',
      };
      return [...state, newTodolist];
    }
    default:
      return state;
  }
};

export const deleteTodlistAC = (id: string) => {
  return { type: 'delete_todolist', payload: { id } } as const;
};
export const createTodolistAC = (title: string) => {
  const id = v1();
  return { type: 'create_todolist', payload: { id, title } as const };
};
