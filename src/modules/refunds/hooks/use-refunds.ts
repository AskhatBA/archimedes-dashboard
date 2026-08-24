import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { axiosInstance } from '@/api';
import type { RefundFilters, RefundListResponse } from '../types';

/**
 * Reads the admin-wide refund listing. The endpoint is role-gated on the backend, so a
 * non-admin token gets a 403 here — which the axios interceptor turns into a logout.
 */
export const useRefunds = (filters: RefundFilters) =>
  useQuery({
    queryKey: ['refunds', filters],
    queryFn: async () => {
      const { data } = await axiosInstance.get<RefundListResponse>(
        '/insurance/admin/refund-requests',
        {
          params: {
            page: filters.page,
            limit: filters.limit,
            ...(filters.search ? { search: filters.search } : {}),
            ...(filters.category !== null ? { category: filters.category } : {}),
            ...(filters.dateFrom ? { dateFrom: filters.dateFrom } : {}),
            ...(filters.dateTo ? { dateTo: filters.dateTo } : {}),
          },
        },
      );

      return data;
    },
    // Without this the table empties out on every page/filter change and the layout
    // jumps; keeping the previous page visible makes paging feel instant.
    placeholderData: keepPreviousData,
  });
