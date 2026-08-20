import { useMutation } from '@tanstack/react-query';
import { axiosInstance } from '@/api';
import type { InitPaymentBody, InitPaymentResponse } from '../types';

/**
 * Creates a payment on the backend and returns the FreedomPay redirect URL.
 *
 * The caller is expected to navigate to `paymentUrl`; FreedomPay then sends the payer
 * back to the success/failure URL configured on the backend.
 */
export const useInitPayment = () =>
  useMutation({
    mutationFn: async (body: InitPaymentBody) => {
      const { data } = await axiosInstance.post<InitPaymentResponse>('/payment/init', body);
      return data;
    },
  });
