"use client";

import * as React from "react";
import {
  UserCheck, UserX, Clock, CheckCircle2, XCircle, AlertTriangle,
  RefreshCw, Filter, Eye, MessageSquare, Shield,
} from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/ui/Card";
import { Table, type Column } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { Spinner } from "@/components/ui/Spinner";
import {
  listAccessRequests,
  approveAccessRequest,
  rejectAccessRequest,
  type AccessRequest,
} from "@/services/onboarding";
import { toast } from "sonner";

const STATUS_CONFIG: Record<string, { variant: "success" | "warning" | "danger" | "info" | "default"; icon: React.ElementType }> = {
  PENDING: { variant: "warning", icon: Clock },
  APPROVED: { variant: "success", icon: CheckCircle2 },
  REJECTED: { variant: "danger", icon: XCircle },
  BLOCKED: { variant: "danger", icon: Shield },
};

export default function AccessRequestsPage({ rolePrefix }: { rolePrefix: string }) {
  const [requests, setRequests] = React.useState<AccessRequest[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [statusFilter, setStatusFilter] = React.useState("");
  const [actionLoading, setActionLoading] = React.useState<string | null>(null);
  const [detailModal, setDetailModal] = React.useState<AccessRequest | null>(null);
  const [rejectModal, setRejectModal] = React.useState<AccessRequest | null>(null);
  const [rejectReason, setRejectReason] = React.useState("");

  const fetchData = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await listAccessRequests(statusFilter || undefined);
      setRequests(res.data ?? []);
    } catch {
      toast.error("Failed to load access requests");
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  React.useEffect(() => { fetchData(); }, [fetchData]);

  const handleApprove = async (req: AccessRequest) => {
    setActionLoading(req.id);
    try {
      await approveAccessRequest({ requestId: req.id });
      toast.success(`${req.user.name} has been approved`);
      fetchData();
    } catch {
      toast.error("Failed to approve request");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async () => {
    if (!rejectModal) return;
    setActionLoading(rejectModal.id);
    try {
      await rejectAccessRequest({ requestId: rejectModal.id, reason: rejectReason || undefined });
      toast.success(`${rejectModal.user.name}'s request has been rejected`);
      setRejectModal(null);
      setRejectReason("");
      fetchData();
    } catch {
      toast.error("Failed to reject request");
    } finally {
      setActionLoading(null);
    }
  };

  const pendingCount = requests.filter((r) => r.status === "PENDING").length;
  const approvedCount = requests.filter((r) => r.status === "APPROVED").length;
  const rejectedCount = requests.filter((r) => r.status === "REJECTED").length;

  const columns: Column<AccessRequest>[] = [
    {
      key: "user",
      header: "Requester",
      render: (r) => (
        <div>
          <p className="font-medium text-text-primary">{r.user.name}</p>
          <p className="text-xs text-text-secondary">{r.user.email}</p>
          {r.user.phone && <p className="text-xs text-text-secondary">{r.user.phone}</p>}
        </div>
      ),
    },
    {
      key: "role",
      header: "Requested Role",
      render: (r) => <Badge variant="info">{r.role}</Badge>,
    },
    {
      key: "skills",
      header: "Skills",
      render: (r) => r.skills.length > 0 ? (
        <div className="flex flex-wrap gap-1">
          {r.skills.slice(0, 3).map((s) => <Badge key={s} variant="outline" size="sm">{s}</Badge>)}
          {r.skills.length > 3 && <Badge variant="outline" size="sm">+{r.skills.length - 3}</Badge>}
        </div>
      ) : <span className="text-text-secondary text-sm">—</span>,
    },
    {
      key: "status",
      header: "Status",
      render: (r) => {
        const cfg = STATUS_CONFIG[r.status] ?? STATUS_CONFIG.PENDING;
        const Icon = cfg.icon;
        return (
          <Badge variant={cfg.variant} className="flex items-center gap-1 w-fit">
            <Icon size={12} /> {r.status}
          </Badge>
        );
      },
    },
    {
      key: "notes",
      header: "Notes",
      render: (r) => r.notes ? (
        <p className="text-sm text-text-secondary max-w-[200px] truncate">{r.notes}</p>
      ) : "—",
    },
    {
      key: "createdAt",
      header: "Requested",
      render: (r) => <span className="text-sm text-text-secondary">{new Date(r.createdAt).toLocaleDateString()}</span>,
    },
    {
      key: "actions",
      header: "",
      className: "w-24",
      render: (r) => (
        <div className="flex items-center gap-1">
          <button onClick={() => setDetailModal(r)} className="p-1 text-text-secondary hover:text-text-primary" title="View details">
            <Eye size={16} />
          </button>
          {r.status === "PENDING" && (
            <>
              <button
                onClick={() => handleApprove(r)}
                disabled={actionLoading === r.id}
                className="p-1 text-success hover:text-success/80 disabled:opacity-50"
                title="Approve"
              >
                <UserCheck size={16} />
              </button>
              <button
                onClick={() => { setRejectModal(r); setRejectReason(""); }}
                disabled={actionLoading === r.id}
                className="p-1 text-danger hover:text-danger/80 disabled:opacity-50"
                title="Reject"
              >
                <UserX size={16} />
              </button>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <PageContainer title="Access Requests" subtitle="Review and manage user access requests for your organization.">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <Card>
          <CardBody className="text-center py-4">
            <p className="text-2xl font-bold text-warning">{pendingCount}</p>
            <p className="text-xs text-text-secondary mt-1">Pending</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center py-4">
            <p className="text-2xl font-bold text-success">{approvedCount}</p>
            <p className="text-xs text-text-secondary mt-1">Approved</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center py-4">
            <p className="text-2xl font-bold text-danger">{rejectedCount}</p>
            <p className="text-xs text-text-secondary mt-1">Rejected</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center py-4">
            <p className="text-2xl font-bold text-text-primary">{requests.length}</p>
            <p className="text-xs text-text-secondary mt-1">Total</p>
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Requests</CardTitle>
            <Button variant="ghost" size="sm" onClick={fetchData} leftIcon={<RefreshCw size={14} />}>Refresh</Button>
          </div>
        </CardHeader>
        <CardBody className="pt-0">
          <div className="flex items-center gap-3 mb-4">
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={[
                { value: "", label: "All Status" },
                { value: "PENDING", label: "Pending" },
                { value: "APPROVED", label: "Approved" },
                { value: "REJECTED", label: "Rejected" },
                { value: "BLOCKED", label: "Blocked" },
              ]}
              className="w-40"
            />
          </div>
          <Table columns={columns} data={requests} loading={loading}
            emptyTitle="No access requests"
            emptyDescription="Access requests from users will appear here." />
        </CardBody>
      </Card>

      {/* Detail Modal */}
      {detailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setDetailModal(null)}>
          <div className="bg-surface rounded-[var(--radius-md)] shadow-lg max-w-lg w-full mx-4 p-6 max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-text-primary">Access Request Details</h3>
              <button onClick={() => setDetailModal(null)} className="text-text-secondary hover:text-text-primary">&times;</button>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-text-secondary">Name</span><span className="font-medium">{detailModal.user.name}</span></div>
              <div className="flex justify-between"><span className="text-text-secondary">Email</span><span className="font-medium">{detailModal.user.email}</span></div>
              {detailModal.user.phone && <div className="flex justify-between"><span className="text-text-secondary">Phone</span><span className="font-medium">{detailModal.user.phone}</span></div>}
              <div className="flex justify-between"><span className="text-text-secondary">Requested Role</span><Badge variant="info">{detailModal.role}</Badge></div>
              <div className="flex justify-between"><span className="text-text-secondary">Status</span><Badge variant={STATUS_CONFIG[detailModal.status]?.variant ?? "default"}>{detailModal.status}</Badge></div>
              {detailModal.skills.length > 0 && (
                <div><span className="text-text-secondary">Skills</span>
                  <div className="flex flex-wrap gap-1 mt-1">{detailModal.skills.map((s) => <Badge key={s} variant="outline" size="sm">{s}</Badge>)}</div>
                </div>
              )}
              {detailModal.notes && <div><span className="text-text-secondary">Notes</span><p className="mt-1">{detailModal.notes}</p></div>}
              {detailModal.rejectionReason && <div><span className="text-text-secondary">Rejection Reason</span><p className="mt-1 text-danger">{detailModal.rejectionReason}</p></div>}
              {detailModal.reviewer && <div className="flex justify-between"><span className="text-text-secondary">Reviewed By</span><span className="font-medium">{detailModal.reviewer.name}</span></div>}
              <div className="flex justify-between"><span className="text-text-secondary">Requested At</span><span>{new Date(detailModal.createdAt).toLocaleString()}</span></div>
            </div>
            {detailModal.status === "PENDING" && (
              <div className="flex gap-2 mt-6">
                <Button variant="danger" size="sm" onClick={() => { setRejectModal(detailModal); setDetailModal(null); setRejectReason(""); }}>Reject</Button>
                <Button variant="primary" size="sm" onClick={() => { handleApprove(detailModal); setDetailModal(null); }}>Approve</Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {rejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setRejectModal(null)}>
          <div className="bg-surface rounded-[var(--radius-md)] shadow-lg max-w-md w-full mx-4 p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-text-primary mb-2">Reject Access Request</h3>
            <p className="text-sm text-text-secondary mb-4">Rejecting {rejectModal.user.name}&apos;s request to join as {rejectModal.role}.</p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Reason for rejection (optional)"
              className="w-full h-24 px-3 py-2 text-sm border border-border rounded-[var(--radius-sm)] bg-surface text-text-primary resize-none"
            />
            <div className="flex gap-2 mt-4 justify-end">
              <Button variant="ghost" size="sm" onClick={() => setRejectModal(null)}>Cancel</Button>
              <Button variant="danger" size="sm" onClick={handleReject} disabled={actionLoading === rejectModal.id}>
                {actionLoading === rejectModal.id ? "Rejecting…" : "Reject Request"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </PageContainer>
  );
}
