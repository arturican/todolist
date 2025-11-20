import { createAsyncThunk } from '@reduxjs/toolkit';
import type { DomainTodolist } from '@/features/todolists/api/todolistsApi.types.ts';
import { todolistsApi } from '@/features/todolists/api/todolistsApi.ts';
import { createAppSlice } from '@/common/utils';
export type FilterValue = 'all' | 'active' | 'completed';

export const todolistsSlice = createAppSlice({
  name: 'todolists',
  initialState: [] as DomainTodolist[],
  reducers: create => ({
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
    fetchTodolistsTC: create.asyncThunk(
      async (_, thunkAPI) => {
        try {
          const res = await todolistsApi.getTodolists();
          return { todolists: res.data };
        } catch (error) {
          return thunkAPI.rejectWithValue(error);
        }
      },
      {
        fulfilled: (state, action) => {
          action.payload?.todolists.map(tl => {
            state.push({ ...tl, filter: 'all' });
          });
        },
      },
    ),
  }),
  extraReducers: builder => {
    builder
      .addCase(changeTodolistTitleTC.fulfilled, (state, action) => {
        const index = state.findIndex(
          todolist => todolist.id === action.payload.id,
        );
        if (index !== -1) {
          state[index].title = action.payload.title;
        }
      })
      .addCase(createTodolistTC.fulfilled, (state, action) => {
        state.unshift({ ...action.payload.todolist, filter: 'all' });
      })
      .addCase(deleteTodolistTC.fulfilled, (state, action) => {
        const index = state.findIndex(
          todolist => todolist.id === action.payload.id,
        );
        if (index !== -1) {
          state.splice(index, 1);
        }
      });
  },
  selectors: {
    selectTodolists: state => state,
  },
});

export const changeTodolistTitleTC = createAsyncThunk(
  `${todolistsSlice.name}/changeTodolistTitleTC`,
  async (payload: { id: string; title: string }, thunkAPI) => {
    try {
      await todolistsApi.changeTodolistTitle(payload);
      return payload;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  },
);

export const createTodolistTC = createAsyncThunk(
  `${todolistsSlice.name}/createTodolistTC`,
  async (title: string, thunkAPI) => {
    try {
      const res = await todolistsApi.createTodolist(title);
      return { todolist: res.data.data.item };
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  },
);

export const deleteTodolistTC = createAsyncThunk(
  `${todolistsSlice.name}/deleteTodolistTC`,
  async (id: string, thunkAPI) => {
    try {
      await todolistsApi.deleteTodolist(id);
      return { id };
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  },
);

export const { fetchTodolistsTC, changeTodolistFilterAC } =
  todolistsSlice.actions;
export const todolistsReducer = todolistsSlice.reducer;
export const { selectTodolists } = todolistsSlice.selectors;
