import './App.css';
import type { Task } from './TodolistItem';
import { TodolistItem } from './TodolistItem';
import { useState } from 'react';
import { v1 } from 'uuid';
import { CreateItemForm } from './CreateItemForm.tsx';

export type FilterValue = 'all' | 'active' | 'completed';
export type Todolist = {
  id: string;
  title: string;
  filter: FilterValue;
};
export type TasksState = {
  [key: string]: Task[];
};
export const App = () => {
  const todolistId1 = v1();
  const todolistId2 = v1();
  const [todolists, setTodolists] = useState<Todolist[]>([
    {
      id: todolistId1,
      title: 'What to learn',
      filter: 'all',
    },
    {
      id: todolistId2,
      title: 'What to buy',
      filter: 'all',
    },
  ]);
  const date = new Date().getMilliseconds();

  const [tasks, setTasks] = useState<TasksState>({
    [todolistId1]: [
      { id: v1(), title: 'HTML&CSS', isDone: true },
      { id: v1(), title: 'JS', isDone: true },
      { id: v1(), title: 'ReactJS', isDone: false },
    ],
    [todolistId2]: [
      { id: v1(), title: 'Rest API', isDone: true },
      { id: v1(), title: 'GraphQL', isDone: true },
    ],
  });

  const deleteTask = (todolistsId: string, taskId: string) => {
    setTasks({ ...tasks, [todolistsId]: tasks[todolistsId].filter(task => task.id !== taskId) });
  };

  const changeFilter = (todolistId: string, filter: FilterValue) => {
    setTodolists(
      todolists.map(todolist => (todolist.id === todolistId ? { ...todolist, filter } : todolist)),
    );
  };

  const createTask = (todolistId: string, titleTask: string) => {
    const newTask = { id: v1().toString(), title: titleTask, isDone: false };
    setTasks({ ...tasks, [todolistId]: [newTask, ...tasks[todolistId]] });
  };

  const changeTaskStatus = (todolistId: string, taskId: string, isDone: boolean) => {
    setTasks({
      ...tasks,
      [todolistId]: tasks[todolistId].map(task =>
        task.id === taskId ? { ...task, isDone } : task,
      ),
    });
  };

  const deleteTodolist = (todolistId: string) => {
    setTodolists(todolists.filter(todolist => todolist.id !== todolistId));
    delete tasks[todolistId];
    setTasks({ ...tasks });
  };

  const createTodolist = (title: string) => {
    const todolistId = v1();
    const newTodolist: Todolist = { id: todolistId, title, filter: 'all' };
    setTodolists([...todolists, newTodolist]);
    setTasks({ ...tasks, [todolistId]: [] });
  };

  return (
    <div className="app">
      <CreateItemForm onCreateItem={createTodolist} />
      {todolists.map(todolist => {
        let filteredTask = tasks[todolist.id];
        if (todolist.filter === 'active') {
          filteredTask = tasks[todolist.id].filter(tasks => !tasks.isDone);
        }
        if (todolist.filter === 'completed') {
          filteredTask = tasks[todolist.id].filter(tasks => tasks.isDone);
        }
        return (
          <TodolistItem
            key={todolist.id}
            todolist={todolist}
            tasks={filteredTask}
            date={date}
            deleteTask={deleteTask}
            changeFilter={changeFilter}
            createTask={createTask}
            changeTaskStatus={changeTaskStatus}
            deleteTodolist={deleteTodolist}
          />
        );
      })}
    </div>
  );
};
