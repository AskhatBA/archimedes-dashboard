import {
  Alert,
  Center,
  Loader,
  SimpleGrid,
  Stack,
  Text,
} from '@mantine/core';
import {
  IconAlertTriangle,
  IconCalendarEvent,
  IconCalendarStats,
  IconCash,
  IconFileInvoice,
  IconUserHeart,
} from '@tabler/icons-react';
import { KpiCard } from './components/kpi-card';
import { useDashboard } from './hooks/use-dashboard';

const fmt = (n: number) => n.toLocaleString('ru-RU');

export const Dashboard = () => {
  const { data, isLoading, isError, error, refetch } = useDashboard();

  if (isLoading) {
    return (
      <Center mih={400}>
        <Loader color="violet" />
      </Center>
    );
  }

  if (isError || !data) {
    return (
      <Alert
        color="red"
        variant="light"
        radius="md"
        icon={<IconAlertTriangle size={18} />}
        title="Не удалось загрузить статистику"
      >
        <Stack gap={6} align="flex-start">
          <Text size="sm">
            {error instanceof Error ? error.message : 'Неизвестная ошибка'}
          </Text>
          <Text
            size="sm"
            c="red"
            fw={600}
            style={{ cursor: 'pointer' }}
            onClick={() => refetch()}
          >
            Повторить
          </Text>
        </Stack>
      </Alert>
    );
  }

  return (
    <SimpleGrid cols={{ base: 1, sm: 2, lg: 3, xl: 5 }} spacing="lg">
      <KpiCard
        label="Пациенты"
        value={fmt(data.totalPatients)}
        hint="Профили пациентов в системе"
        icon={IconUserHeart}
        iconColor="pink"
      />
      <KpiCard
        label="Заявки"
        value={fmt(data.totalRefundRequests)}
        hint="Всего подано на возмещение"
        icon={IconFileInvoice}
        iconColor="violet"
      />
      <KpiCard
        label="Всего приёмов"
        value={fmt(data.totalAppointments)}
        hint="За всё время"
        icon={IconCalendarStats}
        iconColor="cyan"
      />
      <KpiCard
        label="Приёмы сегодня"
        value={fmt(data.appointmentsToday)}
        hint="Записи на текущую дату"
        icon={IconCalendarEvent}
        iconColor="teal"
      />
      <KpiCard
        label="Возмещения"
        value={fmt(data.acceptedRefunds)}
        hint="Заявки, принятые страховой"
        icon={IconCash}
        iconColor="grape"
      />
    </SimpleGrid>
  );
};
