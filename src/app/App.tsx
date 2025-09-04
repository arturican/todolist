import './App.css';
import type { Task } from '../components/TodolistItem.tsx';
import { TodolistItem } from '../components/TodolistItem.tsx';
import { useState } from 'react';
import { CreateItemForm } from '../components/CreateItemForm.tsx';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { containerSX } from '../styles/TodolistItem.styles.ts';
import { NavButton } from '../styles/NavButton.ts';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Switch } from '@mui/material';
import {
  changeTodolistFilterAC,
  changeTodolistTitleAC,
  createTodolistAC,
  deleteTodolistAC,
} from '../model/todolists-reducer.ts';
import {
  changeTaskStatusAC,
  changeTaskTitleAC,
  createTaskAC,
  deleteTaskAC,
} from '../model/tasks-reducer.ts';
import { useAppDispatch } from '../common/hooks/useAppDispatch.ts';
import { useAppSelector } from '../common/hooks/useAppSelector.ts';
import { selectTodolists } from '../model/todolists-selectors.ts';
import { selectTasks } from '../model/tasks-selectors.ts';

export type FilterValue = 'all' | 'active' | 'completed';
export type Todolist = {
  id: string;
  title: string;
  filter: FilterValue;
};
export type TasksState = {
  [key: string]: Task[];
};
type ThemeMode = 'light' | 'dark';
export const App = () => {
  const [themeMode, setThemeMode] = useState<ThemeMode>('light');
  const theme = createTheme({
    palette: {
      mode: themeMode,
      primary: {
        main: '#087EA4',
      },
    },
  });
  const changeMode = () => {
    setThemeMode(themeMode === 'light' ? 'dark' : 'light');
  };

  const todolists = useAppSelector(selectTodolists);
  const date = new Date().getMilliseconds();

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

  const createTodolist = (title: string) => {
    dispatch(createTodolistAC(title));
  };

  const changeTodolistTitle = (id: string, title: string) => {
    dispatch(changeTodolistTitleAC({ id, title }));
  };

  return (
    <div className="app">
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppBar position="static" sx={{ mb: '30px' }}>
          <Toolbar>
            <Container maxWidth="lg" sx={containerSX}>
              <IconButton color="inherit">
                <MenuIcon />
              </IconButton>
              <div>
                <NavButton>Sign in</NavButton>
                <NavButton>Sign up</NavButton>
                <NavButton background={theme.palette.primary.dark}>Faq</NavButton>
                <Switch color={'default'} onChange={changeMode} />
              </div>
            </Container>
          </Toolbar>
        </AppBar>
        <Container maxWidth="lg">
          <Grid container sx={{ mb: '30px' }}>
            <CreateItemForm onCreateItem={createTodolist} />
          </Grid>
          <Grid container spacing={4}>
            {todolists.map(todolist => {
              let filteredTask = tasks[todolist.id] ?? [];
              if (todolist.filter === 'active') {
                filteredTask = tasks[todolist.id].filter(tasks => !tasks.isDone);
              }
              if (todolist.filter === 'completed') {
                filteredTask = tasks[todolist.id].filter(tasks => tasks.isDone);
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
          </Grid>
        </Container>
      </ThemeProvider>
    </div>
  );
};
