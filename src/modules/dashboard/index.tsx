import { Center, Grid, Loader, SimpleGrid, Stack } from '@mantine/core';
import {
  IconCalendarEvent,
  IconCash,
  IconDeviceMobile,
  IconStethoscope,
  IconUserHeart,
  IconUsers,
} from '@tabler/icons-react';
import { AppVersionsCard } from './components/app-versions-card';
import { AppointmentsTrendCard } from './components/appointments-trend-card';
import { DistributionCard } from './components/distribution-card';
import { KpiCard } from './components/kpi-card';
import { NotificationsCard } from './components/notifications-card';
import { RecentAppointmentsCard } from './components/recent-appointments-card';
import { RecentRefundsCard } from './components/recent-refunds-card';
import { RefundTrendCard } from './components/refund-trend-card';
import { TelemedicineCard } from './components/telemedicine-card';
import { TopDoctorsCard } from './components/top-doctors-card';
import { useDashboard } from './hooks/use-dashboard';

const fmt = (n: number) => n.toLocaleString('ru-RU');

export const Dashboard = () => {
  const { data, isLoading } = useDashboard();

  if (isLoading || !data) {
    return (
      <Center mih={400}>
        <Loader color="violet" />
      </Center>
    );
  }

  return (
    <Stack gap="lg">
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 3, xl: 6 }} spacing="lg">
        <KpiCard
          label="Всего пользователей"
          value={fmt(data.kpis.totalUsers)}
          deltaPct={data.kpis.usersDeltaPct}
          icon={IconUsers}
          iconColor="violet"
        />
        <KpiCard
          label="Пациенты"
          value={fmt(data.kpis.totalPatients)}
          deltaPct={data.kpis.patientsDeltaPct}
          icon={IconUserHeart}
          iconColor="pink"
        />
        <KpiCard
          label="Врачи"
          value={fmt(data.kpis.totalDoctors)}
          deltaPct={data.kpis.doctorsDeltaPct}
          icon={IconStethoscope}
          iconColor="cyan"
        />
        <KpiCard
          label="Приёмы сегодня"
          value={fmt(data.kpis.appointmentsToday)}
          deltaPct={data.kpis.appointmentsTodayDeltaPct}
          icon={IconCalendarEvent}
          iconColor="teal"
        />
        <KpiCard
          label="Возмещения (мес)"
          value={`₸${fmt(data.kpis.refundAmountMonth)}`}
          deltaPct={data.kpis.refundAmountDeltaPct}
          icon={IconCash}
          iconColor="grape"
        />
        <KpiCard
          label="Активные устройства"
          value={fmt(data.kpis.activeDevices)}
          deltaPct={data.kpis.activeDevicesDeltaPct}
          icon={IconDeviceMobile}
          iconColor="indigo"
        />
      </SimpleGrid>

      <Grid>
        <Grid.Col span={{ base: 12, lg: 8 }}>
          <AppointmentsTrendCard data={data.appointmentTrend} />
        </Grid.Col>
        <Grid.Col span={{ base: 12, lg: 4 }}>
          <DistributionCard
            title="Приёмы по статусу"
            subtitle="Последние 30 дней"
            data={data.statusDistribution}
            centerLabel={fmt(
              data.statusDistribution.reduce((s, x) => s + x.value, 0),
            )}
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, lg: 8 }}>
          <TelemedicineCard data={data.telemedicineSplit} />
        </Grid.Col>
        <Grid.Col span={{ base: 12, lg: 4 }}>
          <DistributionCard
            title="Пользователи по роли"
            subtitle="По всей платформе"
            data={data.roleDistribution}
            centerLabel={fmt(
              data.roleDistribution.reduce((s, x) => s + x.value, 0),
            )}
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, lg: 8 }}>
          <RefundTrendCard data={data.refundTrend} />
        </Grid.Col>
        <Grid.Col span={{ base: 12, lg: 4 }}>
          <DistributionCard
            title="Устройства по платформе"
            subtitle="Зарегистрированные push-токены"
            data={data.platformDistribution}
            centerLabel={fmt(
              data.platformDistribution.reduce((s, x) => s + x.value, 0),
            )}
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, lg: 8 }}>
          <RecentAppointmentsCard data={data.recentAppointments} />
        </Grid.Col>
        <Grid.Col span={{ base: 12, lg: 4 }}>
          <TopDoctorsCard data={data.topDoctors} />
        </Grid.Col>

        <Grid.Col span={{ base: 12, lg: 8 }}>
          <RecentRefundsCard data={data.recentRefunds} />
        </Grid.Col>
        <Grid.Col span={{ base: 12, lg: 4 }}>
          <Stack gap="lg">
            <NotificationsCard data={data.notificationStats} />
            <AppVersionsCard data={data.appVersions} />
          </Stack>
        </Grid.Col>
      </Grid>
    </Stack>
  );
};
