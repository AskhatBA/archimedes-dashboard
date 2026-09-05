import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { axiosInstance } from '@/api';
import type { TopupListParams, TopupListResponse, TopupPayload } from '../types';

const TOPUPS_KEY = ['med-account-topups'] as const;

/** Drops the empty filters so they never reach the backend as `?status=`. */
const toQuery = (params: TopupListParams) => ({
  page: params.page,
  limit: params.limit,
  ...(params.status ? { status: params.status } : {}),
  ...(params.search ? { search: params.search } : {}),
  ...(params.dateFrom ? { dateFrom: params.dateFrom } : {}),
  ...(params.dateTo ? { dateTo: params.dateTo } : {}),
});

/**
 * The operator queue of paid top-ups. Filtered and paginated server-side, so `totalAmount`
 * covers the whole filtered set rather than the visible page.
 */
export const useTopups = (params: TopupListParams) =>
  useQuery({
    queryKey: [...TOPUPS_KEY, params],
    queryFn: async () => {
      const { data } = await axiosInstance.get<TopupListResponse>(
        '/med-account/topups/admin',
        { params: toQuery(params) },
      );

      return data;
    },
  });

/**
 * Moves a top-up along, or leaves an operator note.
 *
 * Invalidates the whole `med-account-topups` key rather than one page, so the table and
 * the "ждут зачисления" counter both follow a status change.
 */
export const useUpdateTopup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: TopupPayload }) => {
      const { data } = await axiosInstance.patch<{ success: boolean }>(
        `/med-account/topups/admin/${id}`,
        payload,
      );

      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: TOPUPS_KEY }),
  });
};
