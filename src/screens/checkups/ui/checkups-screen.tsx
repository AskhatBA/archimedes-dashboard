import { Checkups } from '@/modules/checkups';
import { DashboardShell } from '@/shared/ui';

export const CheckupsScreen = () => (
  <DashboardShell
    title="Чек-апы"
    subtitle="Каталог платных программ, который видят пациенты в мобильном приложении"
  >
    <Checkups />
  </DashboardShell>
);
