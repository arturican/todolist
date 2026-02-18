import axios from 'axios';

const baseURL =
  import.meta.env.VITE_API_URL || import.meta.env.VITE_BASE_URL || '/api';

export const instance = axios.create({
  baseURL: baseURL,
});

instance.interceptors.request.use(function (config) {
  const token = localStorage.getItem('token');
  const headers = config.headers ?? {};

  if (token) {
    (headers as Record<string, string>).Authorization = `Bearer ${token}`;
  } else {
    delete (headers as Record<string, string>).Authorization;
  }

  config.headers = headers;
  return config;
});
