"use client";

import * as React from "react";
import { Plus, ExternalLink, CheckCircle2, XCircle, Ban } from "lucide-react";
import { useRouter } from "next/navigation";
import { PageContainer } from "@/components/layout/PageContainer";
import { Table, type Column } from "@/components/ui/Table";
import { Pagination } from "@/components/ui/Pagination";
import { Modal, ConfirmModal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { SearchBar } from "@/components/ui/SearchBar";
import { FilterBar, type FilterDef } from "@/components/ui/FilterBar";
import { SkeletonTable } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { SearchableSelect } from "@/components/ui/SearchableSelect";
import { RenewalStatusBadge } from "@/features/enrollments/StatusBadge";
import { useRenewals } from "@/hooks/useRenewals";
import type { Renewal } from "@/services/renewals";

const statusFilters: FilterDef[] = [
  {
    key: "status",
    label: "All Statuses",
    options: [
      { value: "pending", label: "Pending" },
      { value: "approved", label: "Approved" },
      { value: "rejected", label: "Rejected" },
      { value: "cancelled", label: "Cancelled" },
    ],
  },
];

export default function RenewalsPage() {
  const router = useRouter();
  const {
    loading, renewals, total,
    page, setPage, pageSize,
    search, setSearch,
    statusFilter, setStatusFilter,
    modalOpen, setModalOpen,
    saving,
    openCreate, onSubmit,
    approveConfirm, rejectConfirm, cancelConfirm,
    actionSaving,
    handleApprove, handleReject, handleCancel,
    requestApprove, requestReject, requestCancel,
    closeApprove, closeReject, closeCancel,
    enrollmentOptions,
    register, errors, handleSubmit,
  } = useRenewals();

  const columns: Column<Renewal>[] = React.useMemo(() => [
    { key: "studentName", header: "Student" },
    { key: "courseName", header: "Course" },
    { key: "batchName", header: "Batch" },
    {
      key: "previousEndDate",
      header: "Previous End",
      render: (row) => new Date(row.previousEndDate).toLocaleDateString(),
    },
    {
      key: "newEndDate",
      header: "New End",
      render: (row) => new Date(row.newEndDate).toLocaleDateString(),
    },
    {
      key: "status",
      header: "Status",
      render: (row) => <RenewalStatusBadge status={row.status} />,
    },
    {
      key: "actions",
      header: "",
      render: (row) => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={() => router.push(`./renewals/${row.id}`)}>
            <ExternalLink size={14} />
          </Button>
          {row.status === "pending" && (
            <>
              <Button variant="ghost" size="sm" onClick={() => requestApprove(row)}>
                <CheckCircle2 size={14} className="text-success" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => requestReject(row)}>
                <XCircle size={14} className="text-danger" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => requestCancel(row)}>
                <Ban size={14} className="text-warning" />
              </Button>
            </>
          )}
        </div>
      ),
    },
  ], [router, requestApprove, requestReject, requestCancel]);

  return (
    <PageContainer
      title="Renewals"
      subtitle="Manage enrollment renewal requests"
      actions={
        <Button leftIcon={<Plus size={16} />} onClick={openCreate}>
          New Renewal
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
      ) : renewals.length === 0 ? (
        <EmptyState
          title="No renewals found"
          description={search || statusFilter ? "Try adjusting your search or filters" : "No renewal requests yet"}
          action={!search && !statusFilter ? { label: "New Renewal", onClick: openCreate } : undefined}
        />
      ) : (
        <>
          <Table columns={columns} data={renewals} loading={false} />
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
        title="New Renewal Request"
        size="md"
        footer={
          <>
            <Button variant="outline" onClick={() => setModalOpen(false)} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={handleSubmit(onSubmit)} loading={saving}>
              Submit Request
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <SearchableSelect
            label="Enrollment"
            required
            placeholder="Search enrollment..."
            options={enrollmentOptions}
            onChange={(v) => register("enrollmentId").onChange({ target: { value: v } })}
            error={errors.enrollmentId?.message}
            emptyMessage="No enrollments available"
          />
          <Input label="End Date" type="date" required error={errors.newEndDate?.message} {...register("newEndDate")} />
          <Input label="Fee" type="number" required error={errors.fee?.message} {...register("fee")} />
        </div>
      </Modal>

      <ConfirmModal
        open={approveConfirm.open}
        onClose={closeApprove}
        onConfirm={handleApprove}
        title="Approve Renewal"
        description={
          approveConfirm.renewal
            ? `Approve renewal for ${approveConfirm.renewal.studentName}?`
            : ""
        }
        intent="success"
        confirmLabel="Approve"
        loading={actionSaving}
      />

      <ConfirmModal
        open={rejectConfirm.open}
        onClose={closeReject}
        onConfirm={handleReject}
        title="Reject Renewal"
        description={
          rejectConfirm.renewal
            ? `Reject renewal request for ${rejectConfirm.renewal.studentName}?`
            : ""
        }
        intent="danger"
        confirmLabel="Reject"
        loading={actionSaving}
      />

      <ConfirmModal
        open={cancelConfirm.open}
        onClose={closeCancel}
        onConfirm={handleCancel}
        title="Cancel Renewal"
        description={
          cancelConfirm.renewal
            ? `Cancel renewal request for ${cancelConfirm.renewal.studentName}?`
            : ""
        }
        intent="warning"
        confirmLabel="Cancel"
        loading={actionSaving}
      />
    </PageContainer>
  );
}
