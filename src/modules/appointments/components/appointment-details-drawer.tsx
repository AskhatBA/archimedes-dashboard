import {
  Anchor,
  Badge,
  Divider,
  Drawer,
  Group,
  Stack,
  Text,
} from '@mantine/core';
import dayjs from 'dayjs';
import {
  APPOINTMENT_STATUS_COLORS,
  APPOINTMENT_STATUS_HINTS,
  APPOINTMENT_STATUS_LABELS,
  formatAmount,
  PAYMENT_STATUS_COLORS,
  PAYMENT_STATUS_LABELS,
} from '../constants';
import type { Appointment } from '../types';

type Props = {
  appointment: Appointment | null;
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
 * Деньги за приём.
 *
 * Платный приём бронируется обработчиком успешной оплаты, поэтому за ним всегда стоит
 * конкретная транзакция — её сумма, состояние и id, по которому платёж находят в кабинете
 * FreedomPay. У приёма по программе платит страховая, и показывать здесь нечего.
 */
const PaymentSection = ({ appointment }: { appointment: Appointment }) => {
  const { payment } = appointment;

  if (!payment) {
    return (
      <Stack gap={2}>
        <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
          Оплата
        </Text>
        <Text size="sm">По программе страхования</Text>
        <Text size="xs" c="dimmed">
          Пациент за приём не платил — нашей транзакции за ним нет.
        </Text>
      </Stack>
    );
  }

  return (
    <Stack gap="md">
      <Group justify="space-between" align="center" wrap="nowrap">
        <Stack gap={2}>
          <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
            Оплата картой
          </Text>
          <Text size="lg" fw={700}>
            {formatAmount(payment.amount)}
          </Text>
        </Stack>
        <Badge color={PAYMENT_STATUS_COLORS[payment.status]} variant="light" size="lg">
          {PAYMENT_STATUS_LABELS[payment.status]}
        </Badge>
      </Group>
      {!appointment.isPaid && (
        <Text size="xs" c="red">
          Приём связан с платежом, который не прошёл, — стоит сверить с кабинетом FreedomPay.
        </Text>
      )}
      <Field label="Назначение" value={payment.description} />
      <Field
        label="Дата платежа"
        value={dayjs(payment.createdAt).format('D MMMM YYYY, HH:mm')}
      />
      <Field label="ID платежа" value={payment.id} />
      {/* То, по чему платёж ищут в кабинете мерчанта. */}
      <Field label="ID транзакции FreedomPay" value={payment.pgPaymentId ?? '—'} />
    </Stack>
  );
};

/**
 * Read-only by design: the visit itself lives in MIS, so moving or cancelling it here
 * would leave the two systems disagreeing. The dashboard shows what was booked and the
 * ids needed to find it in MIS.
 */
const AppointmentDetails = ({ appointment }: { appointment: Appointment }) => (
  <Stack gap="md">
    <Group justify="space-between" align="center" wrap="nowrap">
      <Text fw={700} size="xl">
        {dayjs(appointment.dateTime).format('D MMMM YYYY, HH:mm')}
      </Text>
      <Badge
        color={APPOINTMENT_STATUS_COLORS[appointment.status]}
        variant="light"
        size="lg"
      >
        {APPOINTMENT_STATUS_LABELS[appointment.status]}
      </Badge>
    </Group>
    <Text size="xs" c="dimmed">
      {APPOINTMENT_STATUS_HINTS[appointment.status]}
    </Text>

    <Divider />

    <Field
      label="Врач"
      value={appointment.doctorName ?? 'Имя не получено из МИС'}
    />
    <Field label="Специальность" value={appointment.doctorSpecialty ?? '—'} />
    <Field label="Филиал" value={appointment.doctorBranch ?? '—'} />

    <Divider />

    <Field label="Аккаунт" value={appointment.accountName ?? 'Профиль не заполнен'} />
    <Field label="ИИН" value={appointment.accountIin ?? '—'} />
    <Field label="Телефон" value={appointment.accountPhone} />
    {appointment.isForFamilyMember && (
      <Text size="xs" c="dimmed">
        Приём оформлен на родственника из полиса — в МИС он записан под своим ID.
      </Text>
    )}

    <Divider />

    <Field
      label="Формат"
      value={appointment.isTelemedicine ? 'Телемедицина' : 'Очный приём'}
    />
    {appointment.isTelemedicine && appointment.meetingUrl && (
      <Stack gap={2}>
        <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
          Ссылка на встречу
        </Text>
        <Anchor
          href={appointment.meetingUrl}
          target="_blank"
          rel="noreferrer"
          size="sm"
          style={{ wordBreak: 'break-all' }}
        >
          {appointment.meetingUrl}
        </Anchor>
      </Stack>
    )}
    {appointment.notes && <Field label="Заметки" value={appointment.notes} />}
    <Field
      label="Создан"
      value={dayjs(appointment.createdAt).format('D MMMM YYYY, HH:mm')}
    />

    <Divider />

    <PaymentSection appointment={appointment} />

    <Divider />

    {/* Kept for cross-checking the visit against the clinic's own system. */}
    <Field label="ID записи в МИС" value={appointment.externalId} />
    <Field label="ID пациента в МИС" value={appointment.patientId} />
    <Field label="ID врача в МИС" value={appointment.doctorId} />
  </Stack>
);

export const AppointmentDetailsDrawer = ({ appointment, onClose }: Props) => (
  <Drawer
    opened={appointment !== null}
    onClose={onClose}
    position="right"
    size="md"
    padding="lg"
    title={
      <Text fw={600} size="lg">
        Приём
      </Text>
    }
  >
    {appointment && <AppointmentDetails appointment={appointment} />}
  </Drawer>
);
