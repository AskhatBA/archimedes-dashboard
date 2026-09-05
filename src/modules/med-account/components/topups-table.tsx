import {
  Badge,
  Group,
  ScrollArea,
  Stack,
  Table,
  Text,
  Tooltip,
} from '@mantine/core';
import dayjs from 'dayjs';
import { STATUS_COLORS, STATUS_LABELS, formatAmount } from '../constants';
import type { Topup } from '../types';

type Props = {
  items: Topup[];
  onSelect: (topup: Topup) => void;
};

export const TopupsTable = ({ items, onSelect }: Props) => (
  <ScrollArea>
    <Table verticalSpacing="sm" highlightOnHover miw={900}>
      <Table.Thead>
        <Table.Tr>
          <Table.Th w={160}>Дата</Table.Th>
          <Table.Th>Пациент</Table.Th>
          <Table.Th ta="right" w={140}>
            Сумма
          </Table.Th>
          <Table.Th w={180}>Статус</Table.Th>
          <Table.Th>Комментарий</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {items.map((topup) => (
          <Table.Tr
            key={topup.id}
            onClick={() => onSelect(topup)}
            style={{ cursor: 'pointer' }}
          >
            <Table.Td>
              <Stack gap={2}>
                <Text size="sm">
                  {dayjs(topup.createdAt).format('DD.MM.YYYY HH:mm')}
                </Text>
                {topup.creditedAt && (
                  <Text size="xs" c="dimmed">
                    зачислено {dayjs(topup.creditedAt).format('DD.MM.YYYY')}
                  </Text>
                )}
              </Stack>
            </Table.Td>
            <Table.Td>
              <Stack gap={2}>
                <Text size="sm" fw={500}>
                  {topup.patientName ?? '—'}
                </Text>
                <Text size="xs" c="dimmed">
                  {topup.patientPhone}
                  {topup.patientIin ? ` · ИИН ${topup.patientIin}` : ''}
                </Text>
              </Stack>
            </Table.Td>
            <Table.Td ta="right">
              <Text size="sm" fw={600}>
                {formatAmount(topup.amount)}
              </Text>
            </Table.Td>
            <Table.Td>
              <Group gap={6} wrap="nowrap">
                <Badge
                  variant="light"
                  color={STATUS_COLORS[topup.status]}
                  radius="sm"
                >
                  {STATUS_LABELS[topup.status]}
                </Badge>
                {/* Без beneficiaryId зачислить в системе страховой не по чему. */}
                {!topup.beneficiaryId && (
                  <Tooltip label="В МИС не нашёлся beneficiaryId — уточните пациента вручную">
                    <Badge variant="outline" color="gray" radius="sm">
                      без ID
                    </Badge>
                  </Tooltip>
                )}
              </Group>
            </Table.Td>
            <Table.Td>
              <Text size="sm" c="dimmed" lineClamp={2}>
                {topup.comment ?? '—'}
              </Text>
            </Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  </ScrollArea>
);
