import { apiClient } from "./api-client";
import type { ApiResponse, PaginatedData } from "./types";

export interface Batch {
  id: string;
  name: string;
  courseName?: string;
}

export async function getBatches(
  search?: string,
): Promise<ApiResponse<PaginatedData<Batch>>> {
  const response = await apiClient.get<ApiResponse<PaginatedData<Batch>>>(
    "/batches",
    { params: { search, pageSize: 100 } },
  );
  return response.data;
}
