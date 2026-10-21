import { Badge, Group, ScrollArea, Stack, Table, Text, Tooltip } from '@mantine/core';
import dayjs from 'dayjs';
import { errorOf, levelColor, messageHint, statusColor } from '../constants';
import type { AppLogLine } from '../types';

type Props = {
  items: AppLogLine[];
  selectedId: string | null;
  onSelect: (line: AppLogLine) => void;
};

/** The request (method, path, status, time) when the line has one, else just the message. */
const Event = ({ line }: { line: AppLogLine }) => {
  const error = errorOf(line);
  const hint = messageHint(line.msg);

  return (
    <Stack gap={2}>
      {line.url && (
        <Group gap={6} wrap="nowrap">
          {line.method && (
            <Text size="sm" fw={600} ff="monospace">
              {line.method.toUpperCase()}
            </Text>
          )}
          <Text size="sm" ff="monospace" style={{ wordBreak: 'break-all' }}>
            {line.url}
          </Text>
          {line.statusCode !== null && (
            <Badge size="sm" variant="light" color={statusColor(line.statusCode)}>
              {line.statusCode}
            </Badge>
          )}
          {line.durationMs !== null && (
            <Text size="xs" c="dimmed" style={{ whiteSpace: 'nowrap' }}>
              {line.durationMs} мс
            </Text>
          )}
        </Group>
      )}
      <Text size="xs" c={line.url ? 'dimmed' : undefined}>
        {hint ?? line.msg ?? '—'}
        {error?.message && (
          <Text span size="xs" c="red" fw={600}>
            {' '}
            · {error.message}
          </Text>
        )}
        {error?.cause && (
          <Text span size="xs" c="red">
            {' '}
            ({error.cause})
          </Text>
        )}
      </Text>
    </Stack>
  );
};

export const LogsTable = ({ items, selectedId, onSelect }: Props) => (
  <ScrollArea>
    <Table verticalSpacing={6} highlightOnHover miw={1000}>
      <Table.Thead>
        <Table.Tr>
          <Table.Th w={150}>Время</Table.Th>
          <Table.Th w={90}>Уровень</Table.Th>
          <Table.Th>Событие</Table.Th>
          <Table.Th w={120}>Компонент</Table.Th>
          <Table.Th w={200}>Кто</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {items.map((line) => (
          <Table.Tr
            key={line.id}
            onClick={() => onSelect(line)}
            bg={line.id === selectedId ? 'var(--mantine-color-violet-light)' : undefined}
            style={{ cursor: 'pointer' }}
          >
            <Table.Td>
              <Tooltip label={dayjs(line.time).format('D MMMM YYYY, HH:mm:ss.SSS')}>
                <Text size="xs" ff="monospace" style={{ whiteSpace: 'nowrap' }}>
                  {dayjs(line.time).format('D MMM HH:mm:ss')}
                </Text>
              </Tooltip>
            </Table.Td>
            <Table.Td>
              <Badge size="sm" variant="light" color={levelColor(line.level)}>
                {line.level}
              </Badge>
            </Table.Td>
            <Table.Td>
              <Event line={line} />
            </Table.Td>
            <Table.Td>
              <Text size="xs" c="dimmed">
                {line.component ?? '—'}
              </Text>
            </Table.Td>
            <Table.Td>
              {line.userId ? (
                <Stack gap={0}>
                  <Text size="xs" fw={500}>
                    {line.userName ?? 'Профиль не заполнен'}
                  </Text>
                  <Text size="xs" c="dimmed">
                    {line.userPhone ?? line.userId.slice(0, 8)}
                  </Text>
                </Stack>
              ) : (
                <Text size="xs" c="dimmed">
                  Без авторизации
                </Text>
              )}
            </Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  </ScrollArea>
);
