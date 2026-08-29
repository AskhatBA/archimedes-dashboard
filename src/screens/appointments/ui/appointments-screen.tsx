import { Appointments } from '@/modules/appointments';
import { DashboardShell } from '@/shared/ui';

export const AppointmentsScreen = () => (
  <DashboardShell
    title="Приёмы"
    subtitle="Записи пациентов к врачам, оформленные через мобильное приложение"
  >
    <Appointments />
  </DashboardShell>
);
