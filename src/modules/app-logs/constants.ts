import type { AppLogLevelFilter, AppLogLine } from './types';

export const APP_LOG_PAGE_SIZE = 100;

/** How often the feed reloads while "Обновлять" is on. */
export const APP_LOG_LIVE_INTERVAL_MS = 5000;

export const LEVEL_OPTIONS: { value: AppLogLevelFilter; label: string }[] = [
  { value: 'all', label: 'Все' },
  { value: 'warn', label: 'Предупреждения и ошибки' },
  { value: 'error', label: 'Только ошибки' },
];

const LEVEL_COLORS: Record<string, string> = {
  trace: 'gray',
  debug: 'gray',
  info: 'blue',
  warn: 'yellow',
  error: 'red',
  fatal: 'red',
};

export const levelColor = (level: string) => LEVEL_COLORS[level] ?? 'gray';

export const statusColor = (status: number) => {
  if (status >= 500) return 'red';
  if (status >= 400) return 'yellow';
  if (status >= 300) return 'gray';
  return 'teal';
};

/** What a few backend messages mean, for whoever reads the feed without the code open. */
const MESSAGE_HINTS: Record<string, string> = {
  'request completed': 'Ответ отправлен',
  'Request rejected with application error': 'Запрос отклонён',
  'Unhandled error': 'Необработанная ошибка',
  'Insurance request failed': 'Ошибка запроса в страховую',
};

export const messageHint = (msg: string | null) => (msg ? MESSAGE_HINTS[msg] : undefined);

const SERVICE_LABELS: Record<string, string> = {
  insurance: 'Страховая',
};

/**
 * `err.message` is the code the app received; `err.details` (when an upstream caused it)
 * is what that service actually answered — the part that explains a bare `UNKNOWN_ERROR`.
 */
export const errorOf = (line: AppLogLine) => {
  const err = line.data.err as
    | { message?: unknown; type?: unknown; stack?: unknown; details?: unknown }
    | undefined;

  if (!err || typeof err !== 'object') return null;

  const details =
    err.details && typeof err.details === 'object'
      ? (err.details as { service?: unknown; status?: unknown; message?: unknown })
      : null;
  const cause = details
    ? [
        typeof details.service === 'string'
          ? (SERVICE_LABELS[details.service] ?? details.service)
          : null,
        typeof details.status === 'number' ? String(details.status) : null,
      ]
        .filter(Boolean)
        .join(' ') + (typeof details.message === 'string' ? `: ${details.message}` : '')
    : null;

  return {
    message: typeof err.message === 'string' ? err.message : null,
    type: typeof err.type === 'string' ? err.type : null,
    stack: typeof err.stack === 'string' ? err.stack : null,
    /** e.g. «Страховая 404: Пользователь не найден». */
    cause: cause || null,
  };
};
