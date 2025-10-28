import { useAppSelector } from '@/common/hooks/useAppSelector.ts';
import { selectTasks } from '@/model/tasks-selectors.ts';
import type { Todolist } from '@/model/todolists-reducer.ts';
import { TaskItem } from '@/TaskItem.tsx';
import List from '@mui/material/List';

export type TaskType = {
  id: string;
  title: string;
  isDone: boolean;
};
type Props = {
  todolist: Todolist;
};

export const Task = ({ todolist }: Props) => {
  const { id, filter } = todolist;
  const tasks = useAppSelector(selectTasks);
  const todolistTasks = tasks[id];
  let filteredTasks = todolistTasks;
  if (filter === 'active') {
    filteredTasks = todolistTasks.filter((tasks: { isDone: boolean }) => !tasks.isDone);
  }
  if (filter === 'completed') {
    filteredTasks = todolistTasks.filter((tasks: { isDone: boolean }) => tasks.isDone);
  }

  return (
    <>
      {filteredTasks.length === 0 ? (
        <span>{'Список задач пуст'}</span>
      ) : (
        <List>
          {filteredTasks.map((task: TaskType) => (
            <TaskItem key={task.id} task={task} todolistId={id} />
          ))}
        </List>
      )}
    </>
  );
};
