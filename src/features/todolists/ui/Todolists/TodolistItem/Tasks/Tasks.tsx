import CircularProgress from '@mui/material/CircularProgress';
import List from '@mui/material/List';
import { useEffect } from 'react';
import { useAppDispatch } from '@/common/hooks/useAppDispatch.ts';
import { useAppSelector } from '@/common/hooks/useAppSelector.ts';
import { TaskStatus } from '@/common/enums/enums.ts';
import type { DomainTodolist } from '@/features/todolists/api/todolistsApi.types.ts';
import type { DomainTask } from '@/features/todolists/api/tasksApi.types.ts';
import {
  fetchTasksTC,
  selectTasks,
} from '@/features/todolists/model/tasks-slice.ts';
import { TaskItem } from '@/features/todolists/ui/Todolists/TodolistItem/Tasks/TaskItem/TaskItem.tsx';
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
  }, [dispatch, id]);

  const todolistTasks = tasks[id];
  const isLoading = todolistTasks === undefined;
  const resolvedTasks = todolistTasks ?? [];

  let filteredTasks = resolvedTasks;
  if (filter === 'active') {
    filteredTasks = resolvedTasks.filter(task => task.status === TaskStatus.New);
  }
  if (filter === 'completed') {
    filteredTasks = resolvedTasks.filter(
      task => task.status === TaskStatus.Completed,
    );
  }

  if (isLoading) {
    return (
      <div
        className={styles.panel}
        data-testid="task-list-panel"
        data-todolist-id={id}
        data-task-count={0}
      >
        <div className={styles.status}>
          <CircularProgress size={22} thickness={4} />
          <span className={styles.empty}>Loading tasks...</span>
        </div>
      </div>
    );
  }

  if (filteredTasks.length === 0) {
    return (
      <div
        className={styles.panel}
        data-testid="task-list-panel"
        data-todolist-id={id}
        data-task-count={0}
      >
        <span className={styles.empty}>Task list is empty</span>
      </div>
    );
  }

  return (
    <div
      className={styles.panel}
      data-testid="task-list-panel"
      data-todolist-id={id}
      data-task-count={filteredTasks.length}
    >
      <List className={styles.list}>
        {filteredTasks.map((task: DomainTask) => (
          <TaskItem key={task.id} task={task} todolist={todolist} />
        ))}
      </List>
    </div>
  );
};
