import {
  Badge,
  Card,
  ScrollArea,
  Stack,
  Table,
  Text,
} from '@mantine/core';
import dayjs from 'dayjs';
import type { RefundRow } from '../types';

type Props = { data: RefundRow[] };

const stateColor: Record<RefundRow['state'], string> = {
  approved: 'teal',
  pending: 'yellow',
  rejected: 'red',
};

const stateLabel: Record<RefundRow['state'], string> = {
  approved: 'Одобрено',
  pending: 'В ожидании',
  rejected: 'Отклонено',
};

export const RecentRefundsCard = ({ data }: Props) => (
  <Card withBorder radius="lg" padding="lg" h="100%">
    <Stack gap="md" h="100%">
      <Stack gap={2}>
        <Text fw={600} size="lg">
          Последние заявки на возмещение
        </Text>
        <Text size="sm" c="dimmed">
          Свежие страховые заявки
        </Text>
      </Stack>
      <ScrollArea>
        <Table verticalSpacing="sm" highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Пациент</Table.Th>
              <Table.Th>Категория</Table.Th>
              <Table.Th ta="right">Сумма</Table.Th>
              <Table.Th>Дата</Table.Th>
              <Table.Th>Состояние</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {data.map((r) => (
              <Table.Tr key={r.id}>
                <Table.Td>
                  <Text size="sm" fw={500}>
                    {r.patientName}
                  </Text>
                </Table.Td>
                <Table.Td>
                  <Text size="sm">{r.category}</Text>
                </Table.Td>
                <Table.Td ta="right">
                  <Text size="sm" fw={600}>
                    ₸{r.amount.toLocaleString('ru-RU')}
                  </Text>
                </Table.Td>
                <Table.Td>
                  <Text size="sm" c="dimmed">
                    {dayjs(r.date).format('D MMM YYYY')}
                  </Text>
                </Table.Td>
                <Table.Td>
                  <Badge color={stateColor[r.state]} variant="light">
                    {stateLabel[r.state]}
                  </Badge>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </ScrollArea>
    </Stack>
  </Card>
);
