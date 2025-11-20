import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { DomainTodolist } from '@/features/todolists/api/todolistsApi.types.ts';
import { todolistsApi } from '@/features/todolists/api/todolistsApi.ts';
export type FilterValue = 'all' | 'active' | 'completed';

export const todolistsSlice = createSlice({
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
  }),
  extraReducers: builder => {
    builder
      .addCase(fetchTodolistsTC.fulfilled, (_state, action) => {
        return action.payload.todolists.map(tl => {
          return { ...tl, filter: 'all' };
        });
      })
      .addCase(fetchTodolistsTC.rejected, (_state, action) => {
        if (action.payload) {
          // @ts-ignore
          console.log(action.payload.message);
        }
      })
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

export const fetchTodolistsTC = createAsyncThunk(
  `${todolistsSlice.name}/fetchTodolistsTC`,
  async (_, thunkAPI) => {
    try {
      const res = await todolistsApi.getTodolists();
      return { todolists: res.data };
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  },
);

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

export const { changeTodolistFilterAC } = todolistsSlice.actions;
export const todolistsReducer = todolistsSlice.reducer;
export const { selectTodolists } = todolistsSlice.selectors;
