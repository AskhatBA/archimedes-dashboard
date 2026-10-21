import { keepPreviousData, useInfiniteQuery, useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { axiosInstance } from '@/api';
import { APP_LOG_LIVE_INTERVAL_MS, APP_LOG_PAGE_SIZE } from '../constants';
import type { AppLogFilters, AppLogListResponse } from '../types';

const toIso = (value: string) => (value ? dayjs(value).toISOString() : undefined);

/**
 * The feed, newest first. The backend pages by an `id` cursor rather than page numbers:
 * new lines arrive all the time, and an offset would shift under the admin's feet.
 */
export const useAppLogs = (filters: AppLogFilters, live: boolean) =>
  useInfiniteQuery({
    queryKey: ['app-logs', filters],
    queryFn: async ({ pageParam }) => {
      const { data } = await axiosInstance.get<AppLogListResponse>('/audit/admin/logs', {
        params: {
          limit: APP_LOG_PAGE_SIZE,
          ...(pageParam ? { before: pageParam } : {}),
          ...(filters.search ? { search: filters.search } : {}),
          ...(filters.level !== 'all' ? { level: filters.level } : {}),
          ...(filters.from ? { from: toIso(filters.from) } : {}),
          ...(filters.to ? { to: toIso(filters.to) } : {}),
        },
      });

      return data;
    },
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    placeholderData: keepPreviousData,
    // A log screen is read while someone reproduces the problem — stale data is the bug.
    staleTime: 0,
    refetchInterval: live ? APP_LOG_LIVE_INTERVAL_MS : false,
  });

/** Every line of one request, oldest first — the timeline in the details drawer. */
export const useRequestLogs = (reqId: string | null) =>
  useQuery({
    queryKey: ['app-logs', 'request', reqId],
    queryFn: async () => {
      const { data } = await axiosInstance.get<AppLogListResponse>('/audit/admin/logs', {
        params: { reqId },
      });

      return data.items;
    },
    enabled: reqId !== null,
    staleTime: 0,
  });
