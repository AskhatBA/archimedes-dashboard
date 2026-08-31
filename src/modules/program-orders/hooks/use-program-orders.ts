import {
  keepPreviousData,
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
  type QueryClient,
} from '@tanstack/react-query';
import { axiosInstance } from '@/api';
import { PROGRAM_ORDER_BOARD_STATUSES } from '../constants';
import type {
  ProgramOrder,
  ProgramOrderBoardFilters,
  ProgramOrderFilters,
  ProgramOrderListResponse,
  ProgramOrderPayload,
  ProgramOrderResponse,
  ProgramOrderStatus,
} from '../types';

const PROGRAM_ORDERS_KEY = ['program-orders'] as const;
const PROGRAM_ORDERS_BOARD_KEY = [...PROGRAM_ORDERS_KEY, 'board'] as const;

const listParams = (filters: ProgramOrderFilters) => ({
  page: filters.page,
  limit: filters.limit,
  ...(filters.search ? { search: filters.search } : {}),
  ...(filters.status ? { status: filters.status } : {}),
  ...(filters.category ? { category: filters.category } : {}),
  ...(filters.dateFrom ? { dateFrom: filters.dateFrom } : {}),
  ...(filters.dateTo ? { dateTo: filters.dateTo } : {}),
});

/**
 * Reads the admin-wide listing of paid-programs orders. The endpoint is role-gated on
 * the backend, so a non-admin token gets a 403 here — which the axios interceptor turns
 * into a logout.
 */
export const useProgramOrders = (filters: ProgramOrderFilters, enabled = true) =>
  useQuery({
    enabled,
    queryKey: [...PROGRAM_ORDERS_KEY, 'list', filters],
    queryFn: async () => {
      const { data } = await axiosInstance.get<ProgramOrderListResponse>(
        '/program-orders/admin',
        { params: listParams(filters) },
      );

      return data;
    },
    // Without this the table empties out on every page/filter change and the layout
    // jumps; keeping the previous page visible makes paging feel instant.
    placeholderData: keepPreviousData,
  });

/** One board column: the orders in a status, plus how many there are in total. */
export type ProgramOrderBoardColumn = {
  status: ProgramOrderStatus;
  items: ProgramOrder[];
  /** Across the whole status, not just the rows loaded into the column. */
  total: number;
  totalAmount: number;
  isFetching: boolean;
};

/**
 * The board reads one page per status — the listing endpoint has no grouping mode, and
 * four narrow queries also let a column grow on its own without reloading the rest.
 * `limits` is per status, so "Показать ещё" only re-fetches the column it was clicked in.
 */
export const useProgramOrdersBoard = (
  filters: ProgramOrderBoardFilters,
  limits: Record<ProgramOrderStatus, number>,
  enabled = true,
) =>
  useQueries({
    queries: PROGRAM_ORDER_BOARD_STATUSES.map((status) => ({
      enabled,
      queryKey: [...PROGRAM_ORDERS_KEY, 'board', status, filters, limits[status]] as const,
      queryFn: async ({ signal }: { signal: AbortSignal }) => {
        const { data } = await axiosInstance.get<ProgramOrderListResponse>(
          '/program-orders/admin',
          {
            // Forwarded so `cancelQueries` before an optimistic move actually aborts a
            // column that is still loading, instead of waiting it out.
            signal,
            params: {
              ...listParams({ ...filters, page: 1, limit: limits[status], status }),
            },
          },
        );

        return data;
      },
      // Same reason as the table: a column that empties out mid-refetch would make cards
      // jump while the admin is dragging one.
      placeholderData: keepPreviousData,
    })),
    combine: (results) => ({
      columns: PROGRAM_ORDER_BOARD_STATUSES.map<ProgramOrderBoardColumn>(
        (status, index) => ({
          status,
          items: results[index].data?.items ?? [],
          total: results[index].data?.total ?? 0,
          totalAmount: results[index].data?.totalAmount ?? 0,
          isFetching: results[index].isFetching,
        }),
      ),
      // `isPending` stays true for a disabled query, so the loader has to key off the
      // fetch itself — otherwise the board would spin forever in list mode.
      isPending: results.some((result) => result.isPending && result.isFetching),
      isError: results.some((result) => result.isError),
      error: results.find((result) => result.error)?.error,
      refetch: () => results.forEach((result) => void result.refetch()),
    }),
  });

