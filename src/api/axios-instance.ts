import axios from 'axios';
import { env } from '@/shared/config';
import { useAuthStore } from '@/shared/lib';

const ADMIN_LOGIN_PATH = '/auth/admin/login';

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

// A 401 means the token expired or was superseded by a newer login; a 403 means the
// account is not an admin. Either way the stored session is worthless, so drop it and
// let `Protected` bounce to /sign-in instead of leaving a dead token in place.
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const isLoginAttempt = error?.config?.url === ADMIN_LOGIN_PATH;

    if (!isLoginAttempt && (status === 401 || status === 403)) {
      useAuthStore.getState().logout();
    }

    return Promise.reject(error);
  },
);
