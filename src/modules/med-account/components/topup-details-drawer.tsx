import { useState } from 'react';
import {
  Alert,
  Badge,
  Button,
  Code,
  Divider,
  Drawer,
  Group,
  Select,
  Stack,
  Text,
  Textarea,
} from '@mantine/core';
import { IconAlertCircle, IconInfoCircle } from '@tabler/icons-react';
import dayjs from 'dayjs';
import { STATUS_COLORS, STATUS_LABELS, STATUS_OPTIONS, formatAmount } from '../constants';
import { resolveMedAccountErrorMessage } from '../data';
import { useUpdateTopup } from '../hooks/use-topups';
import type { Topup, TopupStatus } from '../types';

type Props = {
  topup: Topup | null;
  onClose: () => void;
};

const Row = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <Group justify="space-between" align="flex-start" wrap="nowrap" gap="lg">
    <Text size="sm" c="dimmed">
      {label}
    </Text>
    <Text size="sm" ta="right" style={{ wordBreak: 'break-all' }}>
      {value}
    </Text>
  </Group>
);

/**
 * The editor is mounted under `key={topup.id}` by the parent, so its local state is
 * rebuilt per top-up — otherwise a half-typed note would follow the operator to the next
 * row.
 */
const Editor = ({ topup, onClose }: { topup: Topup; onClose: () => void }) => {
  const [status, setStatus] = useState<TopupStatus>(topup.status);
  const [comment, setComment] = useState(topup.comment ?? '');
  const update = useUpdateTopup();

  const isDirty = status !== topup.status || comment !== (topup.comment ?? '');

  const handleSave = async () => {
    try {
      await update.mutateAsync({
        id: topup.id,
        payload: { status, comment: comment.trim() || null },
      });
      onClose();
    } catch {
      // Surfaced by the alert below.
    }
  };

  return (
    <Stack gap="md">
      {update.isError && (
        <Alert
          color="red"
          variant="light"
          radius="md"
          icon={<IconAlertCircle size={18} />}
        >
          {resolveMedAccountErrorMessage(update.error)}
        </Alert>
      )}

      <Select
        label="Статус"
        description="«Зачислено» ставится после того, как сумма проведена в системе страховой."
        data={STATUS_OPTIONS}
        value={status}
        onChange={(value) => value && setStatus(value as TopupStatus)}
        allowDeselect={false}
        radius="md"
      />

      <Textarea
        label="Комментарий оператора"
        placeholder="Например: проведено вручную, документ №…"
        value={comment}
        onChange={(event) => setComment(event.currentTarget.value)}
        autosize
        minRows={3}
        radius="md"
      />

      <Group justify="flex-end" gap="sm">
        <Button variant="default" radius="md" onClick={onClose}>
          Закрыть
        </Button>
        <Button
          color="violet"
          radius="md"
          disabled={!isDirty}
          loading={update.isPending}
          onClick={handleSave}
        >
          Сохранить
        </Button>
      </Group>
    </Stack>
  );
};

export const TopupDetailsDrawer = ({ topup, onClose }: Props) => (
  <Drawer
    opened={topup !== null}
    onClose={onClose}
    position="right"
    size="md"
    padding="lg"
    title={
      <Text fw={600} size="lg">
        Пополнение медсчёта
      </Text>
    }
  >
    {topup && (
      <Stack gap="md">
        <Group justify="space-between" align="center">
          <Text size="xl" fw={700}>
            {formatAmount(topup.amount)}
          </Text>
          <Badge variant="light" color={STATUS_COLORS[topup.status]} radius="sm">
            {STATUS_LABELS[topup.status]}
          </Badge>
        </Group>

        <Alert
          variant="light"
          color="blue"
          radius="md"
          icon={<IconInfoCircle size={18} />}
        >
          Деньги уже списаны с карты пациента. Медсчёт ведётся в системе страховой, поэтому
          пополнение считается завершённым только после того, как его проведут там.
        </Alert>

        <Divider />

        <Stack gap="xs">
          <Row label="Пациент" value={topup.patientName ?? '—'} />
          <Row label="Телефон" value={topup.patientPhone} />
          <Row label="ИИН" value={topup.patientIin ?? '—'} />
          <Row
            label="Beneficiary ID"
            value={topup.beneficiaryId ? <Code>{topup.beneficiaryId}</Code> : '—'}
          />
          <Row label="Оплачено" value={dayjs(topup.createdAt).format('DD.MM.YYYY HH:mm')} />
          <Row
            label="Зачислено"
            value={
              topup.creditedAt
                ? dayjs(topup.creditedAt).format('DD.MM.YYYY HH:mm')
                : '—'
            }
          />
          <Row label="Платёж" value={<Code>{topup.paymentId}</Code>} />
          {topup.externalRef && (
            <Row label="Ссылка страховой" value={<Code>{topup.externalRef}</Code>} />
          )}
        </Stack>

        <Divider />

        <Editor key={topup.id} topup={topup} onClose={onClose} />
      </Stack>
    )}
  </Drawer>
);
