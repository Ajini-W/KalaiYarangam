import { apiClient } from "./api-client";
import type { ApiResponse } from "./types";

export interface DashboardSummary {
  totalStudents: number;
  activeBranches: number;
  revenueMTD: number;
  pendingPayments: number;
  activeBatches: number;
  totalEnrollments: number;
}

export interface DashboardMetrics {
  newStudentsThisMonth: number;
  totalLeads: number;
  newLeadsThisMonth: number;
  convertedLeads: number;
  conversionRate: number;
  attendanceRate: number;
  totalAttendanceRecords: number;
  avgBatchUtilization: number;
}

export interface UpcomingSession {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  topic: string | null;
  status: string;
  batch: { id: string; name: string } | null;
  attendanceSession: { id: string } | null;
}

export interface UpcomingTask {
  id: string;
  title: string;
  type: string;
  status: string;
  dueDate: string | null;
  batch: { id: string; name: string } | null;
}

export interface UpcomingFollowup {
  id: string;
  name: string;
  phone: string;
  course: string | null;
  status: string;
  nextFollowUp: string | null;
}

export interface DashboardUpcoming {
  sessions: UpcomingSession[];
  tasks: UpcomingTask[];
  followups: UpcomingFollowup[];
}

export interface OverdueInvoice {
  id: string;
  invoiceNumber: string;
  totalAmount: number;
  paidAmount: number;
  dueDate: string;
  student: { id: string; name: string; phone: string } | null;
  status: string;
}

export interface OverdueTask {
  id: string;
  title: string;
  type: string;
  status: string;
  dueDate: string | null;
  batch: { id: string; name: string } | null;
}

export interface PendingFollowup {
  id: string;
  name: string;
  phone: string;
  course: string | null;
  status: string;
  nextFollowUp: string | null;
  createdAt: string;
}

export interface DashboardAlerts {
  overdueInvoices: OverdueInvoice[];
  pendingFollowups: PendingFollowup[];
  overdueTasks: OverdueTask[];
}

export async function getDashboardSummary(): Promise<ApiResponse<DashboardSummary>> {
  const response = await apiClient.get<ApiResponse<DashboardSummary>>("/dashboard/summary");
  return response.data;
}

export async function getDashboardMetrics(): Promise<ApiResponse<DashboardMetrics>> {
  const response = await apiClient.get<ApiResponse<DashboardMetrics>>("/dashboard/metrics");
  return response.data;
}

export async function getDashboardUpcoming(): Promise<ApiResponse<DashboardUpcoming>> {
  const response = await apiClient.get<ApiResponse<DashboardUpcoming>>("/dashboard/upcoming");
  return response.data;
}

export async function getDashboardAlerts(): Promise<ApiResponse<DashboardAlerts>> {
  const response = await apiClient.get<ApiResponse<DashboardAlerts>>("/dashboard/alerts");
  return response.data;
}
