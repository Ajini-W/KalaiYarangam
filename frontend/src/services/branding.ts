import { apiClient } from "./api-client";
import type { ApiResponse } from "./types";

export interface Branding {
  logoUrl: string | null;
  faviconUrl: string | null;
  primaryColor: string | null;
  secondaryColor: string | null;
  tagline: string | null;
  customDomain: string | null;
}

export interface UpdateBrandingRequest {
  logoUrl?: string;
  faviconUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
  tagline?: string;
  customDomain?: string;
}

export async function getBranding(): Promise<ApiResponse<Branding>> {
  const response = await apiClient.get<ApiResponse<Branding>>(
    "/training/branding",
  );
  return response.data;
}

export async function updateBranding(
  data: UpdateBrandingRequest,
): Promise<ApiResponse<Branding>> {
  const response = await apiClient.patch<ApiResponse<Branding>>(
    "/training/branding",
    data,
  );
  return response.data;
}
