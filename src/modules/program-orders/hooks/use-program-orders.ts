import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { axiosInstance } from '@/api';
import type {
  ProgramOrderFilters,
  ProgramOrderListResponse,
  ProgramOrderPayload,
  ProgramOrderResponse,
} from '../types';

const PROGRAM_ORDERS_KEY = ['program-orders'] as const;

const listParams = (filters: ProgramOrderFilters) => ({
  page: filters.page,
  limit: filters.limit,
  ...(filters.search ? { search: filters.search } : {}),
  ...(filters.status ? { status: filters.status } : {}),
  ...(filters.category ? { category: filters.category } : {}),
  ...(filters.dateFrom ? { dateFrom: filters.dateFrom } : {}),
  ...(filters.dateTo ? { dateTo: filters.dateTo } : {}),
});

/**
 * Reads the admin-wide listing of paid-programs orders. The endpoint is role-gated on
 * the backend, so a non-admin token gets a 403 here — which the axios interceptor turns
 * into a logout.
 */
export const useProgramOrders = (filters: ProgramOrderFilters) =>
  useQuery({
    queryKey: [...PROGRAM_ORDERS_KEY, 'list', filters],
    queryFn: async () => {
      const { data } = await axiosInstance.get<ProgramOrderListResponse>(
        '/program-orders/admin',
        { params: listParams(filters) },
      );

      return data;
    },
    // Without this the table empties out on every page/filter change and the layout
    // jumps; keeping the previous page visible makes paging feel instant.
    placeholderData: keepPreviousData,
  });

/**
 * How many orders are still waiting to be picked up, regardless of the filters on
 * screen — that is the number an operator works down, so narrowing the table must not
 * change it. Only the count is used, so the page is asked for a single row.
 */
export const useNewProgramOrdersCount = () =>
  useQuery({
    queryKey: [...PROGRAM_ORDERS_KEY, 'new-count'],
    queryFn: async () => {
      const { data } = await axiosInstance.get<ProgramOrderListResponse>(
        '/program-orders/admin',
        { params: { page: 1, limit: 1, status: 'NEW' } },
      );

      return data.total;
    },
  });

/**
 * Moves an order along or saves an operator note. Invalidates the whole `program-orders`
 * key, so both the table and the "новых" counter follow the change.
 */
export const useUpdateProgramOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: ProgramOrderPayload }) => {
      const { data } = await axiosInstance.patch<ProgramOrderResponse>(
        `/program-orders/admin/${id}`,
        payload,
      );

      return data.order;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: PROGRAM_ORDERS_KEY }),
  });
};
