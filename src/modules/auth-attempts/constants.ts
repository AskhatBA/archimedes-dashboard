import type { AuthAttempt, AuthAttemptEvent, AuthAttemptOutcome } from './types';

export const AUTH_ATTEMPT_PAGE_SIZE = 20;

const EVENT_LABELS: Record<AuthAttemptEvent, string> = {
  AUTH_OTP_REQUEST: 'Запрос кода',
  AUTH_LOGIN_SUCCESS: 'Вход выполнен',
  AUTH_LOGIN_FAILED: 'Ошибка входа',
  AUTH_LOGOUT: 'Выход',
  AUTH_REFRESH_FAILED: 'Сессия не продлена',
  AUTH_PIN_VERIFY_SUCCESS: 'Вход по PIN',
  AUTH_PIN_VERIFY_FAILED: 'Неверный PIN',
  AUTH_PIN_LOCKED: 'PIN заблокирован',
  USER_ACCOUNT_CREATED: 'Аккаунт создан',
  USER_PHONE_CHANGED: 'Телефон изменён',
};

/** The same event means a different thing in the registration flow. */
const REGISTRATION_EVENT_LABELS: Partial<Record<AuthAttemptEvent, string>> = {
  AUTH_OTP_REQUEST: 'Код для регистрации',
  AUTH_LOGIN_FAILED: 'Ошибка регистрации',
  AUTH_LOGIN_SUCCESS: 'Регистрация завершена',
};

export const eventLabel = ({ event, metadata }: AuthAttempt) =>
  (metadata?.flow === 'registration' && REGISTRATION_EVENT_LABELS[event]) ||
  EVENT_LABELS[event] ||
  event;

/** Neutral events (a logout, a code sent) are neither a success nor a failure to look at. */
const NEUTRAL_EVENTS: AuthAttemptEvent[] = ['AUTH_OTP_REQUEST', 'AUTH_LOGOUT', 'USER_PHONE_CHANGED'];

export const eventColor = ({ event, success }: AuthAttempt) => {
  if (!success) return 'red';
  return NEUTRAL_EVENTS.includes(event) ? 'gray' : 'teal';
};

/** Where in the handler it failed — `metadata.step`, see `auth-attempt.ts` on the backend. */
const STEP_LABELS: Record<string, string> = {
  start: 'Начало запроса',
  phone_format: 'Проверка формата телефона',
  insurance_check: 'Запрос в страховую',
  phone_match: 'Сверка телефона со страховой',
  account_lookup: 'Поиск аккаунта',
  sms: 'Отправка SMS',
  otp_save: 'Сохранение кода',
  otp_missing: 'Код не передан',
  otp_check: 'Проверка кода',
  mis_lookup: 'Поиск пациента в МИС',
  registration_token: 'Проверка токена регистрации',
  mis_create_patient: 'Создание пациента в МИС',
  account_create: 'Создание аккаунта',
  session_create: 'Создание сессии',
};

export const stepLabel = (step: string) => STEP_LABELS[step] ?? step;

const REASON_LABELS: Record<string, string> = {
  ACCOUNT_NOT_FOUND: 'Аккаунта нет — нужна регистрация',
  ACCOUNT_ALREADY_EXISTS: 'Аккаунт уже существует',
  INSURANCE_PHONE_IS_NOT_MATCHED: 'Телефон не совпадает с номером в страховой',
  INVALID_PHONE: 'Неверный формат телефона',
  INVALID_OTP: 'Неверный код',
  OTP_EXPIRED: 'Код истёк',
  USER_NOT_FOUND: 'Пользователь не найден',
  INVALID_REGISTRATION_TOKEN: 'Недействительный токен регистрации',
  INVALID_TOKEN: 'Недействительный токен',
  TOKEN_EXPIRED: 'Токен истёк',
  MIS_PATIENT_NOT_FOUND: 'Пациент не найден в МИС',
  INVALID_PIN: 'Неверный PIN',
  PIN_LOCKED: 'PIN заблокирован',
  PIN_NOT_SET: 'PIN не установлен',
  SESSION_REPLACED: 'Вошли с другого устройства',
  REFRESH_TOKEN_REVOKED: 'Сессия отозвана',
  INSURANCE_UNAVAILABLE: 'Страховая не ответила',
  UNKNOWN_ERROR: 'Ошибка внешнего сервиса',
  UNHANDLED: 'Непредвиденная ошибка сервера',
};

export const reasonLabel = (reason: string) => REASON_LABELS[reason] ?? reason;

const SERVICE_LABELS: Record<string, string> = {
  insurance: 'Страховая',
};

export const serviceLabel = (service: string) => SERVICE_LABELS[service] ?? service;

export const FLOW_LABELS: Record<string, string> = {
  login: 'Вход',
  registration: 'Регистрация',
};

export const OUTCOME_OPTIONS: { value: AuthAttemptOutcome; label: string }[] = [
  { value: 'all', label: 'Все' },
  { value: 'failed', label: 'Ошибки' },
  { value: 'succeeded', label: 'Успешные' },
];

/**
 * Mirrors the backend's `parseAuthAttemptSearch`: a full phone in any format or a
 * 12-digit IIN. Anything shorter is not sent — the backend would refuse it with a 400.
 */
export const isCompleteSearch = (input: string) => {
  const digits = input.replace(/\D/g, '');
  return (
    digits.length === 12 ||
    digits.length === 10 ||
    (digits.length === 11 && /^[78]/.test(digits))
  );
};

/**
 * Older builds send no `X-App-Version`, so fall back to the build number in the
 * User-Agent (`archimedesapp/2 CFNetwork/…`) — better than nothing, but ambiguous.
 */
export const appVersionOf = ({ metadata, userAgent }: AuthAttempt) => {
  if (metadata?.appVersion) return metadata.appVersion;

  const build = userAgent?.match(/archimedesapp\/(\d+)/i)?.[1];
  return build ? `сборка ${build}` : null;
};
