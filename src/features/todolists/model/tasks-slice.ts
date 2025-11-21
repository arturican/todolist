import {
  createTodolistTC,
  deleteTodolistTC,
} from '@/features/todolists/model/todolists-slice.ts';
import { createAppSlice } from '@/common/utils';
import { tasksApi } from '@/features/todolists/api/tasksApi.ts';
import type {
  DomainTask,
  UpdateTaskModel,
} from '@/features/todolists/api/tasksApi.types.ts';
import { TaskStatus } from '@/common/enums/enums.ts';
import type { RootState } from '@/app/store.ts';
import { setAppStatusAC } from '@/app/app-slice.ts';

export type TasksState = {
  [key: string]: DomainTask[];
};

export const tasksSlice = createAppSlice({
  name: 'tasks',
  initialState: {} as TasksState,
  reducers: create => ({
    fetchTasksTC: create.asyncThunk(
      async (todolistId: string, { dispatch, rejectWithValue }) => {
        try {
          dispatch(setAppStatusAC({ status: 'loading' }));
          const res = await tasksApi.getTasks(todolistId);
          dispatch(setAppStatusAC({ status: 'succeeded' }));
          return { todolistId, tasks: res.data.items };
        } catch (error) {
          dispatch(setAppStatusAC({ status: 'failed' }));
          return rejectWithValue(error);
        }
      },
      {
        fulfilled: (state, action) => {
          state[action.payload.todolistId] = action.payload.tasks;
        },
      },
    ),
    createTaskTC: create.asyncThunk(
      async (
        payload: { todolistId: string; title: string },
        { dispatch, rejectWithValue },
      ) => {
        try {
          dispatch(setAppStatusAC({ status: 'loading' }));
          const res = await tasksApi.createTask(payload);
          dispatch(setAppStatusAC({ status: 'succeeded' }));
          return { task: res.data.data.item };
        } catch (error) {
          dispatch(setAppStatusAC({ status: 'failed' }));
          return rejectWithValue(error);
        }
      },
      {
        fulfilled: (state, action) => {
          state[action.payload.task.todoListId].unshift(action.payload.task);
        },
      },
    ),

    deleteTaskTC: create.asyncThunk(
      async (payload: { todolistId: string; taskId: string }, thunkAPI) => {
        try {
          await tasksApi.deleteTask(payload);
          return payload;
        } catch (error) {
          return thunkAPI.rejectWithValue(error);
        }
      },
      {
        fulfilled: (state, action) => {
          const tasks = state[action.payload.todolistId];
          const index = tasks.findIndex(
            task => task.id === action.payload.taskId,
          );
          if (index !== -1) {
            tasks.splice(index, 1);
          }
        },
      },
    ),
    updateTaskTC: create.asyncThunk(
      async (
        payload: { todolistId: string; taskId: string; status: TaskStatus },
        { dispatch, rejectWithValue, getState },
      ) => {
        const { todolistId, taskId, status } = payload;

        const allTodolistTasks = (getState() as RootState).tasks[todolistId];
        const task = allTodolistTasks.find(task => task.id === taskId);

        if (!task) {
          return rejectWithValue(null);
        }

        const model: UpdateTaskModel = {
          description: task.description,
          title: task.title,
          priority: task.priority,
          startDate: task.startDate,
          deadline: task.deadline,
          status,
        };

        try {
          dispatch(setAppStatusAC({ status: 'loading' }));
          const res = await tasksApi.updateTask({ todolistId, taskId, model });
          dispatch(setAppStatusAC({ status: 'succeeded' }));
          return { task: res.data.data.item };
        } catch (error) {
          dispatch(setAppStatusAC({ status: 'failed' }));
          return rejectWithValue(error);
        }
      },
      {
        fulfilled: (state, action) => {
          const task = state[action.payload.task.todoListId].find(
            task => task.id === action.payload.task.id,
          );
          if (task) {
            task.status = action.payload.task.status;
          }
        },
      },
    ),
    changeTaskTitleAC: create.reducer<{
      todolistId: string;
      taskId: string;
      title: string;
    }>((state, action) => {
      const task = state[action.payload.todolistId].find(
        task => task.id === action.payload.taskId,
      );
      if (task) {
        task.title = action.payload.title;
      }
    }),
  }),
  extraReducers: builder => {
    builder
      .addCase(createTodolistTC.fulfilled, (state, action) => {
        console.log(action.payload.todolist.id);
        state[action.payload.todolist.id] = [];
      })
      .addCase(deleteTodolistTC.fulfilled, (state, action) => {
        delete state[action.payload.id];
      });
  },
  selectors: {
    selectTasks: state => state,
  },
});
export const {
  deleteTaskTC,
  updateTaskTC,
  changeTaskTitleAC,
  createTaskTC,
  fetchTasksTC,
} = tasksSlice.actions;
export const tasksReducer = tasksSlice.reducer;
export const { selectTasks } = tasksSlice.selectors;
