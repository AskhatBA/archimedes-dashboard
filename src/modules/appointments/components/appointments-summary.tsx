import { Card, Group, SimpleGrid, Stack, Text, ThemeIcon } from '@mantine/core';
import {
  IconCalendarEvent,
  IconCalendarStats,
  IconClockHour4,
} from '@tabler/icons-react';
import { pluralAppointments } from '../constants';

type Props = {
  total: number;
  pageCount: number;
  todayCount: number | undefined;
  upcomingCount: number | undefined;
};

const Tile = ({
  label,
  value,
  hint,
  icon: Icon,
  color,
}: {
  label: string;
  value: string;
  hint: string;
  icon: typeof IconCalendarStats;
  color: string;
}) => (
  <Card withBorder radius="lg" padding="lg">
    <Group justify="space-between" align="flex-start" wrap="nowrap">
      <Stack gap={4}>
        <Text size="sm" c="dimmed">
          {label}
        </Text>
        <Text fw={700} size="xl" lh={1.2}>
          {value}
        </Text>
        <Text size="xs" c="dimmed">
          {hint}
        </Text>
      </Stack>
      <ThemeIcon variant="light" color={color} size={38} radius="md">
        <Icon size={20} />
      </ThemeIcon>
    </Group>
  </Card>
);

const fmt = (value: number | undefined) =>
  value === undefined ? '—' : value.toLocaleString('ru-RU');

/**
 * The first figure follows the filter bar; the other two never do — they are what the
 * clinic has on today, which must not change while an admin narrows the table.
 */
export const AppointmentsSummary = ({
  total,
  pageCount,
  todayCount,
  upcomingCount,
}: Props) => (
  <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="lg">
    <Tile
      label="Приёмов по фильтру"
      value={total.toLocaleString('ru-RU')}
      hint={`Показано ${pageCount} ${pluralAppointments(pageCount)} на странице`}
      icon={IconCalendarStats}
      color="violet"
    />
    <Tile
      label="Сегодня"
      value={fmt(todayCount)}
      hint="Записи на текущую дату, без учёта фильтров"
      icon={IconCalendarEvent}
      color="teal"
    />
    <Tile
      label="Предстоящие"
      value={fmt(upcomingCount)}
      hint="Запланированные с сегодняшнего дня"
      icon={IconClockHour4}
      color="orange"
    />
  </SimpleGrid>
);
