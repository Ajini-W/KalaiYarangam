import type {
  AttendanceSession,
  AttendanceSummary,
  PaginatedMeta,
} from "@/types/attendance";

export const MOCK_ATTENDANCE_META: PaginatedMeta = {
  page: 1,
  pageSize: 10,
  total: 2,
  totalPages: 1,
};

export const MOCK_ATTENDANCE_SESSIONS: AttendanceSession[] = [
  {
    id: "mock-att-1",
    batchId: "mock-batch-1",
    scheduleId: "mock-sched-1",
    date: "2026-07-01",
    isLocked: false,
    createdAt: "2026-07-01T09:00:00Z",
    updatedAt: "2026-07-01T09:30:00Z",
    batch: { id: "mock-batch-1", name: "Bharatanatyam Beginners — Morning" },
    records: [
      {
        id: "rec-1",
        studentId: "mock-stu-1",
        status: "PRESENT",
        student: { id: "mock-stu-1", name: "Priya Sharma", email: "priya@example.com" },
      },
      {
        id: "rec-2",
        studentId: "mock-stu-2",
        status: "LATE",
        student: { id: "mock-stu-2", name: "Arjun Menon", email: "arjun@example.com" },
      },
    ],
    _count: { records: 2 },
  },
  {
    id: "mock-att-2",
    batchId: "mock-batch-2",
    scheduleId: "mock-sched-2",
    date: "2026-07-02",
    isLocked: true,
    lockedAt: "2026-07-02T11:00:00Z",
    createdAt: "2026-07-02T10:00:00Z",
    updatedAt: "2026-07-02T11:00:00Z",
    batch: { id: "mock-batch-2", name: "Carnatic Vocal — Intermediate" },
    records: [
      {
        id: "rec-3",
        studentId: "mock-stu-3",
        status: "PRESENT",
        student: { id: "mock-stu-3", name: "Meera Krishnan", email: "meera@example.com" },
      },
      {
        id: "rec-4",
        studentId: "mock-stu-4",
        status: "ABSENT",
        student: { id: "mock-stu-4", name: "Vikram Iyer", email: "vikram@example.com" },
      },
    ],
    _count: { records: 2 },
  },
];

export const MOCK_ATTENDANCE_SUMMARY: AttendanceSummary = {
  totalSessions: 2,
  totalRecords: 4,
  present: 2,
  absent: 1,
  late: 1,
  excused: 0,
};

export function getMockAttendanceSession(id: string): AttendanceSession | null {
  return MOCK_ATTENDANCE_SESSIONS.find((s) => s.id === id) ?? null;
}

export function getMockAttendanceList() {
  return { data: MOCK_ATTENDANCE_SESSIONS, meta: MOCK_ATTENDANCE_META };
}
