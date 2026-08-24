import { isAxiosError } from 'axios';

const DEFAULT_MESSAGE = 'Не удалось войти. Попробуйте ещё раз.';

/**
 * The backend answers every bad login with the same `INVALID_CREDENTIALS` —
 * unknown email, non-admin account and wrong password are deliberately
 * indistinguishable — so the wording here stays deliberately vague too.
 */
const AUTH_ERROR_MESSAGES: Record<string, string> = {
  INVALID_CREDENTIALS: 'Неверный email или пароль.',
  TOO_MANY_LOGIN_ATTEMPTS:
    'Слишком много неудачных попыток. Повторите вход через 15 минут.',
  FORBIDDEN: 'У этой учётной записи нет доступа к дашборду.',
};

export const resolveAuthErrorMessage = (error: unknown): string => {
  if (!isAxiosError(error)) {
    return DEFAULT_MESSAGE;
  }

  if (!error.response) {
    return 'Сервер недоступен. Проверьте подключение.';
  }

  const code = (error.response.data as { message?: string } | undefined)?.message;

  return (code && AUTH_ERROR_MESSAGES[code]) || DEFAULT_MESSAGE;
};
