import { CreateItemForm } from '../../../../../common/components/CreateItemForm/CreateItemForm.tsx';
import { useAppDispatch } from '@/common/hooks/useAppDispatch.ts';
import { createTaskAC } from '@/features/todolists/model/tasks-reducer.ts';
import { TodolistTitle } from '@/features/todolists/ui/Todolists/TodolistItem/TodolistTitle/TodolistTitle.tsx';
import { Task } from '@/features/todolists/ui/Todolists/TodolistItem/Tasks/Task.tsx';
import type { Todolist } from '@/features/todolists/model/todolists-reducer.ts';
import { FilterButtons } from '@/features/todolists/ui/Todolists/TodolistItem/FilterButtons/FilterButtons.tsx';

type Props = {
  todolist: Todolist;
};

export const TodolistItem = ({ todolist }: Props) => {
  const { id } = todolist;
  const dispatch = useAppDispatch();
  const createTask = (title: string) => {
    dispatch(createTaskAC({ id, title }));
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
