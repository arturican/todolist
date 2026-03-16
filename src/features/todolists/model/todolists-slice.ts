import {
  type DomainTodolist,
  type FilterValue,
  todolistSchema,
} from '@/features/todolists/api/todolistsApi.types.ts';
import { todolistsApi } from '@/features/todolists/api/todolistsApi.ts';
import { finishAppLoadingAC, startAppLoadingAC } from '@/app/app-slice.ts';
import {
  createAppSlice,
  handleServerAppError,
  handleServerNetworkError,
} from '@/common/utils';
import type { RequestStatus } from '@/common/types/types.ts';
import { ResultCode } from '@/common/enums/enums.ts';
import { clearDataAC } from '@/common/actions';

export const todolistsSlice = createAppSlice({
  name: 'todolists',
  initialState: [] as DomainTodolist[],
  selectors: {
    selectTodolists: state => state,
  },
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
          dispatch(startAppLoadingAC());
          const res = await todolistsApi.getTodolists();
          const todolists = todolistSchema.array().parse(res.data);
          dispatch(finishAppLoadingAC());
          return { todolists };
        } catch (error) {
          handleServerNetworkError(dispatch, error);
          return rejectWithValue(error);
        }
      },
      {
        fulfilled: (state, action) => {
          return action.payload.todolists.map(tl => ({
            ...tl,
            filter: 'all',
            entityStatus: 'idle',
          }));
        },
      },
    ),
    createTodolistTC: create.asyncThunk(
      async (title: string, { dispatch, rejectWithValue }) => {
        try {
          dispatch(startAppLoadingAC());
          const res = await todolistsApi.createTodolist(title);
          if (res.data.resultCode === ResultCode.Success) {
            dispatch(finishAppLoadingAC());
            return { todolist: res.data.data.item };
          } else {
            handleServerAppError(res.data, dispatch);
            return rejectWithValue(null);
          }
        } catch (error: any) {
          handleServerNetworkError(dispatch, error);
          return rejectWithValue(null);
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
          dispatch(startAppLoadingAC());
          dispatch(changeTodolistStatusAC({ id, entityStatus: 'loading' }));
          const res = await todolistsApi.deleteTodolist(id);
          if (res.data.resultCode === ResultCode.Success) {
            dispatch(finishAppLoadingAC());
            return { id };
          } else {
            handleServerAppError(res.data, dispatch);
            return rejectWithValue(null);
          }
        } catch (error: any) {
          handleServerNetworkError(dispatch, error);
          return rejectWithValue(null);
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
          dispatch(startAppLoadingAC());
          const res = await todolistsApi.changeTodolistTitle(payload);
          if (res.data.resultCode === ResultCode.Success) {
            dispatch(finishAppLoadingAC());
            return payload;
          } else {
            handleServerAppError(res.data, dispatch);
            return rejectWithValue(null);
          }
        } catch (error: any) {
          handleServerNetworkError(dispatch, error);
          return rejectWithValue(null);
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
  extraReducers: builder => {
    builder.addCase(clearDataAC, () => {
      return [];
    });
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
