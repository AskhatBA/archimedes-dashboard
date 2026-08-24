import { Button, Group, Select, TextInput } from '@mantine/core';
import { IconSearch, IconX } from '@tabler/icons-react';
import { REFUND_CATEGORY_OPTIONS } from '../constants';
import type { RefundFilters } from '../types';

type FilterState = Omit<RefundFilters, 'search'>;

type Props = {
  filters: FilterState;
  searchInput: string;
  onSearchInput: (value: string) => void;
  onChange: (patch: Partial<FilterState>) => void;
  onReset: () => void;
};

const hasAnyFilter = (filters: FilterState, searchInput: string) =>
  Boolean(searchInput || filters.category !== null || filters.dateFrom || filters.dateTo);

export const RefundsFilters = ({
  filters,
  searchInput,
  onSearchInput,
  onChange,
  onReset,
}: Props) => (
  <Group gap="sm" align="flex-end" wrap="wrap">
    <TextInput
      label="Поиск"
      placeholder="ФИО, ИИН или телефон"
      leftSection={<IconSearch size={16} />}
      value={searchInput}
      onChange={(e) => onSearchInput(e.currentTarget.value)}
      radius="md"
      w={260}
    />
    <Select
      label="Категория"
      placeholder="Все категории"
      data={REFUND_CATEGORY_OPTIONS}
      value={filters.category === null ? null : String(filters.category)}
      onChange={(value) =>
        onChange({ category: value === null ? null : Number(value), page: 1 })
      }
      clearable
      radius="md"
      w={220}
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
