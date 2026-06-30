"use client";

import * as React from "react";
import { AlertTriangle, Info, AlertCircle, Skull, Download, RefreshCw, Clock, MapPin, CheckCircle2 } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/ui/Card";
import { Table, type Column } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Pagination } from "@/components/ui/Pagination";
import { SearchBar } from "@/components/ui/SearchBar";
import { Select } from "@/components/ui/Select";
import { securityService, type SecurityEventItem, type SecurityEventStats, downloadBlob } from "@/services/security.service";
import { toast } from "sonner";

const SEVERITY_CONFIG: Record<string, { label: string; variant: "success" | "warning" | "danger" | "info"; icon: React.ElementType }> = {
  INFO: { label: "Info", variant: "info", icon: Info },
  WARNING: { label: "Warning", variant: "warning", icon: AlertTriangle },
  ERROR: { label: "Error", variant: "danger", icon: AlertCircle },
  CRITICAL: { label: "Critical", variant: "danger", icon: Skull },
};

const SEVERITIES = [
  { value: "", label: "All Severities" },
  { value: "INFO", label: "Info" },
  { value: "WARNING", label: "Warning" },
  { value: "ERROR", label: "Error" },
  { value: "CRITICAL", label: "Critical" },
];

const CATEGORIES = [
  { value: "", label: "All Categories" },
  { value: "authentication", label: "Authentication" },
  { value: "authorization", label: "Authorization" },
  { value: "session", label: "Session" },
  { value: "data", label: "Data" },
  { value: "system", label: "System" },
  { value: "compliance", label: "Compliance" },
];

