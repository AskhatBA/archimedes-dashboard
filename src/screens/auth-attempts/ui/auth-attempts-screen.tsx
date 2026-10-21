import { AuthAttempts } from '@/modules/auth-attempts';
import { DashboardShell } from '@/shared/ui';

export const AuthAttemptsScreen = () => (
  <DashboardShell
    title="Попытки входа"
    subtitle="Входы и регистрации из мобильного приложения: кто, когда и почему не получилось"
  >
    <AuthAttempts />
  </DashboardShell>
);
