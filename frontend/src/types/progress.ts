import type { PaginatedMeta, PaginatedResult } from "@/types/attendance";

export interface ProgressRecord {
  id: string;
  tenantId: string;
  studentId: string;
  batchId?: string | null;
  module?: string | null;
  percentage: number;
  grade?: string | null;
  remarks?: string | null;
  trainerId?: string | null;
  assessedAt: string;
  createdAt: string;
  updatedAt: string;
  student?: {
    id: string;
    name: string;
    phone?: string | null;
    email?: string | null;
  };
  batch?: {
    id: string;
    name: string;
  } | null;
}

export interface ProgressSummary {
  totalRecords: number;
  averagePercentage: number;
  minPercentage: number;
  maxPercentage: number;
}

export interface ProgressListParams {
  page?: number;
  pageSize?: number;
  studentId?: string;
  batchId?: string;
}

export interface ProgressSummaryParams {
  studentId?: string;
  batchId?: string;
}

export interface CreateProgressPayload {
  studentId: string;
  batchId?: string;
  module?: string;
  percentage: number;
  grade?: string;
  remarks?: string;
}

export interface UpdateProgressPayload {
  module?: string;
  percentage?: number;
  grade?: string;
  remarks?: string;
}

export interface RecalculateProgressPayload {
  studentId?: string;
  batchId?: string;
}

export type { PaginatedMeta, PaginatedResult };
