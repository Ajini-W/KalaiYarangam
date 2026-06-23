"use client";

import * as React from "react";
import { CheckCircle2, XCircle, Search } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/ui/Card";
import { Table, type Column } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Pagination } from "@/components/ui/Pagination";
import { SearchBar } from "@/components/ui/SearchBar";
import { Select } from "@/components/ui/Select";
import { securityService, type LoginLogItem } from "@/services/security.service";

export default function LoginHistoryPage() {
  const [logs, setLogs] = React.useState<LoginLogItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [page, setPage] = React.useState(1);
  const [pageSize] = React.useState(20);
  const [total, setTotal] = React.useState(0);
  const [search, setSearch] = React.useState("");
  const [successFilter, setSuccessFilter] = React.useState("");

  const fetch = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await securityService.listLoginHistory({
        page, pageSize,
        search: search || undefined,
        success: successFilter ? successFilter === "true" : undefined,
      });
      setLogs(res.data);
      setTotal(res.meta.total);
    } catch { /* ignore */ }
    finally { setLoading(false); }
  }, [page, pageSize, search, successFilter]);

  React.useEffect(() => { fetch(); }, [fetch]);

  const columns: Column<LoginLogItem>[] = [
    { key: "user", header: "User", render: (r) => <span className="font-medium">{r.user.name}</span> },
    { key: "user", header: "Email", render: (r) => <span className="text-text-secondary text-sm">{r.user.email}</span> },
    { key: "ipAddress", header: "IP Address", render: (r) => r.ipAddress || "—" },
    {
      key: "success",
      header: "Status",
      render: (r) => r.success
        ? <span className="flex items-center gap-1 text-success"><CheckCircle2 size={14} /> Success</span>
        : <span className="flex items-center gap-1 text-danger"><XCircle size={14} /> Failed</span>,
    },
    { key: "loginAt", header: "Date & Time", render: (r) => new Date(r.loginAt).toLocaleString() },
  ];

  return (
    <PageContainer title="Login History" subtitle="View all login attempts across the platform.">
      <Card>
        <CardBody>
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <SearchBar value={search} onChange={setSearch} placeholder="Search user, email, or IP…" className="max-w-sm" />
            <Select
              value={successFilter}
              onChange={(e) => setSuccessFilter(e.target.value)}
              options={[
                { value: "", label: "All" },
                { value: "true", label: "Success" },
                { value: "false", label: "Failed" },
              ]}
              className="w-32"
            />
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
