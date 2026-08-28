import { Button, Group, Select, TextInput } from '@mantine/core';
import { IconSearch, IconX } from '@tabler/icons-react';
import {
  PROGRAM_ORDER_CATEGORY_OPTIONS,
  PROGRAM_ORDER_STATUS_OPTIONS,
} from '../constants';
import type {
  ProgramOrderCategory,
  ProgramOrderFilters,
  ProgramOrderStatus,
} from '../types';

type FilterState = Omit<ProgramOrderFilters, 'search'>;

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
      filters.category !== null ||
      filters.dateFrom ||
      filters.dateTo,
  );

export const ProgramOrdersFilters = ({
  filters,
  searchInput,
  onSearchInput,
  onChange,
  onReset,
}: Props) => (
  <Group gap="sm" align="flex-end" wrap="wrap">
    <TextInput
      label="Поиск"
      placeholder="ФИО, ИИН, телефон или программа"
      leftSection={<IconSearch size={16} />}
      value={searchInput}
      onChange={(e) => onSearchInput(e.currentTarget.value)}
      radius="md"
      w={280}
    />
    <Select
      label="Статус"
      placeholder="Все статусы"
      data={PROGRAM_ORDER_STATUS_OPTIONS}
      value={filters.status}
      onChange={(value) =>
        onChange({ status: (value as ProgramOrderStatus | null) ?? null, page: 1 })
      }
      clearable
      radius="md"
      w={180}
    />
    <Select
      label="Категория"
      placeholder="Все категории"
      data={PROGRAM_ORDER_CATEGORY_OPTIONS}
      value={filters.category}
      onChange={(value) =>
        onChange({ category: (value as ProgramOrderCategory | null) ?? null, page: 1 })
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
