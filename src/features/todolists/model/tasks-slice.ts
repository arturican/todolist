import {
  createTodolistTC,
  changeTodolistStatusAC,
  deleteTodolistTC,
} from '@/features/todolists/model/todolists-slice.ts';
import { finishAppLoadingAC, startAppLoadingAC } from '@/app/app-slice.ts';
import {
  createAppSlice,
  handleServerAppError,
  handleServerNetworkError,
} from '@/common/utils';
import { tasksApi } from '@/features/todolists/api/tasksApi.ts';
import {
  type DomainTask,
  domainTaskSchema,
  type UpdateTaskModel,
} from '@/features/todolists/api/tasksApi.types.ts';

import type { RootState } from '@/app/store.ts';
import { ResultCode } from '@/common/enums/enums.ts';
import { clearDataAC } from '@/common/actions';
import type { RequestStatus } from '@/common/types/types.ts';

const toDomainTask = (task: DomainTask): DomainTask => ({
  ...task,
  entityStatus: 'idle',
});

const setTaskEntityStatus = (
  state: TasksState,
  payload: { todolistId: string; taskId: string },
  entityStatus: RequestStatus,
) => {
  const task = state[payload.todolistId]?.find(
    item => item.id === payload.taskId,
  );
  if (task) {
    task.entityStatus = entityStatus;
  }
};

export const tasksSlice = createAppSlice({
  name: 'tasks',
  initialState: {} as TasksState,
  reducers: create => ({
    fetchTasksTC: create.asyncThunk(
      async (todolistId: string, { dispatch, rejectWithValue }) => {
        try {
          dispatch(startAppLoadingAC());
          const res = await tasksApi.getTasks(todolistId);
          const tasks = domainTaskSchema.array().parse(res.data.items);
          dispatch(finishAppLoadingAC());
          return { todolistId, tasks };
        } catch (error: any) {
          handleServerNetworkError(dispatch, error);
          return rejectWithValue(null);
        }
      },
      {
        fulfilled: (state, action) => {
          state[action.payload.todolistId] =
            action.payload.tasks.map(toDomainTask);
        },
        rejected: (state, action) => {
          state[action.meta.arg] ??= [];
        },
      },
    ),
    createTaskTC: create.asyncThunk(
      async (
        payload: { todolistId: string; title: string },
        { dispatch, rejectWithValue },
      ) => {
        try {
          dispatch(startAppLoadingAC());
          dispatch(
            changeTodolistStatusAC({
              id: payload.todolistId,
              entityStatus: 'loading',
            }),
          );
          const res = await tasksApi.createTask(payload);
          if (res.data.resultCode === ResultCode.Success) {
            dispatch(
              changeTodolistStatusAC({
                id: payload.todolistId,
                entityStatus: 'idle',
              }),
            );
            dispatch(finishAppLoadingAC());
            return { task: toDomainTask(res.data.data.item) };
          } else {
            handleServerAppError(res.data, dispatch);
            dispatch(
              changeTodolistStatusAC({
                id: payload.todolistId,
                entityStatus: 'idle',
              }),
            );
            return rejectWithValue(null);
          }
        } catch (error: any) {
          handleServerNetworkError(dispatch, error);
          dispatch(
            changeTodolistStatusAC({
              id: payload.todolistId,
              entityStatus: 'idle',
            }),
          );
          return rejectWithValue(null);
        }
      },
      {
        fulfilled: (state, action) => {
          const todolistTasks = state[action.payload.task.todoListId] ?? [];
          todolistTasks.unshift(action.payload.task);
          state[action.payload.task.todoListId] = todolistTasks;
        },
      },
    ),
    deleteTaskTC: create.asyncThunk(
      async (
        payload: { todolistId: string; taskId: string },
        { dispatch, rejectWithValue },
      ) => {
        try {
          dispatch(startAppLoadingAC());
          const res = await tasksApi.deleteTask(payload);
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
        pending: (state, action) => {
          setTaskEntityStatus(state, action.meta.arg, 'loading');
        },
        fulfilled: (state, action) => {
          const tasks = state[action.payload.todolistId];
          if (!tasks) {
            return;
          }

          const index = tasks.findIndex(
            task => task.id === action.payload.taskId,
          );
          if (index !== -1) {
            tasks.splice(index, 1);
          }
        },
        rejected: (state, action) => {
          setTaskEntityStatus(state, action.meta.arg, 'idle');
        },
      },
    ),
    updateTaskTC: create.asyncThunk(
      async (
        payload: {
          todolistId: string;
          taskId: string;
          domainModel: Partial<UpdateTaskModel>;
        },
        { dispatch, rejectWithValue, getState },
      ) => {
        const { todolistId, taskId, domainModel } = payload;

        const allTodolistTasks =
          (getState() as RootState).tasks[payload.todolistId] ?? [];
        const task = allTodolistTasks.find(task => task.id === payload.taskId);

        if (!task) {
          return rejectWithValue(null);
        }

        const model: UpdateTaskModel = {
          description: task.description,
          title: task.title,
          priority: task.priority,
          startDate: task.startDate,
          deadline: task.deadline,
          status: task.status,
          ...domainModel,
        };

        try {
          dispatch(startAppLoadingAC());
          const res = await tasksApi.updateTask({ todolistId, taskId, model });
          if (res.data.resultCode === ResultCode.Success) {
            dispatch(finishAppLoadingAC());
            return { task: res.data.data.item };
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
        pending: (state, action) => {
          setTaskEntityStatus(state, action.meta.arg, 'loading');
        },
        fulfilled: (state, action) => {
          const allTodolistTasks = state[action.payload.task.todoListId];
          if (!allTodolistTasks) {
            return;
          }

          const taskIndex = allTodolistTasks.findIndex(
            task => task.id === action.payload.task.id,
          );
          if (taskIndex !== -1) {
            allTodolistTasks[taskIndex] = toDomainTask(action.payload.task);
          }
        },
        rejected: (state, action) => {
          setTaskEntityStatus(state, action.meta.arg, 'idle');
        },
      },
    ),
  }),
  extraReducers: builder => {
    builder
      .addCase(createTodolistTC.fulfilled, (state, action) => {
        state[action.payload.todolist.id] = [];
      })
      .addCase(deleteTodolistTC.fulfilled, (state, action) => {
        delete state[action.payload.id];
      })
      .addCase(clearDataAC, () => {
        return {};
      });
  },
  selectors: {
    selectTasks: state => state,
  },
});
export const { deleteTaskTC, updateTaskTC, createTaskTC, fetchTasksTC } =
  tasksSlice.actions;
export const tasksReducer = tasksSlice.reducer;
export const { selectTasks } = tasksSlice.selectors;
export type TasksState = Record<string, DomainTask[]>;
