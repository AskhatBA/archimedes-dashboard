import { Refunds } from '@/modules/refunds';
import { DashboardShell } from '@/shared/ui';

export const RefundsScreen = () => (
  <DashboardShell
    title="Страховые возмещения"
    subtitle="Заявки, поданные пациентами из мобильного приложения"
  >
    <Refunds />
  </DashboardShell>
);
