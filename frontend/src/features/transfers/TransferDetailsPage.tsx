"use client";

import * as React from "react";
import { CheckCircle2, XCircle, Ban, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ConfirmModal } from "@/components/ui/Modal";
import { Skeleton } from "@/components/ui/Skeleton";
import { ErrorState } from "@/components/ui/EmptyState";
import { TransferStatusBadge } from "@/features/enrollments/StatusBadge";
import {
  getTransfer,
  approveTransfer,
  rejectTransfer,
  cancelTransfer,
  type Transfer,
} from "@/services/transfers";

export default function TransferDetailsPage({ id }: { id: string }) {
  const router = useRouter();
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);
  const [transfer, setTransfer] = React.useState<Transfer | null>(null);

  const [actionConfirm, setActionConfirm] = React.useState<{
    open: boolean;
    action: "approve" | "reject" | "cancel" | null;
  }>({ open: false, action: null });
  const [actionSaving, setActionSaving] = React.useState(false);

  const fetchTransfer = React.useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await getTransfer(id);
      setTransfer(res.data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [id]);

  React.useEffect(() => {
    fetchTransfer();
  }, [fetchTransfer]);

  const handleAction = async () => {
    if (!transfer || !actionConfirm.action) return;
    setActionSaving(true);
    try {
      switch (actionConfirm.action) {
        case "approve":
          await approveTransfer(transfer.id);
          toast.success("Transfer approved");
          break;
        case "reject":
          await rejectTransfer(transfer.id);
          toast.success("Transfer rejected");
          break;
        case "cancel":
          await cancelTransfer(transfer.id);
          toast.success("Transfer cancelled");
          break;
      }
      setActionConfirm({ open: false, action: null });
      await fetchTransfer();
    } catch {
      toast.error(`Failed to ${actionConfirm.action} transfer`);
    } finally {
      setActionSaving(false);
    }
  };

  const actionConfig: Record<string, { icon: React.ReactNode; variant: "primary" | "danger" | "outline"; label: string; intent: "success" | "danger" | "warning" }> = {
    approve: { icon: <CheckCircle2 size={14} />, variant: "primary", label: "Approve", intent: "success" },
    reject: { icon: <XCircle size={14} />, variant: "danger", label: "Reject", intent: "danger" },
    cancel: { icon: <Ban size={14} />, variant: "outline", label: "Cancel", intent: "warning" },
  };

  if (error) {
    return (
      <PageContainer
        title="Transfer Details"
        back={() => router.push("../transfers")}
      >
        <ErrorState
          code={500}
          action={{ label: "Retry", onClick: fetchTransfer }}
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title="Transfer Details"
      back={() => router.push("../transfers")}
    >
      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      ) : transfer ? (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-lg font-semibold">{transfer.studentName}</h2>
            <TransferStatusBadge status={transfer.status} />
          </div>

          {transfer.status === "pending" && (
            <div className="flex flex-wrap gap-2">
              <Button
                variant="primary"
                size="sm"
                leftIcon={<CheckCircle2 size={14} />}
                onClick={() => setActionConfirm({ open: true, action: "approve" })}
              >
                Approve
              </Button>
              <Button
                variant="danger"
                size="sm"
                leftIcon={<XCircle size={14} />}
                onClick={() => setActionConfirm({ open: true, action: "reject" })}
              >
                Reject
              </Button>
              <Button
                variant="outline"
                size="sm"
                leftIcon={<Ban size={14} />}
                onClick={() => setActionConfirm({ open: true, action: "cancel" })}
              >
                Cancel Request
              </Button>
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>From Batch</CardTitle>
              </CardHeader>
              <CardBody>
                <p className="text-sm text-text-primary">{transfer.fromBatchName}</p>
              </CardBody>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>To Batch</CardTitle>
              </CardHeader>
              <CardBody>
                <p className="text-sm text-text-primary">{transfer.toBatchName}</p>
              </CardBody>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Student</CardTitle>
              </CardHeader>
              <CardBody>
                <p className="text-sm text-text-primary">{transfer.studentName}</p>
              </CardBody>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Reason</CardTitle>
            </CardHeader>
            <CardBody>
              <p className="text-sm text-text-primary">{transfer.reason}</p>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Timeline</CardTitle>
            </CardHeader>
            <CardBody>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-text-secondary">Requested</span>
                  <span>{new Date(transfer.requestedAt).toLocaleString()}</span>
                </div>
                {transfer.approvedAt && (
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Approved</span>
                    <span>{new Date(transfer.approvedAt).toLocaleString()}</span>
                  </div>
                )}
                {transfer.rejectedAt && (
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Rejected</span>
                    <span>{new Date(transfer.rejectedAt).toLocaleString()}</span>
                  </div>
                )}
              </div>
            </CardBody>
          </Card>

          <ConfirmModal
            open={actionConfirm.open}
            onClose={() => setActionConfirm({ open: false, action: null })}
            onConfirm={handleAction}
            title={`${actionConfirm.action ? actionConfirm.action.charAt(0).toUpperCase() + actionConfirm.action.slice(1) : ""} Transfer`}
            description={`Are you sure you want to ${actionConfirm.action ?? ""} this transfer request for ${transfer.studentName}?`}
            intent={actionConfirm.action ? actionConfig[actionConfirm.action].intent : "info"}
            confirmLabel={actionConfirm.action ? actionConfirm.action.charAt(0).toUpperCase() + actionConfirm.action.slice(1) : "Confirm"}
            loading={actionSaving}
          />
        </div>
      ) : null}
    </PageContainer>
  );
}
