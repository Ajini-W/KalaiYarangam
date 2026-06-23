import { apiClient } from "./api-client";
import type { ApiResponse } from "./types";

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  industry: string;
  status: string;
  logoUrl: string | null;
  website: string | null;
  phone: string | null;
  email: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTenantRequest {
  name: string;
  email: string;
  phone: string;
  businessName: string;
  industry: string;
  password: string;
}

export interface CreateTenantResponse {
  user: {
    id: string;
    tenantId: string;
    branchId: string | null;
    email: string;
    name: string;
    role: string;
  };
  accessToken: string;
}

export interface UpdateTenantRequest {
  name?: string;
  phone?: string;
  email?: string;
  website?: string;
  logoUrl?: string;
  industry?: string;
}

export async function createTenant(
  data: CreateTenantRequest,
): Promise<ApiResponse<CreateTenantResponse>> {
  const response = await apiClient.post<ApiResponse<CreateTenantResponse>>(
    "/auth/register",
    data,
  );
  return response.data;
}

export async function getTenant(): Promise<ApiResponse<Tenant>> {
  const response = await apiClient.get<ApiResponse<Tenant>>(
    "/training/tenant",
  );
  return response.data;
}

export async function updateTenant(
  data: UpdateTenantRequest,
): Promise<ApiResponse<Tenant>> {
  const response = await apiClient.patch<ApiResponse<Tenant>>(
    "/training/tenant",
    data,
  );
  return response.data;
}
