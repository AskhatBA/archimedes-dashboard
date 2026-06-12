import dayjs from 'dayjs';
import type {
  AppVersionRow,
  AppointmentRow,
  AppointmentTrendPoint,
  DashboardKpis,
  DoctorRow,
  NotificationStats,
  PlatformSlice,
  RefundPoint,
  RefundRow,
  RoleSlice,
  StatusSlice,
  TelemedicinePoint,
} from './types';

const today = dayjs('2026-05-19');

const daysBack = (n: number) =>
  Array.from({ length: n }, (_, i) =>
    today.subtract(n - 1 - i, 'day').format('YYYY-MM-DD'),
  );

const seeded = (seed: number) => {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
};

export const mockKpis: DashboardKpis = {
  totalUsers: 18452,
  usersDeltaPct: 8.4,
  totalPatients: 16980,
  patientsDeltaPct: 9.1,
  totalDoctors: 312,
  doctorsDeltaPct: 2.6,
  appointmentsToday: 247,
  appointmentsTodayDeltaPct: 12.3,
  refundAmountMonth: 84520,
  refundAmountDeltaPct: -3.2,
  activeDevices: 14210,
  activeDevicesDeltaPct: 5.7,
};

export const mockAppointmentTrend: AppointmentTrendPoint[] = (() => {
  const rng = seeded(42);
  return daysBack(30).map((date) => {
    const completed = 180 + Math.floor(rng() * 80);
    const cancelled = 10 + Math.floor(rng() * 25);
    const scheduled = 40 + Math.floor(rng() * 60);
    return { date, scheduled, completed, cancelled };
  });
})();

export const mockRoleDistribution: RoleSlice[] = [
  { name: 'Пациенты', value: 16980, color: 'violet.6' },
  { name: 'Врачи', value: 312, color: 'cyan.5' },
  { name: 'Админы', value: 24, color: 'pink.5' },
];

export const mockStatusDistribution: StatusSlice[] = [
  { name: 'Завершено', value: 4820, color: 'teal.6' },
  { name: 'Запланировано', value: 1240, color: 'violet.5' },
  { name: 'Отменено', value: 380, color: 'red.6' },
];

export const mockPlatformDistribution: PlatformSlice[] = [
  { name: 'iOS', value: 8420, color: 'gray.7' },
  { name: 'Android', value: 5610, color: 'green.6' },
  { name: 'Web', value: 180, color: 'blue.5' },
];

export const mockTelemedicineSplit: TelemedicinePoint[] = (() => {
  const rng = seeded(7);
  return daysBack(14).map((date) => ({
    date,
    telemedicine: 60 + Math.floor(rng() * 80),
    inPerson: 120 + Math.floor(rng() * 90),
  }));
})();

export const mockRefundTrend: RefundPoint[] = (() => {
  const rng = seeded(101);
  return daysBack(30).map((date) => {
    const requests = 3 + Math.floor(rng() * 12);
    return {
      date,
      requests,
      amount: requests * (4200 + Math.floor(rng() * 3500)),
    };
  });
})();

export const mockTopDoctors: DoctorRow[] = [
  {
    id: 'd1',
    fullName: 'Aigerim Sultanova',
    specialization: 'Кардиология',
    appointments: 412,
    rating: 4.9,
    status: 'active',
  },
  {
    id: 'd2',
    fullName: 'Daniyar Akhmetov',
    specialization: 'Педиатрия',
    appointments: 388,
    rating: 4.8,
    status: 'active',
  },
  {
    id: 'd3',
    fullName: 'Madina Iskakova',
    specialization: 'Дерматология',
    appointments: 351,
    rating: 4.7,
    status: 'away',
  },
  {
    id: 'd4',
    fullName: 'Yerlan Tasbolatov',
    specialization: 'Неврология',
    appointments: 327,
    rating: 4.8,
    status: 'active',
  },
  {
    id: 'd5',
    fullName: 'Alia Beketova',
    specialization: 'Эндокринология',
    appointments: 298,
    rating: 4.6,
    status: 'offline',
  },
  {
    id: 'd6',
    fullName: 'Nurlan Zhumagulov',
    specialization: 'Ортопедия',
    appointments: 276,
    rating: 4.5,
    status: 'active',
  },
];

