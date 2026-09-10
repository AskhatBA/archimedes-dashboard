import type { AppointmentPaymentStatus, AppointmentStatus } from './types';

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

/** Same tri-state shape as the format filter — cleared means «любая оплата». */
export const APPOINTMENT_PAYMENT_OPTIONS = [
  { value: 'true', label: 'Оплачен картой' },
  { value: 'false', label: 'По программе' },
];

/**
 * Состояние транзакции за приём.
 *
 * У приёма, забронированного как платный, платёж всегда `SUCCESS` — приём и создаётся-то
 * обработчиком успешной оплаты. Остальные значения означают расхождение, которое стоит
 * показать, а не спрятать.
 */
export const PAYMENT_STATUS_LABELS: Record<AppointmentPaymentStatus, string> = {
  SUCCESS: 'Оплачен',
  PENDING: 'Ожидает оплаты',
  FAILED: 'Не прошёл',
  CANCELLED: 'Отменён плательщиком',
};

export const PAYMENT_STATUS_COLORS: Record<AppointmentPaymentStatus, string> = {
  SUCCESS: 'teal',
  PENDING: 'yellow',
  FAILED: 'red',
  CANCELLED: 'gray',
};

export const formatAmount = (amount: number) => `₸${amount.toLocaleString('ru-RU')}`;

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
