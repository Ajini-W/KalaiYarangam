"use client";

import * as React from "react";
import { AlertTriangle, Info, AlertCircle, Skull, Search } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/ui/Card";
import { Table, type Column } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Pagination } from "@/components/ui/Pagination";
import { SearchBar } from "@/components/ui/SearchBar";
import { Select } from "@/components/ui/Select";
import { toast } from "sonner";
import { securityService, type SecurityEventItem } from "@/services/security.service";

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

export default function SecurityEventsPage() {
  const [events, setEvents] = React.useState<SecurityEventItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [page, setPage] = React.useState(1);
  const [pageSize] = React.useState(20);
  const [total, setTotal] = React.useState(0);
  const [search, setSearch] = React.useState("");
  const [severityFilter, setSeverityFilter] = React.useState("");

  const fetch = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await securityService.listSecurityEvents({
        page, pageSize, search: search || undefined, severity: severityFilter || undefined,
      });
      setEvents(res.data);
      setTotal(res.meta.total);
    } catch { toast.error("Failed to load security events"); }
    finally { setLoading(false); }
  }, [page, pageSize, search, severityFilter]);

  React.useEffect(() => { fetch(); }, [fetch]);

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
    { key: "eventType", header: "Event Type", render: (r) => <span className="font-medium font-mono text-xs">{r.eventType}</span> },
    { key: "message", header: "Message", render: (r) => <span className="text-sm max-w-xs truncate block">{r.message}</span> },
    { key: "user", header: "User", render: (r) => r.user ? r.user.name : "—" },
    { key: "ipAddress", header: "IP", render: (r) => r.ipAddress || "—" },
    { key: "createdAt", header: "Date", render: (r) => new Date(r.createdAt).toLocaleString() },
  ];

  return (
    <PageContainer title="Security Events" subtitle="Monitor security-related events across the platform.">
      <Card>
        <CardHeader><CardTitle>Events</CardTitle></CardHeader>
        <CardBody className="pt-0">
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <SearchBar value={search} onChange={setSearch} placeholder="Search events…" className="max-w-sm" />
            <Select value={severityFilter} onChange={(e) => setSeverityFilter(e.target.value)} options={SEVERITIES} className="w-36" />
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
