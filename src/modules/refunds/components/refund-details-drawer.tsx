import { Badge, Divider, Drawer, Group, Stack, Text } from '@mantine/core';
import dayjs from 'dayjs';
import {
  REFUND_STATE_COLORS,
  REFUND_STATE_HINTS,
  REFUND_STATE_LABELS,
  categoryLabel,
} from '../constants';
import type { RefundRequest } from '../types';

type Props = {
  refund: RefundRequest | null;
  onClose: () => void;
};

const Field = ({ label, value }: { label: string; value: string }) => (
  <Stack gap={2}>
    <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
      {label}
    </Text>
    <Text size="sm">{value}</Text>
  </Stack>
);

export const RefundDetailsDrawer = ({ refund, onClose }: Props) => (
  <Drawer
    opened={refund !== null}
    onClose={onClose}
    position="right"
    size="md"
    padding="lg"
    title={
      <Text fw={600} size="lg">
        Заявка на возмещение
      </Text>
    }
  >
    {refund && (
      <Stack gap="md">
        <Group justify="space-between" align="center">
          <Text fw={700} size="xl">
            ₸{refund.amount.toLocaleString('ru-RU')}
          </Text>
          <Badge color={REFUND_STATE_COLORS[refund.state]} variant="light" size="lg">
            {REFUND_STATE_LABELS[refund.state]}
          </Badge>
        </Group>
        <Text size="xs" c="dimmed">
          {REFUND_STATE_HINTS[refund.state]}
        </Text>

        <Divider />

        <Field label="Пациент" value={refund.patientName ?? 'Профиль не заполнен'} />
        <Field label="ИИН" value={refund.patientIin ?? '—'} />
        <Field label="Телефон" value={refund.patientPhone} />

        <Divider />

        <Field label="Категория" value={categoryLabel(refund.category)} />
        <Field label="Дата услуги" value={dayjs(refund.date).format('D MMMM YYYY')} />
        <Field
          label="Подана"
          value={dayjs(refund.createdAt).format('D MMMM YYYY, HH:mm')}
        />
        <Field label="Прикреплённых документов" value={String(refund.filesCount)} />
        <Field label="Комментарий" value={refund.comments?.trim() || '—'} />

        <Divider />

        {/* Kept for cross-checking a claim against the insurer's own system. */}
        <Field label="ID заявки" value={refund.id} />
        <Field label="Программа" value={refund.programId} />
        <Field label="Beneficiary ID" value={refund.beneficiaryId} />
      </Stack>
    )}
  </Drawer>
);
