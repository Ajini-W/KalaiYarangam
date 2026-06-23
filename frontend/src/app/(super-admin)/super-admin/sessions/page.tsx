"use client";

import * as React from "react";
import { ShieldAlert, ShieldX, Search, RefreshCw } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/ui/Card";
import { Table, type Column } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Pagination } from "@/components/ui/Pagination";
import { SearchBar } from "@/components/ui/SearchBar";
import { Spinner } from "@/components/ui/Spinner";
import { securityService, type SessionItem, type SecurityStats } from "@/services/security.service";
import { toast } from "sonner";

export default function SessionsPage() {
  const [sessions, setSessions] = React.useState<SessionItem[]>([]);
  const [stats, setStats] = React.useState<SecurityStats | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [page, setPage] = React.useState(1);
  const [pageSize] = React.useState(15);
  const [total, setTotal] = React.useState(0);
  const [search, setSearch] = React.useState("");

  const fetch = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await securityService.listSessions({ page, pageSize, search: search || undefined });
      setSessions(res.data);
      setTotal(res.meta.total);
      const s = await securityService.getStats();
      setStats(s);
    } catch { /* ignore */ }
    finally { setLoading(false); }
  }, [page, pageSize, search]);

  React.useEffect(() => { fetch(); }, [fetch]);

  const handleRevoke = async (id: string) => {
    try {
      await securityService.revokeSession(id);
      toast.success("Session revoked");
      fetch();
    } catch { toast.error("Failed to revoke session"); }
  };

  const columns: Column<SessionItem>[] = [
    { key: "user", header: "User", render: (r) => <span className="font-medium">{r.user.name}</span> },
    { key: "user", header: "Email", render: (r) => <span className="text-text-secondary text-sm">{r.user.email}</span> },
    { key: "ipAddress", header: "IP Address", render: (r) => r.ipAddress || "—" },
    { key: "deviceInfo", header: "Device", render: (r) => r.deviceInfo || "—" },
    {
      key: "isActive",
      header: "Status",
      render: (r) => r.isActive ? <Badge variant="success">Active</Badge> : <Badge variant="danger">Revoked</Badge>,
    },
    { key: "lastActivity", header: "Last Activity", render: (r) => new Date(r.lastActivity).toLocaleString() },
    { key: "createdAt", header: "Created", render: (r) => new Date(r.createdAt).toLocaleDateString() },
    {
      key: "id",
      header: "",
      className: "w-12",
      render: (r) => r.isActive ? (
        <button onClick={() => handleRevoke(r.id)} className="text-danger hover:text-danger/80 p-1" title="Revoke session">
          <ShieldX size={16} />
        </button>
      ) : null,
    },
  ];

  const statCards = stats ? [
    { label: "Active Sessions", value: stats.activeSessions, color: "text-success" },
    { label: "Failed Logins (24h)", value: stats.failedLoginsLast24h, color: "text-warning" },
    { label: "Critical Events (7d)", value: stats.criticalEventsLast7d, color: "text-danger" },
    { label: "Total Audit Logs", value: stats.totalAuditLogs, color: "text-info" },
  ] : [];

  return (
    <PageContainer title="Active Sessions" subtitle="Monitor and manage active user sessions across the platform.">
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {statCards.map((s) => (
            <Card key={s.label}>
              <CardBody className="text-center py-4">
                <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-xs text-text-secondary mt-1">{s.label}</p>
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Sessions</CardTitle>
            <Button variant="ghost" size="sm" onClick={fetch} leftIcon={<RefreshCw size={14} />}>Refresh</Button>
          </div>
        </CardHeader>
        <CardBody className="pt-0">
          <div className="mb-4">
            <SearchBar value={search} onChange={setSearch} placeholder="Search by user, email, or IP…" className="max-w-sm" />
          </div>
          <Table columns={columns} data={sessions} loading={loading}
            emptyTitle="No sessions found"
            emptyDescription="Active sessions will appear here." />
          <div className="mt-4">
            <Pagination page={page} pageSize={pageSize} total={total} onPageChange={setPage} />
          </div>
        </CardBody>
      </Card>
    </PageContainer>
  );
}
