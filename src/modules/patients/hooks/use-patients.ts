import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { axiosInstance } from '@/api';
import type {
  Patient,
  PatientFilters,
  PatientListResponse,
  PatientResponse,
  PatientUpdatePayload,
} from '../types';

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

/**
 * Every write refetches the whole `['patients']` key — each page and filter combination
 * is cached separately, and an edited name or IIN can move a row between them.
 */
const useInvalidatePatients = () => {
  const queryClient = useQueryClient();

  return () => queryClient.invalidateQueries({ queryKey: ['patients'] });
};

export const useUpdatePatient = () => {
  const invalidate = useInvalidatePatients();

  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: PatientUpdatePayload }) => {
      const { data } = await axiosInstance.patch<PatientResponse>(
        `/patient/admin/patients/${id}`,
        payload,
      );

      return data.patient;
    },
    onSuccess: invalidate,
  });
};

/** Deletes the patient profile only — the account behind it (phone, history) stays. */
export const useDeletePatient = () => {
  const invalidate = useInvalidatePatients();

  return useMutation({
    mutationFn: async (patient: Patient) => {
      await axiosInstance.delete(`/patient/admin/patients/${patient.id}`);
    },
    onSuccess: invalidate,
  });
};
