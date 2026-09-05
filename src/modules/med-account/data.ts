import { isAxiosError } from 'axios';

const DEFAULT_MESSAGE = 'Не удалось сохранить. Попробуйте ещё раз.';

const MED_ACCOUNT_ERROR_MESSAGES: Record<string, string> = {
  MED_ACCOUNT_OPTION_AMOUNT_TAKEN:
    'Такая сумма уже есть в списке — измените её или отредактируйте существующую.',
  MED_ACCOUNT_OPTION_NOT_FOUND: 'Сумма не найдена — возможно, её уже удалили.',
  MED_ACCOUNT_TOPUP_NOT_FOUND: 'Пополнение не найдено — обновите страницу.',
  FORBIDDEN: 'У этой учётной записи нет прав на изменение списка.',
};

/**
 * Write endpoints answer either with a machine-readable `message` code or, when the
 * payload itself is malformed, with express-validator's `errors` array. The array wins:
 * it says which field is wrong, which is what the admin needs.
 */
export const resolveMedAccountErrorMessage = (error: unknown): string => {
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

  return (code && MED_ACCOUNT_ERROR_MESSAGES[code]) || DEFAULT_MESSAGE;
};
