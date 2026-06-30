"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { Building2, Users, MapPin, CreditCard, Calendar, FileText } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardHeader, CardTitle, CardBody, StatCard } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Spinner } from "@/components/ui/Spinner";
import { rbacService, type TenantDetail } from "@/services/rbac.service";

const statusVariant: Record<string, "success" | "warning" | "danger" | "info" | "default"> = {
  ACTIVE: "success",
  TRIAL: "info",
  INACTIVE: "warning",
  SUSPENDED: "danger",
};

export default function TenantDetailPage() {
  const params = useParams();
  const router = useRouter();
  const tenantId = params.tenantId as string;
  const [tenant, setTenant] = React.useState<TenantDetail | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    rbacService.getTenant(tenantId)
      .then(setTenant)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [tenantId]);

  if (loading) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center py-20"><Spinner size="xl" /></div>
      </PageContainer>
    );
  }

  if (!tenant) {
    return (
      <PageContainer>
        <p className="text-text-secondary text-center py-20">Tenant not found.</p>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title={tenant.name}
      subtitle={`${tenant.industry} — ${tenant.status}`}
      back={() => router.push("/super-admin/tenants")}
    >
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Users" value={tenant.userCount} icon={<Users size={20} />} />
        <StatCard title="Branches" value={tenant.branchCount} icon={<Building2 size={20} />} />
        <StatCard title="Access Requests" value={tenant.accessRequestCount} icon={<FileText size={20} />} />
        <StatCard title="Status" value={tenant.status} icon={<Calendar size={20} />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Tenant Info</CardTitle></CardHeader>
          <CardBody className="space-y-3">
            <div className="flex justify-between">
              <span className="text-xs text-text-secondary uppercase tracking-wide">Name</span>
              <span className="text-sm font-medium">{tenant.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-text-secondary uppercase tracking-wide">Slug</span>
              <span className="text-sm font-mono">{tenant.slug}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-text-secondary uppercase tracking-wide">Industry</span>
              <Badge variant="brand">{tenant.industry}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-text-secondary uppercase tracking-wide">Status</span>
              <Badge variant={statusVariant[tenant.status] ?? "default"}>{tenant.status}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-text-secondary uppercase tracking-wide">Email</span>
              <span className="text-sm">{tenant.email ?? "—"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-text-secondary uppercase tracking-wide">Phone</span>
              <span className="text-sm">{tenant.phone ?? "—"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-text-secondary uppercase tracking-wide">Created</span>
              <span className="text-sm">{new Date(tenant.createdAt).toLocaleDateString()}</span>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader><CardTitle>Subscription</CardTitle></CardHeader>
          <CardBody className="space-y-3">
            {tenant.subscription ? (
              <>
                <div className="flex justify-between">
                  <span className="text-xs text-text-secondary uppercase tracking-wide">Plan</span>
                  <span className="text-sm font-medium">{tenant.subscription.plan?.name ?? "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-text-secondary uppercase tracking-wide">Status</span>
                  <Badge variant={statusVariant[tenant.subscription.status] ?? "default"}>{tenant.subscription.status}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-text-secondary uppercase tracking-wide">Start Date</span>
                  <span className="text-sm">{new Date(tenant.subscription.startDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-text-secondary uppercase tracking-wide">End Date</span>
                  <span className="text-sm">{new Date(tenant.subscription.endDate).toLocaleDateString()}</span>
                </div>
                {tenant.subscription.trialEndsAt && (
                  <div className="flex justify-between">
                    <span className="text-xs text-text-secondary uppercase tracking-wide">Trial Ends</span>
                    <span className="text-sm">{new Date(tenant.subscription.trialEndsAt).toLocaleDateString()}</span>
                  </div>
                )}

                {tenant.subscription.invoices.length > 0 && (
                  <div className="mt-4">
                    <p className="text-xs text-text-secondary uppercase tracking-wide mb-2">Recent Invoices</p>
                    <div className="space-y-1">
                      {tenant.subscription.invoices.map((inv) => (
                        <div key={inv.id} className="flex items-center justify-between text-sm">
                          <span className="font-mono text-xs text-text-secondary">{inv.invoiceNumber}</span>
                          <span>{inv.currency} {inv.totalAmount}</span>
                          <span className="text-xs text-text-secondary">{new Date(inv.createdAt).toLocaleDateString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <p className="text-sm text-text-secondary">No subscription data available.</p>
            )}
          </CardBody>
        </Card>

        {tenant.brand && (
          <Card>
            <CardHeader><CardTitle>Branding</CardTitle></CardHeader>
            <CardBody className="space-y-3">
              {tenant.brand.primaryColor && (
                <div className="flex items-center gap-3">
                  <div className="h-5 w-5 rounded-full border" style={{ backgroundColor: tenant.brand.primaryColor }} />
                  <span className="text-sm">{tenant.brand.primaryColor}</span>
                </div>
              )}
              {tenant.brand.secondaryColor && (
                <div className="flex items-center gap-3">
                  <div className="h-5 w-5 rounded-full border" style={{ backgroundColor: tenant.brand.secondaryColor }} />
                  <span className="text-sm">{tenant.brand.secondaryColor}</span>
                </div>
              )}
              {tenant.brand.tagline && <p className="text-sm text-text-secondary">{tenant.brand.tagline}</p>}
            </CardBody>
          </Card>
        )}
      </div>
    </PageContainer>
  );
}
