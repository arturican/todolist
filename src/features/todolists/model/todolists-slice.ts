/*import { createAction, createReducer, nanoid } from '@reduxjs/toolkit';
export type FilterValue = 'all' | 'active' | 'completed';
export type Todolist = {
  id: string;
  title: string;
  filter: FilterValue;
};

export let todolistId1 = nanoid();
export let todolistId2 = nanoid();
export const initialState: Todolist[] = [
  { id: todolistId1, title: 'What to learn', filter: 'all' },
  { id: todolistId2, title: 'What to buy', filter: 'all' },
];

export const deleteTodolistAC = createAction<{ id: string }>('todolists/deleteTodolist');
export const createTodolistAC = createAction('todolists/createTodolist', (title: string) => {
  return { payload: { title, id: nanoid() } };
});
export const changeTodolistTitleAC = createAction<{ id: string; title: string }>(
  'todolists/changeTodolistTitleAC',
);
export const changeTodolistFilterAC = createAction<{ id: string; filter: FilterValue }>(
  'todolists/changeTodolistFilterAC',
);

export const todolistsReducer = createReducer(initialState, builder => {
  builder
    .addCase(deleteTodolistAC, (state, action) => {
      const index = state.findIndex(todolist => todolist.id === action.payload.id);
      if (index !== -1) {
        state.splice(index, 1);
      }
    })
    .addCase(createTodolistAC, (state, action) => {
      state.push({ ...action.payload, filter: 'all' });
    })
    .addCase(changeTodolistTitleAC, (state, action) => {
      const index = state.findIndex(todolist => todolist.id === action.payload.id);
      if (index !== -1) {
        state[index].title = action.payload.title;
      }
    })
    .addCase(changeTodolistFilterAC, (state, action) => {
      const todolist = state.find(todolist => todolist.id === action.payload.id);
      if (todolist) {
        todolist.filter = action.payload.filter;
      }
    });
});*/
import { createSlice, nanoid } from '@reduxjs/toolkit';
export type FilterValue = 'all' | 'active' | 'completed';
export type Todolist = {
  id: string;
  title: string;
  filter: FilterValue;
};
export let todolistId1 = nanoid();
export let todolistId2 = nanoid();
export const todolistsSlice = createSlice({
  name: 'todolists',
  initialState: [
    { id: todolistId1, title: 'What to learn', filter: 'all' },
    { id: todolistId2, title: 'What to buy', filter: 'all' },
  ] as Todolist[],
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
        state.push({ ...action.payload, filter: 'all' });
      },
    ),
  }),
});

export const {
  deleteTodolistAC,
  createTodolistAC,
  changeTodolistTitleAC,
  changeTodolistFilterAC,
} = todolistsSlice.actions;
export const todolistsReducer = todolistsSlice.reducer;
