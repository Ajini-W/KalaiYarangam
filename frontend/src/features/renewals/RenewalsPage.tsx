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
import { RenewalStatusBadge } from "@/features/enrollments/StatusBadge";
import {
  getRenewals,
  createRenewal,
  approveRenewal,
  rejectRenewal,
  cancelRenewal,
  type Renewal,
  type RenewalStatus,
} from "@/services/renewals";

const renewalSchema = z.object({
  enrollmentId: z.string().min(1, "Enrollment is required"),
  newEndDate: z.string().min(1, "New end date is required"),
  fee: z.string().min(1, "Fee is required").refine((v) => !isNaN(Number(v)), "Must be a number"),
});
type RenewalFormData = z.infer<typeof renewalSchema>;

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

  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);
  const [renewals, setRenewals] = React.useState<Renewal[]>([]);
  const [total, setTotal] = React.useState(0);
  const [page, setPage] = React.useState(1);
  const [pageSize] = React.useState(10);
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("");

  const [modalOpen, setModalOpen] = React.useState(false);
  const [saving, setSaving] = React.useState(false);

  const [approveConfirm, setApproveConfirm] = React.useState<{ open: boolean; renewal: Renewal | null }>({
    open: false, renewal: null,
  });
  const [rejectConfirm, setRejectConfirm] = React.useState<{ open: boolean; renewal: Renewal | null }>({
    open: false, renewal: null,
  });
  const [cancelConfirm, setCancelConfirm] = React.useState<{ open: boolean; renewal: Renewal | null }>({
    open: false, renewal: null,
  });
  const [actionSaving, setActionSaving] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RenewalFormData>({
    resolver: zodResolver(renewalSchema),
  });

  const fetchRenewals = React.useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await getRenewals({
        page,
        pageSize,
        search: search || undefined,
        status: (statusFilter as RenewalStatus) || undefined,
      });
      setRenewals(res.data.items);
      setTotal(res.data.total);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, search, statusFilter]);

  React.useEffect(() => {
    fetchRenewals();
  }, [fetchRenewals]);

  const openCreate = () => {
    reset({ enrollmentId: "", newEndDate: "", fee: "0" });
    setModalOpen(true);
  };

  const onSubmit = async (data: RenewalFormData) => {
    setSaving(true);
    try {
      await createRenewal({
        enrollmentId: data.enrollmentId,
        newEndDate: data.newEndDate,
        fee: Number(data.fee),
      });
      toast.success("Renewal request created");
      setModalOpen(false);
      await fetchRenewals();
    } catch {
      toast.error("Failed to create renewal request");
    } finally {
      setSaving(false);
    }
  };

  const handleApprove = async () => {
    const r = approveConfirm.renewal;
    if (!r) return;
    setActionSaving(true);
    try {
      await approveRenewal(r.id);
      toast.success("Renewal approved");
      setApproveConfirm({ open: false, renewal: null });
      await fetchRenewals();
    } catch {
      toast.error("Failed to approve renewal");
    } finally {
      setActionSaving(false);
    }
  };

  const handleReject = async () => {
    const r = rejectConfirm.renewal;
    if (!r) return;
    setActionSaving(true);
    try {
      await rejectRenewal(r.id);
      toast.success("Renewal rejected");
      setRejectConfirm({ open: false, renewal: null });
      await fetchRenewals();
    } catch {
      toast.error("Failed to reject renewal");
    } finally {
      setActionSaving(false);
    }
  };

  const handleCancel = async () => {
    const r = cancelConfirm.renewal;
    if (!r) return;
    setActionSaving(true);
    try {
      await cancelRenewal(r.id);
      toast.success("Renewal cancelled");
      setCancelConfirm({ open: false, renewal: null });
      await fetchRenewals();
    } catch {
      toast.error("Failed to cancel renewal");
    } finally {
      setActionSaving(false);
    }
  };

  const columns: Column<Renewal>[] = [
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
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(`./renewals/${row.id}`)}
          >
            <ExternalLink size={14} />
          </Button>
          {row.status === "pending" && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setApproveConfirm({ open: true, renewal: row })}
              >
                <CheckCircle2 size={14} className="text-success" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setRejectConfirm({ open: true, renewal: row })}
              >
                <XCircle size={14} className="text-danger" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCancelConfirm({ open: true, renewal: row })}
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
      title="Renewals"
      subtitle="Manage enrollment renewal requests"
      actions={
        <Button leftIcon={<Plus size={16} />} onClick={openCreate}>
          New Renewal
        </Button>
      }
      >
      {error && (
        <Alert type="danger" dismissible onDismiss={() => setError(false)} className="mb-4">
          Failed to load renewals.{' '}
          <button onClick={fetchRenewals} className="underline font-semibold">Retry</button>
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
          <Input label="Enrollment ID" required error={errors.enrollmentId?.message} {...register("enrollmentId")} />
          <Input label="New End Date" type="date" required error={errors.newEndDate?.message} {...register("newEndDate")} />
          <Input label="Fee" type="number" required error={errors.fee?.message} {...register("fee")} />
        </div>
      </Modal>

      <ConfirmModal
        open={approveConfirm.open}
        onClose={() => setApproveConfirm({ open: false, renewal: null })}
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
        onClose={() => setRejectConfirm({ open: false, renewal: null })}
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
        onClose={() => setCancelConfirm({ open: false, renewal: null })}
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
