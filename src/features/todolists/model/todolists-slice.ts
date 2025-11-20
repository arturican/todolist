import { createSlice, nanoid } from '@reduxjs/toolkit';
import type { DomainTodolist } from '@/features/todolists/api/todolistsApi.types.ts';
export type FilterValue = 'all' | 'active' | 'completed';
export let todolistId1 = nanoid();
export let todolistId2 = nanoid();
export const todolistsSlice = createSlice({
  name: 'todolists',
  initialState: [
    { id: todolistId1, title: 'What to learn', filter: 'all' },
    { id: todolistId2, title: 'What to buy', filter: 'all' },
  ] as DomainTodolist[],
  reducers: create => ({
    deleteTodolistAC: create.reducer<{ id: string }>((state, action) => {
      const index = state.findIndex(
        todolist => todolist.id === action.payload.id,
      );
      if (index !== -1) {
        state.splice(index, 1);
      }
    }),
    changeTodolistTitleAC: create.reducer<{ id: string; title: string }>(
      (state, action) => {
        const index = state.findIndex(
          todolist => todolist.id === action.payload.id,
        );
        if (index !== -1) {
          state[index].title = action.payload.title;
        }
      },
    ),
    changeTodolistFilterAC: create.reducer<{ id: string; filter: FilterValue }>(
      (state, action) => {
        const todolist = state.find(
          todolist => todolist.id === action.payload.id,
        );
        if (todolist) {
          todolist.filter = action.payload.filter;
        }
      },
    ),
    createTodolistAC: create.preparedReducer(
      (title: string) => ({ payload: { title, id: nanoid() } }),
      (state, action) => {
        state.push({
          ...action.payload,
          filter: 'all',
          addedDate: '',
          order: 0,
        });
      },
    ),
    setTodolistsAC: create.reducer<{ todolists: DomainTodolist[] }>(
      (_state, action) => {
        return action.payload.todolists;
      },
    ),
  }),
  selectors: {
    selectTodolists: state => state,
  },
});

export const {
  deleteTodolistAC,
  createTodolistAC,
  changeTodolistTitleAC,
  changeTodolistFilterAC,
  setTodolistsAC,
} = todolistsSlice.actions;
export const todolistsReducer = todolistsSlice.reducer;
export const { selectTodolists } = todolistsSlice.selectors;
