import List from '@mui/material/List';
import { useAppSelector } from '@/common/hooks/useAppSelector.ts';
import { selectTasks } from '@/model/tasks-selectors.ts';
import type { Todolist } from '@/model/todolists-reducer.ts';
import { TasksItem } from '@/TaskItem.tsx';

export type Task = {
  id: string;
  title: string;
  isDone: boolean;
};
type Props = {
  todolist: Todolist;
};

export const Tasks = ({ todolist }: Props) => {
  const { id, filter } = todolist;
  const tasks = useAppSelector(selectTasks);
  const todolistTasks = tasks[id];
  let filteredTask = todolistTasks;
  if (filter === 'active') {
    filteredTask = todolistTasks.filter((tasks: { isDone: boolean }) => !tasks.isDone);
  }
  if (filter === 'completed') {
    filteredTask = todolistTasks.filter((tasks: { isDone: boolean }) => tasks.isDone);
  }
  return (
    <List>
      {filteredTask.length === 0 ? (
        <span>{'Список задач пуст'}</span>
      ) : (
        filteredTask.map((task: Task) => {
          <TasksItem key={task.id} task={task} todolistId={id} />;
        })
      )}
    </List>
  );
};
