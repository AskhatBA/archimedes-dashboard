import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosInstance } from '@/api';
import { useAuthStore } from '@/shared/lib';
import type { AdminLoginResponse, AdminLoginValues } from '../types';
import { ADMIN_SESSION_QUERY_KEY } from './use-admin-session';

export const useAdminLogin = () => {
  const setSession = useAuthStore((s) => s.setSession);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: AdminLoginValues) => {
      const { data } = await axiosInstance.post<AdminLoginResponse>(
        '/auth/admin/login',
        { email: values.email.trim(), password: values.password },
      );

      return data;
    },
    onSuccess: ({ accessToken, refreshToken, user }) => {
      setSession({ accessToken, refreshToken, user });
      // Seed the session probe with the user we just got, so landing on the
      // dashboard does not flash a "checking session" screen.
      queryClient.setQueryData(ADMIN_SESSION_QUERY_KEY, user);
    },
  });
};
