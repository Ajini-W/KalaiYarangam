import { apiClient } from "./api-client";
import type { ApiResponse } from "./types";

/* ─── Types ─────────────────────────────────────────────────────────────────── */

export interface Course {
  id: string;
  tenantId: string;
  name: string;
  description: string | null;
  duration: number | null;
  fee: number | null;
  categoryId: string | null;
  category?: CourseCategory | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CourseCategory {
  id: string;
  name: string;
  description: string | null;
}

export interface Batch {
  id: string;
  tenantId: string;
  branchId: string | null;
  courseId: string | null;
  name: string;
  code: string;
  capacity: number;
  enrolled?: number;
  startDate: string | null;
  endDate: string | null;
  status: string;
  course?: Course | null;
  trainers?: BatchTrainer[];
  isActive?: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: { enrollments?: number; trainers?: number; sessions?: number };
}

export interface BatchTrainer {
  id: string;
  batchId: string;
  trainerId: string;
  isPrimary: boolean;
  assignedAt: string;
  trainer: { id: string; name: string; email: string };
}

export interface BatchStats {
  total: number;
  active: number;
  completed: number;
  upcoming: number;
}

export interface Trainer {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  _count?: { batchTrainers: number };
}

export interface ScheduleEvent {
  id: string;
  batchId: string;
  title?: string;
  date: string;
  startTime: string;
  endTime: string;
  room?: string | null;
  topic?: string | null;
  notes?: string | null;
  status: string;
  batch?: { id: string; name: string };
}

export interface WaitlistEntry {
  id: string;
  tenantId: string;
  batchId: string;
  studentId: string | null;
  studentName: string;
  studentPhone: string;
  studentEmail: string | null;
  priority: "LOW" | "MEDIUM" | "HIGH";
  status: "WAITING" | "PROMOTED" | "WITHDRAWN" | "EXPIRED";
  notes: string | null;
  requestedAt: string;
  batch?: { id: string; name: string };
}

export interface TrainingDocument {
  id: string;
  tenantId: string;
  studentId: string;
  studentName: string;
  type: string;
  name: string;
  fileUrl: string;
  status: "PENDING" | "VERIFIED" | "REJECTED" | "ARCHIVED";
  remarks: string | null;
  verifiedBy: string | null;
  verifiedAt: string | null;
  uploadedAt: string;
  updatedAt: string;
}

export interface TrainingFile {
  id: string;
  tenantId: string;
  name: string;
  originalName: string;
  mimeType: string;
  size: number;
  category: string;
  fileUrl: string;
  isArchived: boolean;
  uploadedAt: string;
}

export interface TrainingStats {
  totalPrograms: number;
  activePrograms: number;
  totalBatches: number;
  activeBatches: number;
  activeTrainers: number;
  totalStudents: number;
  enrolledStudents: number;
  waitlistCount: number;
  pendingDocuments: number;
  todayClasses: number;
  upcomingSessions: number;
  occupancyRate: number;
  attendanceRate: number;
  completionRate: number;
}

export interface PaginationQuery {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
  sortBy?: string;
  sortDir?: string;
}

/* ─── Helpers ───────────────────────────────────────────────────────────────── */

function buildQuery(params: PaginationQuery): string {
  const search = new URLSearchParams();
  if (params.page) search.set("page", String(params.page));
  if (params.pageSize) search.set("pageSize", String(params.pageSize));
  if (params.search) search.set("search", params.search);
  if (params.status) search.set("status", params.status);
  if (params.sortBy) {
    search.set("sortBy", params.sortBy);
    if (params.sortDir) search.set("sortDir", params.sortDir);
  }
  const qs = search.toString();
  return qs ? `?${qs}` : "";
}

/* ─── Courses (Programs) ────────────────────────────────────────────────────── */

export async function getCourses(query?: PaginationQuery): Promise<ApiResponse<Course[]>> {
  const { data } = await apiClient.get<ApiResponse<Course[]>>(`/training/courses${query ? buildQuery(query) : ""}`);
  return data;
}

export async function getCourse(id: string): Promise<ApiResponse<Course>> {
  const { data } = await apiClient.get<ApiResponse<Course>>(`/training/courses/${id}`);
  return data;
}

export async function createCourse(payload: Partial<Course>): Promise<ApiResponse<Course>> {
  const { data } = await apiClient.post<ApiResponse<Course>>("/training/courses", payload);
  return data;
}

export async function updateCourse(id: string, payload: Partial<Course>): Promise<ApiResponse<Course>> {
  const { data } = await apiClient.patch<ApiResponse<Course>>(`/training/courses/${id}`, payload);
  return data;
}

export async function archiveCourse(id: string): Promise<ApiResponse<void>> {
  const { data } = await apiClient.post<ApiResponse<void>>(`/training/courses/${id}/archive`);
  return data;
}

export async function restoreCourse(id: string): Promise<ApiResponse<void>> {
  const { data } = await apiClient.post<ApiResponse<void>>(`/training/courses/${id}/restore`);
  return data;
}

export async function getCourseStats(): Promise<ApiResponse<BatchStats>> {
  const { data } = await apiClient.get<ApiResponse<BatchStats>>("/training/courses/stats");
  return data;
}

/* ─── Batches ───────────────────────────────────────────────────────────────── */

export async function getBatches(query?: PaginationQuery): Promise<ApiResponse<Batch[]>> {
  const { data } = await apiClient.get<ApiResponse<Batch[]>>(`/training/batches${query ? buildQuery(query) : ""}`);
  return data;
}

export async function getBatch(id: string): Promise<ApiResponse<Batch>> {
  const { data } = await apiClient.get<ApiResponse<Batch>>(`/training/batches/${id}`);
  return data;
}

export async function createBatch(payload: Partial<Batch>): Promise<ApiResponse<Batch>> {
  const { data } = await apiClient.post<ApiResponse<Batch>>("/training/batches", payload);
  return data;
}

export async function updateBatch(id: string, payload: Partial<Batch>): Promise<ApiResponse<Batch>> {
  const { data } = await apiClient.patch<ApiResponse<Batch>>(`/training/batches/${id}`, payload);
  return data;
}

export async function updateBatchStatus(id: string, status: string): Promise<ApiResponse<Batch>> {
  const { data } = await apiClient.patch<ApiResponse<Batch>>(`/training/batches/${id}/status`, { status });
  return data;
}

export async function archiveBatch(id: string): Promise<ApiResponse<void>> {
  const { data } = await apiClient.post<ApiResponse<void>>(`/training/batches/${id}/archive`);
  return data;
}

export async function restoreBatch(id: string): Promise<ApiResponse<void>> {
  const { data } = await apiClient.post<ApiResponse<void>>(`/training/batches/${id}/restore`);
  return data;
}

export async function duplicateBatch(id: string, name?: string): Promise<ApiResponse<Batch>> {
  const { data } = await apiClient.post<ApiResponse<Batch>>(`/training/batches/${id}/duplicate`, name ? { name } : undefined);
  return data;
}

export async function getBatchStats(): Promise<ApiResponse<BatchStats>> {
  const { data } = await apiClient.get<ApiResponse<BatchStats>>("/training/batches/statistics");
  return data;
}

export async function getBatchStudents(batchId: string): Promise<ApiResponse<Array<{ id: string; name: string; email: string; phone: string }>>> {
  const { data } = await apiClient.get<ApiResponse<Array<{ id: string; name: string; email: string; phone: string }>>>(`/training/batches/${batchId}/students`);
  return data;
}

export async function getBatchSchedules(batchId: string): Promise<ApiResponse<ScheduleEvent[]>> {
  const { data } = await apiClient.get<ApiResponse<ScheduleEvent[]>>(`/training/batches/${batchId}/schedules`);
  return data;
}

export async function getBatchAttendance(batchId: string): Promise<ApiResponse<unknown>> {
  const { data } = await apiClient.get<ApiResponse<unknown>>(`/training/batches/${batchId}/attendance`);
  return data;
}

export async function getBatchProgress(batchId: string): Promise<ApiResponse<unknown>> {
  const { data } = await apiClient.get<ApiResponse<unknown>>(`/training/batches/${batchId}/progress`);
  return data;
}

export async function getBatchWaitlist(batchId: string): Promise<ApiResponse<WaitlistEntry[]>> {
  const { data } = await apiClient.get<ApiResponse<WaitlistEntry[]>>(`/training/batches/${batchId}/waitlist`);
  return data;
}

export async function getBatchCapacity(batchId: string): Promise<ApiResponse<{ capacity: number; enrolled: number; occupancy: number; waitlist: number }>> {
  const { data } = await apiClient.get<ApiResponse<{ capacity: number; enrolled: number; occupancy: number; waitlist: number }>>(`/training/batches/${batchId}/capacity`);
  return data;
}

/* ─── Trainers ──────────────────────────────────────────────────────────────── */

export async function getTrainers(query?: PaginationQuery): Promise<ApiResponse<Trainer[]>> {
  const { data } = await apiClient.get<ApiResponse<Trainer[]>>(`/training/trainers${query ? buildQuery(query) : ""}`);
  return data;
}

export async function getTrainer(id: string): Promise<ApiResponse<Trainer>> {
  const { data } = await apiClient.get<ApiResponse<Trainer>>(`/training/trainers/${id}`);
  return data;
}

export async function createTrainer(payload: Partial<Trainer>): Promise<ApiResponse<Trainer>> {
  const { data } = await apiClient.post<ApiResponse<Trainer>>("/training/trainers", payload);
  return data;
}

export async function updateTrainer(id: string, payload: Partial<Trainer>): Promise<ApiResponse<Trainer>> {
  const { data } = await apiClient.patch<ApiResponse<Trainer>>(`/training/trainers/${id}`, payload);
  return data;
}

export async function updateTrainerStatus(id: string, isActive: boolean): Promise<ApiResponse<Trainer>> {
  const { data } = await apiClient.patch<ApiResponse<Trainer>>(`/training/trainers/${id}/status`, { isActive });
  return data;
}

export async function archiveTrainer(id: string): Promise<ApiResponse<void>> {
  const { data } = await apiClient.post<ApiResponse<void>>(`/training/trainers/${id}/archive`);
  return data;
}

export async function restoreTrainer(id: string): Promise<ApiResponse<void>> {
  const { data } = await apiClient.post<ApiResponse<void>>(`/training/trainers/${id}/restore`);
  return data;
}

export async function getTrainerBatches(trainerId: string): Promise<ApiResponse<Batch[]>> {
  const { data } = await apiClient.get<ApiResponse<Array<{ batch: Batch }>>>(`/training/trainers/${trainerId}/batches`);
  return { ...data, data: data.data?.map((bt) => bt.batch) ?? [] };
}

export async function getTrainerSchedule(trainerId: string): Promise<ApiResponse<ScheduleEvent[]>> {
  const { data } = await apiClient.get<ApiResponse<ScheduleEvent[]>>(`/training/trainers/${trainerId}/schedule`);
  return data;
}

export async function getTrainerAttendance(trainerId: string): Promise<ApiResponse<unknown>> {
  const { data } = await apiClient.get<ApiResponse<unknown>>(`/training/trainers/${trainerId}/attendance`);
  return data;
}

export async function getTrainerWorkload(trainerId: string): Promise<ApiResponse<{ batchCount: number; upcomingSessions: number; totalStudents: number }>> {
  const { data } = await apiClient.get<ApiResponse<{ batchCount: number; upcomingSessions: number; totalStudents: number }>>(`/training/trainers/${trainerId}/workload`);
  return data;
}

export async function assignTrainerToBatch(trainerId: string, batchId: string, isPrimary?: boolean): Promise<ApiResponse<void>> {
  const { data } = await apiClient.post<ApiResponse<void>>(`/training/batches/${batchId}/assign-trainer`, { trainerId, isPrimary });
  return data;
}

export async function removeTrainerFromBatch(trainerId: string, batchId: string): Promise<ApiResponse<void>> {
  const { data } = await apiClient.post<ApiResponse<void>>(`/training/batches/${batchId}/assign-trainer`, { trainerId, isPrimary: false });
  return data;
}

/* ─── Schedule ──────────────────────────────────────────────────────────────── */

export async function getSchedules(query?: { page?: number; pageSize?: number; dateFrom?: string; dateTo?: string; batchId?: string; status?: string }): Promise<ApiResponse<ScheduleEvent[]>> {
  const params = new URLSearchParams();
  if (query?.page) params.set("page", String(query.page));
  if (query?.pageSize) params.set("pageSize", String(query.pageSize));
  if (query?.dateFrom) params.set("dateFrom", query.dateFrom);
  if (query?.dateTo) params.set("dateTo", query.dateTo);
  if (query?.batchId) params.set("batchId", query.batchId);
  if (query?.status) params.set("status", query.status);
  const qs = params.toString();
  const { data } = await apiClient.get<ApiResponse<ScheduleEvent[]>>(`/training/schedules${qs ? `?${qs}` : ""}`);
  return data;
}

export async function getSchedule(id: string): Promise<ApiResponse<ScheduleEvent>> {
  const { data } = await apiClient.get<ApiResponse<ScheduleEvent>>(`/training/schedules/${id}`);
  return data;
}

export async function getCalendar(query?: { month?: number; year?: number; batchId?: string }): Promise<ApiResponse<ScheduleEvent[]>> {
  const params = new URLSearchParams();
  if (query?.month) params.set("month", String(query.month));
  if (query?.year) params.set("year", String(query.year));
  if (query?.batchId) params.set("batchId", query.batchId);
  const qs = params.toString();
  const { data } = await apiClient.get<ApiResponse<ScheduleEvent[]>>(`/training/schedules/calendar${qs ? `?${qs}` : ""}`);
  return data;
}

export async function createSchedule(payload: Partial<ScheduleEvent>): Promise<ApiResponse<ScheduleEvent>> {
  const { data } = await apiClient.post<ApiResponse<ScheduleEvent>>("/training/schedules", payload);
  return data;
}

export async function updateSchedule(id: string, payload: Partial<ScheduleEvent>): Promise<ApiResponse<ScheduleEvent>> {
  const { data } = await apiClient.patch<ApiResponse<ScheduleEvent>>(`/training/schedules/${id}`, payload);
  return data;
}

export async function cancelSchedule(id: string): Promise<ApiResponse<void>> {
  const { data } = await apiClient.post<ApiResponse<void>>(`/training/schedules/${id}/cancel`);
  return data;
}

export async function rescheduleEvent(id: string, payload: { date: string; startTime: string; endTime: string }): Promise<ApiResponse<ScheduleEvent>> {
  const { data } = await apiClient.post<ApiResponse<ScheduleEvent>>(`/training/schedules/${id}/reschedule`, payload);
  return data;
}

export async function getTodaySchedule(): Promise<ApiResponse<ScheduleEvent[]>> {
  const { data } = await apiClient.get<ApiResponse<ScheduleEvent[]>>("/training/schedules/today");
  return data;
}

export async function getUpcomingSchedule(): Promise<ApiResponse<ScheduleEvent[]>> {
  const { data } = await apiClient.get<ApiResponse<ScheduleEvent[]>>("/training/schedules/upcoming");
  return data;
}

/* ─── Waitlist ──────────────────────────────────────────────────────────────── */

export async function getWaitlist(query?: PaginationQuery & { batchId?: string }): Promise<ApiResponse<WaitlistEntry[]>> {
  const params = new URLSearchParams();
  if (query?.page) params.set("page", String(query.page));
  if (query?.pageSize) params.set("pageSize", String(query.pageSize));
  if (query?.search) params.set("search", query.search);
  if (query?.status) params.set("status", query.status);
  if (query?.batchId) params.set("batchId", query.batchId);
  const qs = params.toString();
  const { data } = await apiClient.get<ApiResponse<WaitlistEntry[]>>(`/training/waitlist${qs ? `?${qs}` : ""}`);
  return data;
}

export async function getWaitlistEntry(id: string): Promise<ApiResponse<WaitlistEntry>> {
  const { data } = await apiClient.get<ApiResponse<WaitlistEntry>>(`/training/waitlist/${id}`);
  return data;
}

export async function createWaitlistEntry(payload: Partial<WaitlistEntry>): Promise<ApiResponse<WaitlistEntry>> {
  const { data } = await apiClient.post<ApiResponse<WaitlistEntry>>("/training/waitlist", payload);
  return data;
}

export async function updateWaitlistEntry(id: string, payload: Partial<WaitlistEntry>): Promise<ApiResponse<WaitlistEntry>> {
  const { data } = await apiClient.patch<ApiResponse<WaitlistEntry>>(`/training/waitlist/${id}`, payload);
  return data;
}

export async function promoteWaitlistEntry(id: string): Promise<ApiResponse<void>> {
  const { data } = await apiClient.post<ApiResponse<void>>(`/training/waitlist/${id}/promote`);
  return data;
}

export async function withdrawWaitlistEntry(id: string): Promise<ApiResponse<void>> {
  const { data } = await apiClient.post<ApiResponse<void>>(`/training/waitlist/${id}/withdraw`);
  return data;
}

/* ─── Documents ─────────────────────────────────────────────────────────────── */

export async function getDocuments(query?: PaginationQuery & { studentId?: string; type?: string }): Promise<ApiResponse<TrainingDocument[]>> {
  const params = new URLSearchParams();
  if (query?.page) params.set("page", String(query.page));
  if (query?.pageSize) params.set("pageSize", String(query.pageSize));
  if (query?.search) params.set("search", query.search);
  if (query?.status) params.set("status", query.status);
  if (query?.studentId) params.set("studentId", query.studentId);
  if (query?.type) params.set("type", query.type);
  const qs = params.toString();
  const { data } = await apiClient.get<ApiResponse<TrainingDocument[]>>(`/training/documents${qs ? `?${qs}` : ""}`);
  return data;
}

export async function getDocument(id: string): Promise<ApiResponse<TrainingDocument>> {
  const { data } = await apiClient.get<ApiResponse<TrainingDocument>>(`/training/documents/${id}`);
  return data;
}

export async function createDocument(payload: { studentId?: string; type?: string; name: string; fileUrl?: string }): Promise<ApiResponse<TrainingDocument>> {
  const { data } = await apiClient.post<ApiResponse<TrainingDocument>>("/training/documents", payload);
  return data;
}

export async function updateDocument(id: string, payload: Partial<TrainingDocument>): Promise<ApiResponse<TrainingDocument>> {
  const { data } = await apiClient.patch<ApiResponse<TrainingDocument>>(`/training/documents/${id}`, payload);
  return data;
}

export async function uploadDocument(formData: FormData): Promise<ApiResponse<TrainingDocument>> {
  const { data } = await apiClient.post<ApiResponse<TrainingDocument>>("/training/documents", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export async function verifyDocument(id: string): Promise<ApiResponse<TrainingDocument>> {
  const { data } = await apiClient.post<ApiResponse<TrainingDocument>>(`/training/documents/${id}/verify`);
  return data;
}

export async function rejectDocument(id: string, remarks: string): Promise<ApiResponse<TrainingDocument>> {
  const { data } = await apiClient.post<ApiResponse<TrainingDocument>>(`/training/documents/${id}/reject`, { remarks });
  return data;
}

export async function archiveDocument(id: string): Promise<ApiResponse<void>> {
  const { data } = await apiClient.post<ApiResponse<void>>(`/training/documents/${id}/archive`);
  return data;
}

export async function restoreDocument(id: string): Promise<ApiResponse<void>> {
  const { data } = await apiClient.post<ApiResponse<void>>(`/training/documents/${id}/restore`);
  return data;
}

/* ─── Files ─────────────────────────────────────────────────────────────────── */

export async function getFiles(query?: PaginationQuery & { category?: string }): Promise<ApiResponse<TrainingFile[]>> {
  const params = new URLSearchParams();
  if (query?.page) params.set("page", String(query.page));
  if (query?.pageSize) params.set("pageSize", String(query.pageSize));
  if (query?.search) params.set("search", query.search);
  if (query?.category) params.set("category", query.category);
  const qs = params.toString();
  const { data } = await apiClient.get<ApiResponse<TrainingFile[]>>(`/training/files${qs ? `?${qs}` : ""}`);
  return data;
}

export async function uploadFile(file: File, category: string): Promise<ApiResponse<TrainingFile>> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("category", category);
  const { data } = await apiClient.post<ApiResponse<TrainingFile>>("/training/files", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export async function archiveFile(id: string): Promise<ApiResponse<void>> {
  const { data } = await apiClient.post<ApiResponse<void>>(`/training/files/${id}/archive`);
  return data;
}

export async function restoreFile(id: string): Promise<ApiResponse<void>> {
  const { data } = await apiClient.post<ApiResponse<void>>(`/training/files/${id}/restore`);
  return data;
}

export function getFileDownloadUrl(id: string): string {
  return `${apiClient.defaults.baseURL}/training/files/${id}/download`;
}

/* ─── Dashboard Stats ───────────────────────────────────────────────────────── */

export async function getTrainingStats(): Promise<ApiResponse<TrainingStats>> {
  const { data } = await apiClient.get<ApiResponse<TrainingStats>>("/training/stats");
  return data;
}
