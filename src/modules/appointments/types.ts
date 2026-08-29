/** Mirrors the backend enum. */
export type AppointmentStatus = 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';

/**
 * One visit as `GET /appointments/admin` returns it.
 *
 * The ids point at two systems: `patientId`, `doctorId` and `externalId` are MIS ids,
 * while the `account*` fields come from our own tables. The doctor fields are resolved
 * from MIS per request and are `null` when MIS is unreachable — never render them
 * without a fallback to `doctorId`.
 */
export type Appointment = {
  id: string;
  userId: string;
  patientId: string;
  externalId: string;
  dateTime: string;
  status: AppointmentStatus;
  isTelemedicine: boolean;
  meetingUrl: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  doctorId: string;
  doctorName: string | null;
  doctorSpecialty: string | null;
  doctorBranch: string | null;
  accountName: string | null;
  accountIin: string | null;
  accountPhone: string;
  /** The visit is booked under a relative's MIS id, not the account owner's. */
  isForFamilyMember: boolean;
};

export type AppointmentListResponse = {
  success: boolean;
  items: Appointment[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type AppointmentFilters = {
  page: number;
  limit: number;
  search: string;
  status: AppointmentStatus | null;
  /** `null` — любой формат, `true` — только телемедицина, `false` — только очные. */
  telemedicine: boolean | null;
  /** `YYYY-MM-DD`; the backend reads them as whole clinic days (Asia/Almaty). */
  dateFrom: string | null;
  dateTo: string | null;
};
