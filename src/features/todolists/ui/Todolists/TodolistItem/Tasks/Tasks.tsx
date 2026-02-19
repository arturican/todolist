import { useAppSelector } from '@/common/hooks/useAppSelector.ts';
import { TaskItem } from '@/features/todolists/ui/Todolists/TodolistItem/Tasks/TaskItem/TaskItem.tsx';
import List from '@mui/material/List';
import {
  fetchTasksTC,
  selectTasks,
} from '@/features/todolists/model/tasks-slice.ts';
import type { DomainTodolist } from '@/features/todolists/api/todolistsApi.types.ts';
import type { DomainTask } from '@/features/todolists/api/tasksApi.types.ts';
import { TaskStatus } from '@/common/enums/enums.ts';
import { useAppDispatch } from '@/common/hooks/useAppDispatch.ts';
import { useEffect } from 'react';
import styles from './Tasks.module.css';

type Props = {
  todolist: DomainTodolist;
};

export const Tasks = ({ todolist }: Props) => {
  const { id, filter } = todolist;
  const tasks = useAppSelector(selectTasks);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchTasksTC(id));
  }, []);

  const todolistTasks = tasks[id] ?? [];
  let filteredTasks = todolistTasks;
  if (filter === 'active') {
    filteredTasks = todolistTasks.filter(
      task => task.status === TaskStatus.New,
    );
  }
  if (filter === 'completed') {
    filteredTasks = todolistTasks.filter(
      task => task.status === TaskStatus.Completed,
    );
  }

  if (filteredTasks.length === 0) {
    return <span className={styles.empty}>Task list is empty</span>;
  }

  return (
    <List className={styles.list}>
      {filteredTasks.map((task: DomainTask) => (
        <TaskItem key={task.id} task={task} todolist={todolist} />
      ))}
    </List>
  );
};
