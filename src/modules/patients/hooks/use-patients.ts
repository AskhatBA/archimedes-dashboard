import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { axiosInstance } from '@/api';
import type { PatientFilters, PatientListResponse } from '../types';

/**
 * Reads the admin-wide patient listing. The endpoint is role-gated on the backend, so a
 * non-admin token gets a 403 here — which the axios interceptor turns into a logout.
 */
export const usePatients = (filters: PatientFilters) =>
  useQuery({
    queryKey: ['patients', filters],
    queryFn: async () => {
      const { data } = await axiosInstance.get<PatientListResponse>(
        '/patient/admin/patients',
        {
          params: {
            page: filters.page,
            limit: filters.limit,
            ...(filters.search ? { search: filters.search } : {}),
            ...(filters.gender ? { gender: filters.gender } : {}),
          },
        },
      );

      return data;
    },
    // Without this the table empties out on every page/filter change and the layout
    // jumps; keeping the previous page visible makes paging feel instant.
    placeholderData: keepPreviousData,
  });
