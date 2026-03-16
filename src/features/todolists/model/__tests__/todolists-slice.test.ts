import { nanoid } from '@reduxjs/toolkit';
import { beforeEach, expect, test } from 'vitest';
import {
  changeTodolistFilterAC,
  changeTodolistTitleTC,
  createTodolistTC,
  deleteTodolistTC,
  todolistsReducer,
} from '../todolists-slice';
import type { DomainTodolist } from '@/features/todolists/api/todolistsApi.types.ts';

let todolistId1: string;
let todolistId2: string;
let startState: DomainTodolist[] = [];

beforeEach(() => {
  todolistId1 = nanoid();
  todolistId2 = nanoid();

  startState = [
    {
      id: todolistId1,
      title: 'What to learn',
      addedDate: '',
      order: 0,
      filter: 'all',
      entityStatus: 'idle',
    },
    {
      id: todolistId2,
      title: 'What to buy',
      addedDate: '',
      order: 0,
      filter: 'all',
      entityStatus: 'idle',
    },
  ];
});

test('correct todolist should be deleted', () => {
  const endState = todolistsReducer(
    startState,
    deleteTodolistTC.fulfilled({ id: todolistId1 }, 'requestId', todolistId1),
  );

  expect(endState.length).toBe(1);
  expect(endState[0].id).toBe(todolistId2);
});

test('correct todolist should be created', () => {
  const title = 'New todolist';
  const todolist = { id: 'todolistId3', title, addedDate: '', order: 0 };
  const endState = todolistsReducer(
    startState,
    createTodolistTC.fulfilled({ todolist }, 'requestId', title),
  );

  expect(endState.length).toBe(3);
  expect(endState[0].title).toBe(title);
});

test('correct todolist should change its title', () => {
  const title = 'New title';
  const endState = todolistsReducer(
    startState,
    changeTodolistTitleTC.fulfilled({ id: todolistId2, title }, 'requestId', {
      id: todolistId2,
      title,
    }),
  );

  expect(endState[0].title).toBe('What to learn');
  expect(endState[1].title).toBe(title);
  expect(endState[1].entityStatus).toBe('idle');
});

test('correct todolist should change its filter', () => {
  const filter = 'completed';
  const endState = todolistsReducer(
    startState,
    changeTodolistFilterAC({ id: todolistId2, filter }),
  );

  expect(endState[0].filter).toBe('all');
  expect(endState[1].filter).toBe(filter);
});

test('todolist should enter loading state while its title is updating', () => {
  const endState = todolistsReducer(
    startState,
    changeTodolistTitleTC.pending('requestId', {
      id: todolistId2,
      title: 'New title',
    }),
  );

  expect(endState[0].entityStatus).toBe('idle');
  expect(endState[1].entityStatus).toBe('loading');
});

test('failed todolist update should restore list interaction', () => {
  const pendingState = todolistsReducer(
    startState,
    changeTodolistTitleTC.pending('requestId', {
      id: todolistId2,
      title: 'New title',
    }),
  );
  const endState = todolistsReducer(
    pendingState,
    changeTodolistTitleTC.rejected(null, 'requestId', {
      id: todolistId2,
      title: 'New title',
    }),
  );

  expect(endState[1].entityStatus).toBe('idle');
});
