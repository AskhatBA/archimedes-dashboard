import { Card, Group, SimpleGrid, Stack, Text, ThemeIcon } from '@mantine/core';
import { IconCash, IconInbox, IconShoppingCart } from '@tabler/icons-react';
import { formatTenge } from '../constants';

type Props = {
  total: number;
  totalAmount: number;
  pageCount: number;
  newCount: number | undefined;
};

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
 * The first two figures describe the whole filtered set rather than the visible page —
 * the backend aggregates over the same `where` it counts with. The third deliberately
 * ignores the filters: it is the queue an operator works down.
 */
export const ProgramOrdersSummary = ({
  total,
  totalAmount,
  pageCount,
  newCount,
}: Props) => (
  <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="lg">
    <Tile
      label="Заявок по фильтру"
      value={total.toLocaleString('ru-RU')}
      hint={`Показано ${pageCount} на странице`}
      icon={IconShoppingCart}
      color="violet"
    />
    <Tile
      label="Оплачено"
      value={formatTenge(totalAmount)}
      hint="По всем заявкам фильтра"
      icon={IconCash}
      color="teal"
    />
    <Tile
      label="Ждут обработки"
      value={newCount === undefined ? '—' : newCount.toLocaleString('ru-RU')}
      hint="Новые заявки, без учёта фильтров"
      icon={IconInbox}
      color="orange"
    />
  </SimpleGrid>
);