/**
 * How many orders are still waiting to be picked up, regardless of the filters on
 * screen — that is the number an operator works down, so narrowing the table must not
 * change it. Only the count is used, so the page is asked for a single row.
 */
export const useNewProgramOrdersCount = () =>
  useQuery({
    queryKey: [...PROGRAM_ORDERS_KEY, 'new-count'],
    queryFn: async () => {
      const { data } = await axiosInstance.get<ProgramOrderListResponse>(
        '/program-orders/admin',
        { params: { page: 1, limit: 1, status: 'NEW' } },
      );

      return data.total;
    },
  });

/**
 * Moves the order between the cached column pages so a dropped card stays where it was
 * dropped. The cache is the only place the board reads from, which is what keeps an order
 * in exactly one column: an overlay kept beside the cache could show the card in its old
 * column and its new one at once, and two cards sharing an id knock the moved one out of
 * dnd-kit's registry — after which it can never be dragged again.
 */
const moveOrderInBoardCache = (
  queryClient: QueryClient,
  id: string,
  status: ProgramOrderStatus,
) => {
  const entries = queryClient.getQueriesData<ProgramOrderListResponse>({
    queryKey: PROGRAM_ORDERS_BOARD_KEY,
  });

  const moved = entries
    .flatMap(([, data]) => data?.items ?? [])
    .find((item) => item.id === id);

  if (!moved) return;

  const next: ProgramOrder = { ...moved, status };

  entries.forEach(([queryKey]) => {
    // The column a cached page belongs to is the third segment of its key.
    const columnStatus = queryKey[2] as ProgramOrderStatus;

    queryClient.setQueryData<ProgramOrderListResponse>(queryKey, (page) => {
      if (!page) return page;

      const without = page.items.filter((item) => item.id !== id);
      const held = without.length !== page.items.length;

      if (columnStatus === status) {
        // Dropped cards go to the top, where the admin can see them land.
        return held
          ? { ...page, items: [next, ...without] }
          : {
              ...page,
              items: [next, ...without],
              total: page.total + 1,
              totalAmount: page.totalAmount + moved.total,
            };
      }

      return held
        ? {
            ...page,
            items: without,
            total: Math.max(page.total - 1, 0),
            totalAmount: Math.max(page.totalAmount - moved.total, 0),
          }
        : page;
    });
  });
};

/**
 * Moves an order along or saves an operator note. A status change is applied to the board
 * cache first so the card does not sit in its old column until the server answers, then
 * the whole `program-orders` key is invalidated so the table and the "новых" counter
 * follow too.
 */
export const useUpdateProgramOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: ProgramOrderPayload }) => {
      const { data } = await axiosInstance.patch<ProgramOrderResponse>(
        `/program-orders/admin/${id}`,
        payload,
      );

      return data.order;
    },
    onMutate: async ({ id, payload }) => {
      if (!payload.status) return undefined;

      const previous = queryClient.getQueriesData<ProgramOrderListResponse>({
        queryKey: PROGRAM_ORDERS_BOARD_KEY,
      });

      // Synchronously, before the await below: the card has to be in its new column in
      // the same frame the admin let go of it, not one round trip later.
      moveOrderInBoardCache(queryClient, id, payload.status);

      // A refetch still in flight — from the previous drop, most likely — would otherwise
      // land on top of this move and put the card back where it came from.
      await queryClient.cancelQueries({ queryKey: PROGRAM_ORDERS_BOARD_KEY });

      return { previous };
    },
    onError: (_error, _variables, context) => {
      context?.previous?.forEach(([queryKey, data]) =>
        queryClient.setQueryData(queryKey, data),
      );
    },
    // Runs after the rollback too, so a rejected move is re-read from the server rather
    // than left on whatever the snapshot held.
    onSettled: () => queryClient.invalidateQueries({ queryKey: PROGRAM_ORDERS_KEY }),
  });
};
