import axios from 'axios';

const token = import.meta.env.VITE_API_TOKEN;
const apiKey = import.meta.env.VITE_API_KEY;
const baseURL = import.meta.env.VITE_BASE_URL;

export const instance = axios.create({
  baseURL: baseURL,
  headers: {
    Authorization: `Bearer ${token}`,
    'API-KEY': apiKey,
  },
});
