"use client";

import * as React from "react";
import {
  Clock, CheckCircle2, XCircle, Shield, RefreshCw,
  Building2, MapPin, Calendar, AlertTriangle,
} from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import {
  getMyAccessRequests,
  type AccessRequest,
} from "@/services/onboarding";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const STATUS_CONFIG: Record<string, { variant: "success" | "warning" | "danger" | "info" | "default"; icon: React.ElementType; label: string }> = {
  PENDING: { variant: "warning", icon: Clock, label: "Awaiting Review" },
  APPROVED: { variant: "success", icon: CheckCircle2, label: "Approved" },
  REJECTED: { variant: "danger", icon: XCircle, label: "Not Approved" },
  BLOCKED: { variant: "danger", icon: Shield, label: "Blocked" },
};

export default function MyRequestPage() {
  const [requests, setRequests] = React.useState<AccessRequest[]>([]);
  const [loading, setLoading] = React.useState(true);
  const router = useRouter();

  const fetchData = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await getMyAccessRequests();
      setRequests(res.data ?? []);
    } catch {
      toast.error("Failed to load your requests");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => { fetchData(); }, [fetchData]);

  const latestRequest = requests[0] ?? null;

  return (
    <PageContainer title="My Request Status" subtitle="Track your access requests to organizations.">
      {loading ? (
        <div className="flex justify-center py-12"><Spinner size="lg" /></div>
      ) : (
        <>
          {/* Status Overview */}
          {latestRequest && (
            <Card className="mb-6">
              <CardBody>
                <div className="flex items-start gap-4">
                  {(() => {
                    const cfg = STATUS_CONFIG[latestRequest.status] ?? STATUS_CONFIG.PENDING;
                    const Icon = cfg.icon;
                    return (
                      <>
                        <div className={`flex h-12 w-12 items-center justify-center rounded-full shrink-0 ${
                          latestRequest.status === "APPROVED" ? "bg-success/10" :
                          latestRequest.status === "REJECTED" ? "bg-danger/10" :
                          latestRequest.status === "BLOCKED" ? "bg-danger/10" :
                          "bg-warning/10"
                        }`}>
                          <Icon size={24} className={
                            latestRequest.status === "APPROVED" ? "text-success" :
                            latestRequest.status === "REJECTED" ? "text-danger" :
                            latestRequest.status === "BLOCKED" ? "text-danger" :
                            "text-warning"
                          } />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-semibold text-text-primary">{cfg.label}</h3>
                            <Badge variant={cfg.variant} size="sm">{latestRequest.status}</Badge>
                          </div>
                          <p className="text-sm text-text-secondary">
                            {latestRequest.status === "PENDING" &&
                              `Your request to join ${latestRequest.tenant.name} is being reviewed. You'll be notified once a decision is made.`}
                            {latestRequest.status === "APPROVED" &&
                              `Welcome to ${latestRequest.tenant.name}! Your access has been granted.`}
                            {latestRequest.status === "REJECTED" &&
                              `Your request to join ${latestRequest.tenant.name} was not approved.${
                                latestRequest.rejectionReason ? ` Reason: ${latestRequest.rejectionReason}` : ""
                              }`}
                            {latestRequest.status === "BLOCKED" &&
                              `Your access to ${latestRequest.tenant.name} has been revoked.`}
                          </p>
                          {latestRequest.rejectionReason && (
                            <div className="mt-3 p-3 rounded-[var(--radius-sm)] bg-danger/5 border border-danger/20">
                              <div className="flex items-center gap-2 mb-1">
                                <AlertTriangle size={14} className="text-danger" />
                                <span className="text-xs font-semibold text-danger">Rejection Reason</span>
                              </div>
                              <p className="text-sm text-text-secondary">{latestRequest.rejectionReason}</p>
                            </div>
                          )}
                          {latestRequest.status === "PENDING" && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="mt-3"
                              onClick={() => router.push("/onboarding/tenant-search")}
                            >
                              Request to Another Organization
                            </Button>
                          )}
                          {latestRequest.status === "REJECTED" && (
                            <Button
                              variant="primary"
                              size="sm"
                              className="mt-3"
                              onClick={() => router.push("/onboarding/tenant-search")}
                            >
                              Find Another Organization
                            </Button>
                          )}
                        </div>
                      </>
                    );
                  })()}
                </div>
              </CardBody>
            </Card>
          )}

          {/* Request History */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Request History</CardTitle>
                <Button variant="ghost" size="sm" onClick={fetchData} leftIcon={<RefreshCw size={14} />}>Refresh</Button>
              </div>
            </CardHeader>
            <CardBody className="pt-0">
              {requests.length === 0 ? (
                <div className="text-center py-8">
                  <Building2 size={40} className="mx-auto text-text-secondary/30 mb-3" />
                  <p className="text-sm text-text-secondary">No access requests yet.</p>
                  <Button
                    variant="primary"
                    size="sm"
                    className="mt-3"
                    onClick={() => router.push("/onboarding/tenant-search")}
                  >
                    Search Organizations
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {requests.map((req) => {
                    const cfg = STATUS_CONFIG[req.status] ?? STATUS_CONFIG.PENDING;
                    const Icon = cfg.icon;
                    return (
                      <div
                        key={req.id}
                        className="flex items-center gap-4 p-4 rounded-[var(--radius-sm)] border border-border hover:bg-muted/30 transition-colors"
                      >
                        <div className={`flex h-10 w-10 items-center justify-center rounded-full shrink-0 ${
                          req.status === "APPROVED" ? "bg-success/10" :
                          req.status === "REJECTED" ? "bg-danger/10" :
                          req.status === "BLOCKED" ? "bg-danger/10" :
                          "bg-warning/10"
                        }`}>
                          <Icon size={18} className={
                            req.status === "APPROVED" ? "text-success" :
                            req.status === "REJECTED" ? "text-danger" :
                            req.status === "BLOCKED" ? "text-danger" :
                            "text-warning"
                          } />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <p className="text-sm font-medium text-text-primary truncate">{req.tenant.name}</p>
                            <Badge variant={cfg.variant} size="sm">{cfg.label}</Badge>
                          </div>
                          <p className="text-xs text-text-secondary">
                            Role: {req.role} &middot; Requested {new Date(req.createdAt).toLocaleDateString()}
                          </p>
                          {req.branch && (
                            <p className="text-xs text-text-secondary flex items-center gap-1 mt-0.5">
                              <MapPin size={10} /> {req.branch.name}
                            </p>
                          )}
                          {req.rejectionReason && (
                            <p className="text-xs text-danger mt-1 flex items-center gap-1">
                              <AlertTriangle size={10} /> {req.rejectionReason}
                            </p>
                          )}
                          {req.reviewer && (
                            <p className="text-xs text-text-secondary mt-0.5">
                              Reviewed by {req.reviewer.name}
                            </p>
                          )}
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-xs text-text-secondary flex items-center gap-1">
                            <Calendar size={10} />
                            {new Date(req.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardBody>
          </Card>
        </>
      )}
    </PageContainer>
  );
}
