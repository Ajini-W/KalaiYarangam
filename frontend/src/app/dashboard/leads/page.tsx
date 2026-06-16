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

interface Lead {
  id: number;
  name: string;
  phone: string;
  course: string;
  source: string;
  status: "new" | "followup" | "enrolled" | "converted" | "lost";
  date: string;
}

const MOCK: Lead[] = [
  { id: 1, name: "Priya Sharma",  phone: "9876543210", course: "Bharatanatyam", source: "Walk-in",   status: "new",      date: "14 Jun" },
  { id: 2, name: "Ravi Kumar",    phone: "9876543211", course: "Karate",        source: "Referral",  status: "followup", date: "13 Jun" },
  { id: 3, name: "Meena Devi",    phone: "9876543212", course: "Yoga",          source: "Instagram", status: "enrolled", date: "13 Jun" },
  { id: 4, name: "Arjun Raj",     phone: "9876543213", course: "Robotics",      source: "Website",   status: "new",      date: "12 Jun" },
  { id: 5, name: "Sneha Pillai",  phone: "9876543214", course: "Dance",         source: "Facebook",  status: "converted",date: "11 Jun" },
  { id: 6, name: "Kiran Babu",    phone: "9876543215", course: "Silambam",      source: "Walk-in",   status: "lost",     date: "10 Jun" },
];

const statusVariant: Record<Lead["status"], "info" | "warning" | "brand" | "success" | "danger"> = {
  new: "info", followup: "warning", enrolled: "brand", converted: "success", lost: "danger",
};

const columns: Column<Lead>[] = [
  { key: "name",   header: "Name",   sortable: true },
  { key: "phone",  header: "Phone" },
  { key: "course", header: "Course", sortable: true },
  { key: "source", header: "Source" },
  { key: "status", header: "Status", render: (r) => <Badge variant={statusVariant[r.status]}>{r.status}</Badge> },
  { key: "date",   header: "Date",   sortable: true },
];

export default function LeadsPage() {
  const [search, setSearch] = React.useState("");
  const [filters, setFilters] = React.useState<Record<string, string>>({});
  const [page, setPage] = React.useState(1);

  const filtered = MOCK.filter((l) =>
    (!search || l.name.toLowerCase().includes(search.toLowerCase()) || l.course.toLowerCase().includes(search.toLowerCase())) &&
    (!filters.status || l.status === filters.status),
  );

  return (
    <PageContainer
      title="Leads"
      subtitle="Track and manage your enquiries"
      actions={<Button leftIcon={<Plus size={16} />}>Add Lead</Button>}
    >
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <SearchBar value={search} onChange={setSearch} placeholder="Search leads…" className="w-64" />
        <FilterBar
          filters={[{ key: "status", label: "Status", options: [
            { value: "new", label: "New" }, { value: "followup", label: "Follow-up" },
            { value: "enrolled", label: "Enrolled" }, { value: "converted", label: "Converted" }, { value: "lost", label: "Lost" },
          ]}]}
          active={filters}
          onChange={(k, v) => setFilters((p) => ({ ...p, [k]: v }))}
          onClear={() => setFilters({})}
        />
      </div>

      <Table columns={columns} data={filtered} selectable />
      <div className="mt-4">
        <Pagination page={page} pageSize={10} total={filtered.length} onPageChange={setPage} />
      </div>
    </PageContainer>
  );
}
