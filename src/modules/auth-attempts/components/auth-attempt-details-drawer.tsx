import {
  ActionIcon,
  Badge,
  Button,
  Code,
  CopyButton,
  Divider,
  Drawer,
  Group,
  Stack,
  Text,
  Tooltip,
} from '@mantine/core';
import { IconCheck, IconCopy, IconListSearch } from '@tabler/icons-react';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import {
  FLOW_LABELS,
  appVersionOf,
  eventColor,
  eventLabel,
  reasonLabel,
  serviceLabel,
  stepLabel,
} from '../constants';
import type { AuthAttempt } from '../types';

type Props = {
  attempt: AuthAttempt | null;
  onClose: () => void;
};

/** Keys the drawer already shows as fields — anything else is printed raw below them. */
const KNOWN_METADATA_KEYS = [
  'flow',
  'step',
  'reason',
  'statusCode',
  'upstream',
  'reqId',
  'appVersion',
];

const Field = ({
  label,
  value,
  copyable = false,
}: {
  label: string;
  value: string;
  copyable?: boolean;
}) => (
  <Stack gap={2}>
    <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
      {label}
    </Text>
    <Group gap={4} wrap="nowrap" align="flex-start">
      <Text size="sm" style={{ wordBreak: 'break-all' }}>
        {value}
      </Text>
      {copyable && (
        <CopyButton value={value}>
          {({ copied, copy }) => (
            <Tooltip label={copied ? 'Скопировано' : 'Скопировать'}>
              <ActionIcon variant="subtle" color="gray" size="sm" onClick={copy}>
                {copied ? <IconCheck size={14} /> : <IconCopy size={14} />}
              </ActionIcon>
            </Tooltip>
          )}
        </CopyButton>
      )}
    </Group>
  </Stack>
);

/** The log screen reads `?search=` — a request id or a phone/IIN both work there. */
const logsUrl = (search: string) => `/logs?search=${encodeURIComponent(search)}`;

export const AuthAttemptDetailsDrawer = ({ attempt, onClose }: Props) => {
  const navigate = useNavigate();
  const metadata = attempt?.metadata ?? {};
  const person = attempt?.iin ?? attempt?.phone ?? null;
  const { upstream } = metadata;
  const extra = Object.fromEntries(
    Object.entries(metadata).filter(([key]) => !KNOWN_METADATA_KEYS.includes(key)),
  );

  return (
    <Drawer
      opened={attempt !== null}
      onClose={onClose}
      position="right"
      size="md"
      padding="lg"
      title={
        <Text fw={600} size="lg">
          Попытка входа
        </Text>
      }
    >
      {attempt && (
        <Stack gap="md">
          <Group justify="space-between" align="center">
            <Badge color={eventColor(attempt)} variant="light" size="lg">
              {eventLabel(attempt)}
            </Badge>
            <Text size="sm" c="dimmed">
              {dayjs(attempt.createdAt).format('D MMMM YYYY, HH:mm:ss')}
            </Text>
          </Group>

          <Divider label="Кто" labelPosition="left" />
          <Field
            label="Пациент"
            value={
              attempt.patientName ??
              (attempt.userId ? 'Профиль не заполнен' : 'Аккаунта нет')
            }
          />
          <Field label="Телефон" value={attempt.phone ?? '—'} copyable={!!attempt.phone} />
          <Field label="ИИН" value={attempt.iin ?? '—'} copyable={!!attempt.iin} />

          {(metadata.flow || metadata.step || metadata.reason) && (
            <>
              <Divider label="Что произошло" labelPosition="left" />
              {metadata.flow && (
                <Field label="Сценарий" value={FLOW_LABELS[metadata.flow] ?? metadata.flow} />
              )}
              {metadata.step && <Field label="Шаг" value={stepLabel(metadata.step)} />}
              {metadata.reason && (
                <Field
                  label="Причина"
                  value={`${reasonLabel(metadata.reason)} (${metadata.reason})`}
                />
              )}
              {metadata.statusCode && (
                <Field label="Ответ приложению" value={`HTTP ${metadata.statusCode}`} />
              )}
            </>
          )}

          {upstream && (
            <>
              <Divider label="Ответ внешнего сервиса" labelPosition="left" />
              <Field label="Сервис" value={serviceLabel(upstream.service)} />
              {upstream.resolver && <Field label="Метод" value={upstream.resolver} />}
              {upstream.status && <Field label="HTTP-статус" value={String(upstream.status)} />}
              {upstream.errorCode !== undefined && (
                <Field label="Код ошибки" value={String(upstream.errorCode)} />
              )}
              {upstream.message && <Field label="Сообщение" value={upstream.message} />}
            </>
          )}

          <Divider label="Устройство" labelPosition="left" />
          <Field label="Версия приложения" value={appVersionOf(attempt) ?? 'Не передана'} />
          <Field label="User-Agent" value={attempt.userAgent ?? '—'} />
          <Field label="IP" value={attempt.ipAddress ?? '—'} />

          <Group gap="xs">
            {metadata.reqId && (
              <Button
                variant="light"
                color="violet"
                radius="md"
                size="xs"
                leftSection={<IconListSearch size={14} />}
                onClick={() => navigate(logsUrl(metadata.reqId as string))}
              >
                Логи этого запроса
              </Button>
            )}
            {person && (
              <Button
                variant="default"
                radius="md"
                size="xs"
                leftSection={<IconListSearch size={14} />}
                onClick={() => navigate(logsUrl(person))}
              >
                Все логи человека
              </Button>
            )}
          </Group>

          <Divider label="Для разработчика" labelPosition="left" />
          {/* Searching the backend logs by this id shows every line of that request. */}
          {metadata.reqId && <Field label="Request ID" value={metadata.reqId} copyable />}
          {attempt.userId && <Field label="User ID" value={attempt.userId} copyable />}
          <Field label="ID записи" value={attempt.id} />
          {Object.keys(extra).length > 0 && (
            <Stack gap={2}>
              <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
                Прочее
              </Text>
              <Code block>{JSON.stringify(extra, null, 2)}</Code>
            </Stack>
          )}
        </Stack>
      )}
    </Drawer>
  );
};
