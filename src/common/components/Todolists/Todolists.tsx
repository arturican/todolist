import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { TodolistItem } from '@/common/components/TodolistItem.tsx';
import { useAppSelector } from '@/common/hooks/useAppSelector.ts';
import { selectTodolists } from '@/model/todolists-selectors.ts';
import {
  changeTodolistFilterAC,
  changeTodolistTitleAC,
  deleteTodolistAC,
  type FilterValue,
} from '@/model/todolists-reducer.ts';
import { selectTasks } from '@/model/tasks-selectors.ts';
import { useAppDispatch } from '@/common/hooks/useAppDispatch.ts';
import {
  changeTaskStatusAC,
  changeTaskTitleAC,
  createTaskAC,
  deleteTaskAC,
} from '@/model/tasks-reducer.ts';

export const Todolists = () => {
  const todolists = useAppSelector(selectTodolists);
  const tasks = useAppSelector(selectTasks);
  const dispatch = useAppDispatch();
  const deleteTask = (todolistId: string, taskId: string) => {
    dispatch(deleteTaskAC({ todolistId, taskId }));
  };

  const changeFilter = (id: string, filter: FilterValue) => {
    dispatch(changeTodolistFilterAC({ id, filter }));
  };

  const createTask = (todolistId: string, title: string) => {
    dispatch(createTaskAC({ todolistId, title }));
  };

  const changeTaskStatus = (todolistId: string, taskId: string, isDone: boolean) => {
    dispatch(changeTaskStatusAC({ todolistId, taskId, isDone }));
  };
  const changeTaskTitle = (todolistId: string, taskId: string, title: string) => {
    dispatch(changeTaskTitleAC({ todolistId, taskId, title }));
  };

  const deleteTodolist = (todolistId: string) => {
    dispatch(deleteTodolistAC({ id: todolistId }));
  };

  const changeTodolistTitle = (id: string, title: string) => {
    dispatch(changeTodolistTitleAC({ id, title }));
  };
  const date = new Date().getMilliseconds();
  return (
    <>
      {todolists.map(todolist => {
        let filteredTask = tasks[todolist.id] ?? [];
        if (todolist.filter === 'active') {
          filteredTask = tasks[todolist.id].filter((tasks: { isDone: boolean }) => !tasks.isDone);
        }
        if (todolist.filter === 'completed') {
          filteredTask = tasks[todolist.id].filter((tasks: { isDone: boolean }) => tasks.isDone);
        }

        return (
          <Grid key={todolist.id}>
            <Paper sx={{ p: '0 20px 20px 20px' }}>
              <TodolistItem
                todolist={todolist}
                tasks={filteredTask}
                date={date}
                deleteTask={deleteTask}
                changeFilter={changeFilter}
                createTask={createTask}
                changeTaskStatus={changeTaskStatus}
                deleteTodolist={deleteTodolist}
                changeTaskTitle={changeTaskTitle}
                changeTodolistTitle={changeTodolistTitle}
              />
            </Paper>
          </Grid>
        );
      })}
    </>
  );
};
