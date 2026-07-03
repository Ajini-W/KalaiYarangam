"use client";

import * as React from "react";
import { toast } from "sonner";
import { dashboardService } from "@/services/dashboard.service";
import { withMockFallback } from "@/lib/mock-fallback";
import { getMockDashboardData } from "@/mocks";
import type {
  DashboardAlert,
  DashboardMetric,
  DashboardSummary,
  DashboardUpcomingItem,
} from "@/types/dashboard";

export function useDashboard() {
  const [summary, setSummary] = React.useState<DashboardSummary | null>(null);
  const [metrics, setMetrics] = React.useState<DashboardMetric[]>([]);
  const [upcoming, setUpcoming] = React.useState<DashboardUpcomingItem[]>([]);
  const [alerts, setAlerts] = React.useState<DashboardAlert[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [usingMock, setUsingMock] = React.useState(false);

  const applyMock = React.useCallback(() => {
    const mock = getMockDashboardData();
    setSummary(mock.summary);
    setMetrics(mock.metrics);
    setUpcoming(mock.upcoming);
    setAlerts(mock.alerts);
    setUsingMock(true);
    setError(null);
  }, []);

  const fetch = React.useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { data: source, usingMock: isMock } = await withMockFallback(
        async () => {
          const [summaryRes, metricsRes, upcomingRes, alertsRes] = await Promise.allSettled([
            dashboardService.getSummary(),
            dashboardService.getMetrics(),
            dashboardService.getUpcoming(),
            dashboardService.getAlerts(),
          ]);

          const allFailed = [summaryRes, metricsRes, upcomingRes, alertsRes].every(
            (r) => r.status === "rejected",
          );
          if (allFailed) throw new Error("Failed to load dashboard");

          if (summaryRes.status === "fulfilled") setSummary(summaryRes.value);
          if (metricsRes.status === "fulfilled") setMetrics(metricsRes.value.metrics ?? []);
          if (upcomingRes.status === "fulfilled") setUpcoming(upcomingRes.value.items ?? []);
          if (alertsRes.status === "fulfilled") setAlerts(alertsRes.value.alerts ?? []);

          return "api" as const;
        },
        () => "mock" as const,
      );

      if (source === "mock" || isMock) {
        applyMock();
      } else {
        setUsingMock(false);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load dashboard";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [applyMock]);

  React.useEffect(() => {
    fetch();
  }, [fetch]);

  return { summary, metrics, upcoming, alerts, loading, error, usingMock, refetch: fetch };
}
