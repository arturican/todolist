import './App.css';
import { TodolistItem } from './TodolistItem.tsx';

export const App = () => {
  var date = new Date().getMilliseconds();
  const tasks1 = [
    { id: 1, title: 'HTML&CSS', isDone: true },
    { id: 2, title: 'JS', isDone: true },
    { id: 3, title: 'ReactJS', isDone: false },
  ];

  const tasks2 = [
    { id: 1, title: 'Hello world', isDone: false },
    { id: 2, title: 'I am Happy', isDone: false },
    { id: 3, title: 'Yo', isDone: false },
  ];
  return (
    <div className="app">
      <TodolistItem title={'What to learn'} tasks={tasks1} date={date} />
      <TodolistItem title={'Song'} tasks={tasks2} />
    </div>
  );
};
