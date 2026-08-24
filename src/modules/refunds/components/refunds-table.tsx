import {
  Group,
  ScrollArea,
  Stack,
  Table,
  Text,
  Tooltip,
  UnstyledButton,
} from '@mantine/core';
import { IconPaperclip } from '@tabler/icons-react';
import dayjs from 'dayjs';
import { categoryLabel } from '../constants';
import type { RefundRequest } from '../types';

type Props = {
  items: RefundRequest[];
  onSelect: (refund: RefundRequest) => void;
};

export const RefundsTable = ({ items, onSelect }: Props) => (
  <ScrollArea>
    <Table verticalSpacing="sm" highlightOnHover miw={900}>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Пациент</Table.Th>
          <Table.Th>Категория</Table.Th>
          <Table.Th ta="right">Сумма</Table.Th>
          <Table.Th>Дата услуги</Table.Th>
          <Table.Th>Подана</Table.Th>
          <Table.Th>Документы</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {items.map((refund) => (
          <Table.Tr
            key={refund.id}
            style={{ cursor: 'pointer' }}
            onClick={() => onSelect(refund)}
          >
            <Table.Td>
              <UnstyledButton component="div">
                <Stack gap={2}>
                  <Text size="sm" fw={500}>
                    {refund.patientName ?? 'Профиль не заполнен'}
                  </Text>
                  <Text size="xs" c="dimmed">
                    {refund.patientIin ?? refund.patientPhone}
                  </Text>
                </Stack>
              </UnstyledButton>
            </Table.Td>
            <Table.Td>
              <Text size="sm">{categoryLabel(refund.category)}</Text>
            </Table.Td>
            <Table.Td ta="right">
              <Text size="sm" fw={600}>
                ₸{refund.amount.toLocaleString('ru-RU')}
              </Text>
            </Table.Td>
            <Table.Td>
              <Text size="sm">{dayjs(refund.date).format('D MMM YYYY')}</Text>
            </Table.Td>
            <Table.Td>
              <Tooltip label={dayjs(refund.createdAt).format('D MMMM YYYY, HH:mm')}>
                <Text size="sm" c="dimmed">
                  {dayjs(refund.createdAt).format('D MMM YYYY')}
                </Text>
              </Tooltip>
            </Table.Td>
            <Table.Td>
              <Group gap={6}>
                <IconPaperclip size={14} opacity={0.6} />
                <Text size="sm" c="dimmed">
                  {refund.filesCount}
                </Text>
              </Group>
            </Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  </ScrollArea>
);
