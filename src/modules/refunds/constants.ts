import type { RefundState } from './types';

/**
 * Category is stored as the raw MIS integer (see the `RefundRequestBody` schema in the
 * backend's insurance routes) — these are the only four values the mobile app sends.
 */
export const REFUND_CATEGORY_LABELS: Record<number, string> = {
  0: 'АПП',
  2: 'Стационарное лечение',
  4: 'Стоматология',
  5: 'Медикаменты',
};

export const REFUND_CATEGORY_OPTIONS = Object.entries(REFUND_CATEGORY_LABELS).map(
  ([value, label]) => ({ value, label }),
);

export const REFUND_STATE_LABELS: Record<RefundState, string> = {
  accepted: 'Принято',
  failed: 'Ошибка',
  unknown: 'Нет ответа',
};

/**
 * `state` reflects the MIS's answer at submission time — it is not a claim decision,
 * which the insurer makes later in its own system. The tooltip keeps that clear.
 */
export const REFUND_STATE_HINTS: Record<RefundState, string> = {
  accepted: 'Страховая приняла заявку в обработку',
  failed: 'Страховая отклонила отправку — заявка не зарегистрирована',
  unknown: 'Ответ страховой не сохранился — проверьте вручную',
};

export const REFUND_STATE_COLORS: Record<RefundState, string> = {
  accepted: 'teal',
  failed: 'red',
  unknown: 'gray',
};

export const REFUND_PAGE_SIZE = 20;

export const categoryLabel = (category: number) =>
  REFUND_CATEGORY_LABELS[category] ?? `Категория ${category}`;
