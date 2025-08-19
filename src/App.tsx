import './App.css';
import type { Task } from './TodolistItem';
import { TodolistItem } from './TodolistItem';
import { useState } from 'react';
import { v1 } from 'uuid';

export type FilterValue = 'all' | 'active' | 'completed';

export const App = () => {
  const date = new Date().getMilliseconds();

  const [tasks, setTasks] = useState<Task[]>([
    { id: v1(), title: 'HTML&CSS', isDone: true },
    { id: v1(), title: 'JS', isDone: true },
    { id: v1(), title: 'ReactJS', isDone: false },
  ]);

  const [filter, setFilter] = useState<FilterValue>('all');

  let filteredTask = tasks;
  if (filter === 'active') {
    filteredTask = tasks.filter(tasks => !tasks.isDone);
  }
  if (filter === 'completed') {
    filteredTask = tasks.filter(tasks => tasks.isDone);
  }

  const deleteTask = (taskId: string) => {
    const filtered = tasks.filter(task => task.id !== taskId);
    setTasks(filtered);
    console.log(filtered);
  };

  const changeFilter = (filterValue: FilterValue) => {
    setFilter(filterValue);
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
      <TodolistItem
        title={'What to learn'}
        tasks={filteredTask}
        date={date}
        deleteTask={deleteTask}
        changeFilter={changeFilter}
        createTask={createTask}
        changeTaskStatus={changeTaskStatus}
        filter={filter}
      />
    </div>
  );
};
