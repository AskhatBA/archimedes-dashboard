import { Card, Group, Stack, Text, ThemeIcon } from '@mantine/core';
import type { Icon } from '@tabler/icons-react';

type Props = {
  label: string;
  value: string;
  hint: string;
  icon: Icon;
  iconColor: string;
};

export const KpiCard = ({ label, value, hint, icon: Icon, iconColor }: Props) => (
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
        <Text size="sm" c="dimmed">
          {hint}
        </Text>
      </Stack>
    </Stack>
  </Card>
);
