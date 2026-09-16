export type PatientGender = 'M' | 'F';

export type Patient = {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  patronymic: string;
  fullName: string;
  /** Stored as the mobile app sent it — `YYYY-MM-DD`, not an ISO timestamp. */
  birthDate: string;
  gender: string;
  iin: string;
  misPatientId: string;
  phone: string;
  email: string | null;
  appointmentsCount: number;
  refundsCount: number;
};

export type PatientListResponse = {
  success: boolean;
  items: Patient[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type PatientFilters = {
  page: number;
  limit: number;
  search: string;
  gender: PatientGender | null;
};

export type PatientResponse = {
  success: boolean;
  patient: Patient;
};

/**
 * What `PATCH /patient/admin/patients/:id` accepts — any subset of it. The phone is not
 * here on purpose: it is the account's login, and the backend refuses to change it.
 */
export type PatientUpdatePayload = {
  firstName?: string;
  lastName?: string;
  patronymic?: string;
  iin?: string;
};

export type PatientFormValues = {
  lastName: string;
  firstName: string;
  patronymic: string;
  iin: string;
};
