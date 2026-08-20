import axios from 'axios';
import { env } from '@/shared/config';
import { useAuthStore } from '@/shared/lib';

export const axiosInstance = axios.create({
  baseURL: `${env.apiBaseUrl}/v1/api`,
  headers: { 'Content-Type': 'application/json' },
});

// The token lives in the persisted auth store — reading it here (rather than from a
// separate localStorage key) keeps the header in sync with whatever `Protected` gates on.
axiosInstance.interceptors.request.use((config) => {
  const { token } = useAuthStore.getState();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
