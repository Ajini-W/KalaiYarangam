"use client";

import * as React from "react";
import { Search } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardBody } from "@/components/ui/Card";
import { Table, type Column } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Pagination } from "@/components/ui/Pagination";
import { SearchBar } from "@/components/ui/SearchBar";
import { Select } from "@/components/ui/Select";
import { securityService, type AuditLogItem } from "@/services/security.service";

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
];

export default function AuditLogsPage() {
  const [logs, setLogs] = React.useState<AuditLogItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [page, setPage] = React.useState(1);
  const [pageSize] = React.useState(20);
  const [total, setTotal] = React.useState(0);
  const [search, setSearch] = React.useState("");
  const [actionFilter, setActionFilter] = React.useState("");

  const fetch = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await securityService.listAuditLogs({
        page, pageSize, search: search || undefined, action: actionFilter || undefined,
      });
      setLogs(res.data);
      setTotal(res.meta.total);
    } catch { /* ignore */ }
    finally { setLoading(false); }
  }, [page, pageSize, search, actionFilter]);

  React.useEffect(() => { fetch(); }, [fetch]);

  const columns: Column<AuditLogItem>[] = [
    { key: "user", header: "User", render: (r) => r.user ? r.user.name : "—" },
    { key: "action", header: "Action", render: (r) => <Badge variant={ACTION_COLORS[r.action] ?? "default"}>{r.action}</Badge> },
    { key: "entity", header: "Entity" },
    { key: "entityId", header: "Entity ID", render: (r) => r.entityId ? <span className="font-mono text-xs">{r.entityId.slice(0, 8)}…</span> : "—" },
    { key: "oldValues", header: "Changes", render: (r) => {
      if (!r.oldValues && !r.newValues) return "—";
      return <span className="text-xs text-text-secondary">{(r.newValues ? Object.keys(r.newValues).length : 0) + (r.oldValues ? Object.keys(r.oldValues).length : 0)} field(s)</span>;
    }},
    { key: "createdAt", header: "Date", render: (r) => new Date(r.createdAt).toLocaleString() },
  ];

  return (
    <PageContainer title="Audit Logs" subtitle="Track all administrative actions and entity changes across the platform.">
      <Card>
        <CardBody>
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <SearchBar value={search} onChange={setSearch} placeholder="Search user, entity…" className="max-w-sm" />
            <Select value={actionFilter} onChange={(e) => setActionFilter(e.target.value)} options={ACTIONS} className="w-40" />
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
