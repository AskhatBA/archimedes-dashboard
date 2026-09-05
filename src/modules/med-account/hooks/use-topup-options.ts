import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { axiosInstance } from '@/api';
import type {
  TopupOption,
  TopupOptionListResponse,
  TopupOptionPayload,
  TopupOptionResponse,
} from '../types';

const OPTIONS_KEY = ['med-account-options'] as const;

/**
 * The admin listing — unlike `GET /med-account/options`, which the mobile app reads, this
 * one includes unpublished amounts. It is role-gated on the backend, so a non-admin token
 * gets a 403 here, which the axios interceptor turns into a logout.
 */
export const useTopupOptions = () =>
  useQuery({
    queryKey: OPTIONS_KEY,
    queryFn: async () => {
      const { data } = await axiosInstance.get<TopupOptionListResponse>(
        '/med-account/options/admin',
      );

      return data.options;
    },
  });

/** Every mutation below refetches the list, so the table never shows a stale row. */
const useInvalidateOptions = () => {
  const queryClient = useQueryClient();

  return () => queryClient.invalidateQueries({ queryKey: OPTIONS_KEY });
};

export const useCreateTopupOption = () => {
  const invalidate = useInvalidateOptions();

  return useMutation({
    mutationFn: async (payload: TopupOptionPayload) => {
      const { data } = await axiosInstance.post<TopupOptionResponse>(
        '/med-account/options/admin',
        payload,
      );

      return data.option;
    },
    onSuccess: invalidate,
  });
};

export const useUpdateTopupOption = () => {
  const invalidate = useInvalidateOptions();

  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<TopupOptionPayload>;
    }) => {
      const { data } = await axiosInstance.patch<TopupOptionResponse>(
        `/med-account/options/admin/${id}`,
        payload,
      );

      return data.option;
    },
    onSuccess: invalidate,
  });
};

export const useDeleteTopupOption = () => {
  const invalidate = useInvalidateOptions();

  return useMutation({
    mutationFn: async (option: TopupOption) => {
      const { data } = await axiosInstance.delete<TopupOptionResponse>(
        `/med-account/options/admin/${option.id}`,
      );

      return data.option;
    },
    onSuccess: invalidate,
  });
};
