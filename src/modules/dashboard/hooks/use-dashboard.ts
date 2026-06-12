import { useQuery } from '@tanstack/react-query';
import {
  mockAppVersions,
  mockAppointmentTrend,
  mockKpis,
  mockNotificationStats,
  mockPlatformDistribution,
  mockRecentAppointments,
  mockRecentRefunds,
  mockRefundTrend,
  mockRoleDistribution,
  mockStatusDistribution,
  mockTelemedicineSplit,
  mockTopDoctors,
} from '../data';

const delay = <T>(value: T, ms = 250) =>
  new Promise<T>((r) => setTimeout(() => r(value), ms));

export const useDashboard = () =>
  useQuery({
    queryKey: ['dashboard', 'all'],
    queryFn: () =>
      delay({
        kpis: mockKpis,
        appointmentTrend: mockAppointmentTrend,
        roleDistribution: mockRoleDistribution,
        statusDistribution: mockStatusDistribution,
        platformDistribution: mockPlatformDistribution,
        telemedicineSplit: mockTelemedicineSplit,
        refundTrend: mockRefundTrend,
        topDoctors: mockTopDoctors,
        recentAppointments: mockRecentAppointments,
        recentRefunds: mockRecentRefunds,
        notificationStats: mockNotificationStats,
        appVersions: mockAppVersions,
      }),
  });
