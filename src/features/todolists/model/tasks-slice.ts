import {
  createTodolistTC,
  deleteTodolistTC,
} from '@/features/todolists/model/todolists-slice.ts';
import { createAppSlice } from '@/common/utils';
import { tasksApi } from '@/features/todolists/api/tasksApi.ts';
import type { DomainTask } from '@/features/todolists/api/tasksApi.types.ts';
import { TaskStatus } from '@/common/enums/enums.ts';

export type TasksState = {
  [key: string]: DomainTask[];
};

export const tasksSlice = createAppSlice({
  name: 'tasks',
  initialState: {} as TasksState,
  reducers: create => ({
    fetchTasksTC: create.asyncThunk(
      async (todolistId: string, thunkAPI) => {
        try {
          const res = await tasksApi.getTasks(todolistId);
          return { todolistId, tasks: res.data.items };
        } catch (error) {
          return thunkAPI.rejectWithValue(error);
        }
      },
      {
        fulfilled: (state, action) => {
          state[action.payload.todolistId] = action.payload.tasks;
        },
      },
    ),
    createTaskTC: create.asyncThunk(
      async (payload: { todolistId: string; title: string }, thunkAPI) => {
        try {
          const res = await tasksApi.createTask(payload);
          return { task: res.data.data.item };
        } catch (error) {
          return thunkAPI.rejectWithValue(error);
        }
      },
      {
        fulfilled: (state, action) => {
          state[action.payload.task.todoListId].unshift(action.payload.task);
        },
      },
    ),

    deleteTaskAC: create.reducer<{ todolistId: string; taskId: string }>(
      (state, action) => {
        const task = state[action.payload.todolistId];
        const index = task.findIndex(task => task.id === action.payload.taskId);
        if (index !== -1) {
          task.splice(index, 1);
        }
      },
    ),
    changeTaskStatusAC: create.reducer<{
      todolistId: string;
      taskId: string;
      isDone: boolean;
    }>((state, action) => {
      const task = state[action.payload.todolistId].find(
        task => task.id === action.payload.taskId,
      );
      if (task) {
        task.status = action.payload.isDone
          ? TaskStatus.Completed
          : TaskStatus.New;
      }
    }),
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
  deleteTaskAC,
  changeTaskStatusAC,
  changeTaskTitleAC,
  createTaskTC,
  fetchTasksTC,
} = tasksSlice.actions;
export const tasksReducer = tasksSlice.reducer;
export const { selectTasks } = tasksSlice.selectors;
