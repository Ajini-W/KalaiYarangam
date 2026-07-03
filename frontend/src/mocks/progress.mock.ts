import type { PaginatedMeta } from "@/types/attendance";
import type { ProgressRecord, ProgressSummary } from "@/types/progress";

export const MOCK_PROGRESS_META: PaginatedMeta = {
  page: 1,
  pageSize: 10,
  total: 2,
  totalPages: 1,
};

export const MOCK_PROGRESS_RECORDS: ProgressRecord[] = [
  {
    id: "mock-prog-1",
    tenantId: "mock-tenant-1",
    studentId: "mock-stu-1",
    batchId: "mock-batch-1",
    module: "Adavus — Set 1",
    percentage: 78,
    grade: "B+",
    remarks: "Strong footwork; needs posture refinement.",
    assessedAt: "2026-07-01T00:00:00Z",
    createdAt: "2026-07-01T00:00:00Z",
    updatedAt: "2026-07-01T00:00:00Z",
    student: { id: "mock-stu-1", name: "Priya Sharma", email: "priya@example.com" },
    batch: { id: "mock-batch-1", name: "Bharatanatyam Beginners — Morning" },
  },
  {
    id: "mock-prog-2",
    tenantId: "mock-tenant-1",
    studentId: "mock-stu-3",
    batchId: "mock-batch-2",
    module: "Vocal — Swara Practice",
    percentage: 92,
    grade: "A",
    remarks: "Excellent pitch accuracy and breath control.",
    assessedAt: "2026-07-02T00:00:00Z",
    createdAt: "2026-07-02T00:00:00Z",
    updatedAt: "2026-07-02T00:00:00Z",
    student: { id: "mock-stu-3", name: "Meera Krishnan", email: "meera@example.com" },
    batch: { id: "mock-batch-2", name: "Carnatic Vocal — Intermediate" },
  },
];

export const MOCK_PROGRESS_SUMMARY: ProgressSummary = {
  totalRecords: 2,
  averagePercentage: 85,
  minPercentage: 78,
  maxPercentage: 92,
};

export function getMockProgressRecord(id: string): ProgressRecord | null {
  return MOCK_PROGRESS_RECORDS.find((r) => r.id === id) ?? null;
}

export function getMockProgressList() {
  return { data: MOCK_PROGRESS_RECORDS, meta: MOCK_PROGRESS_META };
}
