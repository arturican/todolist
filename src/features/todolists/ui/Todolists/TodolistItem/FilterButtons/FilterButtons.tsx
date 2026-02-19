import Button from '@mui/material/Button';
import { changeTodolistFilterAC } from '@/features/todolists/model/todolists-slice.ts';
import { useAppDispatch } from '@/common/hooks/useAppDispatch.ts';
import type {
  DomainTodolist,
  FilterValue,
} from '@/features/todolists/api/todolistsApi.types.ts';
import styles from './FilterButtons.module.css';

type Props = {
  todolist: DomainTodolist;
};

export const FilterButtons = ({ todolist }: Props) => {
  const { id, filter } = todolist;
  const dispatch = useAppDispatch();

  const changeFilter = (nextFilter: FilterValue) => {
    dispatch(changeTodolistFilterAC({ id, filter: nextFilter }));
  };

  return (
    <div className={styles.segmented}>
      <Button
        className={`${styles.segmentButton} ${filter === 'all' ? styles.active : ''}`}
        onClick={() => changeFilter('all')}
      >
        All
      </Button>
      <Button
        className={`${styles.segmentButton} ${filter === 'active' ? styles.active : ''}`}
        onClick={() => changeFilter('active')}
      >
        Active
      </Button>
      <Button
        className={`${styles.segmentButton} ${filter === 'completed' ? styles.active : ''}`}
        onClick={() => changeFilter('completed')}
      >
        Completed
      </Button>
    </div>
  );
};
