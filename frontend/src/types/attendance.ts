export type AttendanceStatus = "PRESENT" | "ABSENT" | "LATE" | "EXCUSED";

export interface AttendanceStudent {
  id: string;
  name: string;
  phone?: string | null;
  email?: string | null;
}

export interface AttendanceRecord {
  id?: string;
  studentId: string;
  status: AttendanceStatus;
  remarks?: string | null;
  checkInTime?: string | null;
  student?: AttendanceStudent;
}

export interface AttendanceSession {
  id: string;
  batchId: string;
  classSessionId?: string | null;
  scheduleId?: string | null;
  date: string;
  markedBy?: string;
  isLocked?: boolean;
  lockedAt?: string | null;
  lockedBy?: string | null;
  createdAt?: string;
  updatedAt?: string;
  records?: AttendanceRecord[];
  _count?: { records: number };
  batch?: { id: string; name: string };
}

export interface AttendanceSummary {
  totalSessions: number;
  totalRecords: number;
  present: number;
  absent: number;
  late: number;
  excused: number;
}

export interface AttendanceListParams {
  page?: number;
  pageSize?: number;
  batchId?: string;
  classSessionId?: string;
  scheduleId?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface AttendanceSummaryParams {
  studentId?: string;
  batchId?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface CreateAttendancePayload {
  batchId: string;
  classSessionId?: string;
  date: string;
  records: Array<{
    studentId: string;
    status: AttendanceStatus;
    remarks?: string;
    checkInTime?: string;
  }>;
}

export interface UpdateAttendancePayload {
  records: Array<{
    studentId: string;
    status: AttendanceStatus;
    remarks?: string;
    checkInTime?: string;
  }>;
}

export interface BulkMarkAttendancePayload {
  batchId: string;
  classSessionId?: string;
  date: string;
  defaultStatus: AttendanceStatus;
  exceptions?: Array<{
    studentId: string;
    status: AttendanceStatus;
    remarks?: string;
  }>;
}

export interface PaginatedMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResult<T> {
  data: T[];
  meta: PaginatedMeta;
}
