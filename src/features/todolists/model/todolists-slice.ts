import type { DomainTodolist } from '@/features/todolists/api/todolistsApi.types.ts';
import { todolistsApi } from '@/features/todolists/api/todolistsApi.ts';
import { createAppSlice } from '@/common/utils';
import { setAppStatusAC } from '@/app/app-slice.ts';
import type { RequestStatus } from '@/common/types/types.ts';
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
    changeTodolistStatusAC: create.reducer<{
      id: string;
      entityStatus: RequestStatus;
    }>((state, action) => {
      const todolist = state.find(
        todolist => todolist.id === action.payload.id,
      );
      if (todolist) {
        todolist.entityStatus = action.payload.entityStatus;
      }
    }),
    fetchTodolistsTC: create.asyncThunk(
      async (_, { dispatch, rejectWithValue }) => {
        try {
          dispatch(setAppStatusAC({ status: 'loading' }));
          const res = await todolistsApi.getTodolists();
          dispatch(setAppStatusAC({ status: 'succeeded' }));
          return { todolists: res.data };
        } catch (error) {
          dispatch(setAppStatusAC({ status: 'failed' }));
          return rejectWithValue(error);
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
    createTodolistTC: create.asyncThunk(
      async (title: string, { dispatch, rejectWithValue }) => {
        try {
          dispatch(setAppStatusAC({ status: 'loading' }));
          const res = await todolistsApi.createTodolist(title);
          return { todolist: res.data.data.item };
        } catch (error) {
          return rejectWithValue(error);
        }
      },
      {
        fulfilled: (state, action) => {
          state.unshift({
            ...action.payload.todolist,
            filter: 'all',
            entityStatus: 'idle',
          });
        },
      },
    ),
    deleteTodolistTC: create.asyncThunk(
      async (id: string, { dispatch, rejectWithValue }) => {
        try {
          dispatch(setAppStatusAC({ status: 'loading' }));
          dispatch(changeTodolistStatusAC({ id, entityStatus: 'loading' }));
          await todolistsApi.deleteTodolist(id);
          dispatch(setAppStatusAC({ status: 'succeeded' }));
          return { id };
        } catch (error) {
          dispatch(setAppStatusAC({ status: 'failed' }));
          return rejectWithValue(error);
        }
      },
      {
        fulfilled: (state, action) => {
          const index = state.findIndex(
            todolist => todolist.id === action.payload.id,
          );
          if (index !== -1) {
            state.splice(index, 1);
          }
        },
      },
    ),
    changeTodolistTitleTC: create.asyncThunk(
      async (
        payload: { id: string; title: string },
        { dispatch, rejectWithValue },
      ) => {
        try {
          dispatch(setAppStatusAC({ status: 'loading' }));
          await todolistsApi.changeTodolistTitle(payload);
          dispatch(setAppStatusAC({ status: 'succeeded' }));
          return payload;
        } catch (error) {
          dispatch(setAppStatusAC({ status: 'failed' }));
          return rejectWithValue(error);
        }
      },
      {
        fulfilled: (state, action) => {
          const index = state.findIndex(
            todolist => todolist.id === action.payload.id,
          );
          if (index !== -1) {
            state[index].title = action.payload.title;
          }
        },
      },
    ),
  }),

  selectors: {
    selectTodolists: state => state,
  },
});

export const {
  fetchTodolistsTC,
  changeTodolistFilterAC,
  createTodolistTC,
  deleteTodolistTC,
  changeTodolistTitleTC,
  changeTodolistStatusAC,
} = todolistsSlice.actions;
export const todolistsReducer = todolistsSlice.reducer;
export const { selectTodolists } = todolistsSlice.selectors;
