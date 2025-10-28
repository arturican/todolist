import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { TodolistItem } from '@/features/todolists/ui/Todolists/TodolistItem/TodolistItem.tsx';
import { useAppSelector } from '@/common/hooks/useAppSelector.ts';
import { selectTodolists } from '@/features/todolists/model/todolists-selectors.ts';
export const Todolists = () => {
  const todolists = useAppSelector(selectTodolists);

  return (
    <>
      {todolists.map(todolist => {
        return (
          <Grid key={todolist.id}>
            <Paper sx={{ p: '0 20px 20px 20px' }}>
              <TodolistItem todolist={todolist} />
            </Paper>
          </Grid>
        );
      })}
    </>
  );
};
