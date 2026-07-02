"use client";

import * as React from "react";
import { Download, Printer, Eye, RotateCcw as RefundIcon } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { StatCard } from "@/components/ui/Card";
import { Table, type Column } from "@/components/ui/Table";
import { Pagination } from "@/components/ui/Pagination";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { SearchBar } from "@/components/ui/SearchBar";
import { FilterBar, type FilterDef } from "@/components/ui/FilterBar";
import { EmptyState } from "@/components/ui/EmptyState";
import { SkeletonTable } from "@/components/ui/Skeleton";
import { PaymentStatusBadge } from "@/features/finance/components/StatusBadge";
import { getPayments, type Payment, type PaymentStatus, type PaymentMethod } from "@/services/finance";
import { useAuthStore } from "@/store/auth.store";
import { Wallet, DollarSign, CheckCircle2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

const statusFilters: FilterDef[] = [
  {
    key: "status",
    label: "All Statuses",
    options: [
      { value: "completed", label: "Completed" },
      { value: "pending", label: "Pending" },
      { value: "failed", label: "Failed" },
      { value: "refunded", label: "Refunded" },
    ],
  },
];

const methodFilters: FilterDef[] = [
  {
    key: "paymentMethod",
    label: "All Methods",
    options: [
      { value: "cash", label: "Cash" },
      { value: "card", label: "Card" },
      { value: "bank_transfer", label: "Bank Transfer" },
      { value: "cheque", label: "Cheque" },
      { value: "online", label: "Online" },
    ],
  },
];

export default function PaymentHistoryPage() {
  const user = useAuthStore((s) => s.user);
  const role = user?.role ?? "";
  const userId = user?.id ?? "";

  const isSuperAdmin = role === "SUPER_ADMIN";
  const isOwner = role === "OWNER";
  const isBranchManager = role === "BRANCH_MANAGER";
  const isStaff = role === "STAFF";
  const isStudent = role === "STUDENT";
  const isClient = role === "CLIENT";

  const canRefund = isSuperAdmin;
  const canDownload = isSuperAdmin || isOwner || isBranchManager || isStaff || isStudent || isClient;
  const canPrint = isSuperAdmin || isOwner;

  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);
  const [payments, setPayments] = React.useState<Payment[]>([]);
  const [total, setTotal] = React.useState(0);
  const [page, setPage] = React.useState(1);
  const [pageSize] = React.useState(10);
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("");
  const [methodFilter, setMethodFilter] = React.useState("");
  const [dateFrom, setDateFrom] = React.useState("");
  const [dateTo, setDateTo] = React.useState("");
  const [sortKey, setSortKey] = React.useState("");
  const [sortDir, setSortDir] = React.useState<"asc" | "desc">("asc");
  const [viewPayment, setViewPayment] = React.useState<Payment | null>(null);

  const fetchPayments = React.useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const params: Record<string, unknown> = {
        page,
        pageSize,
        search: search || undefined,
        status: (statusFilter as PaymentStatus) || undefined,
        paymentMethod: (methodFilter as PaymentMethod) || undefined,
        dateFrom: dateFrom || undefined,
        dateTo: dateTo || undefined,
        sortBy: sortKey || undefined,
        sortDir: sortKey ? sortDir : undefined,
      };
      if (isStudent || isClient) {
        params.studentId = userId;
      }
      const res = await getPayments(params);
      setPayments(res.data.items);
      setTotal(res.data.total);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, search, statusFilter, methodFilter, dateFrom, dateTo, sortKey, sortDir, userId, isStudent, isClient]);

  React.useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const handleRefund = async (payment: Payment) => {
    if (!confirm(`Refund payment ${payment.receiptNumber}?`)) return;
    try {
      const { refundPayment } = await import("@/services/finance");
      await refundPayment(payment.id);
      toast.success("Payment refunded");
      fetchPayments();
    } catch {
      toast.error("Failed to refund payment");
    }
  };

  const summaryCards = React.useMemo(() => {
    const completed = payments.filter((p) => p.status === "completed");
    const failed = payments.filter((p) => p.status === "failed");
    const refunded = payments.filter((p) => p.status === "refunded");
    return {
      total: total,
      totalAmount: payments.reduce((s, p) => s + p.amount, 0),
      completedAmount: completed.reduce((s, p) => s + p.amount, 0),
      failedCount: failed.length,
      refundedCount: refunded.length,
    };
  }, [payments, total]);

  const columns: Column<Payment>[] = React.useMemo(() => [
    { key: "receiptNumber", header: "Receipt #", sortable: true },
    { key: "studentName", header: "Student", sortable: true },
    {
      key: "invoiceNumber",
      header: "Invoice",
      render: (row) => (
        <span className="font-mono text-xs">{row.invoiceNumber}</span>
      ),
    },
    {
      key: "amount",
      header: "Amount",
      render: (row) => (
        <span className="font-medium">${row.amount.toLocaleString()}</span>
      ),
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
      sortable: true,
      render: (row) => <PaymentStatusBadge status={row.status} />,
    },
    {
      key: "collectedByName",
      header: "Collected By",
    },
    {
      key: "createdAt",
      header: "Date",
      render: (row) => new Date(row.createdAt).toLocaleDateString(),
    },
    {
      key: "actions",
      header: "",
      render: (row) => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="xs" onClick={() => { setViewPayment(row); toast.info("Viewing payment details"); }} title="View Details">
            <Eye size={14} />
          </Button>
          {canDownload && (
            <Button variant="ghost" size="xs" onClick={() => toast.success("Downloading receipt...")} title="Download Receipt">
              <Download size={14} />
            </Button>
          )}
          {canPrint && (
            <Button variant="ghost" size="xs" onClick={() => { window.print(); toast.info("Printing receipt..."); }} title="Print Receipt">
              <Printer size={14} />
            </Button>
          )}
          {canRefund && row.status === "completed" && (
            <Button
              variant="ghost"
              size="xs"
              onClick={() => handleRefund(row)}
              title="Refund"
              className="text-warning"
            >
              <RefundIcon size={14} />
            </Button>
          )}
        </div>
      ),
    },
  ], [canRefund, canDownload, canPrint]);

  const methodLabels: Record<PaymentMethod, string> = {
    cash: "Cash", card: "Card",
    bank_transfer: "Bank Transfer", cheque: "Cheque", online: "Online",
  };

  return (
    <PageContainer
      title="Payment History"
      subtitle="View all payment records and receipts"
    >
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Payments"
          value={summaryCards.total}
          icon={<Wallet size={20} />}
        />
        <StatCard
          title="Total Amount"
          value={`$${summaryCards.totalAmount.toLocaleString()}`}
          icon={<DollarSign size={20} />}
          deltaType="increase"
        />
        <StatCard
          title="Completed"
          value={`$${summaryCards.completedAmount.toLocaleString()}`}
          icon={<CheckCircle2 size={20} />}
          deltaType="increase"
        />
        <StatCard
          title="Failed"
          value={summaryCards.failedCount}
          icon={<AlertTriangle size={20} />}
          deltaType="decrease"
        />
      </div>

      <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <SearchBar
          value={search}
          onChange={(v) => { setSearch(v); setPage(1); }}
          placeholder="Search by student, invoice, or receipt…"
          className="w-full sm:max-w-xs"
        />
        <div className="flex flex-wrap items-center gap-2">
          <Input
            label="From Date"
            type="date"
            value={dateFrom}
            onChange={(e) => { setDateFrom(e.target.value); setPage(1); }}
            className="w-36"
          />
          <Input
            label="To Date"
            type="date"
            value={dateTo}
            onChange={(e) => { setDateTo(e.target.value); setPage(1); }}
            className="w-36"
          />
          <FilterBar
            filters={[...statusFilters, ...methodFilters]}
            active={{ status: statusFilter, paymentMethod: methodFilter }}
            onChange={(key, value) => {
              if (key === "status") setStatusFilter(value);
              if (key === "paymentMethod") setMethodFilter(value);
              setPage(1);
            }}
            onClear={() => {
              setStatusFilter("");
              setMethodFilter("");
              setDateFrom("");
              setDateTo("");
              setPage(1);
            }}
          />
        </div>
      </div>

      {loading ? (
        <SkeletonTable rows={5} />
      ) : error || payments.length === 0 ? (
        <EmptyState
          title="No payment history found"
          description={search || statusFilter || methodFilter ? "Try adjusting your search or filters" : "Payment history will appear here once payments are recorded."}
        />
      ) : (
        <>
          <Table
            columns={columns}
            data={payments}
            loading={false}
            sortKey={sortKey}
            sortDir={sortDir}
            onSort={handleSort}
          />
          <Pagination
            page={page}
            pageSize={pageSize}
            total={total}
            onPageChange={setPage}
            className="mt-4"
          />
        </>
      )}

      <Modal
        open={!!viewPayment}
        onClose={() => setViewPayment(null)}
        title={`Payment Details - ${viewPayment?.receiptNumber ?? ""}`}
        size="md"
        footer={
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => setViewPayment(null)}>
              Close
            </Button>
            {canDownload && (
              <Button variant="outline" leftIcon={<Download size={14} />} onClick={() => toast.success("Downloading receipt...")}>
                Download Receipt
              </Button>
            )}
            {canPrint && (
              <Button variant="outline" leftIcon={<Printer size={14} />} onClick={() => { window.print(); toast.info("Printing receipt..."); }}>
                Print Receipt
              </Button>
            )}
          </div>
        }
      >
        {viewPayment && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-medium text-text-secondary">Receipt Number</p>
                <p className="text-sm font-semibold text-text-primary">{viewPayment.receiptNumber}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-text-secondary">Status</p>
                <div className="mt-0.5"><PaymentStatusBadge status={viewPayment.status} /></div>
              </div>
              <div>
                <p className="text-xs font-medium text-text-secondary">Student</p>
                <p className="text-sm text-text-primary">{viewPayment.studentName}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-text-secondary">Invoice</p>
                <p className="text-sm font-mono text-text-primary">{viewPayment.invoiceNumber}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-text-secondary">Amount</p>
                <p className="text-sm font-semibold text-text-primary">${viewPayment.amount.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-text-secondary">Payment Method</p>
                <p className="text-sm text-text-primary">{methodLabels[viewPayment.paymentMethod]}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-text-secondary">Transaction ID</p>
                <p className="text-sm font-mono text-text-primary">{viewPayment.transactionId ?? "—"}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-text-secondary">Collected By</p>
                <p className="text-sm text-text-primary">{viewPayment.collectedByName}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-text-secondary">Date</p>
                <p className="text-sm text-text-primary">{new Date(viewPayment.createdAt).toLocaleString()}</p>
              </div>
            </div>
            {viewPayment.notes && (
              <div>
                <p className="text-xs font-medium text-text-secondary">Notes</p>
                <p className="text-sm text-text-primary">{viewPayment.notes}</p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </PageContainer>
  );
}
