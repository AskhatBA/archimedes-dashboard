export type CheckupCoverage = 'PERSONAL' | 'FAMILY';

/** One catalogue row as `GET /checkups/admin` returns it. */
export type Checkup = {
  id: string;
  /** Lowercase slug — unique, and what deep links and the seed script point at. */
  code: string;
  title: string;
  description: string | null;
  /** Price in tenge. */
  price: number;
  duration: string | null;
  coverage: CheckupCoverage;
  services: string[];
  popular: boolean;
  /** Unpublished rows stay out of the mobile app but remain visible here. */
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type CheckupListResponse = {
  success: boolean;
  checkups: Checkup[];
};

export type CheckupResponse = {
  success: boolean;
  checkup: Checkup;
};

/** What the write endpoints accept. `PATCH` takes any subset of it. */
export type CheckupPayload = {
  code: string;
  title: string;
  price: number;
  services: string[];
  description: string | null;
  duration: string | null;
  coverage: CheckupCoverage;
  popular: boolean;
  isActive: boolean;
  /** Omitted on create — the backend then appends the entry to the end of the list. */
  sortOrder?: number;
};

/** Form state — numbers stay strings while the admin is typing. */
export type CheckupFormValues = {
  code: string;
  title: string;
  price: number | string;
  /** One service per line; `;` is also accepted so a price-list cell can be pasted in. */
  services: string;
  description: string;
  duration: string;
  coverage: CheckupCoverage;
  popular: boolean;
  isActive: boolean;
  sortOrder: number | string;
};
