"use client";

import * as React from "react";
import { Download, RefreshCw, Clock, CheckCircle2, XCircle, MinusCircle } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/ui/Card";
import { Table, type Column } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Pagination } from "@/components/ui/Pagination";
import { SearchBar } from "@/components/ui/SearchBar";
import { Select } from "@/components/ui/Select";
import { securityService, type ActivityLogItem, downloadBlob } from "@/services/security.service";
import { toast } from "sonner";

const STATUS_CONFIG: Record<string, { variant: "success" | "danger" | "warning" | "info" | "default"; icon: React.ElementType }> = {
  SUCCESS: { variant: "success", icon: CheckCircle2 },
  FAILED: { variant: "danger", icon: XCircle },
  PENDING: { variant: "warning", icon: MinusCircle },
  CANCELLED: { variant: "default", icon: MinusCircle },
};

const ACTION_COLORS: Record<string, "info" | "success" | "danger" | "warning" | "default"> = {
  CREATE: "success",
  EDIT: "info",
  DELETE: "danger",
  IMPORT: "info",
  EXPORT: "info",
  SHARE: "info",
  DOWNLOAD: "default",
  UPLOAD: "info",
  COMMENT: "default",
  ASSIGN: "info",
  APPROVE: "success",
  REJECT: "danger",
  VIEW: "default",
};

const RESOURCES = [
  { value: "", label: "All Resources" },
  { value: "student", label: "Students" },
  { value: "batch", label: "Batches" },
  { value: "attendance", label: "Attendance" },
  { value: "certificate", label: "Certificates" },
  { value: "invoice", label: "Invoices" },
  { value: "settings", label: "Settings" },
  { value: "profile", label: "Profile" },
  { value: "subscription", label: "Subscriptions" },
];

export default function ActivityLogsPage() {
  const [logs, setLogs] = React.useState<ActivityLogItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [page, setPage] = React.useState(1);
  const [pageSize] = React.useState(20);
  const [total, setTotal] = React.useState(0);
  const [search, setSearch] = React.useState("");
  const [resourceFilter, setResourceFilter] = React.useState("");
  const [actionFilter, setActionFilter] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("");
  const [dateFrom, setDateFrom] = React.useState("");
  const [dateTo, setDateTo] = React.useState("");

  const fetchData = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await securityService.listActivityLogs({
        page, pageSize,
        search: search || undefined,
        resource: resourceFilter || undefined,
        action: actionFilter || undefined,
        executionStatus: statusFilter || undefined,
        from: dateFrom || undefined,
        to: dateTo || undefined,
      });
      setLogs(res.data ?? []);
      setTotal(res.meta?.total ?? 0);
    } catch { toast.error("Failed to load activity logs"); }
    finally { setLoading(false); }
  }, [page, pageSize, search, resourceFilter, actionFilter, statusFilter, dateFrom, dateTo]);

  React.useEffect(() => { fetchData(); }, [fetchData]);

  const handleExport = async () => {
    try {
      const blob = await securityService.exportActivityLogsCsv({
        resource: resourceFilter || undefined,
        from: dateFrom || undefined,
        to: dateTo || undefined,
      });
      downloadBlob(blob, `activity_logs_${Date.now()}.csv`);
      toast.success("Export downloaded");
    } catch { toast.error("Failed to export"); }
  };

  const columns: Column<ActivityLogItem>[] = [
    {
      key: "user",
      header: "User",
      render: (r) => r.user ? (
        <div>
          <p className="text-sm font-medium">{r.user.name}</p>
          <p className="text-xs text-text-secondary">{r.user.email}</p>
        </div>
      ) : <span className="text-text-secondary">System</span>,
    },
    {
      key: "activity",
      header: "Activity",
      render: (r) => (
        <div>
          <span className="font-medium text-sm">{r.activity}</span>
          {r.action && <Badge variant={ACTION_COLORS[r.action] ?? "default"} size="sm" className="ml-1">{r.action}</Badge>}
        </div>
      ),
    },
    {
      key: "resource",
      header: "Resource",
      render: (r) => r.resource ? (
        <div>
          <span className="font-medium">{r.resource}</span>
          {r.resourceId && <p className="text-xs font-mono text-text-secondary truncate max-w-24">{r.resourceId}</p>}
        </div>
      ) : "—",
    },
    {
      key: "executionStatus",
      header: "Status",
      render: (r) => {
        const status = r.executionStatus || "SUCCESS";
        const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.SUCCESS;
        const Icon = cfg.icon;
        return (
          <Badge variant={cfg.variant} size="sm" className="flex items-center gap-1 w-fit">
            <Icon size={12} /> {status}
          </Badge>
        );
      },
    },
    {
      key: "requestSource",
      header: "Source",
      render: (r) => r.requestSource ? <Badge variant="outline" size="sm">{r.requestSource}</Badge> : "—",
    },
    {
      key: "ipAddress",
      header: "IP Address",
      render: (r) => r.ipAddress ? <span className="font-mono text-xs">{r.ipAddress}</span> : "—",
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
    <PageContainer title="Activity Logs" subtitle="View all user actions and operations across the platform.">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Activities</CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={handleExport} leftIcon={<Download size={14} />}>Export CSV</Button>
              <Button variant="ghost" size="sm" onClick={fetchData} leftIcon={<RefreshCw size={14} />}>Refresh</Button>
            </div>
          </div>
        </CardHeader>
        <CardBody className="pt-0">
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <SearchBar value={search} onChange={setSearch} placeholder="Search activity, user…" className="max-w-sm" />
            <Select value={resourceFilter} onChange={(e) => { setResourceFilter(e.target.value); setPage(1); }} options={RESOURCES} className="w-36" />
            <Select value={actionFilter} onChange={(e) => { setActionFilter(e.target.value); setPage(1); }}
              options={[
                { value: "", label: "All Actions" },
                { value: "CREATE", label: "Create" },
                { value: "EDIT", label: "Edit" },
                { value: "DELETE", label: "Delete" },
                { value: "IMPORT", label: "Import" },
                { value: "EXPORT", label: "Export" },
                { value: "VIEW", label: "View" },
              ]}
              className="w-32"
            />
            <Select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              options={[
                { value: "", label: "All Status" },
                { value: "SUCCESS", label: "Success" },
                { value: "FAILED", label: "Failed" },
              ]}
              className="w-32"
            />
            <input type="date" value={dateFrom} onChange={(e) => { setDateFrom(e.target.value); setPage(1); }}
              className="h-8 px-2 text-sm border border-border rounded-[var(--radius-sm)] bg-surface text-text-primary" />
            <input type="date" value={dateTo} onChange={(e) => { setDateTo(e.target.value); setPage(1); }}
              className="h-8 px-2 text-sm border border-border rounded-[var(--radius-sm)] bg-surface text-text-primary" />
          </div>
          <Table columns={columns} data={logs} loading={loading}
            emptyTitle="No activity logs"
            emptyDescription="Activity logs will appear here as users perform actions." />
          <div className="mt-4">
            <Pagination page={page} pageSize={pageSize} total={total} onPageChange={setPage} />
          </div>
        </CardBody>
      </Card>
    </PageContainer>
  );
}
