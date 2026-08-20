import { useQuery } from '@tanstack/react-query';
import { axiosInstance } from '@/api';
import type { Payment } from '../types';

/**
 * Reads the payment's current state from the backend.
 *
 * Deliberately fetched once rather than polled: the backend runs its own background
 * reconciliation sweep, so an outcome is discovered server-side whether or not this page
 * is still open. `/payment/status/:id` also re-checks a stale PENDING payment against
 * FreedomPay before answering, which keeps this single request authoritative.
 */
export const usePaymentStatus = (paymentId: string | null) => {
  return useQuery({
    queryKey: ['payment', 'status', paymentId],
    enabled: Boolean(paymentId),
    queryFn: async () => {
      const { data } = await axiosInstance.get<Payment>(`/payment/status/${paymentId}`);
      return data;
    },
    staleTime: 0,
  });
};
