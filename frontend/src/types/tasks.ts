import type { PaginatedMeta, PaginatedResult } from "@/types/attendance";

export type TaskType = "HOMEWORK" | "ASSIGNMENT" | "QUIZ" | "PROJECT" | "EXAM";

export type TaskStatus =
  | "PENDING"
  | "ACTIVE"
  | "SUBMISSION_CLOSED"
  | "GRADED"
  | "CANCELLED";

export type SubmissionStatus =
  | "NOT_SUBMITTED"
  | "SUBMITTED"
  | "LATE"
  | "GRADED"
  | "RETURNED";

export interface Task {
  id: string;
  tenantId: string;
  batchId: string;
  createdBy: string;
  title: string;
  description?: string | null;
  type: TaskType;
  status: TaskStatus;
  dueDate?: string | null;
  maxScore?: number | null;
  allowLateSubmission: boolean;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: { submissions: number };
  submissionCount?: number;
  submissionStatusCounts?: Record<string, number>;
}

export interface TaskSubmission {
  id: string;
  taskId: string;
  studentId: string;
  content?: string | null;
  fileUrl?: string | null;
  submittedAt?: string | null;
  status: SubmissionStatus;
  score?: number | null;
  feedback?: string | null;
  gradedBy?: string | null;
  gradedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  student?: {
    id: string;
    name: string;
    phone?: string | null;
    email?: string | null;
  };
}

export interface TaskListParams {
  page?: number;
  pageSize?: number;
  batchId?: string;
  status?: TaskStatus;
  type?: TaskType;
}

export interface CreateTaskPayload {
  batchId: string;
  title: string;
  description?: string;
  type: TaskType;
  dueDate?: string;
  maxScore?: number;
  allowLateSubmission?: boolean;
}

export interface UpdateTaskPayload {
  title?: string;
  description?: string;
  type?: TaskType;
  dueDate?: string;
  maxScore?: number;
  allowLateSubmission?: boolean;
}

export interface SubmitTaskPayload {
  studentId: string;
  content?: string;
  fileUrl?: string;
}

export interface UpdateSubmissionPayload {
  score?: number;
  feedback?: string;
  status?: "GRADED" | "RETURNED";
}

export type { PaginatedMeta, PaginatedResult };
