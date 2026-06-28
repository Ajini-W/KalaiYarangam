import { apiClient } from "./api-client";
import type {
  AttendanceListParams,
  AttendanceSession,
  AttendanceSummary,
  AttendanceSummaryParams,
  BulkMarkAttendancePayload,
  CreateAttendancePayload,
  PaginatedMeta,
  PaginatedResult,
  UpdateAttendancePayload,
} from "@/types/attendance";

interface ApiEnvelope<T> {
  httpStatusCode: number;
  message: string;
  data: T;
  timestamp: string;
}

function unwrap<T>(response: { data: ApiEnvelope<T> }): T {
  return response.data.data;
}

function unwrapPaginated<T>(
  response: { data: ApiEnvelope<PaginatedResult<T>> },
): { data: T[]; meta: PaginatedMeta } {
  const payload = response.data.data;
  return { data: payload.data ?? [], meta: payload.meta };
}

export const attendanceService = {
  async list(params: AttendanceListParams = {}) {
    const response = await apiClient.get<ApiEnvelope<PaginatedResult<AttendanceSession>>>(
      "/attendance",
      { params },
    );
    return unwrapPaginated<AttendanceSession>(response);
  },

  async getById(id: string) {
    const response = await apiClient.get<ApiEnvelope<AttendanceSession>>(`/attendance/${id}`);
    return unwrap(response);
  },

  async create(payload: CreateAttendancePayload) {
    const response = await apiClient.post<ApiEnvelope<AttendanceSession>>("/attendance", payload);
    return unwrap(response);
  },

  async update(id: string, payload: UpdateAttendancePayload) {
    const response = await apiClient.patch<ApiEnvelope<AttendanceSession>>(
      `/attendance/${id}`,
      payload,
    );
    return unwrap(response);
  },

  async bulkMark(payload: BulkMarkAttendancePayload) {
    const response = await apiClient.post<ApiEnvelope<AttendanceSession>>(
      "/attendance/bulk",
      payload,
    );
    return unwrap(response);
  },

  async getSummary(params: AttendanceSummaryParams = {}) {
    const response = await apiClient.get<ApiEnvelope<AttendanceSummary>>("/attendance/summary", {
      params,
    });
    return unwrap(response);
  },

  async lockSession(scheduleId: string) {
    const response = await apiClient.post<ApiEnvelope<AttendanceSession>>(
      `/attendance/session/${scheduleId}/lock`,
    );
    return unwrap(response);
  },

  async unlockSession(scheduleId: string) {
    const response = await apiClient.post<ApiEnvelope<AttendanceSession>>(
      `/attendance/session/${scheduleId}/unlock`,
    );
    return unwrap(response);
  },
};
