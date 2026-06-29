export interface DashboardMetric {
  key: string;
  label: string;
  value: number | string;
  delta?: number;
  deltaType?: "increase" | "decrease" | "neutral";
  unit?: string;
}

export interface DashboardUpcomingItem {
  id: string;
  title: string;
  type: string;
  date: string;
  description?: string;
}

export interface DashboardAlert {
  id: string;
  severity: "info" | "warning" | "danger";
  title: string;
  message: string;
  createdAt: string;
  href?: string;
}

export interface DashboardActivity {
  id: string;
  action: string;
  entity: string;
  actor?: string;
  timestamp: string;
}

export interface DashboardSummary {
  headline: string;
  subheadline?: string;
  metrics: DashboardMetric[];
  quickStats?: Record<string, number | string>;
}

export interface DashboardMetricsResponse {
  metrics: DashboardMetric[];
}

export interface DashboardUpcomingResponse {
  items: DashboardUpcomingItem[];
}

export interface DashboardAlertsResponse {
  alerts: DashboardAlert[];
}
