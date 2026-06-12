export type Role = 'PATIENT' | 'DOCTOR' | 'ADMIN';
export type AppointmentStatus = 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
export type Platform = 'IOS' | 'ANDROID' | 'WEB';
export type NotificationStatus = 'SENT' | 'DELIVERED' | 'FAILED';

export type DashboardKpis = {
  totalUsers: number;
  usersDeltaPct: number;
  totalPatients: number;
  patientsDeltaPct: number;
  totalDoctors: number;
  doctorsDeltaPct: number;
  appointmentsToday: number;
  appointmentsTodayDeltaPct: number;
  refundAmountMonth: number;
  refundAmountDeltaPct: number;
  activeDevices: number;
  activeDevicesDeltaPct: number;
};

export type AppointmentTrendPoint = {
  date: string;
  scheduled: number;
  completed: number;
  cancelled: number;
};

export type RoleSlice = { name: string; value: number; color: string };
export type StatusSlice = { name: string; value: number; color: string };
export type PlatformSlice = { name: string; value: number; color: string };

export type TelemedicinePoint = {
  date: string;
  telemedicine: number;
  inPerson: number;
};

export type RefundPoint = {
  date: string;
  amount: number;
  requests: number;
};

export type DoctorRow = {
  id: string;
  fullName: string;
  specialization: string;
  appointments: number;
  rating: number;
  status: 'active' | 'away' | 'offline';
};

export type AppointmentRow = {
  id: string;
  patientName: string;
  doctorName: string;
  specialization: string;
  dateTime: string;
  status: AppointmentStatus;
  isTelemedicine: boolean;
};

export type RefundRow = {
  id: string;
  patientName: string;
  category: string;
  amount: number;
  date: string;
  state: 'pending' | 'approved' | 'rejected';
};

export type NotificationStats = {
  sent: number;
  delivered: number;
  failed: number;
  readRate: number;
};

export type AppVersionRow = {
  platform: 'IOS' | 'ANDROID';
  latestVersion: string;
  minSupportedVersion: string;
  forceUpdate: boolean;
  releasedAt: string;
};
