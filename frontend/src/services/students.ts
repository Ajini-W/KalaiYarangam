import { apiClient } from "./api-client";
import type { ApiResponse, PaginatedData } from "./types";

export interface Student {
  id: string;
  name: string;
  email: string;
  phone?: string;
}

export async function getStudents(
  search?: string,
): Promise<ApiResponse<PaginatedData<Student>>> {
  const response = await apiClient.get<ApiResponse<PaginatedData<Student>>>(
    "/students",
    { params: { search, pageSize: 100 } },
  );
  return response.data;
}
