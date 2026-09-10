import { useState } from 'react';
import {
  Alert,
  Card,
  Center,
  Group,
  Loader,
  Pagination,
  Stack,
  Text,
} from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { IconAlertTriangle, IconMoodEmpty } from '@tabler/icons-react';
import { APPOINTMENT_PAGE_SIZE } from './constants';
import { AppointmentDetailsDrawer } from './components/appointment-details-drawer';
import { AppointmentsFilters } from './components/appointments-filters';
import { AppointmentsSummary } from './components/appointments-summary';
import { AppointmentsTable } from './components/appointments-table';
import {
  useAppointments,
  useTodayAppointmentsCount,
  useUpcomingAppointmentsCount,
} from './hooks/use-appointments';
import type { Appointment, AppointmentFilters } from './types';

/** Everything except `search`, which lives in its own debounced input state. */
type FilterState = Omit<AppointmentFilters, 'search'>;

const initialFilters: FilterState = {
  page: 1,
  limit: APPOINTMENT_PAGE_SIZE,
  status: null,
  telemedicine: null,
  paid: null,
  dateFrom: null,
  dateTo: null,
};

export const Appointments = () => {
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [searchInput, setSearchInput] = useState('');
  const [selected, setSelected] = useState<Appointment | null>(null);
  // Typing must not fire a request per keystroke, so the query reads the debounced
  // value rather than the raw input.
  const [debouncedSearch] = useDebouncedValue(searchInput, 350);
  const { data, isPending, isFetching, isError, error, refetch } = useAppointments({
    ...filters,
    search: debouncedSearch.trim(),
  });
  const { data: todayCount } = useTodayAppointmentsCount();
  const { data: upcomingCount } = useUpcomingAppointmentsCount();

  const patch = (next: Partial<FilterState>) =>
    setFilters((prev) => ({ ...prev, ...next }));

  const handleSearchInput = (value: string) => {
    setSearchInput(value);
    // A new search always restarts at page 1 — otherwise narrowing the result set
    // lands the admin on an empty page 4.
    patch({ page: 1 });
  };

  const reset = () => {
    setSearchInput('');
    setFilters(initialFilters);
  };

  return (
    <Stack gap="lg">
      <AppointmentsSummary
        total={data?.total ?? 0}
        pageCount={data?.items.length ?? 0}
        todayCount={todayCount}
        upcomingCount={upcomingCount}
      />

      <Card withBorder radius="lg" padding="lg">
        <Stack gap="md">
          <AppointmentsFilters
            filters={filters}
            searchInput={searchInput}
            onSearchInput={handleSearchInput}
            onChange={patch}
            onReset={reset}
          />

          {isError && (
            <Alert
              color="red"
              variant="light"
              radius="md"
              icon={<IconAlertTriangle size={18} />}
              title="Не удалось загрузить приёмы"
            >
              <Stack gap={6} align="flex-start">
                <Text size="sm">
                  {error instanceof Error ? error.message : 'Неизвестная ошибка'}
                </Text>
                <Text
                  size="sm"
                  c="red"
                  fw={600}
                  style={{ cursor: 'pointer' }}
                  onClick={() => refetch()}
                >
                  Повторить
                </Text>
              </Stack>
            </Alert>
          )}

          {isPending && (
            <Center mih={220}>
              <Loader color="violet" />
            </Center>
          )}

          {!isPending && !isError && data && data.items.length === 0 && (
            <Center mih={220}>
              <Stack align="center" gap={6}>
                <IconMoodEmpty size={32} opacity={0.4} />
                <Text size="sm" c="dimmed">
                  По этим фильтрам приёмов нет
                </Text>
              </Stack>
            </Center>
          )}

          {!isPending && data && data.items.length > 0 && (
            <Stack gap="md" style={{ opacity: isFetching ? 0.6 : 1 }}>
              <AppointmentsTable items={data.items} onSelect={setSelected} />
              <Group justify="space-between" wrap="wrap">
                <Text size="sm" c="dimmed">
                  Страница {data.page} из {data.totalPages} · всего{' '}
                  {data.total.toLocaleString('ru-RU')}
                </Text>
                <Pagination
                  value={data.page}
                  total={data.totalPages}
                  onChange={(page) => patch({ page })}
                  color="violet"
                  radius="md"
                  size="sm"
                />
              </Group>
            </Stack>
          )}
        </Stack>
      </Card>

      <AppointmentDetailsDrawer
        appointment={selected}
        onClose={() => setSelected(null)}
      />
    </Stack>
  );
};
