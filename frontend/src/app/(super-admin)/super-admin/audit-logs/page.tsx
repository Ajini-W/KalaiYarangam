"use client";

import * as React from "react";
import { Download, RefreshCw, Clock, ChevronDown, ChevronUp } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/ui/Card";
import { Table, type Column } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Pagination } from "@/components/ui/Pagination";
import { SearchBar } from "@/components/ui/SearchBar";
import { Select } from "@/components/ui/Select";
import { securityService, type AuditLogItem, type AuditLogStats, downloadBlob } from "@/services/security.service";
import { toast } from "sonner";

const ACTION_COLORS: Record<string, "info" | "success" | "danger" | "warning" | "default"> = {
  CREATE: "success",
  UPDATE: "info",
  DELETE: "danger",
  LOGIN: "info",
  LOGOUT: "warning",
  SESSION_REVOKE: "danger",
  PASSWORD_CHANGE: "warning",
  ROLE_CHANGE: "warning",
  STATUS_CHANGE: "warning",
  PERMISSION_CHANGE: "info",
  SECURITY_EVENT: "danger",
  SETTINGS_CHANGE: "info",
  WEBHOOK_CHANGE: "warning",
  API_KEY_CHANGE: "warning",
  INVITATION: "info",
  SUBSCRIPTION_CHANGE: "info",
  BILLING_CHANGE: "warning",
  DATA_EXPORT: "warning",
  ACCOUNT_LOCK: "danger",
  ACCOUNT_UNLOCK: "success",
  EXPORT: "info",
  IMPORT: "info",
  TWO_FACTOR_ENABLE: "success",
  TWO_FACTOR_DISABLE: "danger",
};

const ACTIONS = [
  { value: "", label: "All Actions" },
  { value: "CREATE", label: "Create" },
  { value: "UPDATE", label: "Update" },
  { value: "DELETE", label: "Delete" },
  { value: "LOGIN", label: "Login" },
  { value: "LOGOUT", label: "Logout" },
  { value: "SESSION_REVOKE", label: "Session Revoke" },
  { value: "PASSWORD_CHANGE", label: "Password Change" },
  { value: "ROLE_CHANGE", label: "Role Change" },
  { value: "STATUS_CHANGE", label: "Status Change" },
  { value: "PERMISSION_CHANGE", label: "Permission Change" },
  { value: "SETTINGS_CHANGE", label: "Settings Change" },
  { value: "API_KEY_CHANGE", label: "API Key Change" },
  { value: "SUBSCRIPTION_CHANGE", label: "Subscription Change" },
  { value: "BILLING_CHANGE", label: "Billing Change" },
];

