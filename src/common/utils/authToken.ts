const AUTH_TOKEN_STORAGE_KEY = 'token';

const getStorage = () => {
  if (typeof window === 'undefined') {
    return null;
  }

  return window.localStorage;
};

export const getAuthToken = () => {
  return getStorage()?.getItem(AUTH_TOKEN_STORAGE_KEY) ?? null;
};

export const setAuthToken = (token: string) => {
  getStorage()?.setItem(AUTH_TOKEN_STORAGE_KEY, token);
};

export const clearAuthToken = () => {
  getStorage()?.removeItem(AUTH_TOKEN_STORAGE_KEY);
};
