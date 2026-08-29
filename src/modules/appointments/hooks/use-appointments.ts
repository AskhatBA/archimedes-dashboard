import { keepPreviousData, useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { axiosInstance } from '@/api';
import type { AppointmentFilters, AppointmentListResponse } from '../types';

const APPOINTMENTS_KEY = ['appointments'] as const;

const listParams = (filters: AppointmentFilters) => ({
  page: filters.page,
  limit: filters.limit,
  ...(filters.search ? { search: filters.search } : {}),
  ...(filters.status ? { status: filters.status } : {}),
  ...(filters.telemedicine === null ? {} : { telemedicine: filters.telemedicine }),
  ...(filters.dateFrom ? { dateFrom: filters.dateFrom } : {}),
  ...(filters.dateTo ? { dateTo: filters.dateTo } : {}),
});

const fetchAppointments = async (params: Record<string, unknown>) => {
  const { data } = await axiosInstance.get<AppointmentListResponse>('/appointments/admin', {
    params,
  });

  return data;
};

/**
 * Reads the clinic-wide appointment listing. The endpoint is role-gated on the backend,
 * so a non-admin token gets a 403 here — which the axios interceptor turns into a logout.
 */
export const useAppointments = (filters: AppointmentFilters) =>
  useQuery({
    queryKey: [...APPOINTMENTS_KEY, 'list', filters],
    queryFn: () => fetchAppointments(listParams(filters)),
    // Without this the table empties out on every page/filter change and the layout
    // jumps; keeping the previous page visible makes paging feel instant.
    placeholderData: keepPreviousData,
  });

/**
 * The two counters above the table. Both deliberately ignore what is in the filter bar —
 * they answer "what does the clinic have on today" regardless of what the admin is
 * currently looking through — so only their `total` is read and a single row is asked for.
 *
 * `today` is the browser's date; the backend turns it into a clinic day (Asia/Almaty),
 * which is the same day for anyone working from the clinic.
 */
const useAppointmentsTotal = (name: string, params: Record<string, unknown>) =>
  useQuery({
    queryKey: [...APPOINTMENTS_KEY, 'total', name],
    queryFn: async () => (await fetchAppointments({ page: 1, limit: 1, ...params })).total,
  });

export const useTodayAppointmentsCount = () => {
  const today = dayjs().format('YYYY-MM-DD');

  return useAppointmentsTotal('today', { dateFrom: today, dateTo: today });
};

export const useUpcomingAppointmentsCount = () =>
  useAppointmentsTotal('upcoming', {
    status: 'SCHEDULED',
    dateFrom: dayjs().format('YYYY-MM-DD'),
  });
