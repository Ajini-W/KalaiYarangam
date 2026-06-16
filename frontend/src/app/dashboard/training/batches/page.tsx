"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { SearchBar } from "@/components/ui/SearchBar";
import { Table, type Column } from "@/components/ui/Table";

interface Batch {
  id: number;
  name: string;
  course: string;
  trainer: string;
  schedule: string;
  enrolled: number;
  capacity: number;
  status: "active" | "full" | "upcoming" | "closed";
}

const MOCK: Batch[] = [
  { id: 1, name: "BN-Morning-01", course: "Bharatanatyam", trainer: "Lakshmi S.", schedule: "Mon/Wed/Fri 7am", enrolled: 18, capacity: 20, status: "active"   },
  { id: 2, name: "KRT-Eve-02",    course: "Karate",        trainer: "Rajan P.",   schedule: "Tue/Thu 6pm",     enrolled: 20, capacity: 20, status: "full"     },
  { id: 3, name: "YOGA-AM-03",    course: "Yoga",          trainer: "Priya M.",   schedule: "Daily 6am",       enrolled: 12, capacity: 25, status: "active"   },
  { id: 4, name: "ROB-WE-04",     course: "Robotics",      trainer: "Arun K.",    schedule: "Sat/Sun 10am",    enrolled: 0,  capacity: 15, status: "upcoming" },
];

const statusVariant: Record<Batch["status"], "success" | "danger" | "info" | "default"> = {
  active: "success", full: "danger", upcoming: "info", closed: "default",
};

const columns: Column<Batch>[] = [
  { key: "name",     header: "Batch",    sortable: true },
  { key: "course",   header: "Course",   sortable: true },
  { key: "trainer",  header: "Trainer" },
  { key: "schedule", header: "Schedule" },
  { key: "enrolled", header: "Students", render: (r) => `${r.enrolled} / ${r.capacity}` },
  { key: "status",   header: "Status",   render: (r) => <Badge variant={statusVariant[r.status]}>{r.status}</Badge> },
];

export default function BatchesPage() {
  const [search, setSearch] = React.useState("");
  const filtered = MOCK.filter((b) => !search || b.name.toLowerCase().includes(search.toLowerCase()) || b.course.toLowerCase().includes(search.toLowerCase()));

  return (
    <PageContainer
      title="Batches"
      subtitle="Manage your training batches and schedules"
      actions={<Button leftIcon={<Plus size={16} />}>New Batch</Button>}
    >
      <div className="mb-4">
        <SearchBar value={search} onChange={setSearch} placeholder="Search batches…" className="w-64" />
      </div>
      <Table columns={columns} data={filtered} />
    </PageContainer>
  );
}
