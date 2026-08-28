import { ProgramOrders } from '@/modules/program-orders';
import { DashboardShell } from '@/shared/ui';

export const ProgramOrdersScreen = () => (
  <DashboardShell
    title="Платные программы"
    subtitle="Оплаченные заявки на мед. планы и чек-апы из мобильного приложения"
  >
    <ProgramOrders />
  </DashboardShell>
);
