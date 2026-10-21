import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { axiosInstance } from '@/api';
import type { AuthAttemptFilters, AuthAttemptListResponse } from '../types';

const SUCCESS_PARAM = { all: undefined, failed: 'false', succeeded: 'true' } as const;

/**
 * Reads sign-in and registration attempts from the audit trail. The endpoint is
 * role-gated on the backend, so a non-admin token gets a 403 — which the axios
 * interceptor turns into a logout.
 */
export const useAuthAttempts = (filters: AuthAttemptFilters, enabled: boolean) =>
  useQuery({
    queryKey: ['auth-attempts', filters],
    queryFn: async () => {
      const success = SUCCESS_PARAM[filters.outcome];
      const { data } = await axiosInstance.get<AuthAttemptListResponse>(
        '/audit/admin/auth-attempts',
        {
          params: {
            page: filters.page,
            limit: filters.limit,
            ...(filters.search ? { search: filters.search } : {}),
            ...(success ? { success } : {}),
          },
        },
      );

      return data;
    },
    enabled,
    placeholderData: keepPreviousData,
  });
