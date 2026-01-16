import axios from 'axios';

const apiKey = import.meta.env.VITE_API_KEY;
const baseURL = import.meta.env.VITE_BASE_URL || '/api';

export const instance = axios.create({
  baseURL: baseURL,
  headers: {
    'API-KEY': apiKey,
  },
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
