import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type AdminUser = {
  id: string;
  email: string | null;
  role: string;
};

type Session = {
  accessToken: string;
  refreshToken: string;
  user: AdminUser;
};

type AuthState = {
  token: string | null;
  refreshToken: string | null;
  user: AdminUser | null;
  setSession: (session: Session) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      refreshToken: null,
      user: null,
      setSession: ({ accessToken, refreshToken, user }) =>
        set({ token: accessToken, refreshToken, user }),
      logout: () => set({ token: null, refreshToken: null, user: null }),
    }),
    { name: 'auth-store' },
  ),
);
