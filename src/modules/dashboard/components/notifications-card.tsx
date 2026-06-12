import { Card, Group, RingProgress, Stack, Text } from '@mantine/core';
import { IconBellRinging } from '@tabler/icons-react';
import type { NotificationStats } from '../types';

type Props = { data: NotificationStats };

const fmt = (n: number) => n.toLocaleString('ru-RU');

export const NotificationsCard = ({ data }: Props) => {
  const deliveryRate = (data.delivered / data.sent) * 100;

  return (
    <Card withBorder radius="lg" padding="lg" h="100%">
      <Stack gap="md" h="100%">
        <Stack gap={2}>
          <Text fw={600} size="lg">
            Push-уведомления
          </Text>
          <Text size="sm" c="dimmed">
            Доставка и вовлечённость (30д)
          </Text>
        </Stack>
        <Group justify="center" gap="xl" mt="sm">
          <RingProgress
            size={140}
            thickness={12}
            roundCaps
            sections={[{ value: data.readRate, color: 'violet' }]}
            label={
              <Stack gap={0} align="center">
                <IconBellRinging
                  size={20}
                  style={{ color: 'var(--mantine-color-violet-6)' }}
                />
                <Text size="xl" fw={700}>
                  {data.readRate.toFixed(0)}%
                </Text>
                <Text size="xs" c="dimmed">
                  Прочитано
                </Text>
              </Stack>
            }
          />
        </Group>
        <Stack gap={8}>
          <Group justify="space-between">
            <Text size="sm" c="dimmed">
              Отправлено
            </Text>
            <Text size="sm" fw={600}>
              {fmt(data.sent)}
            </Text>
          </Group>
          <Group justify="space-between">
            <Text size="sm" c="dimmed">
              Доставлено
            </Text>
            <Group gap={6}>
              <Text size="sm" c="teal.6" fw={500}>
                {deliveryRate.toFixed(1)}%
              </Text>
              <Text size="sm" fw={600}>
                {fmt(data.delivered)}
              </Text>
            </Group>
          </Group>
          <Group justify="space-between">
            <Text size="sm" c="dimmed">
              Ошибки
            </Text>
            <Text size="sm" fw={600} c="red.6">
              {fmt(data.failed)}
            </Text>
          </Group>
        </Stack>
      </Stack>
    </Card>
  );
};
