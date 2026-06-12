import {
  Avatar,
  Badge,
  Card,
  Group,
  Indicator,
  Progress,
  Stack,
  Text,
} from '@mantine/core';
import { IconStarFilled } from '@tabler/icons-react';
import type { DoctorRow } from '../types';

type Props = { data: DoctorRow[] };

const statusColor: Record<DoctorRow['status'], string> = {
  active: 'teal',
  away: 'yellow',
  offline: 'gray',
};

const initials = (name: string) =>
  name
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

export const TopDoctorsCard = ({ data }: Props) => {
  const max = Math.max(...data.map((d) => d.appointments));

  return (
    <Card withBorder radius="lg" padding="lg" h="100%">
      <Stack gap="md" h="100%">
        <Stack gap={2}>
          <Text fw={600} size="lg">
            Лучшие врачи
          </Text>
          <Text size="sm" c="dimmed">
            По числу приёмов за месяц
          </Text>
        </Stack>
        <Stack gap="md">
          {data.map((doctor) => (
            <Stack key={doctor.id} gap={6}>
              <Group justify="space-between" wrap="nowrap">
                <Group gap={10} wrap="nowrap">
                  <Indicator
                    color={statusColor[doctor.status]}
                    size={10}
                    offset={4}
                    withBorder
                    position="bottom-end"
                  >
                    <Avatar radius="xl" color="violet" size={36}>
                      {initials(doctor.fullName)}
                    </Avatar>
                  </Indicator>
                  <Stack gap={0}>
                    <Text size="sm" fw={500}>
                      {doctor.fullName}
                    </Text>
                    <Text size="xs" c="dimmed">
                      {doctor.specialization}
                    </Text>
                  </Stack>
                </Group>
                <Group gap={10} wrap="nowrap">
                  <Badge
                    variant="light"
                    color="yellow"
                    leftSection={<IconStarFilled size={10} />}
                  >
                    {doctor.rating.toFixed(1)}
                  </Badge>
                  <Text size="sm" fw={600}>
                    {doctor.appointments}
                  </Text>
                </Group>
              </Group>
              <Progress
                value={(doctor.appointments / max) * 100}
                size="sm"
                radius="xl"
                color="violet"
              />
            </Stack>
          ))}
        </Stack>
      </Stack>
    </Card>
  );
};
