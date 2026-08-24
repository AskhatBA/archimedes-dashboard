export type RefundState = 'accepted' | 'failed' | 'unknown';

export type RefundRequest = {
  id: string;
  userId: string;
  beneficiaryId: string;
  personId: string;
  programId: string;
  category: number;
  /** Claim date as the mobile app sent it — `YYYY-MM-DD`, not an ISO timestamp. */
  date: string;
  amount: number;
  comments: string | null;
  filesCount: number;
  state: RefundState;
  createdAt: string;
  patientName: string | null;
  patientIin: string | null;
  patientPhone: string;
};

export type RefundListResponse = {
  success: boolean;
  items: RefundRequest[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  totalAmount: number;
};

export type RefundFilters = {
  page: number;
  limit: number;
  search: string;
  category: number | null;
  dateFrom: string | null;
  dateTo: string | null;
};
