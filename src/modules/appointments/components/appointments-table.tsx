import { Badge, Group, ScrollArea, Stack, Table, Text, Tooltip } from '@mantine/core';
import { IconDeviceLaptop, IconBuildingHospital } from '@tabler/icons-react';
import dayjs from 'dayjs';
import {
  APPOINTMENT_STATUS_COLORS,
  APPOINTMENT_STATUS_HINTS,
  APPOINTMENT_STATUS_LABELS,
} from '../constants';
import type { Appointment } from '../types';

type Props = {
  items: Appointment[];
  onSelect: (appointment: Appointment) => void;
};

/** MIS is asked for the doctor's name per request — when it is down the id is all we have. */
const doctorLabel = (appointment: Appointment) =>
  appointment.doctorName ?? `Врач ${appointment.doctorId.slice(0, 8)}`;

export const AppointmentsTable = ({ items, onSelect }: Props) => (
  <ScrollArea>
    <Table verticalSpacing="sm" highlightOnHover miw={960}>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Дата и время</Table.Th>
          <Table.Th>Пациент</Table.Th>
          <Table.Th>Врач</Table.Th>
          <Table.Th>Формат</Table.Th>
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
