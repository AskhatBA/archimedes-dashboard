import { Button, Group, Select, TextInput } from '@mantine/core';
import { IconSearch, IconX } from '@tabler/icons-react';
import {
  APPOINTMENT_FORMAT_OPTIONS,
  APPOINTMENT_PAYMENT_OPTIONS,
  APPOINTMENT_STATUS_OPTIONS,
} from '../constants';
import type { AppointmentFilters, AppointmentStatus } from '../types';

type FilterState = Omit<AppointmentFilters, 'search'>;

type Props = {
  filters: FilterState;
  searchInput: string;
  onSearchInput: (value: string) => void;
  onChange: (patch: Partial<FilterState>) => void;
  onReset: () => void;
};

const hasAnyFilter = (filters: FilterState, searchInput: string) =>
  Boolean(
    searchInput ||
      filters.status !== null ||
      filters.telemedicine !== null ||
      filters.paid !== null ||
      filters.dateFrom ||
      filters.dateTo,
  );

export const AppointmentsFilters = ({
  filters,
  searchInput,
  onSearchInput,
  onChange,
  onReset,
}: Props) => (
  <Group gap="sm" align="flex-end" wrap="wrap">
    <TextInput
      label="Поиск"
      placeholder="ФИО, ИИН, телефон или ID из МИС"
      leftSection={<IconSearch size={16} />}
      value={searchInput}
      onChange={(e) => onSearchInput(e.currentTarget.value)}
      radius="md"
      w={280}
    />
    <Select
      label="Статус"
      placeholder="Все статусы"
      data={APPOINTMENT_STATUS_OPTIONS}
      value={filters.status}
      onChange={(value) =>
        onChange({ status: (value as AppointmentStatus | null) ?? null, page: 1 })
      }
      clearable
      radius="md"
      w={180}
    />
    <Select
      label="Формат"
      placeholder="Любой формат"
      data={APPOINTMENT_FORMAT_OPTIONS}
      // Tri-state: cleared means "любой", so `null` is not the same as `false`.
      value={filters.telemedicine === null ? null : String(filters.telemedicine)}
      onChange={(value) =>
        onChange({ telemedicine: value === null ? null : value === 'true', page: 1 })
      }
      clearable
      radius="md"
      w={180}
    />
    <Select
      label="Оплата"
      placeholder="Любая оплата"
      data={APPOINTMENT_PAYMENT_OPTIONS}
      // Tri-state, like the format filter: cleared means «любая», not «по программе».
      value={filters.paid === null ? null : String(filters.paid)}
      onChange={(value) =>
        onChange({ paid: value === null ? null : value === 'true', page: 1 })
      }
      clearable
      radius="md"
      w={180}
    />
    <TextInput
      label="Дата с"
      type="date"
      value={filters.dateFrom ?? ''}
      onChange={(e) => onChange({ dateFrom: e.currentTarget.value || null, page: 1 })}
      radius="md"
      w={170}
    />
    <TextInput
      label="Дата по"
      type="date"
      value={filters.dateTo ?? ''}
      onChange={(e) => onChange({ dateTo: e.currentTarget.value || null, page: 1 })}
      radius="md"
      w={170}
    />
    {hasAnyFilter(filters, searchInput) && (
      <Button
        variant="subtle"
        color="gray"
        radius="md"
        leftSection={<IconX size={16} />}
        onClick={onReset}
      >
        Сбросить
      </Button>
    )}
  </Group>
);
