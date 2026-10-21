import { Logs } from '@/modules/app-logs';
import { DashboardShell } from '@/shared/ui';

export const LogsScreen = () => (
  <DashboardShell
    title="Логи"
    subtitle="Все запросы и ошибки бэкенда. Ищите по телефону или ИИН пациента, request ID или тексту"
  >
    <Logs />
  </DashboardShell>
);
