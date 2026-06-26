import { apiClient } from "./api-client";
import type { ApiResponse } from "./types";

export interface ModuleFlags {
  trainingManagement: boolean;
  rentalManagement: boolean;
  eventManagement: boolean;
}

export type UpdateModulesRequest = Partial<ModuleFlags>;

export async function getModules(): Promise<ApiResponse<ModuleFlags>> {
  const response = await apiClient.get<ApiResponse<ModuleFlags>>(
    "/training/modules",
  );
  return response.data;
}

export async function updateModules(
  data: UpdateModulesRequest,
): Promise<ApiResponse<ModuleFlags>> {
  const response = await apiClient.patch<ApiResponse<ModuleFlags>>(
    "/training/modules",
    data,
  );
  return response.data;
}
