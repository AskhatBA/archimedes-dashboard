import { BarChart } from '@mantine/charts';
import { Card, Stack, Text } from '@mantine/core';
import dayjs from 'dayjs';
import type { TelemedicinePoint } from '../types';

type Props = { data: TelemedicinePoint[] };

export const TelemedicineCard = ({ data }: Props) => {
  const formatted = data.map((d) => ({
    ...d,
    date: dayjs(d.date).format('MMM D'),
  }));

  return (
    <Card withBorder radius="lg" padding="lg" h="100%">
      <Stack gap="md" h="100%">
        <Stack gap={2}>
          <Text fw={600} size="lg">
            Телемедицина и очно
          </Text>
          <Text size="sm" c="dimmed">
            Распределение визитов по дням — последние 14 дней
          </Text>
        </Stack>
        <BarChart
          h={260}
          data={formatted}
          dataKey="date"
          type="stacked"
          withLegend
          legendProps={{ verticalAlign: 'bottom', height: 28 }}
          series={[
            { name: 'inPerson', label: 'Очно', color: 'violet.6' },
            { name: 'telemedicine', label: 'Телемедицина', color: 'cyan.5' },
          ]}
          barProps={{ radius: 4 }}
        />
      </Stack>
    </Card>
  );
};
