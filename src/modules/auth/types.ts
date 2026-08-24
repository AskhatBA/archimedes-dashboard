import type { AdminUser } from '@/shared/lib';

export type { AdminUser };

export type AdminLoginValues = {
  email: string;
  password: string;
};

export type AdminLoginResponse = {
  success: boolean;
  accessToken: string;
  refreshToken: string;
  user: AdminUser;
};

export type AdminMeResponse = {
  success: boolean;
  user: AdminUser;
};

/** Error codes the sign-in form translates into a message for the operator. */
export type AuthErrorCode =
  | 'INVALID_CREDENTIALS'
  | 'TOO_MANY_LOGIN_ATTEMPTS'
  | 'FORBIDDEN';
