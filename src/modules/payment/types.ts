export type InitPaymentBody = {
  amount: number;
  description?: string;
};

export type InitPaymentResponse = {
  paymentId: string;
  paymentUrl: string;
};

export type PaymentStatus = 'PENDING' | 'SUCCESS' | 'FAILED';

export type Payment = {
  id: string;
  amount: number;
  description: string;
  status: PaymentStatus;
  pgPaymentId: string | null;
  createdAt: string;
};
