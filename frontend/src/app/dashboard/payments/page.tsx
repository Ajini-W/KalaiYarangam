"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { SearchBar } from "@/components/ui/SearchBar";
import { FilterBar } from "@/components/ui/FilterBar";
import { Table, type Column } from "@/components/ui/Table";
import { Pagination } from "@/components/ui/Pagination";

interface Payment {
  id: number;
  ref: string;
  student: string;
  module: "training" | "rental" | "events";
  amount: string;
  mode: string;
  status: "success" | "pending" | "failed";
  date: string;
}

const MOCK: Payment[] = [
  { id: 1, ref: "PAY-001", student: "Priya Sharma",  module: "training", amount: "₹3,600", mode: "UPI",    status: "success", date: "13 Jun 2026" },
  { id: 2, ref: "PAY-002", student: "Raj Weddings",  module: "events",   amount: "₹25,000",mode: "NEFT",   status: "success", date: "13 Jun 2026" },
  { id: 3, ref: "PAY-003", student: "Arjun Raj",     module: "training", amount: "₹1,800", mode: "Cash",   status: "success", date: "12 Jun 2026" },
  { id: 4, ref: "PAY-004", student: "Priya Events",  module: "rental",   amount: "₹5,000", mode: "Card",   status: "pending", date: "12 Jun 2026" },
  { id: 5, ref: "PAY-005", student: "Meena Devi",    module: "training", amount: "₹1,800", mode: "UPI",    status: "failed",  date: "11 Jun 2026" },
];

const statusVariant: Record<Payment["status"], "success" | "warning" | "danger"> = {
  success: "success", pending: "warning", failed: "danger",
};
const moduleVariant: Record<Payment["module"], "brand" | "info" | "warning"> = {
  training: "brand", rental: "info", events: "warning",
};

const columns: Column<Payment>[] = [
  { key: "ref",     header: "Ref #" },
  { key: "student", header: "From",   sortable: true },
  { key: "module",  header: "Module", render: (r) => <Badge variant={moduleVariant[r.module]}>{r.module}</Badge> },
  { key: "amount",  header: "Amount", sortable: true },
  { key: "mode",    header: "Mode" },
  { key: "status",  header: "Status", render: (r) => <Badge variant={statusVariant[r.status]}>{r.status}</Badge> },
  { key: "date",    header: "Date",   sortable: true },
];

export default function PaymentsPage() {
  const [search, setSearch] = React.useState("");
  const [filters, setFilters] = React.useState<Record<string, string>>({});
  const [page, setPage] = React.useState(1);

  const filtered = MOCK.filter((p) =>
    (!search || p.student.toLowerCase().includes(search.toLowerCase()) || p.ref.toLowerCase().includes(search.toLowerCase())) &&
    (!filters.status || p.status === filters.status) &&
    (!filters.module || p.module === filters.module),
  );

  return (
    <PageContainer
      title="Payments"
      subtitle="All payment transactions"
      actions={<Button leftIcon={<Plus size={16} />}>Record Payment</Button>}
    >
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <SearchBar value={search} onChange={setSearch} placeholder="Search payments…" className="w-64" />
        <FilterBar
          filters={[
            { key: "module", label: "Module", options: [
              { value: "training", label: "Training" },
              { value: "rental",   label: "Rental" },
              { value: "events",   label: "Events" },
            ]},
            { key: "status", label: "Status", options: [
              { value: "success", label: "Success" },
              { value: "pending", label: "Pending" },
              { value: "failed",  label: "Failed" },
            ]},
          ]}
          active={filters}
          onChange={(k, v) => setFilters((p) => ({ ...p, [k]: v }))}
          onClear={() => setFilters({})}
        />
      </div>
      <Table columns={columns} data={filtered} />
      <div className="mt-4">
        <Pagination page={page} pageSize={10} total={filtered.length} onPageChange={setPage} />
      </div>
    </PageContainer>
  );
}
