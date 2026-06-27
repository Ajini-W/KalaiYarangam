"use client";

import * as React from "react";
import { Plus, ExternalLink, CheckCircle2, XCircle, Ban } from "lucide-react";
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
import { SkeletonTable } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { Alert } from "@/components/ui/Alert";
import { TransferStatusBadge } from "@/features/enrollments/StatusBadge";
import {
  getTransfers,
  createTransfer,
  approveTransfer,
  rejectTransfer,
  cancelTransfer,
  type Transfer,
  type TransferStatus,
} from "@/services/transfers";

const transferSchema = z.object({
  enrollmentId: z.string().min(1, "Enrollment is required"),
  toBatchId: z.string().min(1, "Target batch is required"),
  reason: z.string().min(10, "Please provide a reason (at least 10 characters)"),
});
type TransferFormData = z.infer<typeof transferSchema>;

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

export default function TransfersPage() {
  const router = useRouter();

  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);
  const [transfers, setTransfers] = React.useState<Transfer[]>([]);
  const [total, setTotal] = React.useState(0);
  const [page, setPage] = React.useState(1);
  const [pageSize] = React.useState(10);
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("");

  const [modalOpen, setModalOpen] = React.useState(false);
  const [saving, setSaving] = React.useState(false);

  const [approveConfirm, setApproveConfirm] = React.useState<{ open: boolean; transfer: Transfer | null }>({
    open: false, transfer: null,
  });
  const [rejectConfirm, setRejectConfirm] = React.useState<{ open: boolean; transfer: Transfer | null }>({
    open: false, transfer: null,
  });
  const [cancelConfirm, setCancelConfirm] = React.useState<{ open: boolean; transfer: Transfer | null }>({
    open: false, transfer: null,
  });
  const [actionSaving, setActionSaving] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TransferFormData>({
    resolver: zodResolver(transferSchema),
  });

  const fetchTransfers = React.useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await getTransfers({
        page,
        pageSize,
        search: search || undefined,
        status: (statusFilter as TransferStatus) || undefined,
      });
      setTransfers(res.data.items);
      setTotal(res.data.total);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, search, statusFilter]);

  React.useEffect(() => {
    fetchTransfers();
  }, [fetchTransfers]);

  const openCreate = () => {
    reset({ enrollmentId: "", toBatchId: "", reason: "" });
    setModalOpen(true);
  };

  const onSubmit = async (data: TransferFormData) => {
    setSaving(true);
    try {
      await createTransfer(data);
      toast.success("Transfer request created");
      setModalOpen(false);
      await fetchTransfers();
    } catch {
      toast.error("Failed to create transfer request");
    } finally {
      setSaving(false);
    }
  };

  const handleApprove = async () => {
    const t = approveConfirm.transfer;
    if (!t) return;
    setActionSaving(true);
    try {
      await approveTransfer(t.id);
      toast.success("Transfer approved");
      setApproveConfirm({ open: false, transfer: null });
      await fetchTransfers();
    } catch {
      toast.error("Failed to approve transfer");
    } finally {
      setActionSaving(false);
    }
  };

  const handleReject = async () => {
    const t = rejectConfirm.transfer;
    if (!t) return;
    setActionSaving(true);
    try {
      await rejectTransfer(t.id);
      toast.success("Transfer rejected");
      setRejectConfirm({ open: false, transfer: null });
      await fetchTransfers();
    } catch {
      toast.error("Failed to reject transfer");
    } finally {
      setActionSaving(false);
    }
  };

  const handleCancel = async () => {
    const t = cancelConfirm.transfer;
    if (!t) return;
    setActionSaving(true);
    try {
      await cancelTransfer(t.id);
      toast.success("Transfer cancelled");
      setCancelConfirm({ open: false, transfer: null });
      await fetchTransfers();
    } catch {
      toast.error("Failed to cancel transfer");
    } finally {
      setActionSaving(false);
    }
  };

  const columns: Column<Transfer>[] = [
    { key: "studentName", header: "Student" },
    { key: "fromBatchName", header: "From Batch" },
    { key: "toBatchName", header: "To Batch" },
    {
      key: "status",
      header: "Status",
      render: (row) => <TransferStatusBadge status={row.status} />,
    },
    {
      key: "requestedAt",
      header: "Requested",
      render: (row) => new Date(row.requestedAt).toLocaleDateString(),
    },
    {
      key: "actions",
      header: "",
      render: (row) => (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(`./transfers/${row.id}`)}
          >
            <ExternalLink size={14} />
          </Button>
          {row.status === "pending" && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setApproveConfirm({ open: true, transfer: row })}
              >
                <CheckCircle2 size={14} className="text-success" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setRejectConfirm({ open: true, transfer: row })}
              >
                <XCircle size={14} className="text-danger" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCancelConfirm({ open: true, transfer: row })}
              >
                <Ban size={14} className="text-warning" />
              </Button>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <PageContainer
      title="Transfers"
      subtitle="Manage batch transfer requests"
      actions={
        <Button leftIcon={<Plus size={16} />} onClick={openCreate}>
          New Transfer
        </Button>
      }
    >
      {error && (
        <Alert type="danger" dismissible onDismiss={() => setError(false)} className="mb-4">
          Failed to load transfers.{' '}
          <button onClick={fetchTransfers} className="underline font-semibold">Retry</button>
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
      ) : transfers.length === 0 ? (
        <EmptyState
          title="No transfers found"
          description={search || statusFilter ? "Try adjusting your search or filters" : "No transfer requests yet"}
          action={!search && !statusFilter ? { label: "New Transfer", onClick: openCreate } : undefined}
        />
      ) : (
        <>
          <Table columns={columns} data={transfers} loading={false} />
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
        title="New Transfer Request"
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
          <Input label="Enrollment ID" required error={errors.enrollmentId?.message} {...register("enrollmentId")} />
          <Input label="Target Batch ID" required error={errors.toBatchId?.message} {...register("toBatchId")} />
          <Input label="Reason" required error={errors.reason?.message} {...register("reason")} />
        </div>
      </Modal>

      <ConfirmModal
        open={approveConfirm.open}
        onClose={() => setApproveConfirm({ open: false, transfer: null })}
        onConfirm={handleApprove}
        title="Approve Transfer"
        description={
          approveConfirm.transfer
            ? `Approve transfer for ${approveConfirm.transfer.studentName} from ${approveConfirm.transfer.fromBatchName} to ${approveConfirm.transfer.toBatchName}?`
            : ""
        }
        intent="success"
        confirmLabel="Approve"
        loading={actionSaving}
      />

      <ConfirmModal
        open={rejectConfirm.open}
        onClose={() => setRejectConfirm({ open: false, transfer: null })}
        onConfirm={handleReject}
        title="Reject Transfer"
        description={
          rejectConfirm.transfer
            ? `Reject transfer request for ${rejectConfirm.transfer.studentName}?`
            : ""
        }
        intent="danger"
        confirmLabel="Reject"
        loading={actionSaving}
      />

      <ConfirmModal
        open={cancelConfirm.open}
        onClose={() => setCancelConfirm({ open: false, transfer: null })}
        onConfirm={handleCancel}
        title="Cancel Transfer"
        description={
          cancelConfirm.transfer
            ? `Cancel transfer request for ${cancelConfirm.transfer.studentName}?`
            : ""
        }
        intent="warning"
        confirmLabel="Cancel"
        loading={actionSaving}
      />
    </PageContainer>
  );
}
