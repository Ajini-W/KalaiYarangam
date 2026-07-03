import type {
  DashboardAlert,
  DashboardMetric,
  DashboardSummary,
  DashboardUpcomingItem,
} from "@/types/dashboard";

export const MOCK_DASHBOARD_SUMMARY: DashboardSummary = {
  headline: "Good afternoon! Here's your overview.",
  subheadline: "2 tasks due this week · 1 upcoming class today",
  metrics: [
    { key: "pending_tasks", label: "Pending Tasks", value: 3, delta: 1, deltaType: "increase" },
    { key: "today_events", label: "Today's Events", value: 2, delta: 0, deltaType: "neutral" },
  ],
  quickStats: { enquiries: 5, notifications: 4 },
};

export const MOCK_DASHBOARD_METRICS: DashboardMetric[] = [
  { key: "attendance_rate", label: "Attendance Rate", value: 87, unit: "%", delta: 3, deltaType: "increase" },
  { key: "active_students", label: "Active Students", value: 24, delta: 2, deltaType: "increase" },
];

export const MOCK_DASHBOARD_UPCOMING: DashboardUpcomingItem[] = [
  {
    id: "mock-up-1",
    title: "Bharatanatyam — Morning Batch",
    type: "session",
    date: "2026-07-03T09:00:00Z",
    description: "Studio A · 12 students",
  },
  {
    id: "mock-up-2",
    title: "Task Due: Adavu Practice",
    type: "task",
    date: "2026-07-10T23:59:00Z",
    description: "Week 3 homework submission",
  },
];

export const MOCK_DASHBOARD_ALERTS: DashboardAlert[] = [
  {
    id: "mock-alert-1",
    severity: "warning",
    title: "Overdue Task Submissions",
    message: "1 student has not submitted Week 3 homework.",
    createdAt: "2026-07-02T08:00:00Z",
    href: "/staff/tasks/mock-task-1",
  },
  {
    id: "mock-alert-2",
    severity: "info",
    title: "Certificate Ready",
    message: "Certificate KY-2026-0001 is ready for download.",
    createdAt: "2026-07-01T14:00:00Z",
    href: "/staff/certificates/mock-cert-1",
  },
];

export function getMockDashboardData() {
  return {
    summary: MOCK_DASHBOARD_SUMMARY,
    metrics: MOCK_DASHBOARD_METRICS,
    upcoming: MOCK_DASHBOARD_UPCOMING,
    alerts: MOCK_DASHBOARD_ALERTS,
  };
}
