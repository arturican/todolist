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

  const changeTodolistTitle = (title: string) => {
    dispatch(changeTodolistTitleTC({ id, title }));
  };
  return (
    <>
      <div className={styles.container}>
        <h3>
          <EditableSpan value={title} onChange={changeTodolistTitle} />
        </h3>
        <IconButton
          onClick={deleteTodolist}
          disabled={entityStatus === 'loading'}
        >
          <DeleteIcon />
        </IconButton>{' '}
      </div>
    </>
  );
};
