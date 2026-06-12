import { AreaChart } from '@mantine/charts';
import { Card, Group, SegmentedControl, Stack, Text } from '@mantine/core';
import { useState } from 'react';
import dayjs from 'dayjs';
import type { AppointmentTrendPoint } from '../types';

type Props = { data: AppointmentTrendPoint[] };

export const AppointmentsTrendCard = ({ data }: Props) => {
  const [range, setRange] = useState('30');
  const sliced = data.slice(-Number(range));
  const formatted = sliced.map((d) => ({
    ...d,
    date: dayjs(d.date).format('MMM D'),
  }));

  return (
    <Card withBorder radius="lg" padding="lg" h="100%">
      <Stack gap="md" h="100%">
        <Group justify="space-between" align="flex-start">
          <Stack gap={2}>
            <Text fw={600} size="lg">
              Приёмы по времени
            </Text>
            <Text size="sm" c="dimmed">
              Запланированные, завершённые и отменённые визиты
            </Text>
          </Stack>
          <SegmentedControl
            size="xs"
            value={range}
            onChange={setRange}
            data={[
              { label: '7д', value: '7' },
              { label: '14д', value: '14' },
              { label: '30д', value: '30' },
            ]}
          />
        </Group>
        <AreaChart
          h={280}
          data={formatted}
          dataKey="date"
          withGradient
          withLegend
          legendProps={{ verticalAlign: 'bottom', height: 28 }}
          series={[
            { name: 'completed', label: 'Завершено', color: 'teal.6' },
            { name: 'scheduled', label: 'Запланировано', color: 'violet.5' },
            { name: 'cancelled', label: 'Отменено', color: 'red.5' },
          ]}
          curveType="natural"
          tickLine="x"
          gridAxis="xy"
        />
      </Stack>
    </Card>
  );
};