export const mockRecentAppointments: AppointmentRow[] = [
  {
    id: 'a1',
    patientName: 'Arman Bekturov',
    doctorName: 'Aigerim Sultanova',
    specialization: 'Кардиология',
    dateTime: today.subtract(1, 'hour').toISOString(),
    status: 'COMPLETED',
    isTelemedicine: true,
  },
  {
    id: 'a2',
    patientName: 'Saltanat Nurpeisova',
    doctorName: 'Daniyar Akhmetov',
    specialization: 'Педиатрия',
    dateTime: today.subtract(2, 'hour').toISOString(),
    status: 'COMPLETED',
    isTelemedicine: false,
  },
  {
    id: 'a3',
    patientName: 'Bekzat Almasov',
    doctorName: 'Madina Iskakova',
    specialization: 'Дерматология',
    dateTime: today.add(30, 'minute').toISOString(),
    status: 'SCHEDULED',
    isTelemedicine: true,
  },
  {
    id: 'a4',
    patientName: 'Aizhan Kasymova',
    doctorName: 'Yerlan Tasbolatov',
    specialization: 'Неврология',
    dateTime: today.add(2, 'hour').toISOString(),
    status: 'SCHEDULED',
    isTelemedicine: false,
  },
  {
    id: 'a5',
    patientName: 'Timur Sagintayev',
    doctorName: 'Alia Beketova',
    specialization: 'Эндокринология',
    dateTime: today.subtract(4, 'hour').toISOString(),
    status: 'CANCELLED',
    isTelemedicine: false,
  },
  {
    id: 'a6',
    patientName: 'Dinara Omarova',
    doctorName: 'Nurlan Zhumagulov',
    specialization: 'Ортопедия',
    dateTime: today.subtract(6, 'hour').toISOString(),
    status: 'COMPLETED',
    isTelemedicine: true,
  },
];

export const mockRecentRefunds: RefundRow[] = [
  {
    id: 'r1',
    patientName: 'Arman Bekturov',
    category: 'Консультация',
    amount: 12400,
    date: today.subtract(2, 'day').toISOString(),
    state: 'approved',
  },
  {
    id: 'r2',
    patientName: 'Saltanat Nurpeisova',
    category: 'Анализы',
    amount: 8200,
    date: today.subtract(1, 'day').toISOString(),
    state: 'pending',
  },
  {
    id: 'r3',
    patientName: 'Bekzat Almasov',
    category: 'Диагностика',
    amount: 22150,
    date: today.subtract(3, 'day').toISOString(),
    state: 'approved',
  },
  {
    id: 'r4',
    patientName: 'Aizhan Kasymova',
    category: 'Аптека',
    amount: 5430,
    date: today.subtract(4, 'day').toISOString(),
    state: 'rejected',
  },
  {
    id: 'r5',
    patientName: 'Timur Sagintayev',
    category: 'Консультация',
    amount: 9600,
    date: today.subtract(5, 'day').toISOString(),
    state: 'pending',
  },
];

export const mockNotificationStats: NotificationStats = {
  sent: 48210,
  delivered: 46980,
  failed: 1230,
  readRate: 72.4,
};

export const mockAppVersions: AppVersionRow[] = [
  {
    platform: 'IOS',
    latestVersion: '2.8.1',
    minSupportedVersion: '2.5.0',
    forceUpdate: false,
    releasedAt: today.subtract(6, 'day').toISOString(),
  },
  {
    platform: 'ANDROID',
    latestVersion: '2.8.0',
    minSupportedVersion: '2.4.0',
    forceUpdate: true,
    releasedAt: today.subtract(8, 'day').toISOString(),
  },
];
