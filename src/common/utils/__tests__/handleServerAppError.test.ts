import { afterEach, expect, test, vi } from 'vitest';
import { clearDataAC } from '@/common/actions';
import { setAppErrorAC, setAppStatusAC } from '@/app/app-slice.ts';
import { ResultCode } from '@/common/enums/enums.ts';
import { handleServerAppError } from '../handleServerAppError.ts';

const createLocalStorageMock = () => {
  const storage = new Map<string, string>();

  return {
    getItem: (key: string) => {
      return storage.get(key) ?? null;
    },
    setItem: (key: string, value: string) => {
      storage.set(key, value);
    },
    removeItem: (key: string) => {
      storage.delete(key);
    },
  };
};

afterEach(() => {
  vi.unstubAllGlobals();
});

test('unauthorized server response should clear session and show auth message', () => {
  const localStorageMock = createLocalStorageMock();
  localStorageMock.setItem('token', 'expired-token');
  vi.stubGlobal('window', { localStorage: localStorageMock });
  const dispatch = vi.fn();

  handleServerAppError(
    {
      data: {},
      resultCode: ResultCode.Error,
      messages: ['You are not authorized'],
      fieldsErrors: [],
    },
    dispatch,
  );

  expect(localStorageMock.getItem('token')).toBeNull();
  expect(dispatch).toHaveBeenNthCalledWith(1, clearDataAC());
  expect(dispatch).toHaveBeenNthCalledWith(
    2,
    setAppErrorAC({ error: 'Session expired. Please sign in again.' }),
  );
  expect(dispatch).toHaveBeenNthCalledWith(
    3,
    setAppStatusAC({ status: 'failed' }),
  );
});
