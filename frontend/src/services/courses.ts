import { apiClient } from "./api-client";
import type { ApiResponse, PaginatedData } from "./types";

export interface Course {
  id: string;
  name: string;
}

export async function getCourses(
  search?: string,
): Promise<ApiResponse<PaginatedData<Course>>> {
  const response = await apiClient.get<ApiResponse<PaginatedData<Course>>>(
    "/courses",
    { params: { search, pageSize: 100 } },
  );
  return response.data;
}
