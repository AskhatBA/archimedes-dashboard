import { useQuery } from '@tanstack/react-query';
import { axiosInstance } from '@/api';
import type { OverviewStats, OverviewStatsResponse } from '../types';

/**
 * Overview counters. The endpoint is role-gated on the backend, so a non-admin token
 * gets a 403 here — which the axios interceptor turns into a logout.
 */
export const useDashboard = () =>
  useQuery<OverviewStats>({
    queryKey: ['dashboard', 'overview'],
    queryFn: async () => {
      const { data } = await axiosInstance.get<OverviewStatsResponse>('/stats/overview');

      return {
        totalPatients: data.totalPatients,
        totalRefundRequests: data.totalRefundRequests,
        acceptedRefunds: data.acceptedRefunds,
        totalAppointments: data.totalAppointments,
        appointmentsToday: data.appointmentsToday,
      };
    },
  });
