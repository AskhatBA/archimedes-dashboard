import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { axiosInstance } from '@/api';
import { useAuthStore } from '@/shared/lib';
import type { AdminMeResponse } from '../types';

export const ADMIN_SESSION_QUERY_KEY = ['auth', 'admin-me'] as const;

/**
 * Asks the backend whether the stored token still belongs to an admin.
 *
 * A token sitting in localStorage only proves that *someone* signed in
 * somewhere — `/auth/admin/me` is gated on the ADMIN role, so this is what
 * keeps a patient's mobile token from opening the dashboard by being pasted
 * into storage.
 */
export const useAdminSession = () => {
  const token = useAuthStore((s) => s.token);
  const logout = useAuthStore((s) => s.logout);

  const query = useQuery({
    queryKey: ADMIN_SESSION_QUERY_KEY,
    queryFn: async () => {
      const { data } = await axiosInstance.get<AdminMeResponse>('/auth/admin/me');

      return data.user;
    },
    enabled: !!token,
    // A 401/403 is a verdict, not a hiccup — retrying only delays the redirect.
    retry: false,
  });

  // Drop a token the backend has rejected, otherwise every reload retries it.
  useEffect(() => {
    if (query.isError) {
      logout();
    }
  }, [query.isError, logout]);

  return {
    user: query.data ?? null,
    isChecking: !!token && query.isPending,
    isAuthenticated: !!token && !!query.data,
  };
};
