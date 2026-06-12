import dayjs from 'dayjs';
import { Dashboard } from '@/modules/dashboard';
import { DashboardShell } from '@/shared/ui';

export const OverviewScreen = () => (
  <DashboardShell
    title="Обзор"
    subtitle={`Сводка за ${dayjs('2026-05-19').format('dddd, D MMMM YYYY')} г.`}
  >
    <Dashboard />
  </DashboardShell>
);
