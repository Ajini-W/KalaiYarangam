"use client";

import * as React from "react";
import { Download, Printer } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { StatCard } from "@/components/ui/Card";
import { Table, type Column } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { SearchBar } from "@/components/ui/SearchBar";
import { FilterBar, type FilterDef } from "@/components/ui/FilterBar";
import { SkeletonTable } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { InvoiceStatusBadge } from "@/features/finance/components/StatusBadge";
import { getInvoices, type Invoice, type InvoiceStatus } from "@/services/finance";
import { useAuthStore } from "@/store/auth.store";
import { FileText, CheckCircle2, AlertTriangle } from "lucide-react";

const statusFilters: FilterDef[] = [
  {
    key: "status",
    label: "All Statuses",
    options: [
      { value: "paid", label: "Paid" },
      { value: "partial", label: "Partial" },
      { value: "overdue", label: "Overdue" },
      { value: "pending", label: "Pending" },
    ],
  },
];

export default function ClientInvoicesPage() {
  const user = useAuthStore((s) => s.user);
  const [invoices, setInvoices] = React.useState<Invoice[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("");

  React.useEffect(() => {
    if (!user?.id) return;
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await getInvoices({
          studentId: user.id,
          search: search || undefined,
          status: (statusFilter as InvoiceStatus) || undefined,
          pageSize: 50,
        });
        setInvoices(res.data.items);
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [user?.id, search, statusFilter]);

  const paid = invoices.filter((i) => i.status === "paid").length;
  const overdue = invoices.filter((i) => i.status === "overdue").length;

  const columns: Column<Invoice>[] = [
    { key: "invoiceNumber", header: "Invoice #" },
    { key: "courseName", header: "Course" },
    {
      key: "totalAmount",
      header: "Amount",
      render: (row) => `$${row.totalAmount.toLocaleString()}`,
    },
    {
      key: "paidAmount",
      header: "Paid",
      render: (row) => `$${row.paidAmount.toLocaleString()}`,
    },
    {
      key: "dueAmount",
      header: "Due",
      render: (row) => (
        <span className={row.dueAmount > 0 ? "text-danger font-medium" : "text-success"}>
          ${row.dueAmount.toLocaleString()}
        </span>
      ),
    },
    {
      key: "issueDate",
      header: "Issue Date",
      render: (row) => new Date(row.issueDate).toLocaleDateString(),
    },
    {
      key: "dueDate",
      header: "Due Date",
      render: (row) => new Date(row.dueDate).toLocaleDateString(),
    },
    {
      key: "status",
      header: "Status",
      render: (row) => <InvoiceStatusBadge status={row.status} />,
    },
    {
      key: "actions",
      header: "",
      render: () => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="xs" title="Download Invoice">
            <Download size={14} />
          </Button>
          <Button variant="ghost" size="xs" title="Print" onClick={() => window.print()}>
            <Printer size={14} />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <PageContainer title="Invoices" subtitle="View your invoices and billing history">
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard title="Total Invoices" value={invoices.length} icon={<FileText size={20} />} />
        <StatCard title="Paid" value={paid} icon={<CheckCircle2 size={20} />} deltaType="increase" />
        <StatCard title="Overdue" value={overdue} icon={<AlertTriangle size={20} />} deltaType="decrease" />
      </div>

      <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <SearchBar
          value={search}
          onChange={(v) => setSearch(v)}
          placeholder="Search invoices…"
          className="w-full sm:max-w-xs"
        />
        <FilterBar
          filters={statusFilters}
          active={{ status: statusFilter }}
          onChange={(key, value) => setStatusFilter(value)}
          onClear={() => setStatusFilter("")}
        />
      </div>

      {loading ? (
        <SkeletonTable rows={4} />
      ) : invoices.length === 0 ? (
        <EmptyState title="No invoices" description="No invoices found for your account." />
      ) : (
        <Table columns={columns} data={invoices} loading={false} />
      )}
    </PageContainer>
  );
}
