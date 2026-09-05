import { MedAccount } from '@/modules/med-account';
import { DashboardShell } from '@/shared/ui';

export const MedAccountScreen = () => (
  <DashboardShell
    title="Медсчёт"
    subtitle="Суммы пополнения в приложении и оплаченные пополнения пациентов"
  >
    <MedAccount />
  </DashboardShell>
);
