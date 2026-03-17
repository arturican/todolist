import {
  changeTodolistTitleTC,
  deleteTodolistTC,
} from '@/features/todolists/model/todolists-slice.ts';
import { useAppDispatch } from '@/common/hooks/useAppDispatch.ts';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import { EditableSpan } from '@/common/components/EditableSpan/EditableSpan.tsx';
import styles from './TodolistTitle.module.css';
import type { DomainTodolist } from '@/features/todolists/api/todolistsApi.types.ts';

type Props = {
  todolist: DomainTodolist;
};

export const TodolistTitle = ({ todolist }: Props) => {
  const { id, title, entityStatus } = todolist;
  const dispatch = useAppDispatch();

  const deleteTodolist = () => {
    dispatch(deleteTodolistTC(id));
  };

  const changeTodolistTitle = (newTitle: string) => {
    dispatch(changeTodolistTitleTC({ id, title: newTitle }));
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>
        <EditableSpan
          value={title}
          onChange={changeTodolistTitle}
          entityStatus={entityStatus}
        />
      </h3>
      <IconButton
        className={styles.iconButton}
        onClick={deleteTodolist}
        disabled={entityStatus === 'loading'}
        aria-label="Delete todolist"
      >
        <DeleteIcon />
      </IconButton>
    </div>
  );
};
