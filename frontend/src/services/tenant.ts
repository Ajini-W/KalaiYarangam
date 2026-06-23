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

export interface ClaimTenantRequest {
  businessName: string;
  industry?: string;
  phone?: string;
  email?: string;
}

export interface ClaimTenantResponse {
  token: {
    accessToken: string;
    user: {
      id: string;
      tenantId: string;
      email: string;
      name: string;
      role: string;
    };
  };
  tenant: {
    id: string;
    name: string;
    slug: string;
    industry: string;
  };
  branch: {
    id: string;
    name: string;
    isDefault: boolean;
  };
}

export interface UpdateTenantRequest {
  name?: string;
  phone?: string;
  email?: string;
  website?: string;
  logoUrl?: string;
  industry?: string;
}

export async function claimTenant(
  data: ClaimTenantRequest,
): Promise<ApiResponse<ClaimTenantResponse>> {
  const response = await apiClient.post<ApiResponse<ClaimTenantResponse>>(
    "/training/onboarding/claim",
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
