import type { TopupStatus } from './types';

export const STATUS_LABELS: Record<TopupStatus, string> = {
  PENDING: 'Ждёт зачисления',
  CREDITED: 'Зачислено',
  FAILED: 'Ошибка зачисления',
};

export const STATUS_COLORS: Record<TopupStatus, string> = {
  PENDING: 'orange',
  CREDITED: 'teal',
  FAILED: 'red',
};

export const STATUS_ORDER: TopupStatus[] = ['PENDING', 'CREDITED', 'FAILED'];

export const STATUS_OPTIONS = STATUS_ORDER.map((value) => ({
  value,
  label: STATUS_LABELS[value],
}));

export const formatAmount = (amount: number) => `₸${amount.toLocaleString('ru-RU')}`;
