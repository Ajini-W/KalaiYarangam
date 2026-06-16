"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { SearchBar } from "@/components/ui/SearchBar";
import { Table, type Column } from "@/components/ui/Table";

interface Event {
  id: number;
  name: string;
  client: string;
  type: string;
  date: string;
  budget: string;
  status: "enquiry" | "planning" | "confirmed" | "executing" | "closed";
}

const MOCK: Event[] = [
  { id: 1, name: "Raj & Priya Wedding",    client: "Raj Family",   type: "Wedding",   date: "20 Jun 2026", budget: "₹8L",   status: "confirmed" },
  { id: 2, name: "TechCorp Annual Day",    client: "TechCorp",     type: "Corporate", date: "25 Jun 2026", budget: "₹3.5L", status: "planning" },
  { id: 3, name: "Arjun Birthday",         client: "Arjun Raj",    type: "Birthday",  date: "18 Jun 2026", budget: "₹45K",  status: "executing" },
  { id: 4, name: "Meena Music Concert",    client: "Meena Events", type: "Concert",   date: "30 Jun 2026", budget: "₹1.2L", status: "enquiry" },
  { id: 5, name: "ABC Product Launch",     client: "ABC Corp",     type: "Corporate", date: "10 Jun 2026", budget: "₹5L",   status: "closed" },
];

const statusVariant: Record<Event["status"], "info" | "warning" | "brand" | "success" | "default"> = {
  enquiry: "info", planning: "warning", confirmed: "brand", executing: "success", closed: "default",
};

const columns: Column<Event>[] = [
  { key: "name",   header: "Event",  sortable: true },
  { key: "client", header: "Client" },
  { key: "type",   header: "Type",   sortable: true },
  { key: "date",   header: "Date",   sortable: true },
  { key: "budget", header: "Budget" },
  { key: "status", header: "Status", render: (r) => <Badge variant={statusVariant[r.status]}>{r.status}</Badge> },
];

export default function EventsPage() {
  const [search, setSearch] = React.useState("");
  const filtered = MOCK.filter((e) => !search || e.name.toLowerCase().includes(search.toLowerCase()) || e.client.toLowerCase().includes(search.toLowerCase()));

  return (
    <PageContainer
      title="Events"
      subtitle="End-to-end event management"
      actions={<Button leftIcon={<Plus size={16} />}>New Event</Button>}
    >
      <div className="mb-4">
        <SearchBar value={search} onChange={setSearch} placeholder="Search events…" className="w-64" />
      </div>
      <Table columns={columns} data={filtered} />
    </PageContainer>
  );
}
