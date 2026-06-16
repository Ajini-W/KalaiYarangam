"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { SearchBar } from "@/components/ui/SearchBar";
import { Table, type Column } from "@/components/ui/Table";

interface Booking {
  id: number;
  customer: string;
  item: string;
  from: string;
  to: string;
  amount: string;
  status: "confirmed" | "dispatched" | "returned" | "pending" | "cancelled";
}

const MOCK: Booking[] = [
  { id: 1, customer: "Raj Weddings",     item: "PA Sound System 2KW", from: "15 Jun", to: "16 Jun", amount: "₹5000",  status: "confirmed" },
  { id: 2, customer: "Priya Events",     item: "LED Wall 10x6ft",     from: "14 Jun", to: "14 Jun", amount: "₹5000",  status: "dispatched" },
  { id: 3, customer: "Arun Decor",       item: "Bridal Costume Set A",from: "13 Jun", to: "13 Jun", amount: "₹1600",  status: "returned" },
  { id: 4, customer: "Meena Caterers",   item: "Round Table (set 10)", from: "20 Jun", to: "20 Jun", amount: "₹1200",  status: "pending" },
];

const statusVariant: Record<Booking["status"], "brand" | "info" | "success" | "warning" | "danger"> = {
  confirmed: "brand", dispatched: "info", returned: "success", pending: "warning", cancelled: "danger",
};

const columns: Column<Booking>[] = [
  { key: "id",       header: "#",        render: (r) => `#BK${String(r.id).padStart(4,"0")}` },
  { key: "customer", header: "Customer", sortable: true },
  { key: "item",     header: "Item" },
  { key: "from",     header: "From" },
  { key: "to",       header: "To" },
  { key: "amount",   header: "Amount" },
  { key: "status",   header: "Status",   render: (r) => <Badge variant={statusVariant[r.status]}>{r.status}</Badge> },
];

export default function BookingsPage() {
  const [search, setSearch] = React.useState("");
  const filtered = MOCK.filter((b) => !search || b.customer.toLowerCase().includes(search.toLowerCase()) || b.item.toLowerCase().includes(search.toLowerCase()));

  return (
    <PageContainer
      title="Rental Bookings"
      subtitle="Manage all rental reservations"
      actions={<Button leftIcon={<Plus size={16} />}>New Booking</Button>}
    >
      <div className="mb-4">
        <SearchBar value={search} onChange={setSearch} placeholder="Search bookings…" className="w-64" />
      </div>
      <Table columns={columns} data={filtered} />
    </PageContainer>
  );
}
