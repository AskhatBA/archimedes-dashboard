/** One selectable amount as `GET /med-account/options/admin` returns it. */
export type TopupOption = {
  id: string;
  /** Amount in tenge — unique across the list. */
  amount: number;
  /** Optional caption under the amount in the app. */
  label: string | null;
  popular: boolean;
  /** Unpublished amounts stay out of the mobile app but remain visible here. */
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type TopupOptionListResponse = {
  success: boolean;
  options: TopupOption[];
};

export type TopupOptionResponse = {
  success: boolean;
  option: TopupOption;
};

/** What the write endpoints accept. `PATCH` takes any subset of it. */
export type TopupOptionPayload = {
  amount: number;
  label: string | null;
  popular: boolean;
  isActive: boolean;
  /** Omitted on create — the backend then appends the amount to the end of the list. */
  sortOrder?: number;
};

/** Form state — numbers stay strings while the admin is typing. */
export type TopupOptionFormValues = {
  amount: number | string;
  label: string;
  popular: boolean;
  isActive: boolean;
  sortOrder: number | string;
};

/**
 * How far a paid top-up has got on its way onto the patient's medical account. The account
 * lives in the insurer's system, so `CREDITED` means an operator (or, once that endpoint
 * exists, the insurer's API) has actually posted it there.
 */
export type TopupStatus = 'PENDING' | 'CREDITED' | 'FAILED';

/** One paid top-up as `GET /med-account/topups/admin` returns it. */
export type Topup = {
  id: string;
  amount: number;
  status: TopupStatus;
  paymentId: string;
  optionId: string | null;
  /** Reference the insurer returned when it accepted the transfer, once it does. */
  externalRef: string | null;
  comment: string | null;
  creditedAt: string | null;
  createdAt: string;
  updatedAt: string;
  userId: string;
  /** Insurer beneficiary the money is for — what an operator searches their system by. */
  beneficiaryId: string | null;
  patientName: string | null;
  patientIin: string | null;
  patientPhone: string;
};

export type TopupListResponse = {
  success: boolean;
  items: Topup[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  /** Summed over the whole filtered set, not the visible page. */
  totalAmount: number;
};

export type TopupListParams = {
  page: number;
  limit: number;
  status?: TopupStatus | '';
  search?: string;
  dateFrom?: string;
  dateTo?: string;
};

/** The only writable columns — the amount belongs to the payment behind the top-up. */
export type TopupPayload = {
  status?: TopupStatus;
  comment?: string | null;
};
