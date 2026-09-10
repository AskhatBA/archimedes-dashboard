import { Badge, Group, ScrollArea, Stack, Table, Text, Tooltip } from '@mantine/core';
import {
  IconCreditCard,
  IconDeviceLaptop,
  IconBuildingHospital,
  IconShieldCheck,
} from '@tabler/icons-react';
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
  items: Appointment[];
  onSelect: (appointment: Appointment) => void;
};

/** MIS is asked for the doctor's name per request — when it is down the id is all we have. */
const doctorLabel = (appointment: Appointment) =>
  appointment.doctorName ?? `Врач ${appointment.doctorId.slice(0, 8)}`;

/**
 * Оплата приёма одной ячейкой.
 *
 * Три случая, а не два: за приёмом либо стоит успешная транзакция, либо его оплатила
 * страховая, либо — редкий случай — платёж есть, но он не успешный. Последнее прятать
 * нельзя: это расхождение, за которым идут разбираться.
 */
const PaymentCell = ({ appointment }: { appointment: Appointment }) => {
  const { payment, isPaid } = appointment;

  if (!payment) {
    return (
      <Tooltip label="Приём по программе страхования — нашей транзакции за ним нет">
        <Badge variant="light" color="gray" leftSection={<IconShieldCheck size={12} />}>
          По программе
        </Badge>
      </Tooltip>
    );
  }

  return (
    <Stack gap={2} align="flex-start">
      <Tooltip
        label={
          isPaid
            ? 'Пациент оплатил приём картой при бронировании'
            : `Платёж за приём: ${PAYMENT_STATUS_LABELS[payment.status]}`
        }
      >
        <Badge
          variant="light"
          color={PAYMENT_STATUS_COLORS[payment.status]}
          leftSection={<IconCreditCard size={12} />}
        >
          {isPaid ? 'Картой' : PAYMENT_STATUS_LABELS[payment.status]}
        </Badge>
      </Tooltip>
      <Text size="xs" c="dimmed">
        {formatAmount(payment.amount)}
      </Text>
    </Stack>
  );
};

export const AppointmentsTable = ({ items, onSelect }: Props) => (
  <ScrollArea>
    <Table verticalSpacing="sm" highlightOnHover miw={1080}>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Дата и время</Table.Th>
          <Table.Th>Пациент</Table.Th>
          <Table.Th>Врач</Table.Th>
          <Table.Th>Формат</Table.Th>
          <Table.Th>Оплата</Table.Th>
          <Table.Th>Статус</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {items.map((appointment) => (
          <Table.Tr
            key={appointment.id}
            style={{ cursor: 'pointer' }}
            onClick={() => onSelect(appointment)}
          >
            <Table.Td>
              <Stack gap={2}>
                <Text size="sm" fw={500}>
                  {dayjs(appointment.dateTime).format('D MMM YYYY')}
                </Text>
                <Text size="xs" c="dimmed">
                  {dayjs(appointment.dateTime).format('HH:mm')}
                </Text>
              </Stack>
            </Table.Td>
            <Table.Td>
              <Stack gap={2}>
                <Group gap={6} wrap="nowrap">
                  <Text size="sm" fw={500}>
                    {appointment.accountName ?? 'Профиль не заполнен'}
                  </Text>
                  {appointment.isForFamilyMember && (
                    <Tooltip label="Запись оформлена на родственника из полиса">
                      <Badge size="xs" variant="light" color="grape">
                        родственник
                      </Badge>
                    </Tooltip>
                  )}
                </Group>
                <Text size="xs" c="dimmed">
                  {appointment.accountIin ?? appointment.accountPhone}
                </Text>
              </Stack>
            </Table.Td>
            <Table.Td>
              <Stack gap={2}>
                <Text size="sm">{doctorLabel(appointment)}</Text>
                <Text size="xs" c="dimmed">
                  {appointment.doctorSpecialty ?? appointment.doctorBranch ?? '—'}
                </Text>
              </Stack>
            </Table.Td>
            <Table.Td>
              <Badge
                variant="light"
                color={appointment.isTelemedicine ? 'cyan' : 'gray'}
                leftSection={
                  appointment.isTelemedicine ? (
                    <IconDeviceLaptop size={12} />
                  ) : (
                    <IconBuildingHospital size={12} />
                  )
                }
              >
                {appointment.isTelemedicine ? 'Телемед' : 'Очный'}
              </Badge>
            </Table.Td>
            <Table.Td>
              <PaymentCell appointment={appointment} />
            </Table.Td>
            <Table.Td>
              <Tooltip label={APPOINTMENT_STATUS_HINTS[appointment.status]}>
                <Badge
                  color={APPOINTMENT_STATUS_COLORS[appointment.status]}
                  variant="light"
                >
                  {APPOINTMENT_STATUS_LABELS[appointment.status]}
                </Badge>
              </Tooltip>
            </Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  </ScrollArea>
);
