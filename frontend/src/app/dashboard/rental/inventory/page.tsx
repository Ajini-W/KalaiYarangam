"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { SearchBar } from "@/components/ui/SearchBar";
import { FilterBar } from "@/components/ui/FilterBar";
import { Table, type Column } from "@/components/ui/Table";

interface Item {
  id: number;
  name: string;
  category: string;
  sku: string;
  quantity: number;
  available: number;
  dailyRate: string;
  condition: "excellent" | "good" | "fair" | "maintenance";
}

const MOCK: Item[] = [
  { id: 1, name: "Bridal Costume Set A",  category: "Costume",  sku: "CST-001", quantity: 5, available: 3, dailyRate: "₹800",  condition: "excellent" },
  { id: 2, name: "PA Sound System 2KW",   category: "Sound",    sku: "SND-001", quantity: 2, available: 1, dailyRate: "₹2500", condition: "good" },
  { id: 3, name: "LED Wall 10x6ft",       category: "LED",      sku: "LED-001", quantity: 3, available: 3, dailyRate: "₹5000", condition: "excellent" },
  { id: 4, name: "Round Table (set of 10)",category: "Furniture",sku: "FRN-001",quantity: 10,available: 0, dailyRate: "₹1200", condition: "good" },
  { id: 5, name: "Generator 10KVA",       category: "Power",    sku: "GEN-001", quantity: 2, available: 2, dailyRate: "₹3000", condition: "maintenance" },
];

const conditionVariant: Record<Item["condition"], "success" | "info" | "warning" | "danger"> = {
  excellent: "success", good: "info", fair: "warning", maintenance: "danger",
};

const columns: Column<Item>[] = [
  { key: "name",      header: "Item",      sortable: true },
  { key: "category",  header: "Category",  sortable: true },
  { key: "sku",       header: "SKU" },
  { key: "quantity",  header: "Qty" },
  { key: "available", header: "Available", render: (r) => (
    <span className={r.available === 0 ? "text-danger font-medium" : ""}>{r.available}</span>
  )},
  { key: "dailyRate", header: "Rate/Day" },
  { key: "condition", header: "Condition",  render: (r) => <Badge variant={conditionVariant[r.condition]}>{r.condition}</Badge> },
];

export default function InventoryPage() {
  const [search, setSearch] = React.useState("");
  const [filters, setFilters] = React.useState<Record<string, string>>({});

  const filtered = MOCK.filter((i) =>
    (!search || i.name.toLowerCase().includes(search.toLowerCase())) &&
    (!filters.category || i.category === filters.category),
  );

  const categories = [...new Set(MOCK.map((i) => i.category))].map((c) => ({ value: c, label: c }));

  return (
    <PageContainer
      title="Inventory"
      subtitle="Track rental items and availability"
      actions={<Button leftIcon={<Plus size={16} />}>Add Item</Button>}
    >
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <SearchBar value={search} onChange={setSearch} placeholder="Search inventory…" className="w-64" />
        <FilterBar
          filters={[{ key: "category", label: "Category", options: categories }]}
          active={filters}
          onChange={(k, v) => setFilters((p) => ({ ...p, [k]: v }))}
          onClear={() => setFilters({})}
        />
      </div>
      <Table columns={columns} data={filtered} />
    </PageContainer>
  );
}
