"use client";

import * as React from "react";
import { Plus, Pencil, Play, Pause, RotateCcw, XCircle, ExternalLink } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { PageContainer } from "@/components/layout/PageContainer";
import { Table, type Column } from "@/components/ui/Table";
import { Pagination } from "@/components/ui/Pagination";
import { Modal, ConfirmModal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { SearchBar } from "@/components/ui/SearchBar";
import { FilterBar, type FilterDef } from "@/components/ui/FilterBar";
import { EmptyState } from "@/components/ui/EmptyState";
import { Alert } from "@/components/ui/Alert";
import { SkeletonTable } from "@/components/ui/Skeleton";
import { EnrollmentStatusBadge } from "./StatusBadge";
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
  type CreateEnrollmentRequest,
  type UpdateEnrollmentRequest,
  type EnrollmentStatus,
} from "@/services/enrollments";

const enrollmentSchema = z.object({
  studentId: z.string().min(1, "Student is required"),
  batchId: z.string().min(1, "Batch is required"),
  courseId: z.string().min(1, "Course is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  fee: z.string().min(1, "Fee is required").refine((v) => !isNaN(Number(v)), "Must be a number"),
});
type EnrollmentFormData = z.infer<typeof enrollmentSchema>;

const statusFilters: FilterDef[] = [
  {
    key: "status",
    label: "All Statuses",
    options: [
      { value: "active", label: "Active" },
      { value: "paused", label: "Paused" },
      { value: "cancelled", label: "Cancelled" },
      { value: "completed", label: "Completed" },
    ],
  },
];

const statusActions: {
  status: EnrollmentStatus;
  nextActions: { label: string; action: "pause" | "resume" | "reactivate" | "cancel"; icon: React.ReactNode; variant: "primary" | "danger" | "outline" }[];
}[] = [
  {
    status: "active",
    nextActions: [
      { label: "Pause", action: "pause", icon: <Pause size={14} />, variant: "outline" },
      { label: "Cancel", action: "cancel", icon: <XCircle size={14} />, variant: "danger" },
    ],
  },
  {
    status: "paused",
    nextActions: [
      { label: "Resume", action: "resume", icon: <Play size={14} />, variant: "primary" },
      { label: "Cancel", action: "cancel", icon: <XCircle size={14} />, variant: "danger" },
    ],
  },
  {
    status: "cancelled",
    nextActions: [
      { label: "Reactivate", action: "reactivate", icon: <RotateCcw size={14} />, variant: "primary" },
    ],
  },
  {
    status: "completed",
    nextActions: [],
  },
];

export default function EnrollmentsPage() {
  const router = useRouter();

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

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EnrollmentFormData>({
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
    setModalOpen(true);
  };

  const onSubmit = async (data: EnrollmentFormData) => {
    setSaving(true);
    try {
      const fee = Number(data.fee);
      if (editingEnrollment) {
        const payload: UpdateEnrollmentRequest = {
          batchId: data.batchId,
          courseId: data.courseId,
          startDate: data.startDate,
          endDate: data.endDate,
          fee,
        };
        await updateEnrollment(editingEnrollment.id, payload);
        toast.success("Enrollment updated");
      } else {
        const payload: CreateEnrollmentRequest = {
          studentId: data.studentId,
          batchId: data.batchId,
          courseId: data.courseId,
          startDate: data.startDate,
          endDate: data.endDate,
          fee,
        };
        await createEnrollment(payload);
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
      setActionConfirm({ open: false, enrollment: null, action: null });
      await fetchEnrollments();
    } catch {
      toast.error(`Failed to ${action} enrollment`);
    } finally {
      setActionSaving(false);
    }
  };

  const actionLabels: Record<string, { title: string; desc: string; intent: "danger" | "info" | "warning" }> = {
    pause: { title: "Pause Enrollment", desc: "The student will temporarily lose access.", intent: "warning" },
    resume: { title: "Resume Enrollment", desc: "The student will regain access.", intent: "info" },
    reactivate: { title: "Reactivate Enrollment", desc: "The enrollment will become active again.", intent: "info" },
    cancel: { title: "Cancel Enrollment", desc: "This action cannot be undone.", intent: "danger" },
  };

  const columns: Column<Enrollment>[] = [
    { key: "studentName", header: "Student", sortable: true },
    { key: "courseName", header: "Course", sortable: true },
    { key: "batchName", header: "Batch", sortable: true },
    {
      key: "status",
      header: "Status",
      sortable: true,
      render: (row) => <EnrollmentStatusBadge status={row.status} />,
    },
    {
      key: "startDate",
      header: "Start Date",
      render: (row) => new Date(row.startDate).toLocaleDateString(),
    },
    {
      key: "endDate",
      header: "End Date",
      render: (row) => new Date(row.endDate).toLocaleDateString(),
    },
    {
      key: "fee",
      header: "Fee",
      render: (row) => `$${row.fee.toLocaleString()}`,
    },
    {
      key: "actions",
      header: "",
      render: (row) => (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(`./enrollments/${row.id}`)}
          >
            <ExternalLink size={14} />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => openEdit(row)}>
            <Pencil size={14} />
          </Button>
        </div>
      ),
    },
  ];

  const confirmActionType = actionConfirm.action;
  const actionLabel = confirmActionType ? actionLabels[confirmActionType] : null;

  return (
    <PageContainer
      title="Enrollments"
      subtitle="Manage student enrollments"
      actions={
        <Button leftIcon={<Plus size={16} />} onClick={openCreate}>
          Add Enrollment
        </Button>
      }
    >
      {error && (
        <Alert type="danger" dismissible onDismiss={() => setError(false)} className="mb-4">
          Failed to load enrollments.{' '}
          <button onClick={fetchEnrollments} className="underline font-semibold">Retry</button>
        </Alert>
      )}

      <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <SearchBar value={search} onChange={setSearch} placeholder="Search students…" className="w-full sm:max-w-xs" />
        <FilterBar
          filters={statusFilters}
          active={{ status: statusFilter }}
          onChange={(key, value) => { setStatusFilter(value); setPage(1); }}
          onClear={() => { setStatusFilter(""); setPage(1); }}
        />
      </div>

      {loading ? (
        <SkeletonTable rows={5} />
      ) : enrollments.length === 0 ? (
        <EmptyState
          title="No enrollments found"
          description={search || statusFilter ? "Try adjusting your search or filters" : "Enroll your first student to get started"}
          action={!search && !statusFilter ? { label: "Add Enrollment", onClick: openCreate } : undefined}
        />
      ) : (
        <>
          <Table
            columns={columns}
            data={enrollments}
            loading={false}
            sortKey={sortKey}
            sortDir={sortDir}
            onSort={handleSort}
          />
          <Pagination
            page={page}
            pageSize={pageSize}
            total={total}
            onPageChange={setPage}
            className="mt-4"
          />
        </>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingEnrollment ? "Edit Enrollment" : "Add Enrollment"}
        size="lg"
        footer={
          <>
            <Button variant="outline" onClick={() => setModalOpen(false)} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={handleSubmit(onSubmit)} loading={saving}>
              {editingEnrollment ? "Save Changes" : "Create Enrollment"}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input label="Student ID" required error={errors.studentId?.message} {...register("studentId")} />
            <Input label="Fee" type="number" required error={errors.fee?.message} {...register("fee")} />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input label="Batch ID" required error={errors.batchId?.message} {...register("batchId")} />
            <Input label="Course ID" required error={errors.courseId?.message} {...register("courseId")} />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input label="Start Date" type="date" required error={errors.startDate?.message} {...register("startDate")} />
            <Input label="End Date" type="date" required error={errors.endDate?.message} {...register("endDate")} />
          </div>
        </div>
      </Modal>

      <ConfirmModal
        open={actionConfirm.open}
        onClose={() => setActionConfirm({ open: false, enrollment: null, action: null })}
        onConfirm={confirmAction}
        title={actionLabel?.title ?? ""}
        description={
          actionConfirm.enrollment
            ? `${actionLabel?.desc ?? ""} (${actionConfirm.enrollment.studentName})`
            : ""
        }
        intent={actionLabel?.intent ?? "info"}
        confirmLabel={actionConfirm.action ? actionConfirm.action.charAt(0).toUpperCase() + actionConfirm.action.slice(1) : "Confirm"}
        loading={actionSaving}
      />
    </PageContainer>
  );
}
