import { Badge, ScrollArea, Stack, Table, Text, Tooltip } from '@mantine/core';
import dayjs from 'dayjs';
import {
  appVersionOf,
  eventColor,
  eventLabel,
  reasonLabel,
  serviceLabel,
  stepLabel,
} from '../constants';
import type { AuthAttempt } from '../types';

type Props = {
  items: AuthAttempt[];
  onSelect: (attempt: AuthAttempt) => void;
};

const Reason = ({ attempt }: { attempt: AuthAttempt }) => {
  const { reason, step, upstream } = attempt.metadata ?? {};

  if (attempt.success || !reason) {
    return (
      <Text size="sm" c="dimmed">
        —
      </Text>
    );
  }

  return (
    <Stack gap={2}>
      <Text size="sm" fw={500}>
        {reasonLabel(reason)}
      </Text>
      {upstream && (
        <Text size="xs" c="red">
          {serviceLabel(upstream.service)}
          {upstream.status ? ` ${upstream.status}` : ''}
          {upstream.message ? `: ${upstream.message}` : ''}
        </Text>
      )}
      {step && (
        <Text size="xs" c="dimmed">
          {stepLabel(step)}
        </Text>
      )}
    </Stack>
  );
};

export const AuthAttemptsTable = ({ items, onSelect }: Props) => (
  <ScrollArea>
    <Table verticalSpacing="sm" highlightOnHover miw={960}>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Время</Table.Th>
          <Table.Th>Кто</Table.Th>
          <Table.Th>Событие</Table.Th>
          <Table.Th>Причина</Table.Th>
          <Table.Th>Версия</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {items.map((attempt) => (
          <Table.Tr
            key={attempt.id}
            style={{ cursor: 'pointer' }}
            onClick={() => onSelect(attempt)}
          >
            <Table.Td>
              <Tooltip label={dayjs(attempt.createdAt).format('D MMMM YYYY, HH:mm:ss')}>
                <Text size="sm" style={{ whiteSpace: 'nowrap' }}>
                  {dayjs(attempt.createdAt).format('D MMM, HH:mm')}
                </Text>
              </Tooltip>
            </Table.Td>
            <Table.Td>
              <Stack gap={2}>
                <Text size="sm" fw={500} c={attempt.patientName ? undefined : 'dimmed'}>
                  {attempt.patientName ?? (attempt.userId ? 'Профиль не заполнен' : 'Без аккаунта')}
                </Text>
                <Text size="xs" c="dimmed">
                  {[attempt.phone, attempt.iin].filter(Boolean).join(' · ') || '—'}
                </Text>
              </Stack>
            </Table.Td>
            <Table.Td>
              <Badge color={eventColor(attempt)} variant="light">
                {eventLabel(attempt)}
              </Badge>
            </Table.Td>
            <Table.Td>
              <Reason attempt={attempt} />
            </Table.Td>
            <Table.Td>
              <Text size="sm" c="dimmed" style={{ whiteSpace: 'nowrap' }}>
                {appVersionOf(attempt) ?? '—'}
              </Text>
            </Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  </ScrollArea>
);
