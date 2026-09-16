import { isAxiosError } from 'axios';

const DEFAULT_MESSAGE = 'Не удалось сохранить. Попробуйте ещё раз.';

const PATIENT_ERROR_MESSAGES: Record<string, string> = {
  PATIENT_IIN_TAKEN: 'Этот ИИН уже указан в профиле другого пациента.',
  PATIENT_MIS_PATIENT_TAKEN:
    'Пациент МИС с этим ИИН уже привязан к другому профилю — ИИН не изменён.',
  MIS_PATIENT_NOT_FOUND:
    'В МИС не найден пациент с таким ИИН (или МИС сейчас недоступна) — ИИН не изменён.',
  PATIENT_PROFILE_NOT_FOUND: 'Профиль не найден — возможно, его уже удалили.',
  FORBIDDEN: 'У этой учётной записи нет прав на изменение пациентов.',
};

/**
 * Write endpoints answer either with a machine-readable `message` code or, when the
 * payload itself is malformed, with express-validator's `errors` array. The array wins:
 * it says which field is wrong, which is what the admin needs.
 */
export const resolvePatientErrorMessage = (error: unknown): string => {
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

  return (code && PATIENT_ERROR_MESSAGES[code]) || DEFAULT_MESSAGE;
};
