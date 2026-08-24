import { Patients } from '@/modules/patients';
import { DashboardShell } from '@/shared/ui';

export const PatientsScreen = () => (
  <DashboardShell
    title="Пациенты"
    subtitle="Профили пациентов, заполненные в мобильном приложении"
  >
    <Patients />
  </DashboardShell>
);
