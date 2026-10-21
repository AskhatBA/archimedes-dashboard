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
import { AUTH_ATTEMPT_PAGE_SIZE, isCompleteSearch } from './constants';
import { AuthAttemptDetailsDrawer } from './components/auth-attempt-details-drawer';
import { AuthAttemptsFilters } from './components/auth-attempts-filters';
import { AuthAttemptsTable } from './components/auth-attempts-table';
import { useAuthAttempts } from './hooks/use-auth-attempts';
import type { AuthAttempt, AuthAttemptOutcome } from './types';

export const AuthAttempts = () => {
  const [page, setPage] = useState(1);
  const [outcome, setOutcome] = useState<AuthAttemptOutcome>('all');
  const [searchInput, setSearchInput] = useState('');
  const [selected, setSelected] = useState<AuthAttempt | null>(null);
  const [debouncedSearch] = useDebouncedValue(searchInput.trim(), 350);

  // A half-typed number would only earn a 400 from the backend, so it is not sent:
  // the list stays as it was and the input says what is missing.
  const isSearchIncomplete = debouncedSearch !== '' && !isCompleteSearch(debouncedSearch);
  const { data, isPending, isFetching, isError, error, refetch } = useAuthAttempts(
    { page, limit: AUTH_ATTEMPT_PAGE_SIZE, search: debouncedSearch, outcome },
    !isSearchIncomplete,
  );

  const handleSearchInput = (value: string) => {
    setSearchInput(value);
    setPage(1);
  };

  const handleOutcomeChange = (value: AuthAttemptOutcome) => {
    setOutcome(value);
    setPage(1);
  };

  const reset = () => {
    setSearchInput('');
    setOutcome('all');
    setPage(1);
  };

  return (
    <Stack gap="lg">
      <Card withBorder radius="lg" padding="lg">
        <Stack gap="md">
          <AuthAttemptsFilters
            searchInput={searchInput}
            isSearchIncomplete={isSearchIncomplete}
            outcome={outcome}
            onSearchInput={handleSearchInput}
            onOutcomeChange={handleOutcomeChange}
            onReset={reset}
          />

          {isError && (
            <Alert
              color="red"
              variant="light"
              radius="md"
              icon={<IconAlertTriangle size={18} />}
              title="Не удалось загрузить попытки входа"
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

          {isPending && !isSearchIncomplete && (
            <Center mih={220}>
              <Loader color="violet" />
            </Center>
          )}

          {!isPending && !isError && data && data.items.length === 0 && (
            <Center mih={220}>
              <Stack align="center" gap={6}>
                <IconMoodEmpty size={32} opacity={0.4} />
                <Text size="sm" c="dimmed">
                  {debouncedSearch
                    ? 'По этому телефону или ИИН попыток входа нет'
                    : 'Попыток входа пока нет'}
                </Text>
              </Stack>
            </Center>
          )}

          {!isPending && data && data.items.length > 0 && (
            <Stack gap="md" style={{ opacity: isFetching ? 0.6 : 1 }}>
              <AuthAttemptsTable items={data.items} onSelect={setSelected} />
              <Group justify="space-between" wrap="wrap">
                <Text size="sm" c="dimmed">
                  Страница {data.page} из {data.totalPages} · всего{' '}
                  {data.total.toLocaleString('ru-RU')}
                </Text>
                <Pagination
                  value={data.page}
                  total={data.totalPages}
                  onChange={setPage}
                  color="violet"
                  radius="md"
                  size="sm"
                />
              </Group>
            </Stack>
          )}
        </Stack>
      </Card>

      <AuthAttemptDetailsDrawer attempt={selected} onClose={() => setSelected(null)} />
    </Stack>
  );
};
