"use client";

import * as React from "react";
import { CheckCircle2, XCircle, AlertTriangle, Download, RefreshCw, Clock, MapPin } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/ui/Card";
import { Table, type Column } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Pagination } from "@/components/ui/Pagination";
import { SearchBar } from "@/components/ui/SearchBar";
import { Select } from "@/components/ui/Select";
import { securityService, type LoginLogItem, type LoginHistoryStats, downloadBlob } from "@/services/security.service";
import { toast } from "sonner";

const METHOD_BADGES: Record<string, "info" | "success" | "warning" | "default"> = {
  PASSWORD: "default",
  SSO: "info",
  OAUTH_GOOGLE: "info",
  MAGIC_LINK: "success",
  API_KEY: "warning",
};

export default function LoginHistoryPage() {
  const [logs, setLogs] = React.useState<LoginLogItem[]>([]);
  const [stats, setStats] = React.useState<LoginHistoryStats | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [page, setPage] = React.useState(1);
  const [pageSize] = React.useState(20);
  const [total, setTotal] = React.useState(0);
  const [search, setSearch] = React.useState("");
  const [successFilter, setSuccessFilter] = React.useState("");
  const [methodFilter, setMethodFilter] = React.useState("");
  const [suspiciousFilter, setSuspiciousFilter] = React.useState("");
  const [dateFrom, setDateFrom] = React.useState("");
  const [dateTo, setDateTo] = React.useState("");

  const fetchData = React.useCallback(async () => {
    setLoading(true);
    try {
      const [res, s] = await Promise.all([
        securityService.listLoginHistory({
          page, pageSize,
          search: search || undefined,
          success: successFilter ? successFilter === "true" : undefined,
          loginMethod: methodFilter || undefined,
          isSuspicious: suspiciousFilter ? suspiciousFilter === "true" : undefined,
          from: dateFrom || undefined,
          to: dateTo || undefined,
        }),
        securityService.getLoginHistoryStats(),
      ]);
      setLogs(res.data ?? []);
      setTotal(res.meta?.total ?? 0);
      setStats(s);
    } catch { toast.error("Failed to load login history"); }
    finally { setLoading(false); }
  }, [page, pageSize, search, successFilter, methodFilter, suspiciousFilter, dateFrom, dateTo]);

  React.useEffect(() => { fetchData(); }, [fetchData]);

  const handleExport = async () => {
    try {
      const blob = await securityService.exportLoginHistoryCsv({
        success: successFilter ? successFilter === "true" : undefined,
        from: dateFrom || undefined,
        to: dateTo || undefined,
      });
      downloadBlob(blob, `login_history_${Date.now()}.csv`);
      toast.success("Export downloaded");
    } catch { toast.error("Failed to export"); }
  };

  const columns: Column<LoginLogItem>[] = [
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
      key: "status",
      header: "Status",
      render: (r) => (
        <div className="flex items-center gap-1.5">
          {r.success
            ? <span className="flex items-center gap-1 text-success"><CheckCircle2 size={14} /> Success</span>
            : <span className="flex items-center gap-1 text-danger"><XCircle size={14} /> Failed</span>
          }
          {r.isSuspicious && (
            <Badge variant="danger" size="sm"><AlertTriangle size={10} /> Suspicious</Badge>
          )}
        </div>
      ),
    },
    {
      key: "loginMethod",
      header: "Method",
      render: (r) => <Badge variant={METHOD_BADGES[r.loginMethod] ?? "default"} size="sm">{r.loginMethod}</Badge>,
    },
    {
      key: "device",
      header: "Browser & OS",
      render: (r) => (
        <div>
          <p className="text-sm">{r.browser || "Unknown"}{r.browserVersion ? ` ${r.browserVersion}` : ""}</p>
          <p className="text-xs text-text-secondary">{r.os || "Unknown"}{r.osVersion ? ` ${r.osVersion}` : ""}</p>
        </div>
      ),
    },
    {
      key: "ipAddress",
      header: "IP & Location",
      render: (r) => (
        <div>
          <p className="font-mono text-xs">{r.ipAddress || "—"}</p>
          {r.city && <p className="text-xs text-text-secondary flex items-center gap-1"><MapPin size={10} />{r.city}{r.country ? `, ${r.country}` : ""}</p>}
        </div>
      ),
    },
    {
      key: "failureReason",
      header: "Failure Reason",
      render: (r) => {
        if (r.success) return "—";
        return r.failureReason ? <Badge variant="danger" size="sm">{r.failureReason.replace(/_/g, " ")}</Badge> : "—";
      },
    },
    {
      key: "loginAt",
      header: "Time",
      render: (r) => (
        <div className="flex items-center gap-1 text-sm text-text-secondary">
          <Clock size={12} />
          {new Date(r.loginAt).toLocaleString()}
        </div>
      ),
    },
  ];

  return (
    <PageContainer title="Login History" subtitle="Track all authentication attempts across the platform.">
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          <Card>
            <CardBody className="text-center py-4">
              <p className="text-2xl font-bold text-text-primary">{stats.totalAttempts.toLocaleString()}</p>
              <p className="text-xs text-text-secondary mt-1">Total Attempts</p>
            </CardBody>
          </Card>
          <Card>
            <CardBody className="text-center py-4">
              <p className="text-2xl font-bold text-success">{stats.successRate}%</p>
              <p className="text-xs text-text-secondary mt-1">Success Rate</p>
            </CardBody>
          </Card>
          <Card>
            <CardBody className="text-center py-4">
              <p className="text-2xl font-bold text-warning">{stats.failedLast24h}</p>
              <p className="text-xs text-text-secondary mt-1">Failed (24h)</p>
            </CardBody>
          </Card>
          <Card>
            <CardBody className="text-center py-4">
              <p className="text-2xl font-bold text-danger">{stats.suspiciousLast7d}</p>
              <p className="text-xs text-text-secondary mt-1">Suspicious (7d)</p>
            </CardBody>
          </Card>
        </div>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Login Attempts</CardTitle>
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
              value={successFilter}
              onChange={(e) => { setSuccessFilter(e.target.value); setPage(1); }}
              options={[
                { value: "", label: "All Status" },
                { value: "true", label: "Success" },
                { value: "false", label: "Failed" },
              ]}
              className="w-32"
            />
            <Select
              value={methodFilter}
              onChange={(e) => { setMethodFilter(e.target.value); setPage(1); }}
              options={[
                { value: "", label: "All Methods" },
                { value: "PASSWORD", label: "Password" },
                { value: "SSO", label: "SSO" },
                { value: "OAUTH_GOOGLE", label: "Google OAuth" },
                { value: "MAGIC_LINK", label: "Magic Link" },
                { value: "API_KEY", label: "API Key" },
              ]}
              className="w-40"
            />
            <Select
              value={suspiciousFilter}
              onChange={(e) => { setSuspiciousFilter(e.target.value); setPage(1); }}
              options={[
                { value: "", label: "All" },
                { value: "true", label: "Suspicious" },
                { value: "false", label: "Normal" },
              ]}
              className="w-36"
            />
            <input type="date" value={dateFrom} onChange={(e) => { setDateFrom(e.target.value); setPage(1); }}
              className="h-8 px-2 text-sm border border-border rounded-[var(--radius-sm)] bg-surface text-text-primary" />
            <input type="date" value={dateTo} onChange={(e) => { setDateTo(e.target.value); setPage(1); }}
              className="h-8 px-2 text-sm border border-border rounded-[var(--radius-sm)] bg-surface text-text-primary" />
          </div>
          <Table columns={columns} data={logs} loading={loading}
            emptyTitle="No login records"
            emptyDescription="Login history will appear here as users log in." />
          <div className="mt-4">
            <Pagination page={page} pageSize={pageSize} total={total} onPageChange={setPage} />
          </div>
        </CardBody>
      </Card>
    </PageContainer>
  );
}
