import { apiClient } from "./api-client";
import type { ApiResponse, PaginatedData } from "./types";

export type TransferStatus = "pending" | "approved" | "rejected" | "cancelled";

export interface Transfer {
  id: string;
  tenantId: string;
  enrollmentId: string;
  studentId: string;
  studentName: string;
  fromBatchId: string;
  fromBatchName: string;
  toBatchId: string;
  toBatchName: string;
  reason: string;
  status: TransferStatus;
  requestedAt: string;
  approvedAt?: string;
  rejectedAt?: string;
  rejectedReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTransferRequest {
  enrollmentId: string;
  toBatchId: string;
  reason: string;
}

export interface TransferListParams {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: TransferStatus;
  sortBy?: string;
  sortDir?: "asc" | "desc";
}

export async function getTransfers(
  params?: TransferListParams,
): Promise<ApiResponse<PaginatedData<Transfer>>> {
  const response = await apiClient.get<ApiResponse<PaginatedData<Transfer>>>(
    "/transfers",
    { params },
  );
  return response.data;
}

export async function getTransfer(
  id: string,
): Promise<ApiResponse<Transfer>> {
  const response = await apiClient.get<ApiResponse<Transfer>>(
    `/transfers/${id}`,
  );
  return response.data;
}

export async function createTransfer(
  data: CreateTransferRequest,
): Promise<ApiResponse<Transfer>> {
  const response = await apiClient.post<ApiResponse<Transfer>>(
    "/transfers",
    data,
  );
  return response.data;
}

export async function approveTransfer(
  id: string,
): Promise<ApiResponse<Transfer>> {
  const response = await apiClient.post<ApiResponse<Transfer>>(
    `/transfers/${id}/approve`,
  );
  return response.data;
}

export async function rejectTransfer(
  id: string,
  reason?: string,
): Promise<ApiResponse<Transfer>> {
  const response = await apiClient.post<ApiResponse<Transfer>>(
    `/transfers/${id}/reject`,
    { reason },
  );
  return response.data;
}

export async function cancelTransfer(
  id: string,
): Promise<ApiResponse<Transfer>> {
  const response = await apiClient.post<ApiResponse<Transfer>>(
    `/transfers/${id}/cancel`,
  );
  return response.data;
}
