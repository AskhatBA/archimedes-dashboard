import type { ProgramOrderCategory, ProgramOrderStatus } from './types';

export const PROGRAM_ORDER_STATUS_LABELS: Record<ProgramOrderStatus, string> = {
  NEW: 'Новая',
  IN_PROGRESS: 'В работе',
  COMPLETED: 'Завершена',
  CANCELLED: 'Отменена',
};

export const PROGRAM_ORDER_STATUS_HINTS: Record<ProgramOrderStatus, string> = {
  NEW: 'Оплачена, никто ещё не взял её в работу',
  IN_PROGRESS: 'С пациентом связались, дата согласовывается',
  COMPLETED: 'Программа оформлена или чек-ап проведён',
  CANCELLED: 'Заявка отменена — деньги возвращаются вручную',
};

export const PROGRAM_ORDER_STATUS_COLORS: Record<ProgramOrderStatus, string> = {
  NEW: 'violet',
  IN_PROGRESS: 'blue',
  COMPLETED: 'teal',
  CANCELLED: 'gray',
};

/**
 * The board's column headers. Plural, unlike the row badge: a column names a pile of
 * orders while a badge names the one order it sits on.
 */
export const PROGRAM_ORDER_STATUS_COLUMN_LABELS: Record<ProgramOrderStatus, string> = {
  NEW: 'Новые',
  IN_PROGRESS: 'В работе',
  COMPLETED: 'Завершённые',
  CANCELLED: 'Отменённые',
};

/** Left-to-right column order on the board — the path an order takes through the queue. */
export const PROGRAM_ORDER_BOARD_STATUSES: ProgramOrderStatus[] = [
  'NEW',
  'IN_PROGRESS',
  'COMPLETED',
  'CANCELLED',
];

export const PROGRAM_ORDER_STATUS_OPTIONS = (
  Object.keys(PROGRAM_ORDER_STATUS_LABELS) as ProgramOrderStatus[]
).map((value) => ({ value, label: PROGRAM_ORDER_STATUS_LABELS[value] }));

export const PROGRAM_ORDER_CATEGORY_LABELS: Record<ProgramOrderCategory, string> = {
  MED_PLAN: 'Мед. план',
  CHECKUP: 'Чек-ап',
};

export const PROGRAM_ORDER_CATEGORY_COLORS: Record<ProgramOrderCategory, string> = {
  MED_PLAN: 'indigo',
  CHECKUP: 'cyan',
};

export const PROGRAM_ORDER_CATEGORY_OPTIONS = (
  Object.keys(PROGRAM_ORDER_CATEGORY_LABELS) as ProgramOrderCategory[]
).map((value) => ({ value, label: PROGRAM_ORDER_CATEGORY_LABELS[value] }));

export const PROGRAM_ORDER_PAGE_SIZE = 20;

/**
 * A board column loads its own page: four columns are four requests, so each asks for
 * fewer rows than the table does, and "Показать ещё" grows one column by the same step.
 */
export const PROGRAM_ORDER_BOARD_COLUMN_SIZE = 15;

/**
 * How far a press has to travel before it counts as dragging a card rather than clicking
 * it. The sensor and the card's click guard read the same number, so a press can never be
 * both a drag and a click.
 */
export const PROGRAM_ORDER_DRAG_ACTIVATION_DISTANCE = 8;

export const PROGRAM_ORDER_BOARD_INITIAL_LIMITS = Object.fromEntries(
  PROGRAM_ORDER_BOARD_STATUSES.map((status) => [status, PROGRAM_ORDER_BOARD_COLUMN_SIZE]),
) as Record<ProgramOrderStatus, number>;

export const formatTenge = (amount: number) =>
  `₸${Math.round(amount).toLocaleString('ru-RU')}`;

/** Russian counts need three forms: 1 программа, 2 программы, 5 программ. */
export const pluralPrograms = (count: number) => {
  const mod100 = count % 100;
  const mod10 = count % 10;

  if (mod100 >= 11 && mod100 <= 14) return 'программ';
  if (mod10 === 1) return 'программа';
  if (mod10 >= 2 && mod10 <= 4) return 'программы';

  return 'программ';
};
