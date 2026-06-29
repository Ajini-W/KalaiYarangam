import { apiClient } from "./api-client";
import type {
  CreateProgressPayload,
  PaginatedMeta,
  PaginatedResult,
  ProgressListParams,
  ProgressRecord,
  ProgressSummary,
  ProgressSummaryParams,
  RecalculateProgressPayload,
  UpdateProgressPayload,
} from "@/types/progress";

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

export const progressService = {
  async list(params: ProgressListParams = {}) {
    const response = await apiClient.get<ApiEnvelope<PaginatedResult<ProgressRecord>>>(
      "/class/progress",
      { params },
    );
    return unwrapPaginated<ProgressRecord>(response);
  },

  async getById(id: string) {
    const response = await apiClient.get<ApiEnvelope<ProgressRecord>>(`/class/progress/${id}`);
    return unwrap(response);
  },

  async create(payload: CreateProgressPayload) {
    const response = await apiClient.post<ApiEnvelope<ProgressRecord>>(
      "/class/progress",
      payload,
    );
    return unwrap(response);
  },

  async update(id: string, payload: UpdateProgressPayload) {
    const response = await apiClient.patch<ApiEnvelope<ProgressRecord>>(
      `/class/progress/${id}`,
      payload,
    );
    return unwrap(response);
  },

  async getSummary(params: ProgressSummaryParams = {}) {
    const response = await apiClient.get<ApiEnvelope<ProgressSummary>>(
      "/class/progress/summary",
      { params },
    );
    return unwrap(response);
  },

  async recalculate(payload: RecalculateProgressPayload = {}) {
    const response = await apiClient.post<ApiEnvelope<unknown[]>>(
      "/class/progress/recalculate",
      payload,
    );
    return unwrap(response);
  },
};
