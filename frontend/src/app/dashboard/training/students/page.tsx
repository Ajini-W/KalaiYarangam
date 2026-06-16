"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { SearchBar } from "@/components/ui/SearchBar";
import { Table, type Column } from "@/components/ui/Table";

interface Student {
  id: number;
  name: string;
  phone: string;
  batch: string;
  attendance: string;
  feeStatus: "paid" | "partial" | "due";
  joined: string;
}

const MOCK: Student[] = [
  { id: 1, name: "Priya Sharma",  phone: "9876543210", batch: "BN-Morning-01", attendance: "92%", feeStatus: "paid",    joined: "Jan 2026" },
  { id: 2, name: "Meena Devi",    phone: "9876543212", batch: "YOGA-AM-03",    attendance: "85%", feeStatus: "partial", joined: "Feb 2026" },
  { id: 3, name: "Kiran Babu",    phone: "9876543215", batch: "KRT-Eve-02",    attendance: "78%", feeStatus: "due",     joined: "Mar 2026" },
  { id: 4, name: "Arjun Raj",     phone: "9876543213", batch: "ROB-WE-04",     attendance: "95%", feeStatus: "paid",    joined: "Apr 2026" },
];

const feeVariant: Record<Student["feeStatus"], "success" | "warning" | "danger"> = {
  paid: "success", partial: "warning", due: "danger",
};

const columns: Column<Student>[] = [
  { key: "name",       header: "Name",       sortable: true },
  { key: "phone",      header: "Phone" },
  { key: "batch",      header: "Batch" },
  { key: "attendance", header: "Attendance",  sortable: true },
  { key: "feeStatus",  header: "Fee Status",  render: (r) => <Badge variant={feeVariant[r.feeStatus]}>{r.feeStatus}</Badge> },
  { key: "joined",     header: "Joined" },
];

export default function StudentsPage() {
  const [search, setSearch] = React.useState("");
  const filtered = MOCK.filter((s) => !search || s.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <PageContainer
      title="Students"
      subtitle="Manage enrolled students"
      actions={<Button leftIcon={<Plus size={16} />}>Add Student</Button>}
    >
      <div className="mb-4">
        <SearchBar value={search} onChange={setSearch} placeholder="Search students…" className="w-64" />
      </div>
      <Table columns={columns} data={filtered} />
    </PageContainer>
  );
}
