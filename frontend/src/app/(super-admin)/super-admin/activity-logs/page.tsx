"use client";

import * as React from "react";
import { Search } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardBody } from "@/components/ui/Card";
import { Table, type Column } from "@/components/ui/Table";
import { Pagination } from "@/components/ui/Pagination";
import { SearchBar } from "@/components/ui/SearchBar";
import { toast } from "sonner";
import { securityService, type ActivityLogItem } from "@/services/security.service";

export default function ActivityLogsPage() {
  const [logs, setLogs] = React.useState<ActivityLogItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [page, setPage] = React.useState(1);
  const [pageSize] = React.useState(20);
  const [total, setTotal] = React.useState(0);
  const [search, setSearch] = React.useState("");

  const fetch = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await securityService.listActivityLogs({ page, pageSize, search: search || undefined });
      setLogs(res.data);
      setTotal(res.meta.total);
    } catch { toast.error("Failed to load activity logs"); }
    finally { setLoading(false); }
  }, [page, pageSize, search]);

  React.useEffect(() => { fetch(); }, [fetch]);

  const columns: Column<ActivityLogItem>[] = [
    { key: "user", header: "User", render: (r) => r.user ? r.user.name : "—" },
    { key: "activity", header: "Activity", render: (r) => <span className="font-medium">{r.activity}</span> },
    { key: "details", header: "Details", render: (r) => r.details ? <span className="text-xs text-text-secondary">{JSON.stringify(r.details).slice(0, 80)}…</span> : "—" },
    { key: "ipAddress", header: "IP", render: (r) => r.ipAddress || "—" },
    { key: "createdAt", header: "Date", render: (r) => new Date(r.createdAt).toLocaleString() },
  ];

  return (
    <PageContainer title="Activity Logs" subtitle="View user activity and actions across the platform.">
      <Card>
        <CardBody>
          <div className="mb-4">
            <SearchBar value={search} onChange={setSearch} placeholder="Search activity, user…" className="max-w-sm" />
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
