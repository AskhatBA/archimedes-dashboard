export type AppLogLevel = 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal';

/** One backend log line as pino wrote it, with the columns the backend filters on. */
export type AppLogLine = {
  /** A BigInt on the backend, sent as a string — it is also the paging cursor. */
  id: string;
  time: string;
  level: AppLogLevel | string;
  msg: string | null;
  reqId: string | null;
  userId: string | null;
  component: string | null;
  method: string | null;
  url: string | null;
  statusCode: number | null;
  durationMs: number | null;
  /** The whole line: `err` with its stack, `responseData` from an upstream, `query`… */
  data: Record<string, unknown>;
  userPhone: string | null;
  userName: string | null;
};

/**
 * Returned when the search was a phone or IIN. Logs hold neither, so the backend
 * follows the person's accounts and the requests of their sign-in attempts instead.
 */
export type AppLogPerson = {
  accounts: number;
  attempts: number;
};

export type AppLogListResponse = {
  success: boolean;
  items: AppLogLine[];
  nextCursor: string | null;
  person: AppLogPerson | null;
};

export type AppLogLevelFilter = 'all' | 'warn' | 'error';

export type AppLogFilters = {
  search: string;
  level: AppLogLevelFilter;
  /** `datetime-local` values, local time — converted to ISO when sent. */
  from: string;
  to: string;
};
