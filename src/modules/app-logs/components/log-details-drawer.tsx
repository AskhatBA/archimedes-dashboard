import {
  ActionIcon,
  Badge,
  Center,
  Code,
  CopyButton,
  Divider,
  Drawer,
  Group,
  Loader,
  ScrollArea,
  Stack,
  Text,
  Tooltip,
  UnstyledButton,
} from '@mantine/core';
import { IconCheck, IconCopy } from '@tabler/icons-react';
import dayjs from 'dayjs';
import { errorOf, levelColor, messageHint, statusColor } from '../constants';
import { useRequestLogs } from '../hooks/use-app-logs';
import type { AppLogLine } from '../types';

type Props = {
  line: AppLogLine | null;
  onSelect: (line: AppLogLine) => void;
  onClose: () => void;
};

const Copy = ({ value }: { value: string }) => (
  <CopyButton value={value}>
    {({ copied, copy }) => (
      <Tooltip label={copied ? 'Скопировано' : 'Скопировать'}>
        <ActionIcon variant="subtle" color="gray" size="sm" onClick={copy}>
          {copied ? <IconCheck size={14} /> : <IconCopy size={14} />}
        </ActionIcon>
      </Tooltip>
    )}
  </CopyButton>
);

const Field = ({ label, value, copyable = false }: { label: string; value: string; copyable?: boolean }) => (
  <Stack gap={2}>
    <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
      {label}
    </Text>
    <Group gap={4} wrap="nowrap" align="flex-start">
      <Text size="sm" style={{ wordBreak: 'break-all' }}>
        {value}
      </Text>
      {copyable && <Copy value={value} />}
    </Group>
  </Stack>
);

/**
 * All lines that share this line's `reqId`, in order — for a failed request that is the
 * upstream call, the rejection and the response, which together say what went wrong.
 */
const RequestTimeline = ({
  line,
  onSelect,
}: {
  line: AppLogLine;
  onSelect: (line: AppLogLine) => void;
}) => {
  const { data, isPending, isError } = useRequestLogs(line.reqId);

  if (isPending) {
    return (
      <Center py="sm">
        <Loader size="sm" color="violet" />
      </Center>
    );
  }

  if (isError || !data) {
    return (
      <Text size="sm" c="red">
        Не удалось загрузить строки запроса
      </Text>
    );
  }

  return (
    <Stack gap={4}>
      {data.map((entry) => (
        <UnstyledButton
          key={entry.id}
          onClick={() => onSelect(entry)}
          p={6}
          style={{
            borderRadius: 6,
            background:
              entry.id === line.id ? 'var(--mantine-color-violet-light)' : undefined,
          }}
        >
          <Group gap={8} wrap="nowrap" align="flex-start">
            <Text size="xs" ff="monospace" c="dimmed" style={{ whiteSpace: 'nowrap' }}>
              {dayjs(entry.time).format('HH:mm:ss.SSS')}
            </Text>
            <Badge size="xs" variant="light" color={levelColor(entry.level)}>
              {entry.level}
            </Badge>
            <Text size="xs" style={{ wordBreak: 'break-word' }}>
              {entry.component ? `[${entry.component}] ` : ''}
              {messageHint(entry.msg) ?? entry.msg}
              {errorOf(entry)?.message ? ` · ${errorOf(entry)?.message}` : ''}
              {errorOf(entry)?.cause ? ` (${errorOf(entry)?.cause})` : ''}
            </Text>
          </Group>
        </UnstyledButton>
      ))}
    </Stack>
  );
};

export const LogDetailsDrawer = ({ line, onSelect, onClose }: Props) => {
  const error = line ? errorOf(line) : null;
  const responseData = line?.data.responseData;

  return (
    <Drawer
      opened={line !== null}
      onClose={onClose}
      position="right"
      size="xl"
      padding="lg"
      title={
        <Text fw={600} size="lg">
          Строка лога
        </Text>
      }
    >
      {line && (
        <Stack gap="md">
          <Group justify="space-between" align="center">
            <Group gap="xs">
              <Badge color={levelColor(line.level)} variant="light" size="lg">
                {line.level}
              </Badge>
              {line.statusCode !== null && (
                <Badge color={statusColor(line.statusCode)} variant="outline" size="lg">
                  HTTP {line.statusCode}
                </Badge>
              )}
            </Group>
            <Text size="sm" c="dimmed">
              {dayjs(line.time).format('D MMMM YYYY, HH:mm:ss.SSS')}
            </Text>
          </Group>

          <Field
            label="Сообщение"
            value={[messageHint(line.msg), line.msg].filter(Boolean).join(' — ') || '—'}
          />
          {line.url && (
            <Field
              label="Запрос"
              value={`${line.method?.toUpperCase() ?? ''} ${line.url}${
                line.durationMs !== null ? ` · ${line.durationMs} мс` : ''
              }`}
            />
          )}
          {line.component && <Field label="Компонент" value={line.component} />}

          {error && (
            <>
              <Divider label="Ошибка" labelPosition="left" />
              <Field
                label="Код / сообщение"
                value={[error.message, error.type && `(${error.type})`].filter(Boolean).join(' ')}
              />
              {error.cause && <Field label="Причина у внешнего сервиса" value={error.cause} />}
              {error.stack && (
                <ScrollArea.Autosize mah={220}>
                  <Code block>{error.stack}</Code>
                </ScrollArea.Autosize>
              )}
            </>
          )}

          {responseData !== undefined && (
            <>
              <Divider label="Ответ внешнего сервиса" labelPosition="left" />
              <Code block>{JSON.stringify(responseData, null, 2)}</Code>
            </>
          )}

          <Divider label="Кто" labelPosition="left" />
          {line.userId ? (
            <>
              <Field label="Пациент" value={line.userName ?? 'Профиль не заполнен'} />
              {line.userPhone && <Field label="Телефон" value={line.userPhone} copyable />}
              <Field label="User ID" value={line.userId} copyable />
            </>
          ) : (
            <Text size="sm" c="dimmed">
              Запрос без авторизации — вход, регистрация или проверка аккаунта
            </Text>
          )}

          {line.reqId && (
            <>
              <Divider label="Весь запрос" labelPosition="left" />
              <Field label="Request ID" value={line.reqId} copyable />
              <RequestTimeline line={line} onSelect={onSelect} />
            </>
          )}

          <Divider label="Строка целиком" labelPosition="left" />
          <ScrollArea.Autosize mah={420}>
            <Code block>{JSON.stringify(line.data, null, 2)}</Code>
          </ScrollArea.Autosize>
        </Stack>
      )}
    </Drawer>
  );
};
