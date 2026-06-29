import { apiClient } from "./api-client";
import type { ApiResponse, PaginatedData } from "./types";

export type EnrollmentStatus = "active" | "paused" | "cancelled" | "completed";

export interface Enrollment {
  id: string;
  tenantId: string;
  branchId: string;
  studentId: string;
  studentName: string;
  batchId: string;
  batchName: string;
  courseId: string;
  courseName: string;
  status: EnrollmentStatus;
  startDate: string;
  endDate: string;
  fee: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEnrollmentRequest {
  studentId: string;
  batchId: string;
  courseId: string;
  startDate: string;
  endDate: string;
  fee: number;
}

export interface UpdateEnrollmentRequest {
  batchId?: string;
  courseId?: string;
  startDate?: string;
  endDate?: string;
  fee?: number;
}

export interface EnrollmentListParams {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: EnrollmentStatus;
  batchId?: string;
  courseId?: string;
  sortBy?: string;
  sortDir?: "asc" | "desc";
}

export async function getEnrollments(
  params?: EnrollmentListParams,
): Promise<ApiResponse<PaginatedData<Enrollment>>> {
  const response = await apiClient.get<ApiResponse<PaginatedData<Enrollment>>>(
    "/enrollments",
    { params },
  );
  return response.data;
}

export async function getEnrollment(
  id: string,
): Promise<ApiResponse<Enrollment>> {
  const response = await apiClient.get<ApiResponse<Enrollment>>(
    `/enrollments/${id}`,
  );
  return response.data;
}

export async function createEnrollment(
  data: CreateEnrollmentRequest,
): Promise<ApiResponse<Enrollment>> {
  const response = await apiClient.post<ApiResponse<Enrollment>>(
    "/enrollments",
    data,
  );
  return response.data;
}

export async function updateEnrollment(
  id: string,
  data: UpdateEnrollmentRequest,
): Promise<ApiResponse<Enrollment>> {
  const response = await apiClient.patch<ApiResponse<Enrollment>>(
    `/enrollments/${id}`,
    data,
  );
  return response.data;
}

export async function pauseEnrollment(
  id: string,
): Promise<ApiResponse<Enrollment>> {
  const response = await apiClient.post<ApiResponse<Enrollment>>(
    `/enrollments/${id}/pause`,
  );
  return response.data;
}

export async function resumeEnrollment(
  id: string,
): Promise<ApiResponse<Enrollment>> {
  const response = await apiClient.post<ApiResponse<Enrollment>>(
    `/enrollments/${id}/resume`,
  );
  return response.data;
}

export async function reactivateEnrollment(
  id: string,
): Promise<ApiResponse<Enrollment>> {
  const response = await apiClient.post<ApiResponse<Enrollment>>(
    `/enrollments/${id}/reactivate`,
  );
  return response.data;
}

export async function cancelEnrollment(
  id: string,
): Promise<ApiResponse<Enrollment>> {
  const response = await apiClient.post<ApiResponse<Enrollment>>(
    `/enrollments/${id}/cancel`,
  );
  return response.data;
}

export async function transferEnrollment(
  id: string,
  data: { toBatchId: string; reason: string },
): Promise<ApiResponse<Enrollment>> {
  const response = await apiClient.post<ApiResponse<Enrollment>>(
    `/enrollments/${id}/transfer`,
    data,
  );
  return response.data;
}
