import { apiClient } from "./api-client";
import type {
  DashboardAlertsResponse,
  DashboardMetricsResponse,
  DashboardSummary,
  DashboardUpcomingResponse,
} from "@/types/dashboard";

interface ApiEnvelope<T> {
  httpStatusCode: number;
  message: string;
  data: T;
  timestamp: string;
}

function unwrap<T>(response: { data: ApiEnvelope<T> }): T {
  return response.data.data;
}

export const dashboardService = {
  async getSummary() {
    const response = await apiClient.get<ApiEnvelope<DashboardSummary>>("/dashboard/summary");
    return unwrap(response);
  },

  async getMetrics() {
    const response = await apiClient.get<ApiEnvelope<DashboardMetricsResponse>>("/dashboard/metrics");
    return unwrap(response);
  },

  async getUpcoming() {
    const response = await apiClient.get<ApiEnvelope<DashboardUpcomingResponse>>("/dashboard/upcoming");
    return unwrap(response);
  },

  async getAlerts() {
    const response = await apiClient.get<ApiEnvelope<DashboardAlertsResponse>>("/dashboard/alerts");
    return unwrap(response);
  },
};
