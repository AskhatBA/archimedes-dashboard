import { DonutChart } from '@mantine/charts';
import { Card, Group, Stack, Text } from '@mantine/core';

type Slice = { name: string; value: number; color: string };

type Props = {
  title: string;
  subtitle: string;
  data: Slice[];
  centerLabel: string;
};

const formatNumber = (n: number) =>
  n.toLocaleString('ru-RU', { maximumFractionDigits: 0 });

export const DistributionCard = ({ title, subtitle, data, centerLabel }: Props) => {
  const total = data.reduce((sum, s) => sum + s.value, 0);

  return (
    <Card withBorder radius="lg" padding="lg" h="100%">
      <Stack gap="md" h="100%">
        <Stack gap={2}>
          <Text fw={600} size="lg">
            {title}
          </Text>
          <Text size="sm" c="dimmed">
            {subtitle}
          </Text>
        </Stack>
        <Group justify="center">
          <DonutChart
            data={data}
            size={180}
            thickness={28}
            withLabelsLine={false}
            chartLabel={centerLabel}
            tooltipDataSource="segment"
          />
        </Group>
        <Stack gap={8}>
          {data.map((s) => {
            const pct = total === 0 ? 0 : (s.value / total) * 100;
            return (
              <Group key={s.name} justify="space-between" wrap="nowrap">
                <Group gap={8} wrap="nowrap">
                  <div
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: 3,
                      background: `var(--mantine-color-${s.color.replace('.', '-')})`,
                    }}
                  />
                  <Text size="sm">{s.name}</Text>
                </Group>
                <Group gap={10} wrap="nowrap">
                  <Text size="sm" c="dimmed">
                    {pct.toFixed(1)}%
                  </Text>
                  <Text size="sm" fw={600}>
                    {formatNumber(s.value)}
                  </Text>
                </Group>
              </Group>
            );
          })}
        </Stack>
      </Stack>
    </Card>
  );
};
