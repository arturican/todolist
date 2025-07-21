import './App.css';
import type { Task } from './TodolistItem';
import { TodolistItem } from './TodolistItem';
import { useState } from 'react';

export const App = () => {
  const date = new Date().getMilliseconds();

  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, title: 'HTML&CSS', isDone: true },
    { id: 2, title: 'JS', isDone: true },
    { id: 3, title: 'ReactJS', isDone: false },
    { id: 33, title: 'TS', isDone: false },
  ]);

  const deleteTask = (taskId: number) => {
    const filtered = tasks.filter(task => task.id !== taskId);
    setTasks(filtered);
    console.log(filtered);
  };

  return (
    <div className="app">
      <TodolistItem title={'What to learn'} tasks={tasks} date={date} deleteTask={deleteTask} />
    </div>
  );
};
