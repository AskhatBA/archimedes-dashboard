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
import {
  PROGRAM_ORDER_BOARD_COLUMN_SIZE,
  PROGRAM_ORDER_BOARD_INITIAL_LIMITS,
  PROGRAM_ORDER_PAGE_SIZE,
} from './constants';
import { ProgramOrderDetailsDrawer } from './components/program-order-details-drawer';
import { ProgramOrdersBoard } from './components/program-orders-board';
import { ProgramOrdersFilters } from './components/program-orders-filters';
import { ProgramOrdersSummary } from './components/program-orders-summary';
import { ProgramOrdersTable } from './components/program-orders-table';
import {
  useNewProgramOrdersCount,
  useProgramOrders,
  useProgramOrdersBoard,
} from './hooks/use-program-orders';
import type {
  ProgramOrder,
  ProgramOrderFilters,
  ProgramOrderStatus,
  ProgramOrderView,
} from './types';

/** Everything except `search`, which lives in its own debounced input state. */
type FilterState = Omit<ProgramOrderFilters, 'search'>;

const initialFilters: FilterState = {
  page: 1,
  limit: PROGRAM_ORDER_PAGE_SIZE,
  status: null,
  category: null,
  dateFrom: null,
  dateTo: null,
};

export const ProgramOrders = () => {
  const [view, setView] = useState<ProgramOrderView>('list');
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [searchInput, setSearchInput] = useState('');
  const [selected, setSelected] = useState<ProgramOrder | null>(null);
  // How many cards each column has asked for. Per status, so "Показать ещё" in one
  // column does not re-fetch the other three.
  const [boardLimits, setBoardLimits] = useState(PROGRAM_ORDER_BOARD_INITIAL_LIMITS);
  // Typing must not fire a request per keystroke, so the query reads the debounced
  // value rather than the raw input.
  const [debouncedSearch] = useDebouncedValue(searchInput, 350);
  const search = debouncedSearch.trim();
  const isBoard = view === 'board';

  // Only the visible view fetches — the other one would just be four (or one) requests
  // for a screen nobody is looking at.
  const list = useProgramOrders({ ...filters, search }, !isBoard);
  const board = useProgramOrdersBoard(
    {
      search,
      category: filters.category,
      dateFrom: filters.dateFrom,
      dateTo: filters.dateTo,
    },
    boardLimits,
    isBoard,
  );
  const { data: newCount } = useNewProgramOrdersCount();

  const patch = (next: Partial<FilterState>) =>
    setFilters((prev) => ({ ...prev, ...next }));

  const handleSearchInput = (value: string) => {
    setSearchInput(value);
    // A new search always restarts at page 1 — otherwise narrowing the result set
    // lands the admin on an empty page 4.
    patch({ page: 1 });
  };

  const handleViewChange = (next: ProgramOrderView) => {
    setView(next);
    // The board has no status filter, so one left over from the table would silently
    // apply to nothing; the table, in turn, must not open on page 4 of the old result.
    setFilters((prev) => ({ ...prev, page: 1, status: null }));
    setBoardLimits(PROGRAM_ORDER_BOARD_INITIAL_LIMITS);
  };

  const handleLoadMore = (status: ProgramOrderStatus) =>
    setBoardLimits((prev) => ({
      ...prev,
      [status]: prev[status] + PROGRAM_ORDER_BOARD_COLUMN_SIZE,
    }));

  const reset = () => {
    setSearchInput('');
    setFilters(initialFilters);
    setBoardLimits(PROGRAM_ORDER_BOARD_INITIAL_LIMITS);
  };

  // The board's four columns cover the same filtered set the table pages through, so the
  // tiles add up to the same figures either way.
  const boardTotal = board.columns.reduce((sum, column) => sum + column.total, 0);
  const boardAmount = board.columns.reduce((sum, column) => sum + column.totalAmount, 0);
  const boardLoaded = board.columns.reduce((sum, column) => sum + column.items.length, 0);

  const isPending = isBoard ? board.isPending : list.isPending;
  const isError = isBoard ? board.isError : list.isError;
  const error = isBoard ? board.error : list.error;
  const refetch = isBoard ? board.refetch : list.refetch;
  const isEmpty = isBoard ? boardTotal === 0 : list.data?.items.length === 0;

  return (
    <Stack gap="lg">
      <ProgramOrdersSummary
        total={isBoard ? boardTotal : (list.data?.total ?? 0)}
        totalAmount={isBoard ? boardAmount : (list.data?.totalAmount ?? 0)}
        visibleHint={
          isBoard
            ? `Загружено ${boardLoaded} на доске`
            : `Показано ${list.data?.items.length ?? 0} на странице`
        }
        newCount={newCount}
      />

      <Card withBorder radius="lg" padding="lg">
        <Stack gap="md">
          <ProgramOrdersFilters
            filters={filters}
            searchInput={searchInput}
            onSearchInput={handleSearchInput}
            onChange={patch}
            onReset={reset}
            view={view}
            onViewChange={handleViewChange}
          />

          {isError && (
            <Alert
              color="red"
              variant="light"
              radius="md"
              icon={<IconAlertTriangle size={18} />}
              title="Не удалось загрузить заявки"
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

          {!isPending && !isError && isEmpty && (
            <Center mih={220}>
              <Stack align="center" gap={6}>
                <IconMoodEmpty size={32} opacity={0.4} />
                <Text size="sm" c="dimmed">
                  По этим фильтрам заявок нет
                </Text>
              </Stack>
            </Center>
          )}

          {!isPending && !isEmpty && isBoard && (
            <ProgramOrdersBoard
              columns={board.columns}
              onSelect={setSelected}
              onLoadMore={handleLoadMore}
            />
          )}

          {!isPending && !isBoard && list.data && list.data.items.length > 0 && (
            <Stack gap="md" style={{ opacity: list.isFetching ? 0.6 : 1 }}>
              <ProgramOrdersTable items={list.data.items} onSelect={setSelected} />
              <Group justify="space-between" wrap="wrap">
                <Text size="sm" c="dimmed">
                  Страница {list.data.page} из {list.data.totalPages} · всего{' '}
                  {list.data.total.toLocaleString('ru-RU')}
                </Text>
                <Pagination
                  value={list.data.page}
                  total={list.data.totalPages}
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

      <ProgramOrderDetailsDrawer order={selected} onClose={() => setSelected(null)} />
    </Stack>
  );
};
