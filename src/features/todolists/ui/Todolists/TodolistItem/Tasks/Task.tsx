import { useAppSelector } from '@/common/hooks/useAppSelector.ts';
import { TaskItem } from '@/features/todolists/ui/Todolists/TodolistItem/Tasks/TaskItem/TaskItem.tsx';
import List from '@mui/material/List';
import { selectTasks } from '@/features/todolists/model/tasks-slice.ts';
import type { DomainTodolist } from '@/features/todolists/api/todolistsApi.types.ts';

export type TaskType = {
  id: string;
  title: string;
  isDone: boolean;
};
type Props = {
  todolist: DomainTodolist;
};

export const Task = ({ todolist }: Props) => {
  const { id, filter } = todolist;
  const tasks = useAppSelector(selectTasks);
  const todolistTasks = tasks[id];
  let filteredTasks = todolistTasks;
  if (filter === 'active') {
    filteredTasks = todolistTasks.filter(
      (tasks: { isDone: boolean }) => !tasks.isDone,
    );
  }
  if (filter === 'completed') {
    filteredTasks = todolistTasks.filter(
      (tasks: { isDone: boolean }) => tasks.isDone,
    );
  }

  return (
    <>
      {filteredTasks?.length === 0 ? (
        <span>{'Список задач пуст'}</span>
      ) : (
        <List>
          {filteredTasks?.map((task: TaskType) => (
            <TaskItem key={task.id} task={task} todolistId={id} />
          ))}
        </List>
      )}
    </>
  );
};
