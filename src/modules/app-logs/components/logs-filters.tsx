import {
  ActionIcon,
  Button,
  Group,
  SegmentedControl,
  Stack,
  Switch,
  TextInput,
  Tooltip,
} from '@mantine/core';
import { IconRefresh, IconSearch, IconX } from '@tabler/icons-react';
import { LEVEL_OPTIONS } from '../constants';
import type { AppLogFilters, AppLogLevelFilter } from '../types';

type FilterState = Omit<AppLogFilters, 'search'>;

type Props = {
  filters: FilterState;
  searchInput: string;
  live: boolean;
  isFetching: boolean;
  onSearchInput: (value: string) => void;
  onChange: (patch: Partial<FilterState>) => void;
  onLiveChange: (live: boolean) => void;
  onRefresh: () => void;
  onReset: () => void;
};

const hasAnyFilter = (filters: FilterState, searchInput: string) =>
  Boolean(searchInput || filters.level !== 'all' || filters.from || filters.to);

export const LogsFilters = ({
  filters,
  searchInput,
  live,
  isFetching,
  onSearchInput,
  onChange,
  onLiveChange,
  onRefresh,
  onReset,
}: Props) => (
  <Stack gap="sm">
    <Group gap="sm" align="flex-end" wrap="wrap">
      <TextInput
        label="Поиск"
        placeholder="Телефон, ИИН, request ID или текст"
        leftSection={<IconSearch size={16} />}
        value={searchInput}
        onChange={(e) => onSearchInput(e.currentTarget.value)}
        radius="md"
        w={320}
      />
      <TextInput
        label="С"
        type="datetime-local"
        value={filters.from}
        onChange={(e) => onChange({ from: e.currentTarget.value })}
        radius="md"
        w={210}
      />
      <TextInput
        label="По"
        type="datetime-local"
        value={filters.to}
        onChange={(e) => onChange({ to: e.currentTarget.value })}
        radius="md"
        w={210}
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
    <Group gap="md" justify="space-between" wrap="wrap">
      <SegmentedControl
        data={LEVEL_OPTIONS}
        value={filters.level}
        onChange={(value) => onChange({ level: value as AppLogLevelFilter })}
        radius="md"
      />
      <Group gap="sm">
        <Switch
          label="Обновлять автоматически"
          checked={live}
          onChange={(e) => onLiveChange(e.currentTarget.checked)}
          color="violet"
        />
        <Tooltip label="Обновить">
          <ActionIcon
            variant="default"
            size="lg"
            radius="md"
            onClick={onRefresh}
            loading={isFetching}
            aria-label="Обновить"
          >
            <IconRefresh size={18} />
          </ActionIcon>
        </Tooltip>
      </Group>
    </Group>
  </Stack>
);
