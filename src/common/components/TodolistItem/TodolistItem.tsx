import { CreateItemForm } from '../CreateItemForm/CreateItemForm.tsx';
import Button from '@mui/material/Button';
import { Box } from '@mui/material';
import { containerSX } from '@/styles/TodolistItem.styles.ts';
import {
  changeTodolistFilterAC,
  type FilterValue,
  type Todolist,
} from '@/model/todolists-reducer.ts';

import { useAppDispatch } from '@/common/hooks/useAppDispatch.ts';
import { createTaskAC } from '@/model/tasks-reducer.ts';
import { TodolistTitle } from '@/TodolistTitle.tsx';
import { Tasks } from '@/Tasks.tsx';

export type Props = {
  todolist: Todolist;
};

export const TodolistItem = ({ todolist }: Props) => {
  const { id, filter } = todolist;
  const dispatch = useAppDispatch();
  const createTask = (title: string) => {
    dispatch(createTaskAC({ id, title }));
  };

  const changeFilter = (filter: FilterValue) => {
    dispatch(changeTodolistFilterAC({ id, filter }));
  };

  return (
    <div>
      <TodolistTitle todolist={todolist} />
      <CreateItemForm onCreateItem={createTask} />
      <Tasks todolist={todolist} />
      <Box sx={containerSX}>
        <Button
          variant={filter === 'all' ? 'outlined' : 'text'}
          color={'inherit'}
          onClick={() => changeFilter('all')}
        >
          ALL
        </Button>
        <Button
          variant={filter === 'active' ? 'outlined' : 'text'}
          color={'primary'}
          onClick={() => changeFilter('active')}
        >
          ACTIVE
        </Button>
        <Button
          variant={filter === 'completed' ? 'outlined' : 'text'}
          color={'secondary'}
          onClick={() => changeFilter('completed')}
        >
          COMPLETED
        </Button>
      </Box>
    </div>
  );
};
