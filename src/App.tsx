import './App.css';
import type { Task } from './TodolistItem';
import { TodolistItem } from './TodolistItem';
import { useState } from 'react';

export type FilterValue = 'all' | 'active' | 'completed';

export const App = () => {
  const date = new Date().getMilliseconds();

  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, title: 'HTML&CSS', isDone: true },
    { id: 2, title: 'JS', isDone: true },
    { id: 3, title: 'ReactJS', isDone: false },
  ]);

  const [filter, setFilter] = useState<FilterValue>('all');

  let filteredTask = tasks;
  if (filter === 'active') {
    filteredTask = tasks.filter(tasks => !tasks.isDone);
  }
  if (filter === 'completed') {
    filteredTask = tasks.filter(tasks => tasks.isDone);
  }

  const deleteTask = (taskId: number) => {
    const filtered = tasks.filter(task => task.id !== taskId);
    setTasks(filtered);
    console.log(filtered);
  };

  const changeFilter = (filterValue: FilterValue) => {
    setFilter(filterValue);
  };

  return (
    <div className="app">
      <TodolistItem
        title={'What to learn'}
        tasks={filteredTask}
        date={date}
        deleteTask={deleteTask}
        changeFilter={changeFilter}
      />
    </div>
  );
};
