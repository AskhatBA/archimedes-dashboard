import { isAxiosError } from 'axios';

const DEFAULT_MESSAGE = 'Не удалось сохранить заявку. Попробуйте ещё раз.';

const PROGRAM_ORDER_ERROR_MESSAGES: Record<string, string> = {
  PROGRAM_ORDER_NOT_FOUND: 'Заявка не найдена — возможно, её уже удалили.',
  FORBIDDEN: 'У этой учётной записи нет прав на изменение заявок.',
};

/**
 * The write endpoint answers either with a machine-readable `message` code or, when the
 * payload itself is malformed, with express-validator's `errors` array. The array wins:
 * it says which field is wrong, which is what the admin needs.
 */
export const resolveProgramOrderErrorMessage = (error: unknown): string => {
  if (!isAxiosError(error)) {
    return DEFAULT_MESSAGE;
  }

  if (!error.response) {
    return 'Сервер недоступен. Проверьте подключение.';
  }

  const data = error.response.data as
    | { message?: string; errors?: { msg?: string }[] }
    | undefined;

  const validationMessages = (data?.errors ?? [])
    .map((item) => item.msg)
    .filter((msg): msg is string => Boolean(msg));

  if (validationMessages.length > 0) {
    return validationMessages.join('. ');
  }

  const code = data?.message;

  return (code && PROGRAM_ORDER_ERROR_MESSAGES[code]) || DEFAULT_MESSAGE;
};
