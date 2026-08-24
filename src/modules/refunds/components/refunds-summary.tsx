import { Card, Group, SimpleGrid, Stack, Text, ThemeIcon } from '@mantine/core';
import { IconCash, IconFileInvoice, IconReceipt2 } from '@tabler/icons-react';

type Props = {
  total: number;
  totalAmount: number;
  pageCount: number;
};

const fmtAmount = (n: number) => `₸${Math.round(n).toLocaleString('ru-RU')}`;

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
  icon: typeof IconCash;
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

/**
 * The figures describe the whole filtered set, not the visible page — the backend
 * aggregates over the same `where` it counts with.
 */
export const RefundsSummary = ({ total, totalAmount, pageCount }: Props) => (
  <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="lg">
    <Tile
      label="Заявок по фильтру"
      value={total.toLocaleString('ru-RU')}
      hint={`Показано ${pageCount} на странице`}
      icon={IconFileInvoice}
      color="violet"
    />
    <Tile
      label="Сумма возмещений"
      value={fmtAmount(totalAmount)}
      hint="По всем заявкам фильтра"
      icon={IconCash}
      color="teal"
    />
    <Tile
      label="Средняя заявка"
      value={fmtAmount(total > 0 ? totalAmount / total : 0)}
      hint="Сумма ÷ количество"
      icon={IconReceipt2}
      color="cyan"
    />
  </SimpleGrid>
);
