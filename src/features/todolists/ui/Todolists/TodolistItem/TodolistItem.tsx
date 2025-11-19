import { CreateItemForm } from '@/common/components';
import { useAppDispatch } from '@/common/hooks/useAppDispatch.ts';
import { createTaskAC } from '@/features/todolists/model/tasks-slice.ts';
import { TodolistTitle } from '@/features/todolists/ui/Todolists/TodolistItem/TodolistTitle/TodolistTitle.tsx';
import { Task } from '@/features/todolists/ui/Todolists/TodolistItem/Tasks/Task.tsx';
import type { Todolist } from '@/features/todolists/model/todolists-slice.ts';
import { FilterButtons } from '@/features/todolists/ui/Todolists/TodolistItem/FilterButtons/FilterButtons.tsx';

type Props = {
  todolist: Todolist;
};

export const TodolistItem = ({ todolist }: Props) => {
  const { id: todolistId } = todolist;
  const dispatch = useAppDispatch();
  const createTask = (title: string) => {
    dispatch(createTaskAC({ todolistId, title }));
  };
  return (
    <div>
      <TodolistTitle todolist={todolist} />
      <CreateItemForm onCreateItem={createTask} />
      <Task todolist={todolist} />
      <FilterButtons todolist={todolist} />
    </div>
  );
};
