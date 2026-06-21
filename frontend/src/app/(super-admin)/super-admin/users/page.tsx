"use client";

import * as React from "react";
import { Plus, Search, MoreHorizontal, Shield, ShieldOff, UserCheck, UserX } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Table, type Column } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { Pagination } from "@/components/ui/Pagination";
import { Badge } from "@/components/ui/Badge";
import { SearchBar } from "@/components/ui/SearchBar";
import { rbacService, type UserListItem } from "@/services/rbac.service";
import { useRouter } from "next/navigation";

const statusVariant: Record<string, "success" | "warning" | "danger" | "info"> = {
  ACTIVE: "success",
  INACTIVE: "warning",
  SUSPENDED: "danger",
  PENDING: "info",
};

export default function UserManagementPage() {
  const router = useRouter();
  const [users, setUsers] = React.useState<UserListItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [page, setPage] = React.useState(1);
  const [pageSize] = React.useState(10);
  const [total, setTotal] = React.useState(0);
  const [search, setSearch] = React.useState("");

  const fetchUsers = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await rbacService.listUsers(page, pageSize);
      setUsers(res.data);
      setTotal(res.meta.total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize]);

  React.useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleStatusToggle = async (user: UserListItem) => {
    const nextStatus = user.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    try {
      await rbacService.updateUserStatus(user.id, nextStatus);
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const columns: Column<UserListItem>[] = [
    { key: "name", header: "Name", sortable: true },
    { key: "email", header: "Email" },
    { key: "role", header: "Role", render: (r) => <Badge variant="brand">{r.role}</Badge> },
    {
      key: "status",
      header: "Status",
      render: (r) => <Badge variant={statusVariant[r.status] ?? "default"}>{r.status}</Badge>,
    },
    {
      key: "emailVerified",
      header: "Verified",
      render: (r) => (r.emailVerified ? <UserCheck size={16} className="text-success" /> : <UserX size={16} className="text-text-disabled" />),
    },
    {
      key: "createdAt",
      header: "Joined",
      render: (r) => new Date(r.createdAt).toLocaleDateString(),
    },
    {
      key: "id",
      header: "",
      className: "w-12",
      render: (r) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => router.push(`/super-admin/users/${r.id}`)}
            className="text-text-secondary hover:text-text-primary p-1"
            title="View details"
          >
            <MoreHorizontal size={16} />
          </button>
          <button
            onClick={() => handleStatusToggle(r)}
            className="text-text-secondary hover:text-text-primary p-1"
            title={r.status === "ACTIVE" ? "Deactivate user" : "Activate user"}
          >
            {r.status === "ACTIVE" ? <ShieldOff size={16} /> : <Shield size={16} />}
          </button>
        </div>
      ),
    },
  ];

  return (
    <PageContainer
      title="User Management"
      subtitle="Manage users, assign roles, and control account status."
      actions={
        <Button variant="primary" leftIcon={<Plus size={16} />} onClick={() => router.push("/super-admin/users")}>
          Add User
        </Button>
      }
    >
      <div className="flex items-center gap-4 mb-4">
        <SearchBar value={search} onChange={setSearch} placeholder="Search users…" className="max-w-sm" />
      </div>

      <Table
        columns={columns}
        data={users}
        loading={loading}
        emptyTitle="No users found"
        emptyDescription="Users will appear here once they register."
      />

      <div className="mt-4">
        <Pagination page={page} pageSize={pageSize} total={total} onPageChange={setPage} />
      </div>
    </PageContainer>
  );
}
