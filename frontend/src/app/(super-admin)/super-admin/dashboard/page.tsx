"use client";

import * as React from "react";
import { Users, Building2, CreditCard, BarChart3, Settings, ShieldAlert, Activity, AlertTriangle } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { StatCard } from "@/components/ui/Card";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Spinner } from "@/components/ui/Spinner";
import { useAuthStore } from "@/store/auth.store";
import { securityService, type SecurityStats } from "@/services/security.service";
import { useRouter } from "next/navigation";

export default function SuperAdminDashboard() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const [stats, setStats] = React.useState<SecurityStats | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    securityService.getStats()
      .then(setStats)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (!user) return null;

  const initials = user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <PageContainer>
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-2">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground text-lg font-bold">{initials}</span>
          <div>
            <h1 className="text-2xl font-bold text-text-primary">Welcome, {user.name.split(" ")[0]}!</h1>
            <p className="text-sm text-text-secondary mt-0.5">Super Admin &middot; Here&apos;s your platform overview.</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20"><Spinner size="xl" /></div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard title="Total Users" value={stats?.totalUsers ?? "—"} icon={<Users size={20} />} />
            <StatCard title="Total Tenants" value={stats?.totalTenants ?? "—"} icon={<Building2 size={20} />} />
            <StatCard title="Active Subscriptions" value={stats?.activeSubscriptions ?? "—"} icon={<CreditCard size={20} />} />
            <StatCard title="Pending Requests" value={stats?.pendingAccessRequests ?? "—"} icon={<ShieldAlert size={20} />} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard title="Trial Subscriptions" value={stats?.trialSubscriptions ?? "—"} icon={<Activity size={20} />} />
            <StatCard title="Active Sessions" value={stats?.activeSessions ?? "—"} icon={<Activity size={20} />} />
            <StatCard title="Failed Logins (24h)" value={stats?.failedLoginsLast24h ?? "—"} icon={<AlertTriangle size={20} />} />
            <StatCard title="Critical Events (7d)" value={stats?.criticalEventsLast7d ?? "—"} icon={<AlertTriangle size={20} />} />
          </div>

          {stats?.tenantsByStatus && Object.keys(stats.tenantsByStatus).length > 0 && (
            <Card className="mb-8">
              <CardHeader><CardTitle>Tenants by Status</CardTitle></CardHeader>
              <CardBody className="pt-0">
                <div className="flex flex-wrap gap-3">
                  {Object.entries(stats.tenantsByStatus).map(([status, count]) => (
                    <div key={status} className="flex items-center gap-2 rounded-[var(--radius-md)] bg-surface-raised px-4 py-2">
                      <Badge variant={status === "ACTIVE" ? "success" : status === "TRIAL" ? "info" : status === "SUSPENDED" ? "danger" : "warning"}>
                        {status}
                      </Badge>
                      <span className="font-bold text-text-primary">{count}</span>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          )}

          <Card>
            <CardHeader><CardTitle>Quick Actions</CardTitle></CardHeader>
            <CardBody className="pt-0">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {[
                  { label: "Users", icon: <Users size={18} />, href: "/super-admin/users" },
                  { label: "Tenants", icon: <Building2 size={18} />, href: "/super-admin/tenants" },
                  { label: "Sessions", icon: <Activity size={18} />, href: "/super-admin/sessions" },
                  { label: "Security", icon: <ShieldAlert size={18} />, href: "/super-admin/security-events" },
                  { label: "Audit Logs", icon: <BarChart3 size={18} />, href: "/super-admin/audit-logs" },
                  { label: "Activity Logs", icon: <Activity size={18} />, href: "/super-admin/activity-logs" },
                ].map((a) => (
                  <Button key={a.label} variant="outline" className="justify-start gap-2.5 h-auto py-3 px-3" onClick={() => router.push(a.href)}>
                    <span className="shrink-0">{a.icon}</span>
                    {a.label}
                  </Button>
                ))}
              </div>
            </CardBody>
          </Card>
        </>
      )}
    </PageContainer>
  );
}
