import { apiClient } from "./api-client";
import type { ApiResponse, PaginatedData } from "./types";

export type RenewalStatus = "pending" | "approved" | "rejected" | "cancelled";

export interface Renewal {
  id: string;
  tenantId: string;
  enrollmentId: string;
  studentId: string;
  studentName: string;
  batchId: string;
  batchName: string;
  courseId: string;
  courseName: string;
  previousEndDate: string;
  newEndDate: string;
  fee: number;
  status: RenewalStatus;
  requestedAt: string;
  approvedAt?: string;
  rejectedAt?: string;
  rejectedReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRenewalRequest {
  enrollmentId: string;
  newEndDate: string;
  fee: number;
}

export interface RenewalListParams {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: RenewalStatus;
  sortBy?: string;
  sortDir?: "asc" | "desc";
}

export async function getRenewals(
  params?: RenewalListParams,
): Promise<ApiResponse<PaginatedData<Renewal>>> {
  const response = await apiClient.get<ApiResponse<PaginatedData<Renewal>>>(
    "/renewals",
    { params },
  );
  return response.data;
}

export async function getRenewal(
  id: string,
): Promise<ApiResponse<Renewal>> {
  const response = await apiClient.get<ApiResponse<Renewal>>(
    `/renewals/${id}`,
  );
  return response.data;
}

export async function createRenewal(
  data: CreateRenewalRequest,
): Promise<ApiResponse<Renewal>> {
  const response = await apiClient.post<ApiResponse<Renewal>>(
    "/renewals",
    data,
  );
  return response.data;
}

export async function approveRenewal(
  id: string,
): Promise<ApiResponse<Renewal>> {
  const response = await apiClient.post<ApiResponse<Renewal>>(
    `/renewals/${id}/approve`,
  );
  return response.data;
}

export async function rejectRenewal(
  id: string,
  reason?: string,
): Promise<ApiResponse<Renewal>> {
  const response = await apiClient.post<ApiResponse<Renewal>>(
    `/renewals/${id}/reject`,
    { reason },
  );
  return response.data;
}

export async function cancelRenewal(
  id: string,
): Promise<ApiResponse<Renewal>> {
  const response = await apiClient.post<ApiResponse<Renewal>>(
    `/renewals/${id}/cancel`,
  );
  return response.data;
}
