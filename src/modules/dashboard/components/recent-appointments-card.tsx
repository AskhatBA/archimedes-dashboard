import {
  Avatar,
  Badge,
  Card,
  Group,
  ScrollArea,
  Stack,
  Table,
  Text,
} from '@mantine/core';
import { IconVideo } from '@tabler/icons-react';
import dayjs from 'dayjs';
import type { AppointmentRow, AppointmentStatus } from '../types';

type Props = { data: AppointmentRow[] };

const statusColor: Record<AppointmentStatus, string> = {
  COMPLETED: 'teal',
  SCHEDULED: 'violet',
  CANCELLED: 'red',
};

const statusLabel: Record<AppointmentStatus, string> = {
  COMPLETED: 'Завершён',
  SCHEDULED: 'Запланирован',
  CANCELLED: 'Отменён',
};

const initials = (name: string) =>
  name
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

export const RecentAppointmentsCard = ({ data }: Props) => (
  <Card withBorder radius="lg" padding="lg" h="100%">
    <Stack gap="md" h="100%">
      <Group justify="space-between">
        <Stack gap={2}>
          <Text fw={600} size="lg">
            Последние приёмы
          </Text>
          <Text size="sm" c="dimmed">
            Лента событий по всем клиникам
          </Text>
        </Stack>
      </Group>
      <ScrollArea>
        <Table verticalSpacing="sm" highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Пациент</Table.Th>
              <Table.Th>Врач</Table.Th>
              <Table.Th>Когда</Table.Th>
              <Table.Th>Тип</Table.Th>
              <Table.Th>Статус</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {data.map((row) => (
              <Table.Tr key={row.id}>
                <Table.Td>
                  <Group gap={10} wrap="nowrap">
                    <Avatar color="violet" radius="xl" size={32}>
                      {initials(row.patientName)}
                    </Avatar>
                    <Text size="sm" fw={500}>
                      {row.patientName}
                    </Text>
                  </Group>
                </Table.Td>
                <Table.Td>
                  <Stack gap={0}>
                    <Text size="sm" fw={500}>
                      {row.doctorName}
                    </Text>
                    <Text size="xs" c="dimmed">
                      {row.specialization}
                    </Text>
                  </Stack>
                </Table.Td>
                <Table.Td>
                  <Text size="sm">
                    {dayjs(row.dateTime).format('MMM D · HH:mm')}
                  </Text>
                </Table.Td>
                <Table.Td>
                  {row.isTelemedicine ? (
                    <Badge
                      variant="light"
                      color="cyan"
                      leftSection={<IconVideo size={12} />}
                    >
                      Онлайн
                    </Badge>
                  ) : (
                    <Badge variant="light" color="gray">
                      Очно
                    </Badge>
                  )}
                </Table.Td>
                <Table.Td>
                  <Badge color={statusColor[row.status]} variant="light">
                    {statusLabel[row.status]}
                  </Badge>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </ScrollArea>
    </Stack>
  </Card>
);
