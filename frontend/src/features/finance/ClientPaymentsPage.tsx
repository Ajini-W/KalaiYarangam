"use client";

import * as React from "react";
import { Download, Printer } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { StatCard } from "@/components/ui/Card";
import { Table, type Column } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { SearchBar } from "@/components/ui/SearchBar";
import { SkeletonTable } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { PaymentStatusBadge } from "@/features/finance/components/StatusBadge";
import { getPayments, type Payment, type PaymentMethod } from "@/services/finance";
import { useAuthStore } from "@/store/auth.store";
import { DollarSign, Wallet } from "lucide-react";

export default function ClientPaymentsPage() {
  const user = useAuthStore((s) => s.user);
  const [payments, setPayments] = React.useState<Payment[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");

  React.useEffect(() => {
    if (!user?.id) return;
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await getPayments({
          studentId: user.id,
          search: search || undefined,
          pageSize: 50,
        });
        setPayments(res.data.items);
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [user?.id, search]);

  const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0);
  const completedAmount = payments.filter((p) => p.status === "completed").reduce((sum, p) => sum + p.amount, 0);

  const columns: Column<Payment>[] = [
    { key: "receiptNumber", header: "Receipt #" },
    { key: "invoiceNumber", header: "Invoice" },
    {
      key: "amount",
      header: "Amount",
      render: (row) => `$${row.amount.toLocaleString()}`,
    },
    {
      key: "paymentMethod",
      header: "Method",
      render: (row) => {
        const labels: Record<PaymentMethod, string> = {
          cash: "Cash", card: "Card",
          bank_transfer: "Bank Transfer", cheque: "Cheque", online: "Online",
        };
        return labels[row.paymentMethod] ?? row.paymentMethod;
      },
    },
    {
      key: "status",
      header: "Status",
      render: (row) => <PaymentStatusBadge status={row.status} />,
    },
    {
      key: "createdAt",
      header: "Date",
      render: (row) => new Date(row.createdAt).toLocaleDateString(),
    },
    {
      key: "actions",
      header: "",
      render: () => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="xs" title="Download Receipt">
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
    <PageContainer title="Payment History" subtitle="View your payment records">
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard title="Total Payments" value={payments.length} icon={<Wallet size={20} />} />
        <StatCard
          title="Total Amount"
          value={`$${totalAmount.toLocaleString()}`}
          icon={<DollarSign size={20} />}
        />
        <StatCard
          title="Completed"
          value={`$${completedAmount.toLocaleString()}`}
          icon={<DollarSign size={20} />}
          deltaType="increase"
        />
      </div>

      <div className="mb-4">
        <SearchBar
          value={search}
          onChange={(v) => setSearch(v)}
          placeholder="Search payments…"
          className="w-full sm:max-w-xs"
        />
      </div>

      {loading ? (
        <SkeletonTable rows={4} />
      ) : payments.length === 0 ? (
        <EmptyState title="No payments" description="No payments found for your account." />
      ) : (
        <Table columns={columns} data={payments} loading={false} />
      )}
    </PageContainer>
  );
}
