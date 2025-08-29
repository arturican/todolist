import type { Todolist } from '../App.tsx';

export type DeleteTodolistAction = ReturnType<typeof deleteTodlistAC>;
type Actions = DeleteTodolistAction;
const initialState: Todolist[] = [];
export const todolistsReducer = (state: Todolist[] = initialState, action: Actions): Todolist[] => {
  switch (action.type) {
    case 'delete_todolist': {
      return state.filter(todolist => todolist.id !== action.payload.id);
    }
    default:
      return state;
  }
};

export const deleteTodlistAC = (id: string) => {
  return { type: 'delete_todolist', payload: { id } } as const;
};
