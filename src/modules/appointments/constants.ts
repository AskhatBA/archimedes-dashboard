import type { AppointmentStatus } from './types';

export const APPOINTMENT_STATUS_LABELS: Record<AppointmentStatus, string> = {
  SCHEDULED: 'Запланирован',
  COMPLETED: 'Завершён',
  CANCELLED: 'Отменён',
};

export const APPOINTMENT_STATUS_HINTS: Record<AppointmentStatus, string> = {
  SCHEDULED: 'Записан в МИС, приём ещё не состоялся',
  COMPLETED: 'Приём состоялся',
  CANCELLED: 'Запись отменена пациентом или клиникой',
};

export const APPOINTMENT_STATUS_COLORS: Record<AppointmentStatus, string> = {
  SCHEDULED: 'violet',
  COMPLETED: 'teal',
  CANCELLED: 'gray',
};

export const APPOINTMENT_STATUS_OPTIONS = (
  Object.keys(APPOINTMENT_STATUS_LABELS) as AppointmentStatus[]
).map((value) => ({ value, label: APPOINTMENT_STATUS_LABELS[value] }));

/** The format filter is a tri-state, so it travels as a string and is parsed back. */
export const APPOINTMENT_FORMAT_OPTIONS = [
  { value: 'true', label: 'Телемедицина' },
  { value: 'false', label: 'Очный приём' },
];

export const APPOINTMENT_PAGE_SIZE = 20;

/** Russian counts need three forms: 1 приём, 2 приёма, 5 приёмов. */
export const pluralAppointments = (count: number) => {
  const mod100 = count % 100;
  const mod10 = count % 10;

  if (mod100 >= 11 && mod100 <= 14) return 'приёмов';
  if (mod10 === 1) return 'приём';
  if (mod10 >= 2 && mod10 <= 4) return 'приёма';

  return 'приёмов';
};
