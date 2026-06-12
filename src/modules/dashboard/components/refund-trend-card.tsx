import { LineChart } from '@mantine/charts';
import { Card, Group, Stack, Text } from '@mantine/core';
import dayjs from 'dayjs';
import type { RefundPoint } from '../types';

type Props = { data: RefundPoint[] };

const formatTenge = (n: number) =>
  n >= 1000 ? `${(n / 1000).toFixed(0)}k` : String(n);

export const RefundTrendCard = ({ data }: Props) => {
  const formatted = data.map((d) => ({
    ...d,
    date: dayjs(d.date).format('MMM D'),
  }));

  const total = data.reduce((s, d) => s + d.amount, 0);
  const totalRequests = data.reduce((s, d) => s + d.requests, 0);

  return (
    <Card withBorder radius="lg" padding="lg" h="100%">
      <Stack gap="md" h="100%">
        <Group justify="space-between" align="flex-start">
          <Stack gap={2}>
            <Text fw={600} size="lg">
              Страховые возмещения
            </Text>
            <Text size="sm" c="dimmed">
              Последние 30 дней
            </Text>
          </Stack>
          <Group gap="xl">
            <Stack gap={0} align="flex-end">
              <Text size="xs" c="dimmed" tt="uppercase" lts={0.5}>
                Сумма
              </Text>
              <Text fw={700} size="lg">
                ₸{total.toLocaleString('ru-RU')}
              </Text>
            </Stack>
            <Stack gap={0} align="flex-end">
              <Text size="xs" c="dimmed" tt="uppercase" lts={0.5}>
                Заявок
              </Text>
              <Text fw={700} size="lg">
                {totalRequests}
              </Text>
            </Stack>
          </Group>
        </Group>
        <LineChart
          h={260}
          data={formatted}
          dataKey="date"
          withLegend
          legendProps={{ verticalAlign: 'bottom', height: 28 }}
          series={[
            { name: 'amount', label: 'Сумма (₸)', color: 'violet.6' },
          ]}
          valueFormatter={formatTenge}
          curveType="natural"
          withDots={false}
          gridAxis="xy"
        />
      </Stack>
    </Card>
  );
};