export default function SecurityEventsPage() {
  const [events, setEvents] = React.useState<SecurityEventItem[]>([]);
  const [stats, setStats] = React.useState<SecurityEventStats | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [page, setPage] = React.useState(1);
  const [pageSize] = React.useState(20);
  const [total, setTotal] = React.useState(0);
  const [search, setSearch] = React.useState("");
  const [severityFilter, setSeverityFilter] = React.useState("");
  const [categoryFilter, setCategoryFilter] = React.useState("");
  const [resolvedFilter, setResolvedFilter] = React.useState("");
  const [dateFrom, setDateFrom] = React.useState("");
  const [dateTo, setDateTo] = React.useState("");

  const fetchData = React.useCallback(async () => {
    setLoading(true);
    try {
      const [res, s] = await Promise.all([
        securityService.listSecurityEvents({
          page, pageSize, search: search || undefined,
          severity: severityFilter || undefined,
          category: categoryFilter || undefined,
          resolved: resolvedFilter ? resolvedFilter === "true" : undefined,
          from: dateFrom || undefined,
          to: dateTo || undefined,
        }),
        securityService.getSecurityEventStats(),
      ]);
      setEvents(res.data ?? []);
      setTotal(res.meta?.total ?? 0);
      setStats(s);
    } catch { toast.error("Failed to load security events"); }
    finally { setLoading(false); }
  }, [page, pageSize, search, severityFilter, categoryFilter, resolvedFilter, dateFrom, dateTo]);

  React.useEffect(() => { fetchData(); }, [fetchData]);

  const handleExport = async () => {
    try {
      const blob = await securityService.exportSecurityEventsCsv({
        severity: severityFilter || undefined,
        from: dateFrom || undefined,
        to: dateTo || undefined,
      });
      downloadBlob(blob, `security_events_${Date.now()}.csv`);
      toast.success("Export downloaded");
    } catch { toast.error("Failed to export"); }
  };

  const columns: Column<SecurityEventItem>[] = [
    {
      key: "severity",
      header: "Severity",
      render: (r) => {
        const cfg = SEVERITY_CONFIG[r.severity] ?? SEVERITY_CONFIG.INFO;
        const Icon = cfg.icon;
        return (
          <Badge variant={cfg.variant} className="flex items-center gap-1 w-fit">
            <Icon size={12} /> {cfg.label}
          </Badge>
        );
      },
    },
    {
      key: "eventType",
      header: "Event Type",
      render: (r) => (
        <div>
          <span className="font-medium font-mono text-xs">{r.eventType}</span>
          {r.category && <p className="text-xs text-text-secondary mt-0.5">{r.category}</p>}
        </div>
      ),
    },
    {
      key: "message",
      header: "Message",
      render: (r) => <span className="text-sm max-w-xs truncate block">{r.message}</span>,
    },
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
      key: "location",
      header: "Location",
      render: (r) => (
        <div>
          {r.ipAddress && <p className="font-mono text-xs">{r.ipAddress}</p>}
          {r.location && <p className="text-xs text-text-secondary flex items-center gap-1"><MapPin size={10} />{r.location}</p>}
        </div>
      ),
    },
    {
      key: "resolved",
      header: "Status",
      render: (r) => r.resolved
        ? <Badge variant="success" size="sm"><CheckCircle2 size={10} /> Resolved</Badge>
        : <Badge variant="warning" size="sm">Open</Badge>,
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
    <PageContainer title="Security Events" subtitle="Monitor security-related events across the platform.">
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          <Card>
            <CardBody className="text-center py-4">
              <p className="text-2xl font-bold text-text-primary">{stats.totalEvents.toLocaleString()}</p>
              <p className="text-xs text-text-secondary mt-1">Total Events</p>
            </CardBody>
          </Card>
          <Card>
            <CardBody className="text-center py-4">
              <p className="text-2xl font-bold text-info">{stats.eventsLast24h}</p>
              <p className="text-xs text-text-secondary mt-1">Last 24h</p>
            </CardBody>
          </Card>
          <Card>
            <CardBody className="text-center py-4">
              <p className="text-2xl font-bold text-danger">{stats.criticalLast7d}</p>
              <p className="text-xs text-text-secondary mt-1">Critical (7d)</p>
            </CardBody>
          </Card>
          <Card>
            <CardBody className="text-center py-4">
              <p className="text-2xl font-bold text-warning">{stats.unresolvedCount}</p>
              <p className="text-xs text-text-secondary mt-1">Unresolved</p>
            </CardBody>
          </Card>
        </div>
      )}

      {stats?.eventsBySeverity && Object.keys(stats.eventsBySeverity).length > 0 && (
        <Card className="mb-6">
          <CardBody className="py-3">
            <div className="flex items-center gap-4 flex-wrap">
              <span className="text-sm font-medium text-text-secondary">Severity Breakdown:</span>
              {Object.entries(stats.eventsBySeverity).map(([sev, count]) => {
                const cfg = SEVERITY_CONFIG[sev] ?? SEVERITY_CONFIG.INFO;
                return (
                  <Badge key={sev} variant={cfg.variant}>
                    {cfg.label}: {count}
                  </Badge>
                );
              })}
            </div>
          </CardBody>
        </Card>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Events</CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={handleExport} leftIcon={<Download size={14} />}>Export CSV</Button>
              <Button variant="ghost" size="sm" onClick={fetchData} leftIcon={<RefreshCw size={14} />}>Refresh</Button>
            </div>
          </div>
        </CardHeader>
        <CardBody className="pt-0">
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <SearchBar value={search} onChange={setSearch} placeholder="Search events…" className="max-w-sm" />
            <Select value={severityFilter} onChange={(e) => { setSeverityFilter(e.target.value); setPage(1); }} options={SEVERITIES} className="w-36" />
            <Select value={categoryFilter} onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }} options={CATEGORIES} className="w-40" />
            <Select value={resolvedFilter} onChange={(e) => { setResolvedFilter(e.target.value); setPage(1); }}
              options={[
                { value: "", label: "All Status" },
                { value: "true", label: "Resolved" },
                { value: "false", label: "Unresolved" },
              ]}
              className="w-36"
            />
            <input type="date" value={dateFrom} onChange={(e) => { setDateFrom(e.target.value); setPage(1); }}
              className="h-8 px-2 text-sm border border-border rounded-[var(--radius-sm)] bg-surface text-text-primary" />
            <input type="date" value={dateTo} onChange={(e) => { setDateTo(e.target.value); setPage(1); }}
              className="h-8 px-2 text-sm border border-border rounded-[var(--radius-sm)] bg-surface text-text-primary" />
          </div>
          <Table columns={columns} data={events} loading={loading}
            emptyTitle="No security events"
            emptyDescription="Security events will appear here when triggered." />
          <div className="mt-4">
            <Pagination page={page} pageSize={pageSize} total={total} onPageChange={setPage} />
          </div>
        </CardBody>
      </Card>
    </PageContainer>
  );
}
