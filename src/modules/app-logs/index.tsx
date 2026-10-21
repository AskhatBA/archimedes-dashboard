import { useEffect, useState } from 'react';
import { Alert, Button, Card, Center, Loader, Stack, Text } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { IconAlertTriangle, IconInfoCircle, IconMoodEmpty } from '@tabler/icons-react';
import { useSearchParams } from 'react-router-dom';
import { LogDetailsDrawer } from './components/log-details-drawer';
import { LogsFilters } from './components/logs-filters';
import { LogsTable } from './components/logs-table';
import { useAppLogs } from './hooks/use-app-logs';
import type { AppLogFilters, AppLogLine, AppLogPerson } from './types';

/** Everything except `search`, which lives in its own debounced input state. */
type FilterState = Omit<AppLogFilters, 'search'>;

const initialFilters: FilterState = { level: 'all', from: '', to: '' };

const PersonNotice = ({ person }: { person: AppLogPerson }) => {
  if (person.accounts === 0 && person.attempts === 0) {
    return (
      <Alert color="gray" variant="light" radius="md" icon={<IconInfoCircle size={18} />}>
        Этого человека нет ни среди аккаунтов, ни среди попыток входа — приложение ни разу не
        отправило его телефон или ИИН на сервер.
      </Alert>
    );
  }

  return (
    <Alert color="violet" variant="light" radius="md" icon={<IconInfoCircle size={18} />}>
      В логах нет телефонов и ИИН, поэтому показаны запросы{' '}
      {person.accounts > 0 ? 'его аккаунта' : ''}
      {person.accounts > 0 && person.attempts > 0 ? ' и ' : ''}
      {person.attempts > 0 ? `его попыток входа (${person.attempts})` : ''}.
      {person.accounts === 0 && ' Аккаунта у него нет.'}
    </Alert>
  );
};

export const Logs = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  // Seeded from the URL, so "Попытки входа" can link straight to a person or a request.
  const [searchInput, setSearchInput] = useState(() => searchParams.get('search') ?? '');
  const [live, setLive] = useState(false);
  const [selected, setSelected] = useState<AppLogLine | null>(null);
  const [debouncedSearch] = useDebouncedValue(searchInput.trim(), 400);

  const {
    data,
    isPending,
    isFetching,
    isError,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useAppLogs({ ...filters, search: debouncedSearch }, live);

  // Keeps the address shareable and the back button meaningful.
  useEffect(() => {
    if ((searchParams.get('search') ?? '') === debouncedSearch) return;
    setSearchParams(debouncedSearch ? { search: debouncedSearch } : {}, { replace: true });
  }, [debouncedSearch, searchParams, setSearchParams]);

  const items = data?.pages.flatMap((page) => page.items) ?? [];
  const person = data?.pages[0]?.person ?? null;

  const reset = () => {
    setSearchInput('');
    setFilters(initialFilters);
  };

  return (
    <Stack gap="lg">
      <Card withBorder radius="lg" padding="lg">
        <Stack gap="md">
          <LogsFilters
            filters={filters}
            searchInput={searchInput}
            live={live}
            isFetching={isFetching && !isFetchingNextPage}
            onSearchInput={setSearchInput}
            onChange={(patch) => setFilters((prev) => ({ ...prev, ...patch }))}
            onLiveChange={setLive}
            onRefresh={() => refetch()}
            onReset={reset}
          />

          {person && <PersonNotice person={person} />}

          {isError && (
            <Alert
              color="red"
              variant="light"
              radius="md"
              icon={<IconAlertTriangle size={18} />}
              title="Не удалось загрузить логи"
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

          {!isPending && !isError && items.length === 0 && (
            <Center mih={220}>
              <Stack align="center" gap={6}>
                <IconMoodEmpty size={32} opacity={0.4} />
                <Text size="sm" c="dimmed">
                  По этим фильтрам логов нет
                </Text>
              </Stack>
            </Center>
          )}

          {items.length > 0 && (
            <Stack gap="md">
              <LogsTable
                items={items}
                selectedId={selected?.id ?? null}
                onSelect={setSelected}
              />
              <Center>
                {hasNextPage ? (
                  <Button
                    variant="light"
                    color="violet"
                    radius="md"
                    loading={isFetchingNextPage}
                    onClick={() => fetchNextPage()}
                  >
                    Показать раньше
                  </Button>
                ) : (
                  <Text size="sm" c="dimmed">
                    Больше строк нет
                  </Text>
                )}
              </Center>
            </Stack>
          )}
        </Stack>
      </Card>

      <LogDetailsDrawer
        line={selected}
        onSelect={setSelected}
        onClose={() => setSelected(null)}
      />
    </Stack>
  );
};
