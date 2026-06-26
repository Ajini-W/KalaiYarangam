import { apiClient } from "./api-client";
import type { ApiResponse } from "./types";

export interface TenantSettings {
  timezone: string;
  dateFormat: string;
  currency: string;
  language: string;
  timeFormat: string;
  weekStartDay: string;
}

export type CreateSettingsRequest = TenantSettings;

export type UpdateSettingsRequest = Partial<TenantSettings>;

export async function getSettings(): Promise<ApiResponse<TenantSettings>> {
  const response = await apiClient.get<ApiResponse<TenantSettings>>(
    "/training/settings",
  );
  return response.data;
}

export async function createSettings(
  data: CreateSettingsRequest,
): Promise<ApiResponse<TenantSettings>> {
  const response = await apiClient.post<ApiResponse<TenantSettings>>(
    "/training/settings",
    data,
  );
  return response.data;
}

export async function updateSettings(
  data: UpdateSettingsRequest,
): Promise<ApiResponse<TenantSettings>> {
  const response = await apiClient.patch<ApiResponse<TenantSettings>>(
    "/training/settings",
    data,
  );
  return response.data;
}