function ChangeDiff({ oldValues, newValues }: { oldValues: Record<string, unknown> | null; newValues: Record<string, unknown> | null }) {
  const [expanded, setExpanded] = React.useState(false);
  if (!oldValues && !newValues) return <span className="text-text-secondary">—</span>;

  const oldKeys = oldValues ? Object.keys(oldValues) : [];
  const newKeys = newValues ? Object.keys(newValues) : [];
  const allKeys = [...new Set([...oldKeys, ...newKeys])];

  return (
    <div>
      <button onClick={() => setExpanded(!expanded)} className="flex items-center gap-1 text-xs text-text-secondary hover:text-text-primary">
        {allKeys.length} field(s)
        {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
      </button>
      {expanded && (
        <div className="mt-1 text-xs space-y-0.5 max-h-40 overflow-y-auto">
          {allKeys.map((key) => {
            const old = oldValues?.[key];
            const newVal = newValues?.[key];
            return (
              <div key={key} className="flex gap-2">
                <span className="font-mono text-text-secondary min-w-20">{key}</span>
                {old !== undefined && <span className="text-danger line-through">{String(old).slice(0, 30)}</span>}
                {old !== undefined && newVal !== undefined && <span className="text-text-secondary">→</span>}
                {newVal !== undefined && <span className="text-success">{String(newVal).slice(0, 30)}</span>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function AuditLogsPage() {
  const [logs, setLogs] = React.useState<AuditLogItem[]>([]);
  const [stats, setStats] = React.useState<AuditLogStats | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [page, setPage] = React.useState(1);
  const [pageSize] = React.useState(20);
  const [total, setTotal] = React.useState(0);
  const [search, setSearch] = React.useState("");
  const [actionFilter, setActionFilter] = React.useState("");
  const [entityFilter, setEntityFilter] = React.useState("");
  const [dateFrom, setDateFrom] = React.useState("");
  const [dateTo, setDateTo] = React.useState("");

  const fetchData = React.useCallback(async () => {
    setLoading(true);
    try {
      const [res, s] = await Promise.all([
        securityService.listAuditLogs({
          page, pageSize,
          search: search || undefined,
          action: actionFilter || undefined,
          entity: entityFilter || undefined,
          from: dateFrom || undefined,
          to: dateTo || undefined,
        }),
        securityService.getAuditLogStats(),
      ]);
      setLogs(res.data ?? []);
      setTotal(res.meta?.total ?? 0);
      setStats(s);
    } catch { toast.error("Failed to load audit logs"); }
    finally { setLoading(false); }
  }, [page, pageSize, search, actionFilter, entityFilter, dateFrom, dateTo]);

  React.useEffect(() => { fetchData(); }, [fetchData]);

  const handleExport = async () => {
    try {
      const blob = await securityService.exportAuditLogsCsv({
        action: actionFilter || undefined,
        entity: entityFilter || undefined,
        from: dateFrom || undefined,
        to: dateTo || undefined,
      });
      downloadBlob(blob, `audit_logs_${Date.now()}.csv`);
      toast.success("Export downloaded");
    } catch { toast.error("Failed to export"); }
  };

  const columns: Column<AuditLogItem>[] = [
    {
      key: "user",
      header: "Actor",
      render: (r) => r.user ? (
        <div>
          <p className="text-sm font-medium">{r.user.name}</p>
          <p className="text-xs text-text-secondary">{r.user.role}</p>
        </div>
      ) : <span className="text-text-secondary">System</span>,
    },
    {
      key: "action",
      header: "Action",
      render: (r) => <Badge variant={ACTION_COLORS[r.action] ?? "default"}>{r.action.replace(/_/g, " ")}</Badge>,
    },
    {
      key: "entity",
      header: "Entity",
      render: (r) => (
        <div>
          <span className="font-medium">{r.entity}</span>
          {r.entityId && <p className="text-xs font-mono text-text-secondary truncate max-w-24">{r.entityId}</p>}
        </div>
      ),
    },
    {
      key: "changes",
      header: "Changes",
      render: (r) => <ChangeDiff oldValues={r.oldValues} newValues={r.newValues} />,
    },
    {
      key: "location",
      header: "IP & Browser",
      render: (r) => (
        <div>
          {r.ipAddress && <p className="font-mono text-xs">{r.ipAddress}</p>}
          {r.browser && <p className="text-xs text-text-secondary">{r.browser}</p>}
        </div>
      ),
    },
    {
      key: "correlationId",
      header: "Correlation",
      render: (r) => r.correlationId ? (
        <span className="font-mono text-xs text-text-secondary" title={r.correlationId}>{r.correlationId.slice(0, 8)}…</span>
      ) : "—",
    },
    {
      key: "createdAt",
      header: "Time",
      render: (r) => (
        <div className="flex items-center gap-1 text-sm text-text-secondary">
          <Clock size={12} />
          {new Date(r.createdAt).toLocaleString()}
        </div>
      ),
    },
  ];

  return (
    <PageContainer title="Audit Logs" subtitle="Track all administrative actions and entity changes across the platform.">
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          <Card>
            <CardBody className="text-center py-4">
              <p className="text-2xl font-bold text-text-primary">{stats.totalLogs.toLocaleString()}</p>
              <p className="text-xs text-text-secondary mt-1">Total Logs</p>
            </CardBody>
          </Card>
          <Card>
            <CardBody className="text-center py-4">
              <p className="text-2xl font-bold text-info">{stats.logsLast24h}</p>
              <p className="text-xs text-text-secondary mt-1">Last 24h</p>
            </CardBody>
          </Card>
          <Card>
            <CardBody className="text-center py-4">
              <p className="text-2xl font-bold text-primary">{stats.logsLast7d}</p>
              <p className="text-xs text-text-secondary mt-1">Last 7 days</p>
            </CardBody>
          </Card>
          <Card>
            <CardBody className="text-center py-4">
              <p className="text-2xl font-bold text-text-primary">{Object.keys(stats.topEntities).length}</p>
              <p className="text-xs text-text-secondary mt-1">Entity Types</p>
            </CardBody>
          </Card>
        </div>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Audit Trail</CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={handleExport} leftIcon={<Download size={14} />}>Export CSV</Button>
              <Button variant="ghost" size="sm" onClick={fetchData} leftIcon={<RefreshCw size={14} />}>Refresh</Button>
            </div>
          </div>
        </CardHeader>
        <CardBody className="pt-0">
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <SearchBar value={search} onChange={setSearch} placeholder="Search user, entity…" className="max-w-sm" />
            <Select value={actionFilter} onChange={(e) => { setActionFilter(e.target.value); setPage(1); }} options={ACTIONS} className="w-44" />
            <input type="text" value={entityFilter} onChange={(e) => { setEntityFilter(e.target.value); setPage(1); }}
              placeholder="Filter by entity…" className="h-8 px-2 text-sm border border-border rounded-[var(--radius-sm)] bg-surface text-text-primary w-40" />
            <input type="date" value={dateFrom} onChange={(e) => { setDateFrom(e.target.value); setPage(1); }}
              className="h-8 px-2 text-sm border border-border rounded-[var(--radius-sm)] bg-surface text-text-primary" />
            <input type="date" value={dateTo} onChange={(e) => { setDateTo(e.target.value); setPage(1); }}
              className="h-8 px-2 text-sm border border-border rounded-[var(--radius-sm)] bg-surface text-text-primary" />
          </div>
          <Table columns={columns} data={logs} loading={loading}
            emptyTitle="No audit logs"
            emptyDescription="Audit logs will appear here as actions are performed." />
          <div className="mt-4">
            <Pagination page={page} pageSize={pageSize} total={total} onPageChange={setPage} />
          </div>
        </CardBody>
      </Card>
    </PageContainer>
  );
}
