import { Button, Group, Select, TextInput } from '@mantine/core';
import { IconSearch, IconX } from '@tabler/icons-react';
import { PATIENT_GENDER_OPTIONS } from '../constants';
import type { PatientFilters, PatientGender } from '../types';

type FilterState = Omit<PatientFilters, 'search'>;

type Props = {
  filters: FilterState;
  searchInput: string;
  onSearchInput: (value: string) => void;
  onChange: (patch: Partial<FilterState>) => void;
  onReset: () => void;
};

const hasAnyFilter = (filters: FilterState, searchInput: string) =>
  Boolean(searchInput || filters.gender !== null);

export const PatientsFilters = ({
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
      w={280}
    />
    <Select
      label="Пол"
      placeholder="Любой"
      data={PATIENT_GENDER_OPTIONS}
      value={filters.gender}
      onChange={(value) =>
        onChange({ gender: (value as PatientGender | null) ?? null, page: 1 })
      }
      clearable
      radius="md"
      w={180}
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
