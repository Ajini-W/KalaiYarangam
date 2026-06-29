import { apiClient } from "./api-client";
import type {
  CreateTaskPayload,
  PaginatedMeta,
  PaginatedResult,
  SubmitTaskPayload,
  Task,
  TaskListParams,
  TaskSubmission,
  UpdateSubmissionPayload,
  UpdateTaskPayload,
} from "@/types/tasks";

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

export const tasksService = {
  async list(params: TaskListParams = {}) {
    const response = await apiClient.get<ApiEnvelope<PaginatedResult<Task>>>(
      "/class/tasks",
      { params },
    );
    return unwrapPaginated<Task>(response);
  },

  async getById(id: string) {
    const response = await apiClient.get<ApiEnvelope<Task>>(`/class/tasks/${id}`);
    return unwrap(response);
  },

  async create(payload: CreateTaskPayload) {
    const response = await apiClient.post<ApiEnvelope<Task>>("/class/tasks", payload);
    return unwrap(response);
  },

  async update(id: string, payload: UpdateTaskPayload) {
    const response = await apiClient.patch<ApiEnvelope<Task>>(`/class/tasks/${id}`, payload);
    return unwrap(response);
  },

  async archive(id: string) {
    const response = await apiClient.post<ApiEnvelope<Task>>(`/class/tasks/${id}/archive`);
    return unwrap(response);
  },

  async restore(id: string) {
    const response = await apiClient.post<ApiEnvelope<Task>>(`/class/tasks/${id}/restore`);
    return unwrap(response);
  },

  async publish(id: string) {
    const response = await apiClient.post<ApiEnvelope<Task>>(`/class/tasks/${id}/publish`);
    return unwrap(response);
  },

  async close(id: string) {
    const response = await apiClient.post<ApiEnvelope<Task>>(`/class/tasks/${id}/close`);
    return unwrap(response);
  },

  async getSubmissions(id: string) {
    const response = await apiClient.get<ApiEnvelope<TaskSubmission[]>>(
      `/class/tasks/${id}/submissions`,
    );
    return unwrap(response);
  },

  async submit(id: string, payload: SubmitTaskPayload) {
    const response = await apiClient.post<ApiEnvelope<TaskSubmission>>(
      `/class/tasks/${id}/submissions`,
      payload,
    );
    return unwrap(response);
  },

  async updateSubmission(
    taskId: string,
    submissionId: string,
    payload: UpdateSubmissionPayload,
  ) {
    const response = await apiClient.patch<ApiEnvelope<TaskSubmission>>(
      `/class/tasks/${taskId}/submissions/${submissionId}`,
      payload,
    );
    return unwrap(response);
  },
};
