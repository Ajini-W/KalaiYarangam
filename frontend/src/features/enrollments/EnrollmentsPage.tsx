"use client";

import * as React from "react";
import { Plus, ExternalLink } from "lucide-react";
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
import { SkeletonTable } from "@/components/ui/Skeleton";
import { SearchableSelect } from "@/components/ui/SearchableSelect";
import { EnrollmentStatusBadge } from "./StatusBadge";
import { useEnrollments } from "@/hooks/useEnrollments";
import type { Enrollment } from "@/services/enrollments";

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

const actionLabels: Record<string, { title: string; desc: string; intent: "danger" | "info" | "warning" }> = {
  pause: { title: "Pause Enrollment", desc: "The student will temporarily lose access.", intent: "warning" },
  resume: { title: "Resume Enrollment", desc: "The student will regain access.", intent: "info" },
  reactivate: { title: "Reactivate Enrollment", desc: "The enrollment will become active again.", intent: "info" },
  cancel: { title: "Cancel Enrollment", desc: "This action cannot be undone.", intent: "danger" },
};

export default function EnrollmentsPage() {
  const router = useRouter();
  const {
    loading, enrollments, total,
    page, setPage, pageSize,
    search, setSearch,
    statusFilter, setStatusFilter,
    sortKey, sortDir, handleSort,
    modalOpen, setModalOpen,
    editingEnrollment, saving,
    openCreate, onSubmit,
    actionConfirm, actionSaving, confirmAction, closeActionConfirm,
    studentOptions, batchOptions, courseOptions,
    studentName, studentEmail,
    register, errors, handleSubmit,
  } = useEnrollments();

  const columns: Column<Enrollment>[] = React.useMemo(() => [
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
          <Button variant="ghost" size="sm" onClick={() => router.push(`./enrollments/${row.id}`)}>
            <ExternalLink size={14} />
          </Button>
        </div>
      ),
    },
  ], [router]);

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
            <SearchableSelect
              label="Student Name"
              required
              placeholder="Search student..."
              options={studentOptions}
              value={editingEnrollment ? editingEnrollment.studentId : undefined}
              onChange={(v) => register("studentId").onChange({ target: { value: v } })}
              error={errors.studentId?.message}
              emptyMessage="No students available"
            />
            <SearchableSelect
              label="Course Name"
              required
              placeholder="Search course..."
              options={courseOptions}
              value={editingEnrollment ? editingEnrollment.courseId : undefined}
              onChange={(v) => register("courseId").onChange({ target: { value: v } })}
              error={errors.courseId?.message}
              emptyMessage="No courses available"
            />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <SearchableSelect
              label="Batch Name"
              required
              placeholder="Search batch..."
              options={batchOptions}
              value={editingEnrollment ? editingEnrollment.batchId : undefined}
              onChange={(v) => register("batchId").onChange({ target: { value: v } })}
              error={errors.batchId?.message}
              emptyMessage="No batches available"
            />
            <Input label="Fee" type="number" required error={errors.fee?.message} {...register("fee")} />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {studentName && !editingEnrollment && (
              <div className="col-span-2 rounded-[var(--radius-sm)] border border-border bg-surface-raised px-3 py-2 text-sm">
                <p className="font-medium text-text-primary">{studentName}</p>
                {studentEmail && <p className="text-xs text-text-secondary">{studentEmail}</p>}
              </div>
            )}
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input label="Start Date" type="date" required error={errors.startDate?.message} {...register("startDate")} />
            <Input label="End Date" type="date" required error={errors.endDate?.message} {...register("endDate")} />
          </div>
        </div>
      </Modal>

      <ConfirmModal
        open={actionConfirm.open}
        onClose={closeActionConfirm}
        onConfirm={confirmAction}
        title={actionLabel?.title ?? ""}
        description={
          actionConfirm.enrollment
            ? `${actionLabel?.desc ?? ""} (${actionConfirm.enrollment.studentName})`
            : ""
        }
        intent={actionLabel?.intent ?? "info"}
        confirmLabel={confirmActionType ? confirmActionType.charAt(0).toUpperCase() + confirmActionType.slice(1) : "Confirm"}
        loading={actionSaving}
      />
    </PageContainer>
  );
}
