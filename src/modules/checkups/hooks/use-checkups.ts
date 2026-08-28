import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { axiosInstance } from '@/api';
import type {
  Checkup,
  CheckupListResponse,
  CheckupPayload,
  CheckupResponse,
} from '../types';

const CHECKUPS_KEY = ['checkups'] as const;

/**
 * The admin listing — unlike `GET /checkups`, which the mobile app reads, this one
 * includes unpublished entries. It is role-gated on the backend, so a non-admin token
 * gets a 403 here, which the axios interceptor turns into a logout.
 */
export const useCheckups = () =>
  useQuery({
    queryKey: CHECKUPS_KEY,
    queryFn: async () => {
      const { data } = await axiosInstance.get<CheckupListResponse>('/checkups/admin');

      return data.checkups;
    },
  });

/** Every mutation below refetches the list, so the table never shows a stale row. */
const useInvalidateCheckups = () => {
  const queryClient = useQueryClient();

  return () => queryClient.invalidateQueries({ queryKey: CHECKUPS_KEY });
};

export const useCreateCheckup = () => {
  const invalidate = useInvalidateCheckups();

  return useMutation({
    mutationFn: async (payload: CheckupPayload) => {
      const { data } = await axiosInstance.post<CheckupResponse>(
        '/checkups/admin',
        payload,
      );

      return data.checkup;
    },
    onSuccess: invalidate,
  });
};

export const useUpdateCheckup = () => {
  const invalidate = useInvalidateCheckups();

  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<CheckupPayload>;
    }) => {
      const { data } = await axiosInstance.patch<CheckupResponse>(
        `/checkups/admin/${id}`,
        payload,
      );

      return data.checkup;
    },
    onSuccess: invalidate,
  });
};

export const useDeleteCheckup = () => {
  const invalidate = useInvalidateCheckups();

  return useMutation({
    mutationFn: async (checkup: Checkup) => {
      const { data } = await axiosInstance.delete<CheckupResponse>(
        `/checkups/admin/${checkup.id}`,
      );

      return data.checkup;
    },
    onSuccess: invalidate,
  });
};
