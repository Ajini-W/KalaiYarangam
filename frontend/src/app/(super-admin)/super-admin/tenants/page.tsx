"use client";

import * as React from "react";
import { Plus, Search, MoreHorizontal } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Table, type Column } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Pagination } from "@/components/ui/Pagination";
import { SearchBar } from "@/components/ui/SearchBar";
import { rbacService, type TenantListItem } from "@/services/rbac.service";
import { useRouter } from "next/navigation";

const statusVariant: Record<string, "success" | "warning" | "danger" | "info" | "default"> = {
  ACTIVE: "success",
  TRIAL: "info",
  INACTIVE: "warning",
  SUSPENDED: "danger",
};

const subscriptionStatusVariant: Record<string, "success" | "warning" | "info" | "default"> = {
  ACTIVE: "success",
  TRIAL: "info",
  EXPIRED: "warning",
  CANCELLED: "warning",
};

export default function TenantManagementPage() {
  const router = useRouter();
  const [tenants, setTenants] = React.useState<TenantListItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [page, setPage] = React.useState(1);
  const [pageSize] = React.useState(10);
  const [total, setTotal] = React.useState(0);

  const fetchTenants = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await rbacService.listTenants(page, pageSize);
      setTenants(res.data);
      setTotal(res.meta.total);
    } catch { /* ignore */ }
    finally { setLoading(false); }
  }, [page, pageSize]);

  React.useEffect(() => { fetchTenants(); }, [fetchTenants]);

  const columns: Column<TenantListItem>[] = [
    { key: "name", header: "Name", render: (r) => <span className="font-medium">{r.name}</span> },
    { key: "industry", header: "Industry", render: (r) => <Badge variant="brand">{r.industry}</Badge> },
    {
      key: "status",
      header: "Status",
      render: (r) => <Badge variant={statusVariant[r.status] ?? "default"}>{r.status}</Badge>,
    },
    {
      key: "subscription",
      header: "Subscription",
      render: (r) => r.subscription
        ? <Badge variant={subscriptionStatusVariant[r.subscription.status] ?? "default"}>{r.subscription.plan?.name ?? r.subscription.status}</Badge>
        : <span className="text-text-muted">—</span>,
    },
    { key: "userCount", header: "Users" },
    { key: "branchCount", header: "Branches" },
    { key: "createdAt", header: "Created", render: (r) => new Date(r.createdAt).toLocaleDateString() },
    {
      key: "id",
      header: "",
      className: "w-12",
      render: (r) => (
        <button
          onClick={() => router.push(`/super-admin/tenants/${r.id}`)}
          className="text-text-secondary hover:text-text-primary p-1"
          title="View details"
        >
          <MoreHorizontal size={16} />
        </button>
      ),
    },
  ];

  return (
    <PageContainer
      title="Tenant Management"
      subtitle="View and manage all tenants, their subscription status, and activity."
    >
      <Table
        columns={columns}
        data={tenants}
        loading={loading}
        emptyTitle="No tenants found"
        emptyDescription="Tenants will appear here once they register."
      />
      <div className="mt-4">
        <Pagination page={page} pageSize={pageSize} total={total} onPageChange={setPage} />
      </div>
    </PageContainer>
  );
}
