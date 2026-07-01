import { apiClient } from "./api-client";
import type { ApiResponse } from "./types";

export type LeadStatus = "NEW" | "CONTACTED" | "FOLLOWUP" | "INTERESTED" | "DEMO_SCHEDULED" | "CONVERTED" | "LOST";
export type LeadSource = "WALK_IN" | "PHONE" | "WEBSITE" | "SOCIAL_MEDIA" | "REFERRAL" | "ADVERTISEMENT" | "OTHER";

export interface Lead {
  id: string;
  tenantId: string;
  branchId: string | null;
  name: string;
  email: string | null;
  phone: string;
  course: string | null;
  source: LeadSource;
  status: LeadStatus;
  notes: string | null;
  assignedTo: string | null;
  convertedAt: string | null;
  convertedToStudentId: string | null;
  nextFollowUp: string | null;
  createdAt: string;
  updatedAt: string;
  branch?: { id: string; name: string } | null;
  _count?: { followups: number };
}

export interface LeadFollowup {
  id: string;
  leadId: string;
  userId: string | null;
  notes: string;
  outcome: string | null;
  nextDate: string | null;
  contactedVia: string | null;
  createdAt: string;
  user?: { id: string; name: string } | null;
}

export interface LeadStats {
  total: number;
  new: number;
  contacted: number;
  converted: number;
  lost: number;
  todayFollowups: number;
  pendingFollowups: number;
  conversionRate: number;
}

export interface LeadQuery {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
  source?: string;
  branchId?: string;
  assignedTo?: string;
  sortBy?: string;
  sortDir?: "asc" | "desc";
}

export interface PaginatedMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginatedMeta;
}

/* ─── Leads ─────────────────────────────────────────────── */

export async function getLeads(query?: LeadQuery): Promise<ApiResponse<PaginatedResponse<Lead>>> {
  const { data } = await apiClient.get<ApiResponse<PaginatedResponse<Lead>>>("/leads", { params: query });
  return data;
}

export async function getLead(id: string): Promise<ApiResponse<Lead>> {
  const { data } = await apiClient.get<ApiResponse<Lead>>(`/leads/${id}`);
  return data;
}

export async function createLead(payload: Partial<Lead> & { name: string; phone: string }): Promise<ApiResponse<Lead>> {
  const { data } = await apiClient.post<ApiResponse<Lead>>("/leads", payload);
  return data;
}

export async function updateLead(id: string, payload: Partial<Lead>): Promise<ApiResponse<Lead>> {
  const { data } = await apiClient.patch<ApiResponse<Lead>>(`/leads/${id}`, payload);
  return data;
}

export async function deleteLead(id: string): Promise<ApiResponse<null>> {
  const { data } = await apiClient.delete<ApiResponse<null>>(`/leads/${id}`);
  return data;
}

export async function getLeadStats(): Promise<ApiResponse<LeadStats>> {
  const { data } = await apiClient.get<ApiResponse<LeadStats>>("/leads/stats");
  return data;
}

export async function assignLead(id: string, assignedTo: string): Promise<ApiResponse<Lead>> {
  const { data } = await apiClient.post<ApiResponse<Lead>>(`/leads/${id}/assign`, { assignedTo });
  return data;
}

export async function bulkAssignLeads(leadIds: string[], assignedTo: string): Promise<ApiResponse<null>> {
  const { data } = await apiClient.post<ApiResponse<null>>("/leads/bulk-assign", { leadIds, assignedTo });
  return data;
}

export async function archiveLead(id: string): Promise<ApiResponse<Lead>> {
  const { data } = await apiClient.post<ApiResponse<Lead>>(`/leads/${id}/archive`);
  return data;
}

export async function restoreLead(id: string): Promise<ApiResponse<Lead>> {
  const { data } = await apiClient.post<ApiResponse<Lead>>(`/leads/${id}/restore`);
  return data;
}

export async function convertLead(id: string, payload: { studentName: string; studentPhone?: string; studentEmail?: string; batchId?: string }): Promise<ApiResponse<{ lead: Lead; student: unknown }>> {
  const { data } = await apiClient.post<ApiResponse<{ lead: Lead; student: unknown }>>(`/leads/${id}/convert`, payload);
  return data;
}

/* ─── Followups ─────────────────────────────────────────── */

export async function createFollowup(leadId: string, payload: { notes: string; outcome?: string; nextDate?: string; contactedVia?: string }): Promise<ApiResponse<LeadFollowup>> {
  const { data } = await apiClient.post<ApiResponse<LeadFollowup>>(`/leads/${leadId}/followups`, payload);
  return data;
}

export async function getFollowups(leadId: string): Promise<ApiResponse<LeadFollowup[]>> {
  const { data } = await apiClient.get<ApiResponse<LeadFollowup[]>>(`/leads/${leadId}/followups`);
  return data;
}

export async function updateFollowup(id: string, payload: Partial<LeadFollowup>): Promise<ApiResponse<LeadFollowup>> {
  const { data } = await apiClient.patch<ApiResponse<LeadFollowup>>(`/leads/followups/${id}`, payload);
  return data;
}

export async function deleteFollowup(id: string): Promise<ApiResponse<null>> {
  const { data } = await apiClient.delete<ApiResponse<null>>(`/leads/followups/${id}`);
  return data;
}

/* ─── Students (for lead conversion) ────────────────────── */

export async function getConversionStudents(query?: { search?: string; page?: number; pageSize?: number }): Promise<ApiResponse<PaginatedResponse<{ id: string; name: string; phone: string; email: string | null }>>> {
  const { data } = await apiClient.get<ApiResponse<PaginatedResponse<{ id: string; name: string; phone: string; email: string | null }>>>("/leads/students", { params: query });
  return data;
}
