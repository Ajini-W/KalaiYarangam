import type { PaginatedMeta } from "@/types/attendance";
import type { Task, TaskSubmission } from "@/types/tasks";

export const MOCK_TASKS_META: PaginatedMeta = {
  page: 1,
  pageSize: 10,
  total: 2,
  totalPages: 1,
};

export const MOCK_TASKS: Task[] = [
  {
    id: "mock-task-1",
    tenantId: "mock-tenant-1",
    batchId: "mock-batch-1",
    createdBy: "mock-user-1",
    title: "Week 3 — Adavu Practice Recording",
    description: "Record and submit your Week 3 adavu practice session.",
    type: "HOMEWORK",
    status: "ACTIVE",
    dueDate: "2026-07-10",
    maxScore: 100,
    allowLateSubmission: true,
    isArchived: false,
    createdAt: "2026-07-01T08:00:00Z",
    updatedAt: "2026-07-01T08:00:00Z",
    _count: { submissions: 3 },
  },
  {
    id: "mock-task-2",
    tenantId: "mock-tenant-1",
    batchId: "mock-batch-2",
    createdBy: "mock-user-1",
    title: "Theory Quiz — Taala Basics",
    description: "Complete the taala fundamentals quiz before Friday's class.",
    type: "QUIZ",
    status: "ACTIVE",
    dueDate: "2026-07-08",
    maxScore: 50,
    allowLateSubmission: false,
    isArchived: false,
    createdAt: "2026-07-02T10:00:00Z",
    updatedAt: "2026-07-02T10:00:00Z",
    _count: { submissions: 1 },
  },
];

export const MOCK_TASK_SUBMISSIONS: TaskSubmission[] = [
  {
    id: "mock-sub-1",
    taskId: "mock-task-1",
    studentId: "mock-stu-1",
    content: "Submitted practice video link.",
    submittedAt: "2026-07-05T14:00:00Z",
    status: "SUBMITTED",
    createdAt: "2026-07-05T14:00:00Z",
    updatedAt: "2026-07-05T14:00:00Z",
    student: { id: "mock-stu-1", name: "Priya Sharma", email: "priya@example.com" },
  },
  {
    id: "mock-sub-2",
    taskId: "mock-task-1",
    studentId: "mock-stu-2",
    content: "Late submission with notes.",
    submittedAt: "2026-07-06T09:00:00Z",
    status: "LATE",
    score: 85,
    feedback: "Good effort, work on timing.",
    gradedAt: "2026-07-06T16:00:00Z",
    createdAt: "2026-07-06T09:00:00Z",
    updatedAt: "2026-07-06T16:00:00Z",
    student: { id: "mock-stu-2", name: "Arjun Menon", email: "arjun@example.com" },
  },
];

export function getMockTask(id: string): Task | null {
  return MOCK_TASKS.find((t) => t.id === id) ?? null;
}

export function getMockTaskList() {
  return { data: MOCK_TASKS, meta: MOCK_TASKS_META };
}

export function getMockTaskSubmissions(taskId: string): TaskSubmission[] {
  return MOCK_TASK_SUBMISSIONS.filter((s) => s.taskId === taskId);
}
