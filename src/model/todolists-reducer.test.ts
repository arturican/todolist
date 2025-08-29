import { v1 } from 'uuid';
import { beforeEach, expect, test } from 'vitest';
import type { Todolist } from '../App';
import { createTodolistAC, deleteTodlistAC, todolistsReducer } from './todolists-reducer';

let todolistId1: string;
let todolistId2: string;
let startState: Todolist[] = [];

beforeEach(() => {
  todolistId1 = v1();
  todolistId2 = v1();
  startState = [
    { id: todolistId1, title: 'What to learn', filter: 'all' },
    { id: todolistId2, title: 'What to buy', filter: 'all' },
  ];
});

test('correct todolist should be deleted', () => {
  const endState = todolistsReducer(startState, deleteTodlistAC(todolistId1));
  expect(endState.length).toBe(1);
  expect(endState[0].id).toBe(todolistId2);
});

test('correct todolist should be created', () => {
  const title = 'New todolist';
  const endState = todolistsReducer(startState, createTodolistAC(title));
  expect(endState.length).toBe(3);
  expect(endState[2].title).toBe(title);
});
