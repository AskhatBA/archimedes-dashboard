import { Card, Group, Stack, Text, ThemeIcon } from '@mantine/core';
import { IconTrendingDown, IconTrendingUp } from '@tabler/icons-react';
import type { Icon } from '@tabler/icons-react';

type Props = {
  label: string;
  value: string;
  deltaPct: number;
  icon: Icon;
  iconColor: string;
};

export const KpiCard = ({ label, value, deltaPct, icon: Icon, iconColor }: Props) => {
  const positive = deltaPct >= 0;
  return (
    <Card withBorder radius="lg" padding="lg" h="100%">
      <Stack gap="md">
        <Group justify="space-between" align="flex-start">
          <Text size="sm" c="dimmed" fw={500} tt="uppercase" lts={0.5}>
            {label}
          </Text>
          <ThemeIcon variant="light" color={iconColor} size={38} radius="md">
            <Icon size={20} stroke={1.6} />
          </ThemeIcon>
        </Group>
        <Stack gap={4}>
          <Text size="28px" fw={700} lh={1}>
            {value}
          </Text>
          <Group gap={6} align="center">
            <ThemeIcon
              variant="light"
              color={positive ? 'teal' : 'red'}
              size={20}
              radius="xl"
            >
              {positive ? (
                <IconTrendingUp size={14} stroke={2} />
              ) : (
                <IconTrendingDown size={14} stroke={2} />
              )}
            </ThemeIcon>
            <Text size="sm" c={positive ? 'teal.6' : 'red.6'} fw={600}>
              {positive ? '+' : ''}
              {deltaPct.toFixed(1)}%
            </Text>
            <Text size="sm" c="dimmed">
              к прошлому периоду
            </Text>
          </Group>
        </Stack>
      </Stack>
    </Card>
  );
};
