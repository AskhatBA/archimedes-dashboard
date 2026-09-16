import {
  ActionIcon,
  Avatar,
  Badge,
  Group,
  ScrollArea,
  Stack,
  Table,
  Text,
  Tooltip,
} from '@mantine/core';
import {
  IconCalendarStats,
  IconCash,
  IconPencil,
  IconTrash,
} from '@tabler/icons-react';
import dayjs from 'dayjs';
import {
  PATIENT_GENDER_COLORS,
  formatPhone,
  genderLabel,
  isKnownGender,
} from '../constants';
import type { Patient } from '../types';

type Props = {
  items: Patient[];
  onEdit: (patient: Patient) => void;
  onDelete: (patient: Patient) => void;
};

/** `Иванов Иван` -> `ИИ`. Falls back to a single letter for one-word names. */
const initials = (fullName: string) =>
  fullName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');

const YEAR_FORMS = ['год', 'года', 'лет'] as const;

/** Russian needs three forms: 21 год, 22 года, 25 лет. */
const yearsLabel = (years: number) => {
  const mod100 = years % 100;
  const mod10 = years % 10;
  if (mod100 >= 11 && mod100 <= 14) return YEAR_FORMS[2];
  if (mod10 === 1) return YEAR_FORMS[0];
  if (mod10 >= 2 && mod10 <= 4) return YEAR_FORMS[1];
  return YEAR_FORMS[2];
};

const age = (birthDate: string) => {
  const date = dayjs(birthDate);
  if (!date.isValid()) return null;

  const years = dayjs().diff(date, 'year');
  return `${years} ${yearsLabel(years)}`;
};

const formatBirthDate = (birthDate: string) => {
  const date = dayjs(birthDate);
  return date.isValid() ? date.format('D MMM YYYY') : birthDate;
};

export const PatientsTable = ({ items, onEdit, onDelete }: Props) => (
  <ScrollArea>
    <Table verticalSpacing="sm" highlightOnHover miw={980}>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Пациент</Table.Th>
          <Table.Th>ИИН</Table.Th>
          <Table.Th>Пол</Table.Th>
          <Table.Th>Дата рождения</Table.Th>
          <Table.Th>Телефон</Table.Th>
          <Table.Th ta="right">Приёмы</Table.Th>
          <Table.Th ta="right">Возмещения</Table.Th>
          <Table.Th />
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {items.map((patient) => (
          <Table.Tr key={patient.id}>
            <Table.Td>
              <Group gap="sm" wrap="nowrap">
                <Avatar
                  color={
                    isKnownGender(patient.gender)
                      ? PATIENT_GENDER_COLORS[patient.gender]
                      : 'gray'
                  }
                  radius="xl"
                  size={36}
                >
                  {initials(patient.fullName)}
                </Avatar>
                <Stack gap={2}>
                  <Text size="sm" fw={500}>
                    {patient.fullName}
                  </Text>
                  <Text size="xs" c="dimmed">
                    {patient.patronymic || patient.email || '—'}
                  </Text>
                </Stack>
              </Group>
            </Table.Td>
            <Table.Td>
              <Text size="sm" ff="monospace">
                {patient.iin}
              </Text>
            </Table.Td>
            <Table.Td>
              <Badge
                variant="light"
                radius="sm"
                color={
                  isKnownGender(patient.gender)
                    ? PATIENT_GENDER_COLORS[patient.gender]
                    : 'gray'
                }
              >
                {genderLabel(patient.gender)}
              </Badge>
            </Table.Td>
            <Table.Td>
              <Stack gap={2}>
                <Text size="sm">{formatBirthDate(patient.birthDate)}</Text>
                <Text size="xs" c="dimmed">
                  {age(patient.birthDate) ?? '—'}
                </Text>
              </Stack>
            </Table.Td>
            <Table.Td>
              <Text size="sm">{formatPhone(patient.phone)}</Text>
            </Table.Td>
            <Table.Td ta="right">
              <Group gap={6} justify="flex-end">
                <IconCalendarStats size={14} opacity={0.6} />
                <Text size="sm">{patient.appointmentsCount}</Text>
              </Group>
            </Table.Td>
            <Table.Td ta="right">
              <Group gap={6} justify="flex-end">
                <IconCash size={14} opacity={0.6} />
                <Text size="sm">{patient.refundsCount}</Text>
              </Group>
            </Table.Td>
            <Table.Td>
              <Group gap={4} justify="flex-end" wrap="nowrap">
                <Tooltip label="Редактировать">
                  <ActionIcon
                    variant="subtle"
                    color="violet"
                    onClick={() => onEdit(patient)}
                    aria-label="Редактировать"
                  >
                    <IconPencil size={16} />
                  </ActionIcon>
                </Tooltip>
                <Tooltip label="Удалить профиль">
                  <ActionIcon
                    variant="subtle"
                    color="red"
                    onClick={() => onDelete(patient)}
                    aria-label="Удалить профиль"
                  >
                    <IconTrash size={16} />
                  </ActionIcon>
                </Tooltip>
              </Group>
            </Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  </ScrollArea>
);
