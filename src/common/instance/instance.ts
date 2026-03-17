import axios from 'axios';
import { getAuthToken } from '@/common/utils';

const baseURL = import.meta.env.VITE_API_URL || '/api';

export const instance = axios.create({
  baseURL: baseURL,
});

instance.interceptors.request.use(function (config) {
  const token = getAuthToken();
  const headers = config.headers ?? {};

  if (token) {
    (headers as Record<string, string>).Authorization = `Bearer ${token}`;
  } else {
    delete (headers as Record<string, string>).Authorization;
  }

  config.headers = headers;
  return config;
});
