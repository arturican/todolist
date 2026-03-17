import { expect, test } from 'vitest';
import { clearDataAC } from '@/common/actions';
import { authReducer } from '../auth-slice.ts';

test('auth state should be reset by clearData action', () => {
  const startState = {
    name: 'admin',
    isLoggedIn: true,
  };

  const endState = authReducer(startState, clearDataAC());

  expect(endState).toEqual({
    name: '',
    isLoggedIn: false,
  });
});
