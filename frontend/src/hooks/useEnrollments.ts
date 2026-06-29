"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  getEnrollments,
  getEnrollment,
  createEnrollment,
  updateEnrollment,
  pauseEnrollment,
  resumeEnrollment,
  reactivateEnrollment,
  cancelEnrollment,
  type Enrollment,
  type EnrollmentStatus,
} from "@/services/enrollments";
import { getStudents } from "@/services/students";
import { getBatches } from "@/services/batches";
import { getCourses } from "@/services/courses";
import type { SearchableOption } from "@/components/ui/SearchableSelect";

export const enrollmentSchema = z.object({
  studentId: z.string().min(1, "Student is required"),
  batchId: z.string().min(1, "Batch is required"),
  courseId: z.string().min(1, "Course is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  fee: z.string().min(1, "Fee is required").refine((v) => !isNaN(Number(v)), "Must be a number"),
});
export type EnrollmentFormData = z.infer<typeof enrollmentSchema>;

export interface EnrollmentsState {
  loading: boolean;
  error: boolean;
  enrollments: Enrollment[];
  total: number;
  page: number;
  setPage: (p: number) => void;
  pageSize: number;
  search: string;
  setSearch: (s: string) => void;
  statusFilter: string;
  setStatusFilter: (s: string) => void;
  sortKey: string;
  sortDir: "asc" | "desc";
  handleSort: (key: string) => void;
  modalOpen: boolean;
  setModalOpen: (o: boolean) => void;
  editingEnrollment: Enrollment | null;
  saving: boolean;
  openCreate: () => void;
  openEdit: (enrollment: Enrollment) => Promise<void>;
  onSubmit: (data: EnrollmentFormData) => Promise<void>;
  actionConfirm: { open: boolean; enrollment: Enrollment | null; action: "pause" | "resume" | "reactivate" | "cancel" | null };
  actionSaving: boolean;
  confirmAction: () => Promise<void>;
  requestAction: (enrollment: Enrollment, action: "pause" | "resume" | "reactivate" | "cancel") => void;
  closeActionConfirm: () => void;
  fetchEnrollments: () => Promise<void>;
  studentOptions: SearchableOption[];
  batchOptions: SearchableOption[];
  courseOptions: SearchableOption[];
  studentName: string;
  studentEmail: string;
  register: ReturnType<typeof useForm<EnrollmentFormData>>["register"];
  errors: ReturnType<typeof useForm<EnrollmentFormData>>["formState"]["errors"];
  handleSubmit: ReturnType<typeof useForm<EnrollmentFormData>>["handleSubmit"];
  reset: ReturnType<typeof useForm<EnrollmentFormData>>["reset"];
}

export function useEnrollments(): EnrollmentsState {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);
  const [enrollments, setEnrollments] = React.useState<Enrollment[]>([]);
  const [total, setTotal] = React.useState(0);
  const [page, setPage] = React.useState(1);
  const [pageSize] = React.useState(10);
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("");
  const [sortKey, setSortKey] = React.useState("");
  const [sortDir, setSortDir] = React.useState<"asc" | "desc">("asc");

  const [modalOpen, setModalOpen] = React.useState(false);
  const [editingEnrollment, setEditingEnrollment] = React.useState<Enrollment | null>(null);
  const [saving, setSaving] = React.useState(false);

  const [actionConfirm, setActionConfirm] = React.useState<{
    open: boolean;
    enrollment: Enrollment | null;
    action: "pause" | "resume" | "reactivate" | "cancel" | null;
  }>({ open: false, enrollment: null, action: null });
  const [actionSaving, setActionSaving] = React.useState(false);

  const [studentOptions, setStudentOptions] = React.useState<SearchableOption[]>([]);
  const [batchOptions, setBatchOptions] = React.useState<SearchableOption[]>([]);
  const [courseOptions, setCourseOptions] = React.useState<SearchableOption[]>([]);
  const [studentName, setStudentName] = React.useState("");
  const [studentEmail, setStudentEmail] = React.useState("");

  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm<EnrollmentFormData>({
    resolver: zodResolver(enrollmentSchema),
  });

  const fetchEnrollments = React.useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await getEnrollments({
        page,
        pageSize,
        search: search || undefined,
        status: (statusFilter as EnrollmentStatus) || undefined,
        sortBy: sortKey || undefined,
        sortDir: sortKey ? sortDir : undefined,
      });
      setEnrollments(res.data.items);
      setTotal(res.data.total);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, search, statusFilter, sortKey, sortDir]);

  React.useEffect(() => {
    fetchEnrollments();
  }, [fetchEnrollments]);

  const fetchOptions = React.useCallback(async () => {
    try {
      const [studentsRes, batchesRes, coursesRes] = await Promise.all([
        getStudents(),
        getBatches(),
        getCourses(),
      ]);
      setStudentOptions(
        studentsRes.data.items.map((s) => ({
          value: s.id,
          label: s.name,
          secondary: s.email,
        })),
      );
      setBatchOptions(
        batchesRes.data.items.map((b) => ({
          value: b.id,
          label: b.name,
          secondary: b.courseName,
        })),
      );
      setCourseOptions(
        coursesRes.data.items.map((c) => ({
          value: c.id,
          label: c.name,
        })),
      );
    } catch {
      // Options are non-critical
    }
  }, []);

  React.useEffect(() => {
    if (modalOpen) fetchOptions();
  }, [modalOpen, fetchOptions]);

  const selectedStudentId = watch("studentId");
  React.useEffect(() => {
    const student = studentOptions.find((s) => s.value === selectedStudentId);
    setStudentName(student?.label ?? "");
    setStudentEmail(student?.secondary ?? "");
  }, [selectedStudentId, studentOptions]);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const openCreate = () => {
    setEditingEnrollment(null);
    reset({ studentId: "", batchId: "", courseId: "", startDate: "", endDate: "", fee: "0" });
    setStudentName("");
    setStudentEmail("");
    setModalOpen(true);
  };

  const openEdit = async (enrollment: Enrollment) => {
    setEditingEnrollment(enrollment);
    const full = await getEnrollment(enrollment.id);
    const e = full.data;
    reset({
      studentId: e.studentId,
      batchId: e.batchId,
      courseId: e.courseId,
      startDate: e.startDate.slice(0, 10),
      endDate: e.endDate.slice(0, 10),
      fee: String(e.fee),
    });
    setStudentName(e.studentName);
    setModalOpen(true);
  };

  const onSubmit = async (data: EnrollmentFormData) => {
    setSaving(true);
    try {
      const fee = Number(data.fee);
      if (editingEnrollment) {
        await updateEnrollment(editingEnrollment.id, {
          batchId: data.batchId,
          courseId: data.courseId,
          startDate: data.startDate,
          endDate: data.endDate,
          fee,
        });
        toast.success("Enrollment updated");
      } else {
        await createEnrollment({
          studentId: data.studentId,
          batchId: data.batchId,
          courseId: data.courseId,
          startDate: data.startDate,
          endDate: data.endDate,
          fee,
        });
        toast.success("Enrollment created");
      }
      setModalOpen(false);
      await fetchEnrollments();
    } catch {
      toast.error(editingEnrollment ? "Failed to update enrollment" : "Failed to create enrollment");
    } finally {
      setSaving(false);
    }
  };

  const requestAction = (
    enrollment: Enrollment,
    action: "pause" | "resume" | "reactivate" | "cancel",
  ) => {
    setActionConfirm({ open: true, enrollment, action });
  };

  const closeActionConfirm = () => {
    setActionConfirm({ open: false, enrollment: null, action: null });
  };

  const confirmAction = async () => {
    const { enrollment, action } = actionConfirm;
    if (!enrollment || !action) return;
    setActionSaving(true);
    try {
      switch (action) {
        case "pause":
          await pauseEnrollment(enrollment.id);
          toast.success("Enrollment paused");
          break;
        case "resume":
          await resumeEnrollment(enrollment.id);
          toast.success("Enrollment resumed");
          break;
        case "reactivate":
          await reactivateEnrollment(enrollment.id);
          toast.success("Enrollment reactivated");
          break;
        case "cancel":
          await cancelEnrollment(enrollment.id);
          toast.success("Enrollment cancelled");
          break;
      }
      closeActionConfirm();
      await fetchEnrollments();
    } catch {
      toast.error(`Failed to ${action} enrollment`);
    } finally {
      setActionSaving(false);
    }
  };

  return {
    loading, error, enrollments, total,
    page, setPage, pageSize,
    search, setSearch,
    statusFilter, setStatusFilter,
    sortKey, sortDir, handleSort,
    modalOpen, setModalOpen,
    editingEnrollment, saving,
    openCreate, openEdit, onSubmit,
    actionConfirm, actionSaving, confirmAction, requestAction, closeActionConfirm,
    fetchEnrollments,
    studentOptions, batchOptions, courseOptions,
    studentName, studentEmail,
    register, errors, handleSubmit, reset,
  };
}
