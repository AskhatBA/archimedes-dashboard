import { useState } from 'react';
import {
  Alert,
  Badge,
  Button,
  Card,
  Center,
  Group,
  Loader,
  Pagination,
  SegmentedControl,
  Select,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import {
  IconAlertTriangle,
  IconMoodEmpty,
  IconPlus,
  IconSearch,
} from '@tabler/icons-react';
import { DeleteTopupOptionModal } from './components/delete-topup-option-modal';
import { TopupDetailsDrawer } from './components/topup-details-drawer';
import { TopupOptionFormDrawer } from './components/topup-option-form-drawer';
import { TopupOptionsTable } from './components/topup-options-table';
import { TopupsTable } from './components/topups-table';
import { STATUS_OPTIONS, formatAmount } from './constants';
import { useTopupOptions, useUpdateTopupOption } from './hooks/use-topup-options';
import { useTopups } from './hooks/use-topups';
import type { Topup, TopupOption, TopupStatus } from './types';

const PAGE_SIZE = 20;

type View = 'options' | 'topups';

const ErrorAlert = ({
  title,
  error,
  onRetry,
}: {
  title: string;
  error: unknown;
  onRetry: () => void;
}) => (
  <Alert
    color="red"
    variant="light"
    radius="md"
    icon={<IconAlertTriangle size={18} />}
    title={title}
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
        onClick={onRetry}
      >
        Повторить
      </Text>
    </Stack>
  </Alert>
);

const EmptyState = ({ children }: { children: string }) => (
  <Center mih={220}>
    <Stack align="center" gap={6}>
      <IconMoodEmpty size={32} opacity={0.4} />
      <Text size="sm" c="dimmed">
        {children}
      </Text>
    </Stack>
  </Center>
);

/** The catalogue of amounts the mobile app offers on the "пополнить медсчёт" screen. */
const OptionsView = () => {
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<TopupOption | null>(null);
  // Separate from `editing` because the create form has no amount to edit.
  const [formOpen, setFormOpen] = useState(false);
  const [deleting, setDeleting] = useState<TopupOption | null>(null);

  const { data, isPending, isFetching, isError, error, refetch } = useTopupOptions();
  const update = useUpdateTopupOption();

  // The list is a dozen rows, so filtering client-side beats a round trip.
  const query = search.trim().toLowerCase();
  const items = (data ?? []).filter(
    (option) =>
      !query ||
      String(option.amount).includes(query.replace(/\s/g, '')) ||
      (option.label ?? '').toLowerCase().includes(query),
  );

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (option: TopupOption) => {
    setEditing(option);
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setEditing(null);
  };

  const togglingId = update.isPending && update.variables ? [update.variables.id] : [];

  return (
    <Card withBorder radius="lg" padding="lg">
      <Stack gap="md">
        <Group justify="space-between" align="flex-end" wrap="wrap" gap="sm">
          <TextInput
            label="Поиск"
            placeholder="Сумма или подпись"
            leftSection={<IconSearch size={16} />}
            value={search}
            onChange={(e) => setSearch(e.currentTarget.value)}
            radius="md"
            w={280}
          />
          <Button
            leftSection={<IconPlus size={16} />}
            color="violet"
            radius="md"
            onClick={openCreate}
          >
            Добавить сумму
          </Button>
        </Group>

        {isError && (
          <ErrorAlert
            title="Не удалось загрузить суммы пополнения"
            error={error}
            onRetry={refetch}
          />
        )}

        {isPending && (
          <Center mih={220}>
            <Loader color="violet" />
          </Center>
        )}

        {!isPending && !isError && items.length === 0 && (
          <EmptyState>
            {query ? 'Ничего не найдено' : 'Список сумм пока пуст'}
          </EmptyState>
        )}

        {!isPending && items.length > 0 && (
          <Stack gap="md" style={{ opacity: isFetching ? 0.6 : 1 }}>
            <TopupOptionsTable
              items={items}
              pendingIds={togglingId}
              onEdit={openEdit}
              onDelete={setDeleting}
              onTogglePublished={(option) =>
                update.mutate({
                  id: option.id,
                  payload: { isActive: !option.isActive },
                })
              }
            />
            <Text size="sm" c="dimmed">
              Всего {(data ?? []).length} · показано в приложении{' '}
              {(data ?? []).filter((option) => option.isActive).length}
            </Text>
          </Stack>
        )}
      </Stack>

      <TopupOptionFormDrawer opened={formOpen} option={editing} onClose={closeForm} />
      <DeleteTopupOptionModal option={deleting} onClose={() => setDeleting(null)} />
    </Card>
  );
};

/** The operator queue: top-ups patients have paid for, and where each one has got to. */
const TopupsView = () => {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<TopupStatus | ''>('');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Topup | null>(null);

  const { data, isPending, isFetching, isError, error, refetch } = useTopups({
    page,
    limit: PAGE_SIZE,
    status,
    search: search.trim(),
  });

  // Pinned to PENDING with `limit=1` and read only for its `total`: it is the queue an
  // operator works down, so narrowing the table must not change it.
  const pending = useTopups({ page: 1, limit: 1, status: 'PENDING' });

  const resetTo = (apply: () => void) => {
    apply();
    setPage(1);
  };

  return (
    <Stack gap="lg">
      <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
        <Card withBorder radius="lg" padding="lg">
          <Text size="sm" c="dimmed">
            Ждут зачисления
          </Text>
          <Group gap="xs" align="baseline">
            <Text size="xl" fw={700}>
              {pending.data?.total ?? '—'}
            </Text>
            <Badge variant="light" color="orange" radius="sm">
              в очереди
            </Badge>
          </Group>
        </Card>
        <Card withBorder radius="lg" padding="lg">
          <Text size="sm" c="dimmed">
            Пополнений по фильтру
          </Text>
          <Text size="xl" fw={700}>
            {data?.total ?? '—'}
          </Text>
        </Card>
        <Card withBorder radius="lg" padding="lg">
          <Text size="sm" c="dimmed">
            Сумма по фильтру
          </Text>
          <Text size="xl" fw={700}>
            {data ? formatAmount(data.totalAmount) : '—'}
          </Text>
        </Card>
      </SimpleGrid>

      <Card withBorder radius="lg" padding="lg">
        <Stack gap="md">
          <Group align="flex-end" wrap="wrap" gap="sm">
            <TextInput
              label="Поиск"
              placeholder="ФИО, ИИН или телефон"
              leftSection={<IconSearch size={16} />}
              value={search}
              onChange={(e) => resetTo(() => setSearch(e.currentTarget.value))}
              radius="md"
              w={280}
            />
            <Select
              label="Статус"
              placeholder="Все"
              data={STATUS_OPTIONS}
              value={status || null}
              onChange={(value) =>
                resetTo(() => setStatus((value as TopupStatus | null) ?? ''))
              }
              clearable
              radius="md"
              w={220}
            />
          </Group>

          {isError && (
            <ErrorAlert
              title="Не удалось загрузить пополнения"
              error={error}
              onRetry={refetch}
            />
          )}

          {isPending && (
            <Center mih={220}>
              <Loader color="violet" />
            </Center>
          )}

          {!isPending && !isError && (data?.items.length ?? 0) === 0 && (
            <EmptyState>Пополнений по этим условиям нет</EmptyState>
          )}

          {!isPending && (data?.items.length ?? 0) > 0 && (
            <Stack gap="md" style={{ opacity: isFetching ? 0.6 : 1 }}>
              <TopupsTable items={data!.items} onSelect={setSelected} />
              {data!.totalPages > 1 && (
                <Group justify="flex-end">
                  <Pagination
                    total={data!.totalPages}
                    value={page}
                    onChange={setPage}
                    color="violet"
                    radius="md"
                  />
                </Group>
              )}
            </Stack>
          )}
        </Stack>
      </Card>

      <TopupDetailsDrawer topup={selected} onClose={() => setSelected(null)} />
    </Stack>
  );
};

/**
 * Two sides of the same thing: the amounts the app offers, and the top-ups patients have
 * actually paid for. Only the visible view fetches, so switching does not keep both
 * listings warm.
 */
export const MedAccount = () => {
  const [view, setView] = useState<View>('topups');

  return (
    <Stack gap="lg">
      <SegmentedControl
        value={view}
        onChange={(value) => setView(value as View)}
        color="violet"
        radius="md"
        w="fit-content"
        data={[
          { value: 'topups', label: 'Пополнения' },
          { value: 'options', label: 'Суммы пополнения' },
        ]}
      />

      {view === 'topups' ? <TopupsView /> : <OptionsView />}
    </Stack>
  );
};
