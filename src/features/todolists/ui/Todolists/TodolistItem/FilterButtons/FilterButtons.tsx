import Button from '@mui/material/Button';
import { useAppDispatch } from '@/common/hooks/useAppDispatch.ts';
import type {
  DomainTodolist,
  FilterValue,
} from '@/features/todolists/api/todolistsApi.types.ts';
import { changeTodolistFilterAC } from '@/features/todolists/model/todolists-slice.ts';
import styles from './FilterButtons.module.css';

type Props = {
  todolist: DomainTodolist;
};

export const FilterButtons = ({ todolist }: Props) => {
  const { id, filter } = todolist;
  const dispatch = useAppDispatch();
  const disabled = todolist.entityStatus === 'loading';

  const changeFilter = (nextFilter: FilterValue) => {
    dispatch(changeTodolistFilterAC({ id, filter: nextFilter }));
  };

  return (
    <div className={styles.segmented} role="group" aria-label="Task filter">
      <Button
        className={`${styles.segmentButton} ${filter === 'all' ? styles.active : ''}`}
        onClick={() => changeFilter('all')}
        aria-pressed={filter === 'all'}
        disabled={disabled}
      >
        All
      </Button>
      <Button
        className={`${styles.segmentButton} ${filter === 'active' ? styles.active : ''}`}
        onClick={() => changeFilter('active')}
        aria-pressed={filter === 'active'}
        disabled={disabled}
      >
        Active
      </Button>
      <Button
        className={`${styles.segmentButton} ${filter === 'completed' ? styles.active : ''}`}
        onClick={() => changeFilter('completed')}
        aria-pressed={filter === 'completed'}
        disabled={disabled}
      >
        Completed
      </Button>
    </div>
  );
};
