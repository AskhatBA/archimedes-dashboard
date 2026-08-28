/** Where an operator has got to with an order. Mirrors the backend enum. */
export type ProgramOrderStatus = 'NEW' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

/** Which catalogue an ordered program came from — the mobile app's two tabs. */
export type ProgramOrderCategory = 'MED_PLAN' | 'CHECKUP';

/** One program inside an order, snapshotted at purchase time. */
export type ProgramOrderItem = {
  id: string;
  category: ProgramOrderCategory;
  /** MIS `oid` for a med plan, the check-up's own id for a check-up. */
  externalId: string;
  code: string | null;
  title: string;
  price: number;
};

export type ProgramOrder = {
  id: string;
  userId: string;
  status: ProgramOrderStatus;
  total: number;
  contactPhone: string | null;
  comment: string | null;
  /** The settled payment behind the order — an order never exists without one. */
  paymentId: string;
  createdAt: string;
  updatedAt: string;
  items: ProgramOrderItem[];
  patientName: string | null;
  patientIin: string | null;
  patientPhone: string;
};

/** `items` here is the page of orders — each order carries its own `items` of programs. */
export type ProgramOrderListResponse = {
  success: boolean;
  items: ProgramOrder[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  totalAmount: number;
};

export type ProgramOrderResponse = {
  success: boolean;
  order: ProgramOrder;
};

export type ProgramOrderFilters = {
  page: number;
  limit: number;
  search: string;
  status: ProgramOrderStatus | null;
  category: ProgramOrderCategory | null;
  dateFrom: string | null;
  dateTo: string | null;
};

/** Only these two fields are editable — amounts and programs belong to the payment. */
export type ProgramOrderPayload = {
  status?: ProgramOrderStatus;
  comment?: string | null;
};
