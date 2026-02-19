import { TodolistItem } from '@/features/todolists/ui/Todolists/TodolistItem/TodolistItem.tsx';
import { useAppSelector } from '@/common/hooks/useAppSelector.ts';
import {
  fetchTodolistsTC,
  selectTodolists,
} from '@/features/todolists/model/todolists-slice.ts';
import { useEffect } from 'react';
import { useAppDispatch } from '@/common/hooks/useAppDispatch.ts';
import styles from './Todolists.module.css';

export const Todolists = () => {
  const todolists = useAppSelector(selectTodolists);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchTodolistsTC());
  }, []);

  return (
    <div className={styles.grid}>
      {todolists.map(todolist => (
        <article key={todolist.id} className={styles.card}>
          <TodolistItem todolist={todolist} />
        </article>
      ))}
    </div>
  );
};
