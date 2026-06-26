import { apiClient } from "./api-client";
import type { ApiResponse } from "./types";

export interface Branch {
  id: string;
  tenantId: string;
  name: string;
  code: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  email: string;
  isDefault: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBranchRequest {
  name: string;
  code: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  email: string;
}

export interface UpdateBranchRequest {
  name?: string;
  phone?: string;
  city?: string;
  address?: string;
  state?: string;
  pincode?: string;
  email?: string;
  code?: string;
}

export interface UpdateBranchStatusRequest {
  isActive: boolean;
}

export async function getBranches(): Promise<ApiResponse<Branch[]>> {
  const response = await apiClient.get<ApiResponse<Branch[]>>(
    "/training/branches",
  );
  return response.data;
}

export async function createBranch(
  data: CreateBranchRequest,
): Promise<ApiResponse<Branch>> {
  const response = await apiClient.post<ApiResponse<Branch>>(
    "/training/branches",
    data,
  );
  return response.data;
}

export async function getBranch(
  id: string,
): Promise<ApiResponse<Branch>> {
  const response = await apiClient.get<ApiResponse<Branch>>(
    `/training/branches/${id}`,
  );
  return response.data;
}

export async function updateBranch(
  id: string,
  data: UpdateBranchRequest,
): Promise<ApiResponse<Branch>> {
  const response = await apiClient.patch<ApiResponse<Branch>>(
    `/training/branches/${id}`,
    data,
  );
  return response.data;
}

export async function updateBranchStatus(
  id: string,
  data: UpdateBranchStatusRequest,
): Promise<ApiResponse<Branch>> {
  const response = await apiClient.patch<ApiResponse<Branch>>(
    `/training/branches/${id}/status`,
    data,
  );
  return response.data;
}
