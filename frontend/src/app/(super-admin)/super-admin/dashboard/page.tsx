"use client";

import * as React from "react";
import {
  Users, Building2, CreditCard, BarChart3, ShieldAlert, Activity, AlertTriangle,
  Shield, Monitor, Smartphone, Tablet, Eye, Key,
} from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { StatCard } from "@/components/ui/Card";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Spinner } from "@/components/ui/Spinner";
import { useAuthStore } from "@/store/auth.store";
import { securityService, type SecurityStats } from "@/services/security.service";
import { useRouter } from "next/navigation";

const SEVERITY_BADGE: Record<string, "info" | "warning" | "danger"> = {
  INFO: "info",
  WARNING: "warning",
  ERROR: "danger",
  CRITICAL: "danger",
};

const ACTION_BADGE: Record<string, "info" | "success" | "danger" | "warning" | "default"> = {
  CREATE: "success",
  UPDATE: "info",
  DELETE: "danger",
  LOGIN: "info",
  LOGOUT: "warning",
  SESSION_REVOKE: "danger",
  PASSWORD_CHANGE: "warning",
  ROLE_CHANGE: "warning",
};

function RecentList<T extends { id: string }>({
  items,
  renderItem,
}: {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
}) {
  if (items.length === 0) {
    return <p className="text-sm text-text-secondary py-4 text-center">No recent activity</p>;
  }
  return (
    <div className="divide-y divide-border">
      {items.map((item) => (
        <div key={item.id} className="py-2.5 first:pt-0 last:pb-0">
          {renderItem(item)}
        </div>
      ))}
    </div>
  );
}

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
            <p className="text-sm text-text-secondary mt-0.5">Super Admin &middot; Here&apos;s your platform security overview.</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20"><Spinner size="xl" /></div>
      ) : (
        <>
          {/* Primary Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard title="Total Users" value={stats?.totalUsers ?? "—"} icon={<Users size={20} />} />
            <StatCard title="Total Tenants" value={stats?.totalTenants ?? "—"} icon={<Building2 size={20} />} />
            <StatCard title="Active Subscriptions" value={stats?.activeSubscriptions ?? "—"} icon={<CreditCard size={20} />} />
            <StatCard title="Pending Requests" value={stats?.pendingAccessRequests ?? "—"} icon={<ShieldAlert size={20} />} />
          </div>

          {/* Security Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard
              title="Active Sessions"
              value={stats?.activeSessions ?? "—"}
              icon={<Activity size={20} />}
              delta={stats?.sessionsByDeviceType ? `${Object.keys(stats.sessionsByDeviceType).length} device types` : undefined}
              deltaType="neutral"
            />
            <StatCard
              title="Failed Logins (24h)"
              value={stats?.failedLoginsLast24h ?? "—"}
              icon={<AlertTriangle size={20} />}
              deltaType={stats && stats.failedLoginsLast24h > 10 ? "decrease" : "neutral"}
            />
            <StatCard
              title="Suspicious Logins (7d)"
              value={stats?.suspiciousLoginsLast7d ?? "—"}
              icon={<Shield size={20} />}
              deltaType={stats && stats.suspiciousLoginsLast7d > 0 ? "decrease" : "neutral"}
            />
            <StatCard
              title="Critical Events (7d)"
              value={stats?.criticalEventsLast7d ?? "—"}
              icon={<AlertTriangle size={20} />}
              deltaType={stats && stats.criticalEventsLast7d > 0 ? "decrease" : "neutral"}
            />
          </div>

          {/* Login Trend & Session Devices */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            {stats?.loginTrend && (
              <Card>
                <CardHeader><CardTitle>Login Trend (30 days)</CardTitle></CardHeader>
                <CardBody className="pt-0">
                  <div className="flex items-center gap-6">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-text-secondary">Successful</span>
                        <span className="text-sm font-bold text-success">{stats.loginTrend.success.toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-success/10 rounded-full h-2.5">
                        <div className="bg-success h-2.5 rounded-full" style={{ width: `${Math.min(100, (stats.loginTrend.success / Math.max(1, stats.loginTrend.success + stats.loginTrend.failed)) * 100)}%` }} />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-text-secondary">Failed</span>
                        <span className="text-sm font-bold text-danger">{stats.loginTrend.failed.toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-danger/10 rounded-full h-2.5">
                        <div className="bg-danger h-2.5 rounded-full" style={{ width: `${Math.min(100, (stats.loginTrend.failed / Math.max(1, stats.loginTrend.success + stats.loginTrend.failed)) * 100)}%` }} />
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            )}

            {stats?.sessionsByDeviceType && Object.keys(stats.sessionsByDeviceType).length > 0 && (
              <Card>
                <CardHeader><CardTitle>Active Sessions by Device</CardTitle></CardHeader>
                <CardBody className="pt-0">
                  <div className="space-y-3">
                    {Object.entries(stats.sessionsByDeviceType).map(([type, count]) => {
                      const Icon = type === "DESKTOP" ? Monitor : type === "MOBILE" ? Smartphone : type === "TABLET" ? Tablet : Activity;
                      const total = Object.values(stats.sessionsByDeviceType!).reduce((a, b) => a + b, 0);
                      return (
                        <div key={type} className="flex items-center gap-3">
                          <Icon size={16} className="text-text-secondary shrink-0" />
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm capitalize">{type.toLowerCase()}</span>
                              <span className="text-sm font-medium">{count}</span>
                            </div>
                            <div className="w-full bg-surface-raised rounded-full h-1.5">
                              <div className="bg-primary h-1.5 rounded-full" style={{ width: `${(count / Math.max(1, total)) * 100}%` }} />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardBody>
              </Card>
            )}
          </div>

          {/* Tenants by Status */}
          {stats?.tenantsByStatus && Object.keys(stats.tenantsByStatus).length > 0 && (
            <Card className="mb-6">
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

          {/* Recent Activity Panels */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
            {/* Recent Security Events */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Recent Security Events</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => router.push("/super-admin/security-events")}>View All</Button>
                </div>
              </CardHeader>
              <CardBody className="pt-0">
                <RecentList items={stats?.recentSecurityEvents ?? []} renderItem={(e) => (
                  <div className="flex items-start gap-2">
                    <Badge variant={SEVERITY_BADGE[e.severity] ?? "info"} size="sm" className="shrink-0 mt-0.5">{e.severity}</Badge>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">{e.eventType}</p>
                      <p className="text-xs text-text-secondary truncate">{e.message}</p>
                      <p className="text-xs text-text-secondary mt-0.5">{new Date(e.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                )} />
              </CardBody>
            </Card>

            {/* Recent Audit Logs */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Recent Audit Logs</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => router.push("/super-admin/audit-logs")}>View All</Button>
                </div>
              </CardHeader>
              <CardBody className="pt-0">
                <RecentList items={stats?.recentAuditLogs ?? []} renderItem={(l) => (
                  <div className="flex items-start gap-2">
                    <Badge variant={ACTION_BADGE[l.action] ?? "default"} size="sm" className="shrink-0 mt-0.5">{l.action.replace(/_/g, " ")}</Badge>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">{l.entity}{l.entityId ? ` · ${l.entityId.slice(0, 8)}` : ""}</p>
                      <p className="text-xs text-text-secondary">{l.user?.name ?? "System"}</p>
                      <p className="text-xs text-text-secondary mt-0.5">{new Date(l.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                )} />
              </CardBody>
            </Card>

            {/* Recent Login Attempts */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Recent Logins</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => router.push("/super-admin/login-history")}>View All</Button>
                </div>
              </CardHeader>
              <CardBody className="pt-0">
                <RecentList items={stats?.recentLoginAttempts ?? []} renderItem={(l) => (
                  <div className="flex items-start gap-2">
                    {l.success
                      ? <Badge variant="success" size="sm" className="shrink-0 mt-0.5">OK</Badge>
                      : <Badge variant="danger" size="sm" className="shrink-0 mt-0.5">FAIL</Badge>
                    }
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">{l.user.name}</p>
                      <p className="text-xs text-text-secondary font-mono">{l.ipAddress ?? "—"}</p>
                      <p className="text-xs text-text-secondary mt-0.5">{new Date(l.loginAt).toLocaleString()}</p>
                    </div>
                  </div>
                )} />
              </CardBody>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="mb-6">
            <CardHeader><CardTitle>Quick Actions</CardTitle></CardHeader>
            <CardBody className="pt-0">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {[
                  { label: "Users", icon: <Users size={18} />, href: "/super-admin/users" },
                  { label: "Tenants", icon: <Building2 size={18} />, href: "/super-admin/tenants" },
                  { label: "Sessions", icon: <Activity size={18} />, href: "/super-admin/sessions" },
                  { label: "Security Events", icon: <ShieldAlert size={18} />, href: "/super-admin/security-events" },
                  { label: "Audit Logs", icon: <BarChart3 size={18} />, href: "/super-admin/audit-logs" },
                  { label: "Activity Logs", icon: <Activity size={18} />, href: "/super-admin/activity-logs" },
                  { label: "Login History", icon: <Eye size={18} />, href: "/super-admin/login-history" },
                  { label: "Roles & Permissions", icon: <Key size={18} />, href: "/super-admin/roles" },
                ].map((a) => (
                  <Button key={a.label} variant="outline" className="justify-start gap-2.5 h-auto py-3 px-3" onClick={() => router.push(a.href)}>
                    <span className="shrink-0">{a.icon}</span>
                    {a.label}
                  </Button>
                ))}
              </div>
            </CardBody>
          </Card>

          {/* Security Event Trend */}
          {stats?.securityEventTrend && Object.keys(stats.securityEventTrend).length > 0 && (
            <Card>
              <CardHeader><CardTitle>Security Events by Severity (30 days)</CardTitle></CardHeader>
              <CardBody className="pt-0">
                <div className="flex items-end gap-4 h-32">
                  {Object.entries(stats.securityEventTrend).map(([sev, count]) => {
                    const max = Math.max(...Object.values(stats.securityEventTrend!), 1);
                    const height = (count / max) * 100;
                    const colors: Record<string, string> = {
                      INFO: "bg-info",
                      WARNING: "bg-warning",
                      ERROR: "bg-danger",
                      CRITICAL: "bg-danger",
                    };
                    return (
                      <div key={sev} className="flex-1 flex flex-col items-center gap-1">
                        <span className="text-xs font-medium text-text-secondary">{count}</span>
                        <div className="w-full bg-surface-raised rounded-t" style={{ height: `${Math.max(4, height)}%` }}>
                          <div className={`w-full rounded-t ${colors[sev] ?? "bg-info"}`} style={{ height: "100%" }} />
                        </div>
                        <span className="text-xs text-text-secondary">{sev.toLowerCase()}</span>
                      </div>
                    );
                  })}
                </div>
              </CardBody>
            </Card>
          )}
        </>
      )}
    </PageContainer>
  );
}
