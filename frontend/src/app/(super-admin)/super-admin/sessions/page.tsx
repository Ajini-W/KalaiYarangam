"use client";

import * as React from "react";
import { ShieldX, RefreshCw, Monitor, Smartphone, Tablet, Download, Globe, Clock, MapPin } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/ui/Card";
import { Table, type Column } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Pagination } from "@/components/ui/Pagination";
import { SearchBar } from "@/components/ui/SearchBar";
import { Select } from "@/components/ui/Select";
import { securityService, type SessionItem, type SecurityStats, downloadBlob } from "@/services/security.service";
import { toast } from "sonner";

const DEVICE_ICONS: Record<string, React.ElementType> = {
  DESKTOP: Monitor,
  MOBILE: Smartphone,
  TABLET: Tablet,
};

function getDeviceIcon(deviceType: string) {
  return DEVICE_ICONS[deviceType] || Globe;
}

export default function SessionsPage() {
  const [sessions, setSessions] = React.useState<SessionItem[]>([]);
  const [stats, setStats] = React.useState<SecurityStats | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [page, setPage] = React.useState(1);
  const [pageSize] = React.useState(15);
  const [total, setTotal] = React.useState(0);
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("");
  const [deviceFilter, setDeviceFilter] = React.useState("");

  const fetchData = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await securityService.listSessions({
        page, pageSize, search: search || undefined,
        isActive: statusFilter ? statusFilter === "active" : undefined,
        deviceType: deviceFilter || undefined,
      });
      setSessions(res.data ?? []);
      setTotal(res.meta?.total ?? 0);
      const s = await securityService.getStats();
      setStats(s);
    } catch { toast.error("Failed to load sessions"); }
    finally { setLoading(false); }
  }, [page, pageSize, search, statusFilter, deviceFilter]);

  React.useEffect(() => { fetchData(); }, [fetchData]);

  const handleRevoke = async (id: string) => {
    try {
      await securityService.revokeSession(id);
      toast.success("Session revoked");
      fetchData();
    } catch { toast.error("Failed to revoke session"); }
  };

  const handleExport = async () => {
    try {
      const blob = await securityService.exportSessionsCsv({
        isActive: statusFilter ? statusFilter === "active" : undefined,
      });
      downloadBlob(blob, `sessions_${Date.now()}.csv`);
      toast.success("Export downloaded");
    } catch { toast.error("Failed to export"); }
  };

  const columns: Column<SessionItem>[] = [
    {
      key: "user",
      header: "User",
      render: (r) => (
        <div>
          <p className="font-medium text-text-primary">{r.user.name}</p>
          <p className="text-xs text-text-secondary">{r.user.email}</p>
        </div>
      ),
    },
    {
      key: "device",
      header: "Device & Browser",
      render: (r) => {
        const Icon = getDeviceIcon(r.deviceType);
        return (
          <div className="flex items-center gap-2">
            <Icon size={14} className="text-text-secondary shrink-0" />
            <div>
              <p className="text-sm font-medium">{r.browser || "Unknown"}{r.browserVersion ? ` ${r.browserVersion}` : ""}</p>
              <p className="text-xs text-text-secondary">{r.os || "Unknown"}{r.osVersion ? ` ${r.osVersion}` : ""}</p>
            </div>
          </div>
        );
      },
    },
    {
      key: "ipAddress",
      header: "IP & Location",
      render: (r) => (
        <div>
          <p className="font-mono text-xs">{r.ipAddress || "—"}</p>
          {r.location && <p className="text-xs text-text-secondary flex items-center gap-1"><MapPin size={10} />{r.location}</p>}
        </div>
      ),
    },
    {
      key: "loginMethod",
      header: "Method",
      render: (r) => <Badge variant="outline" size="sm">{r.loginMethod}</Badge>,
    },
    {
      key: "isActive",
      header: "Status",
      render: (r) => r.isActive ? <Badge variant="success">Active</Badge> : <Badge variant="danger">Revoked</Badge>,
    },
    {
      key: "lastActivity",
      header: "Last Activity",
      render: (r) => (
        <div className="flex items-center gap-1 text-sm text-text-secondary">
          <Clock size={12} />
          {new Date(r.lastActivity).toLocaleString()}
        </div>
      ),
    },
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
    { label: "Suspicious (7d)", value: stats.suspiciousLoginsLast7d, color: "text-danger" },
    { label: "Critical Events (7d)", value: stats.criticalEventsLast7d, color: "text-danger" },
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

      {stats?.sessionsByDeviceType && Object.keys(stats.sessionsByDeviceType).length > 0 && (
        <Card className="mb-6">
          <CardBody className="py-3">
            <div className="flex items-center gap-4 flex-wrap">
              <span className="text-sm font-medium text-text-secondary">Sessions by Device:</span>
              {Object.entries(stats.sessionsByDeviceType).map(([type, count]) => {
                const Icon = getDeviceIcon(type);
                return (
                  <div key={type} className="flex items-center gap-1.5 text-sm">
                    <Icon size={14} className="text-text-secondary" />
                    <span className="font-medium">{count}</span>
                    <span className="text-text-secondary">{type.toLowerCase()}</span>
                  </div>
                );
              })}
            </div>
          </CardBody>
        </Card>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Sessions</CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={handleExport} leftIcon={<Download size={14} />}>Export CSV</Button>
              <Button variant="ghost" size="sm" onClick={fetchData} leftIcon={<RefreshCw size={14} />}>Refresh</Button>
            </div>
          </div>
        </CardHeader>
        <CardBody className="pt-0">
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <SearchBar value={search} onChange={setSearch} placeholder="Search user, email, IP…" className="max-w-sm" />
            <Select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              options={[
                { value: "", label: "All Status" },
                { value: "active", label: "Active" },
                { value: "revoked", label: "Revoked" },
              ]}
              className="w-36"
            />
            <Select
              value={deviceFilter}
              onChange={(e) => { setDeviceFilter(e.target.value); setPage(1); }}
              options={[
                { value: "", label: "All Devices" },
                { value: "DESKTOP", label: "Desktop" },
                { value: "MOBILE", label: "Mobile" },
                { value: "TABLET", label: "Tablet" },
              ]}
              className="w-36"
            />
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
