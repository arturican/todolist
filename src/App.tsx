import './App.css';
import type { Task } from './TodolistItem';
import { TodolistItem } from './TodolistItem';
import { useState } from 'react';
import { v1 } from 'uuid';

export type FilterValue = 'all' | 'active' | 'completed';
export type Todolist = {
  id: string;
  title: string;
  filters: FilterValue;
};

export const App = () => {
  const [todolists, setTodolists] = useState<Todolist[]>([
    {
      id: v1(),
      title: 'What to learn',
      filter: 'all',
    },
    {
      id: v1(),
      title: 'What to buy',
      filter: 'all',
    },
  ]);
  const date = new Date().getMilliseconds();

  const [tasks, setTasks] = useState<Task[]>([
    { id: v1(), title: 'HTML&CSS', isDone: true },
    { id: v1(), title: 'JS', isDone: true },
    { id: v1(), title: 'ReactJS', isDone: false },
  ]);

  const deleteTask = (taskId: string) => {
    const filtered = tasks.filter(task => task.id !== taskId);
    setTasks(filtered);
    console.log(filtered);
  };

  const changeFilter = (todolistId: string, filter: FilterValue) => {
    setTodolists(
      todolists.map(todolist => (todolist.id === todolistId ? { ...todolist, filter } : todolist)),
    );
  };

  const createTask = (titleTask: string) => {
    const newTask = { id: v1().toString(), title: titleTask, isDone: false };
    setTasks([newTask, ...tasks]);
  };

  const changeTaskStatus = (taskId: string, isDone: boolean) => {
    setTasks(tasks.map(task => (task.id == taskId ? { ...task, isDone } : task)));
  };

  return (
    <div className="app">
      {todolists.map(todolist => {
        let filteredTask = tasks;
        if (todolist.filter === 'active') {
          filteredTask = tasks.filter(tasks => !tasks.isDone);
        }
        if (todolist.filter === 'completed') {
          filteredTask = tasks.filter(tasks => tasks.isDone);
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
          />
        );
      })}
    </div>
  );
};
