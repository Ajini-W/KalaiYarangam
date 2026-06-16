"use client";

import * as React from "react";
import { UserPlus } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { SearchBar } from "@/components/ui/SearchBar";
import { Table, type Column } from "@/components/ui/Table";

interface User {
  id: number;
  name: string;
  email: string;
  role: "owner" | "manager" | "staff" | "trainer";
  branch: string;
  status: "active" | "inactive";
  joined: string;
}

const MOCK: User[] = [
  { id: 1, name: "Admin User",    email: "admin@myacademy.com",   role: "owner",   branch: "All",      status: "active",   joined: "Jan 2026" },
  { id: 2, name: "Lakshmi S.",    email: "lakshmi@myacademy.com", role: "trainer", branch: "Chennai",  status: "active",   joined: "Feb 2026" },
  { id: 3, name: "Rajan P.",      email: "rajan@myacademy.com",   role: "trainer", branch: "Chennai",  status: "active",   joined: "Feb 2026" },
  { id: 4, name: "Kavitha M.",    email: "kavitha@myacademy.com", role: "staff",   branch: "Chennai",  status: "active",   joined: "Mar 2026" },
  { id: 5, name: "Suresh R.",     email: "suresh@myacademy.com",  role: "manager", branch: "Madurai",  status: "inactive", joined: "Mar 2026" },
];

const roleVariant: Record<User["role"], "brand" | "info" | "default" | "warning"> = {
  owner: "brand", manager: "info", staff: "default", trainer: "warning",
};

const columns: Column<User>[] = [
  { key: "name",   header: "Name",   sortable: true },
  { key: "email",  header: "Email" },
  { key: "role",   header: "Role",   render: (r) => <Badge variant={roleVariant[r.role]}>{r.role}</Badge> },
  { key: "branch", header: "Branch" },
  { key: "status", header: "Status", render: (r) => <Badge variant={r.status === "active" ? "success" : "default"}>{r.status}</Badge> },
  { key: "joined", header: "Joined" },
];

export default function UsersPage() {
  const [search, setSearch] = React.useState("");
  const filtered = MOCK.filter((u) => !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));

  return (
    <PageContainer
      title="Users"
      subtitle="Manage team members and permissions"
      actions={<Button leftIcon={<UserPlus size={16} />}>Invite User</Button>}
    >
      <div className="mb-4">
        <SearchBar value={search} onChange={setSearch} placeholder="Search users…" className="w-64" />
      </div>
      <Table columns={columns} data={filtered} />
    </PageContainer>
  );
}
