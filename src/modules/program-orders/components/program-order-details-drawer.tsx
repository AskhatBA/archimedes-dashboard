import { useState } from 'react';
import {
  Alert,
  Badge,
  Button,
  Card,
  Divider,
  Drawer,
  Group,
  Select,
  Stack,
  Text,
  Textarea,
} from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import dayjs from 'dayjs';
import {
  PROGRAM_ORDER_CATEGORY_COLORS,
  PROGRAM_ORDER_CATEGORY_LABELS,
  PROGRAM_ORDER_STATUS_COLORS,
  PROGRAM_ORDER_STATUS_HINTS,
  PROGRAM_ORDER_STATUS_LABELS,
  PROGRAM_ORDER_STATUS_OPTIONS,
  formatTenge,
} from '../constants';
import { resolveProgramOrderErrorMessage } from '../data';
import { useUpdateProgramOrder } from '../hooks/use-program-orders';
import type { ProgramOrder, ProgramOrderStatus } from '../types';

type Props = {
  order: ProgramOrder | null;
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

/**
 * Split out so the editor's local state is created fresh for each order — mounted under
 * `key={order.id}`, it cannot carry a half-typed note over to the next row the admin
 * opens.
 */
const OrderEditor = ({ order, onSaved }: { order: ProgramOrder; onSaved: () => void }) => {
  const [status, setStatus] = useState<ProgramOrderStatus>(order.status);
  const [comment, setComment] = useState(order.comment ?? '');
  const update = useUpdateProgramOrder();

  const trimmedComment = comment.trim();
  const isDirty = status !== order.status || trimmedComment !== (order.comment ?? '');

  const handleSave = async () => {
    try {
      await update.mutateAsync({
        id: order.id,
        payload: {
          ...(status !== order.status ? { status } : {}),
          // An emptied field means "no note", which the backend stores as null rather
          // than as an empty string.
          ...(trimmedComment !== (order.comment ?? '')
            ? { comment: trimmedComment || null }
            : {}),
        },
      });
      onSaved();
    } catch {
      // Surfaced by the alert below.
    }
  };

  return (
    <Stack gap="md">
      <Group justify="space-between" align="center">
        <Text fw={700} size="xl">
          {formatTenge(order.total)}
        </Text>
        <Badge
          color={PROGRAM_ORDER_STATUS_COLORS[order.status]}
          variant="light"
          size="lg"
        >
          {PROGRAM_ORDER_STATUS_LABELS[order.status]}
        </Badge>
      </Group>
      <Text size="xs" c="dimmed">
        {PROGRAM_ORDER_STATUS_HINTS[order.status]}
      </Text>

      <Divider />

      <Stack gap={8}>
        <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
          Состав заявки
        </Text>
        {order.items.map((item) => (
          <Card key={item.id} withBorder radius="md" padding="sm">
            <Group justify="space-between" align="flex-start" wrap="nowrap" gap="sm">
              <Stack gap={4}>
                <Text size="sm" fw={500}>
                  {item.title}
                </Text>
                <Group gap={6}>
                  <Badge
                    size="sm"
                    variant="light"
                    color={PROGRAM_ORDER_CATEGORY_COLORS[item.category]}
                  >
                    {PROGRAM_ORDER_CATEGORY_LABELS[item.category]}
                  </Badge>
                  {item.code && (
                    <Text size="xs" c="dimmed">
                      {item.code}
                    </Text>
                  )}
                </Group>
              </Stack>
              <Text size="sm" fw={600} style={{ whiteSpace: 'nowrap' }}>
                {formatTenge(item.price)}
              </Text>
            </Group>
          </Card>
        ))}
      </Stack>

      <Divider />

      <Field label="Пациент" value={order.patientName ?? 'Профиль не заполнен'} />
      <Field label="ИИН" value={order.patientIin ?? '—'} />
      <Field label="Телефон для связи" value={order.contactPhone ?? order.patientPhone} />
      <Field
        label="Оплачена"
        value={dayjs(order.createdAt).format('D MMMM YYYY, HH:mm')}
      />

      <Divider />

      {update.isError && (
        <Alert
          color="red"
          variant="light"
          radius="md"
          icon={<IconAlertCircle size={18} />}
        >
          {resolveProgramOrderErrorMessage(update.error)}
        </Alert>
      )}

      <Select
        label="Статус"
        data={PROGRAM_ORDER_STATUS_OPTIONS}
        value={status}
        onChange={(value) => value && setStatus(value as ProgramOrderStatus)}
        allowDeselect={false}
        radius="md"
      />
      <Textarea
        label="Комментарий оператора"
        placeholder="Что уже сделано по заявке"
        value={comment}
        onChange={(e) => setComment(e.currentTarget.value)}
        autosize
        minRows={3}
        maxRows={8}
        radius="md"
      />
      <Group justify="flex-end">
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

      <Divider />

      {/* Kept for cross-checking an order against the payment provider's own records. */}
      <Field label="ID заявки" value={order.id} />
      <Field label="ID платежа" value={order.paymentId} />
    </Stack>
  );
};

export const ProgramOrderDetailsDrawer = ({ order, onClose }: Props) => (
  <Drawer
    opened={order !== null}
    onClose={onClose}
    position="right"
    size="md"
    padding="lg"
    title={
      <Text fw={600} size="lg">
        Заявка на платную программу
      </Text>
    }
  >
    {order && <OrderEditor key={order.id} order={order} onSaved={onClose} />}
  </Drawer>
);
