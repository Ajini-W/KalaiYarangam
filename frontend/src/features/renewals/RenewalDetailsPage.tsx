"use client";

import * as React from "react";
import { CheckCircle2, XCircle, Ban, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ConfirmModal } from "@/components/ui/Modal";
import { Skeleton } from "@/components/ui/Skeleton";
import { ErrorState } from "@/components/ui/EmptyState";
import { RenewalStatusBadge } from "@/features/enrollments/StatusBadge";
import {
  getRenewal,
  approveRenewal,
  rejectRenewal,
  cancelRenewal,
  type Renewal,
} from "@/services/renewals";

export default function RenewalDetailsPage({ id }: { id: string }) {
  const router = useRouter();
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);
  const [renewal, setRenewal] = React.useState<Renewal | null>(null);

  const [actionConfirm, setActionConfirm] = React.useState<{
    open: boolean;
    action: "approve" | "reject" | "cancel" | null;
  }>({ open: false, action: null });
  const [actionSaving, setActionSaving] = React.useState(false);

  const fetchRenewal = React.useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await getRenewal(id);
      setRenewal(res.data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [id]);

  React.useEffect(() => {
    fetchRenewal();
  }, [fetchRenewal]);

  const handleAction = async () => {
    if (!renewal || !actionConfirm.action) return;
    setActionSaving(true);
    try {
      switch (actionConfirm.action) {
        case "approve":
          await approveRenewal(renewal.id);
          toast.success("Renewal approved");
          break;
        case "reject":
          await rejectRenewal(renewal.id);
          toast.success("Renewal rejected");
          break;
        case "cancel":
          await cancelRenewal(renewal.id);
          toast.success("Renewal cancelled");
          break;
      }
      setActionConfirm({ open: false, action: null });
      await fetchRenewal();
    } catch {
      toast.error(`Failed to ${actionConfirm.action} renewal`);
    } finally {
      setActionSaving(false);
    }
  };

  if (error) {
    return (
      <PageContainer
        title="Renewal Details"
        back={() => router.push("../renewals")}
      >
        <ErrorState
          code={500}
          action={{ label: "Retry", onClick: fetchRenewal }}
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title="Renewal Details"
      back={() => router.push("../renewals")}
    >
      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      ) : renewal ? (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-lg font-semibold">{renewal.studentName}</h2>
            <RenewalStatusBadge status={renewal.status} />
          </div>

          {renewal.status === "pending" && (
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
                <CardTitle>Course</CardTitle>
              </CardHeader>
              <CardBody>
                <p className="text-sm text-text-primary">{renewal.courseName}</p>
              </CardBody>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Batch</CardTitle>
              </CardHeader>
              <CardBody>
                <p className="text-sm text-text-primary">{renewal.batchName}</p>
              </CardBody>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Fee</CardTitle>
              </CardHeader>
              <CardBody>
                <p className="text-lg font-semibold text-text-primary">
                  ${renewal.fee.toLocaleString()}
                </p>
              </CardBody>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Previous End Date</CardTitle>
              </CardHeader>
              <CardBody>
                <p className="text-sm text-text-primary">
                  {new Date(renewal.previousEndDate).toLocaleDateString()}
                </p>
              </CardBody>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>New End Date</CardTitle>
              </CardHeader>
              <CardBody>
                <p className="text-sm text-text-primary">
                  {new Date(renewal.newEndDate).toLocaleDateString()}
                </p>
              </CardBody>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Student</CardTitle>
              </CardHeader>
              <CardBody>
                <p className="text-sm text-text-primary">{renewal.studentName}</p>
              </CardBody>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Timeline</CardTitle>
            </CardHeader>
            <CardBody>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-text-secondary">Requested</span>
                  <span>{new Date(renewal.requestedAt).toLocaleString()}</span>
                </div>
                {renewal.approvedAt && (
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Approved</span>
                    <span>{new Date(renewal.approvedAt).toLocaleString()}</span>
                  </div>
                )}
                {renewal.rejectedAt && (
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Rejected</span>
                    <span>{new Date(renewal.rejectedAt).toLocaleString()}</span>
                  </div>
                )}
              </div>
            </CardBody>
          </Card>

          <ConfirmModal
            open={actionConfirm.open}
            onClose={() => setActionConfirm({ open: false, action: null })}
            onConfirm={handleAction}
            title={`${actionConfirm.action ? actionConfirm.action.charAt(0).toUpperCase() + actionConfirm.action.slice(1) : ""} Renewal`}
            description={`Are you sure you want to ${actionConfirm.action ?? ""} this renewal request for ${renewal.studentName}?`}
            intent={actionConfirm.action === "approve" ? "success" : actionConfirm.action === "reject" ? "danger" : "warning"}
            confirmLabel={actionConfirm.action ? actionConfirm.action.charAt(0).toUpperCase() + actionConfirm.action.slice(1) : "Confirm"}
            loading={actionSaving}
          />
        </div>
      ) : null}
    </PageContainer>
  );
}
