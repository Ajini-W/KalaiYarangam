import { z } from "zod";

export const attendanceStatusSchema = z.enum(["PRESENT", "ABSENT", "LATE", "EXCUSED"]);

export const attendanceRecordSchema = z.object({
  studentId: z.string().uuid("Invalid student"),
  status: attendanceStatusSchema,
  remarks: z.string().max(255, "Remarks too long").optional(),
  checkInTime: z.string().optional(),
});

export const markAttendanceSchema = z.object({
  batchId: z.string().uuid("Select a batch"),
  classSessionId: z.string().uuid().optional().or(z.literal("")),
  date: z.string().min(1, "Date is required"),
  records: z.array(attendanceRecordSchema).min(1, "Add at least one student record"),
});

export const bulkMarkSchema = z.object({
  batchId: z.string().uuid("Select a batch"),
  classSessionId: z.string().uuid().optional().or(z.literal("")),
  date: z.string().min(1, "Date is required"),
  defaultStatus: attendanceStatusSchema,
  exceptions: z.array(attendanceRecordSchema).optional(),
});

export const attendanceFiltersSchema = z.object({
  batchId: z.string().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
});

export type MarkAttendanceFormValues = z.infer<typeof markAttendanceSchema>;
export type BulkMarkFormValues = z.infer<typeof bulkMarkSchema>;
export type AttendanceFiltersFormValues = z.infer<typeof attendanceFiltersSchema>;
