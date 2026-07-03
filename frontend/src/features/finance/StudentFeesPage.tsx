"use client";

import * as React from "react";
import { Download, Printer } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { StatCard } from "@/components/ui/Card";
import { Table, type Column } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { SkeletonTable } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { InvoiceStatusBadge, PaymentStatusBadge } from "@/features/finance/components/StatusBadge";
import { getInvoices, type Invoice } from "@/services/finance";
import { getPayments, type Payment } from "@/services/finance";
import { useAuthStore } from "@/store/auth.store";
import { FileText, DollarSign } from "lucide-react";

export default function StudentFeesPage() {
  const user = useAuthStore((s) => s.user);
  const [invoices, setInvoices] = React.useState<Invoice[]>([]);
  const [payments, setPayments] = React.useState<Payment[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!user?.id) return;
    const fetch = async () => {
      setLoading(true);
      try {
        const [invRes, payRes] = await Promise.all([
          getInvoices({ studentId: user.id, pageSize: 50 }),
          getPayments({ studentId: user.id, pageSize: 50 }),
        ]);
        setInvoices(invRes.data.items);
        setPayments(payRes.data.items);
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [user?.id]);

  const totalDue = invoices.reduce((sum, inv) => sum + inv.dueAmount, 0);
  const totalPaid = invoices.reduce((sum, inv) => sum + inv.paidAmount, 0);

  const invoiceColumns: Column<Invoice>[] = [
    { key: "invoiceNumber", header: "Invoice #" },
    { key: "courseName", header: "Course" },
    {
      key: "totalAmount",
      header: "Amount",
      render: (row) => `$${row.totalAmount.toLocaleString()}`,
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

  const paymentColumns: Column<Payment>[] = [
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
        const labels: Record<string, string> = {
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
    <PageContainer title="Fees" subtitle="Your fee schedule, dues, and payment history">
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          title="Total Paid"
          value={`$${totalPaid.toLocaleString()}`}
          icon={<DollarSign size={20} />}
          deltaType="increase"
        />
        <StatCard
          title="Total Due"
          value={`$${totalDue.toLocaleString()}`}
          icon={<FileText size={20} />}
          deltaType={totalDue > 0 ? "decrease" : "increase"}
        />
        <StatCard
          title="Invoices"
          value={invoices.length}
          icon={<FileText size={20} />}
        />
      </div>

      <h3 className="mb-3 text-base font-semibold text-text-primary">Invoices</h3>
      {loading ? (
        <SkeletonTable rows={3} />
      ) : invoices.length === 0 ? (
        <EmptyState title="No invoices" description="You don't have any invoices yet." />
      ) : (
        <Table columns={invoiceColumns} data={invoices} loading={false} className="mb-8" />
      )}

      <h3 className="mb-3 text-base font-semibold text-text-primary">Payment History</h3>
      {loading ? (
        <SkeletonTable rows={3} />
      ) : payments.length === 0 ? (
        <EmptyState title="No payments" description="You haven't made any payments yet." />
      ) : (
        <Table columns={paymentColumns} data={payments} loading={false} />
      )}
    </PageContainer>
  );
}
