export type AuthAttemptEvent =
  | 'AUTH_OTP_REQUEST'
  | 'AUTH_LOGIN_SUCCESS'
  | 'AUTH_LOGIN_FAILED'
  | 'AUTH_LOGOUT'
  | 'AUTH_REFRESH_FAILED'
  | 'AUTH_PIN_VERIFY_SUCCESS'
  | 'AUTH_PIN_VERIFY_FAILED'
  | 'AUTH_PIN_LOCKED'
  | 'USER_ACCOUNT_CREATED'
  | 'USER_PHONE_CHANGED';

/** What an upstream service answered when it caused the failure — e.g. the insurer's 404. */
export type AuthAttemptUpstream = {
  service: string;
  resolver?: string;
  status?: number;
  errorCode?: number | string;
  message?: string;
};

/**
 * Free-form on the backend; these are the keys the auth handlers write. Entries from
 * before the attempt tracking carry at most `reason`.
 */
export type AuthAttemptMetadata = {
  flow?: 'login' | 'registration';
  step?: string;
  reason?: string;
  statusCode?: number;
  upstream?: AuthAttemptUpstream;
  reqId?: string;
  appVersion?: string;
  [key: string]: unknown;
};

export type AuthAttempt = {
  id: string;
  event: AuthAttemptEvent;
  success: boolean;
  createdAt: string;
  userId: string | null;
  patientName: string | null;
  phone: string | null;
  iin: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  metadata: AuthAttemptMetadata | null;
};

export type AuthAttemptListResponse = {
  success: boolean;
  items: AuthAttempt[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type AuthAttemptOutcome = 'all' | 'failed' | 'succeeded';

export type AuthAttemptFilters = {
  page: number;
  limit: number;
  /** A full phone or IIN, already checked by `isCompleteSearch` — never a partial number. */
  search: string;
  outcome: AuthAttemptOutcome;
};
