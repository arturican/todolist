import Button from '@mui/material/Button';
import { Box } from '@mui/material';
import {
  changeTodolistFilterAC,
  type FilterValue,
  type Todolist,
} from '@/features/todolists/model/todolists-slice.ts';
import { useAppDispatch } from '@/common/hooks/useAppDispatch.ts';
import { containerSX } from '@/common/styles/container.styles.ts';

type Props = {
  todolist: Todolist;
};
export const FilterButtons = ({ todolist }: Props) => {
  const { id, filter } = todolist;
  const dispatch = useAppDispatch();
  const changeFilter = (filter: FilterValue) => {
    dispatch(changeTodolistFilterAC({ id, filter }));
  };
  return (
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
  );
};
