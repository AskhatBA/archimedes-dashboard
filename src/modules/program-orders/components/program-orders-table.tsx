import { Badge, Group, ScrollArea, Stack, Table, Text, Tooltip } from '@mantine/core';
import dayjs from 'dayjs';
import {
  PROGRAM_ORDER_CATEGORY_COLORS,
  PROGRAM_ORDER_CATEGORY_LABELS,
  PROGRAM_ORDER_STATUS_COLORS,
  PROGRAM_ORDER_STATUS_HINTS,
  PROGRAM_ORDER_STATUS_LABELS,
  formatTenge,
  pluralPrograms,
} from '../constants';
import type { ProgramOrder, ProgramOrderCategory } from '../types';

type Props = {
  items: ProgramOrder[];
  onSelect: (order: ProgramOrder) => void;
};

/** One badge per catalogue present in the order, not one per program — a cart of five
 *  check-ups is still a check-up order, and the titles are listed in the row below. */
const categoriesOf = (order: ProgramOrder): ProgramOrderCategory[] => [
  ...new Set(order.items.map((item) => item.category)),
];

export const ProgramOrdersTable = ({ items, onSelect }: Props) => (
  <ScrollArea>
    <Table verticalSpacing="sm" highlightOnHover miw={960}>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Пациент</Table.Th>
          <Table.Th>Программы</Table.Th>
          <Table.Th ta="right">Сумма</Table.Th>
          <Table.Th>Статус</Table.Th>
          <Table.Th>Оплачена</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {items.map((order) => (
          <Table.Tr
            key={order.id}
            style={{ cursor: 'pointer' }}
            onClick={() => onSelect(order)}
          >
            <Table.Td>
              <Stack gap={2}>
                <Text size="sm" fw={500}>
                  {order.patientName ?? 'Профиль не заполнен'}
                </Text>
                <Text size="xs" c="dimmed">
                  {order.patientIin ?? order.patientPhone}
                </Text>
              </Stack>
            </Table.Td>
            <Table.Td>
              <Stack gap={4}>
                <Group gap={6}>
                  {categoriesOf(order).map((category) => (
                    <Badge
                      key={category}
                      size="sm"
                      variant="light"
                      color={PROGRAM_ORDER_CATEGORY_COLORS[category]}
                    >
                      {PROGRAM_ORDER_CATEGORY_LABELS[category]}
                    </Badge>
                  ))}
                </Group>
                <Text size="xs" c="dimmed" lineClamp={2}>
                  {order.items.map((item) => item.title).join(' · ')}
                </Text>
              </Stack>
            </Table.Td>
            <Table.Td ta="right">
              <Stack gap={2}>
                <Text size="sm" fw={600}>
                  {formatTenge(order.total)}
                </Text>
                <Text size="xs" c="dimmed">
                  {order.items.length} {pluralPrograms(order.items.length)}
                </Text>
              </Stack>
            </Table.Td>
            <Table.Td>
              <Tooltip label={PROGRAM_ORDER_STATUS_HINTS[order.status]}>
                <Badge
                  color={PROGRAM_ORDER_STATUS_COLORS[order.status]}
                  variant="light"
                >
                  {PROGRAM_ORDER_STATUS_LABELS[order.status]}
                </Badge>
              </Tooltip>
            </Table.Td>
            <Table.Td>
              <Tooltip label={dayjs(order.createdAt).format('D MMMM YYYY, HH:mm')}>
                <Text size="sm" c="dimmed">
                  {dayjs(order.createdAt).format('D MMM YYYY')}
                </Text>
              </Tooltip>
            </Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  </ScrollArea>
);
