import axios from 'axios';

export const token = import.meta.env.VITE_API_TOKEN;
const apiKey = import.meta.env.VITE_API_KEY;
const baseURL = import.meta.env.VITE_BASE_URL;

export const instance = axios.create({
  baseURL: baseURL,
  headers: {
    'API-KEY': apiKey,
  },
});

instance.interceptors.request.use(function (config) {
  config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
  return config;
});
