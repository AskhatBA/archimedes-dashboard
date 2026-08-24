/** Payload of `GET /stats/overview` — plain counters, admin-only on the backend. */
export type OverviewStats = {
  totalPatients: number;
  totalRefundRequests: number;
  acceptedRefunds: number;
  totalAppointments: number;
  appointmentsToday: number;
};

export type OverviewStatsResponse = OverviewStats & { success: boolean };
