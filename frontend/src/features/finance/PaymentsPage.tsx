"use client";

import * as React from "react";
import { Plus, Eye, Download, Printer } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardHeader, CardTitle, CardBody, StatCard } from "@/components/ui/Card";
import { Table, type Column } from "@/components/ui/Table";
import { Pagination } from "@/components/ui/Pagination";
import { Modal, ConfirmModal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { SearchBar } from "@/components/ui/SearchBar";
import { FilterBar, type FilterDef } from "@/components/ui/FilterBar";
import { EmptyState } from "@/components/ui/EmptyState";
import { SkeletonTable } from "@/components/ui/Skeleton";
import { SearchableSelect } from "@/components/ui/SearchableSelect";
import { Select } from "@/components/ui/Select";
import { Badge } from "@/components/ui/Badge";
import { PaymentStatusBadge } from "@/features/finance/components/StatusBadge";
import { usePayments } from "@/features/finance/hooks/usePayments";
import { useAuthStore } from "@/store/auth.store";
import { toast } from "sonner";
import { Wallet, DollarSign, Ban, RotateCcw as RefundIcon } from "lucide-react";
import type { Payment, PaymentMethod } from "@/services/finance";

const paymentMethodOptions = [
  { value: "cash", label: "Cash" },
  { value: "card", label: "Card" },
  { value: "bank_transfer", label: "Bank Transfer" },
  { value: "cheque", label: "Cheque" },
  { value: "online", label: "Online" },
];

const methodChipVariant: Record<PaymentMethod, "success" | "brand" | "secondary" | "outline" | "info"> = {
  cash: "success",
  card: "brand",
  bank_transfer: "secondary",
  cheque: "outline",
  online: "info",
};

const methodLabels: Record<PaymentMethod, string> = {
  cash: "Cash",
  card: "Card",
  bank_transfer: "Bank Transfer",
  cheque: "Cheque",
  online: "Online",
};

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
    options: paymentMethodOptions,
  },
];

export default function PaymentsPage() {
  const user = useAuthStore((s) => s.user);
  const role = user?.role ?? "";
  const canManage = role === "SUPER_ADMIN" || role === "OWNER" || role === "BRANCH_MANAGER" || role === "STAFF";
  const canRefund = role === "SUPER_ADMIN";
  const canDownload = role === "SUPER_ADMIN" || role === "OWNER" || role === "BRANCH_MANAGER" || role === "STAFF" || role === "STUDENT" || role === "CLIENT";
  const canPrint = role === "SUPER_ADMIN" || role === "OWNER";

  const {
    loading, error, payments, total,
    page, setPage, pageSize,
    search, setSearch,
    statusFilter, setStatusFilter,
    methodFilter, setMethodFilter,
    dateFrom, setDateFrom, dateTo, setDateTo,
    sortKey, sortDir, handleSort,
    modalOpen, setModalOpen,
    saving,
    openCreate, onSubmit,
    actionConfirm, actionSaving, confirmAction, closeActionConfirm,
    requestAction,
    studentOptions, invoiceOptions,
    register, errors, handleSubmit,
    summaryCards, fetchPayments,
  } = usePayments();

  const [viewPayment, setViewPayment] = React.useState<Payment | null>(null);

  const columns: Column<Payment>[] = React.useMemo(() => [
    { key: "receiptNumber", header: "Receipt #", sortable: true },
    { key: "studentName", header: "Student", sortable: true },
    {
      key: "invoiceNumber",
      header: "Invoice",
      render: (row) => (
        <span className="font-mono text-xs text-text-secondary">{row.invoiceNumber}</span>
      ),
    },
    {
      key: "amount",
      header: "Amount",
      render: (row) => (
        <span className="text-lg font-bold text-text-primary tabular-nums">
          ${row.amount.toLocaleString()}
        </span>
      ),
    },
    {
      key: "paymentMethod",
      header: "Method",
      render: (row) => (
        <Badge variant={methodChipVariant[row.paymentMethod]} size="sm">
          {methodLabels[row.paymentMethod]}
        </Badge>
      ),
    },
    {
      key: "transactionId",
      header: "Transaction ID",
      render: (row) => row.transactionId ? (
        <span className="font-mono text-xs text-text-secondary">{row.transactionId}</span>
      ) : (
        <span className="text-text-disabled text-xs">—</span>
      ),
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
      render: (row) => (
        <span className="text-sm text-text-secondary">{row.collectedByName}</span>
      ),
    },
    {
      key: "createdAt",
      header: "Date",
      render: (row) => (
        <span className="text-sm text-text-secondary">{new Date(row.createdAt).toLocaleDateString()}</span>
      ),
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
              onClick={() => requestAction(row, "refund")}
              title="Refund"
              className="text-warning"
            >
              <RefundIcon size={14} />
            </Button>
          )}
        </div>
      ),
    },
  ], [canRefund, requestAction, canDownload, canPrint]);

  const confirmActionType = actionConfirm.action;
  const actionLabels: Record<string, { title: string; desc: string; intent: "danger" | "info" | "warning" }> = {
    refund: { title: "Refund Payment", desc: "This will reverse the payment transaction.", intent: "warning" },
  };
  const actionLabel = confirmActionType ? actionLabels[confirmActionType] : null;

  return (
    <PageContainer
      title="Payments"
      subtitle="Payment Operations Workspace"
      actions={
        canManage ? (
          <Button leftIcon={<Plus size={16} />} onClick={openCreate}>
            Record Payment
          </Button>
        ) : undefined
      }
    >
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Payments"
          value={summaryCards.total}
          icon={<Wallet size={20} />}
        />
        <StatCard
          title="Collected Today"
          value={summaryCards.collectedToday}
          icon={<DollarSign size={20} />}
          deltaType="increase"
        />
        <StatCard
          title="Pending"
          value={summaryCards.pending}
          icon={<Ban size={20} />}
          deltaType="neutral"
        />
        <StatCard
          title="Refunded"
          value={summaryCards.refunded}
          icon={<RefundIcon size={20} />}
          deltaType="decrease"
        />
      </div>

      <Card className="mb-4">
        <div className="flex flex-wrap items-center gap-2 px-4 py-2.5">
          <span className="text-xs font-medium text-text-secondary mr-2">Quick Actions</span>
          {canManage && (
            <Button variant="primary" size="xs" leftIcon={<Plus size={14} />} onClick={openCreate}>
              Record Payment
            </Button>
          )}
          <Button variant="outline" size="xs" leftIcon={<Download size={14} />} onClick={() => toast.success("Downloading receipt...")}>
            Download Receipt
          </Button>
          <Button variant="outline" size="xs" leftIcon={<Printer size={14} />} onClick={() => { window.print(); toast.info("Printing receipt..."); }}>
            Print Receipt
          </Button>
        </div>
      </Card>

      <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <SearchBar
          value={search}
          onChange={(v) => { setSearch(v); setPage(1); }}
          placeholder="Search by student, invoice, or transaction ID…"
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
          title="No payments found"
          description={search || statusFilter || methodFilter ? "Try adjusting your search or filters" : "Record your first payment to get started"}
          action={!search && !statusFilter && !methodFilter && canManage ? { label: "Record Payment", onClick: openCreate } : undefined}
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
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Record Payment"
        size="lg"
        footer={
          <>
            <Button variant="outline" onClick={() => setModalOpen(false)} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={handleSubmit(onSubmit)} loading={saving}>
              Record Payment
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <SearchableSelect
              label="Student Name"
              required
              placeholder="Search student..."
              options={studentOptions}
              onChange={(v) => register("studentId").onChange({ target: { value: v } })}
              error={errors.studentId?.message}
              emptyMessage="No students available"
            />
            <SearchableSelect
              label="Invoice"
              required
              placeholder="Search invoice..."
              options={invoiceOptions}
              onChange={(v) => register("invoiceId").onChange({ target: { value: v } })}
              error={errors.invoiceId?.message}
              emptyMessage="No invoices available"
            />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="Amount"
              type="number"
              required
              error={errors.amount?.message}
              {...register("amount")}
              placeholder="0.00"
            />
            <Select
              label="Payment Method"
              required
              error={errors.paymentMethod?.message}
              placeholder="Select method"
              options={paymentMethodOptions}
              {...register("paymentMethod")}
            />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="Transaction ID"
              {...register("transactionId")}
              placeholder="Optional"
            />
            <Input
              label="Reference Number"
              {...register("referenceNumber")}
              placeholder="Optional"
            />
          </div>
          <Textarea
            label="Notes"
            {...register("notes")}
            placeholder="Optional notes"
          />
        </div>
      </Modal>

      <Modal
        open={!!viewPayment}
        onClose={() => setViewPayment(null)}
        title={`Payment Details — ${viewPayment?.receiptNumber ?? ""}`}
        size="md"
        footer={
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => setViewPayment(null)}>
              Close
            </Button>
            {canDownload && viewPayment && (
              <Button variant="outline" leftIcon={<Download size={14} />} onClick={() => toast.success("Downloading receipt...")}>
                Download Receipt
              </Button>
            )}
            {canPrint && viewPayment && (
              <Button variant="outline" leftIcon={<Printer size={14} />} onClick={() => { window.print(); toast.info("Printing receipt..."); }}>
                Print Receipt
              </Button>
            )}
          </div>
        }
      >
        {viewPayment && (
          <div className="space-y-6">
            <div className="text-center py-4">
              <p className="text-xs font-medium uppercase tracking-wide text-text-secondary">Amount</p>
              <p className="mt-1 text-4xl font-bold text-text-primary tabular-nums">
                ${viewPayment.amount.toLocaleString()}
              </p>
              <div className="mt-2">
                <PaymentStatusBadge status={viewPayment.status} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-medium text-text-secondary">Receipt Number</p>
                <p className="mt-0.5 text-sm font-semibold text-text-primary">{viewPayment.receiptNumber}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-text-secondary">Transaction ID</p>
                <p className="mt-0.5 text-sm font-mono text-text-secondary">{viewPayment.transactionId || "—"}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-text-secondary">Student</p>
                <p className="mt-0.5 text-sm text-text-primary">{viewPayment.studentName}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-text-secondary">Invoice</p>
                <p className="mt-0.5 text-sm text-text-primary">{viewPayment.invoiceNumber}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-text-secondary">Payment Method</p>
                <div className="mt-0.5">
                  <Badge variant={methodChipVariant[viewPayment.paymentMethod]} size="sm">
                    {methodLabels[viewPayment.paymentMethod]}
                  </Badge>
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-text-secondary">Collected By</p>
                <p className="mt-0.5 text-sm text-text-primary">{viewPayment.collectedByName}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-text-secondary">Reference Number</p>
                <p className="mt-0.5 text-sm text-text-secondary">{viewPayment.referenceNumber || "—"}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-text-secondary">Date</p>
                <p className="mt-0.5 text-sm text-text-primary">{new Date(viewPayment.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
            {viewPayment.notes && (
              <div>
                <p className="text-xs font-medium text-text-secondary">Notes</p>
                <p className="mt-0.5 text-sm text-text-primary">{viewPayment.notes}</p>
              </div>
            )}
          </div>
        )}
      </Modal>

      <ConfirmModal
        open={actionConfirm.open}
        onClose={closeActionConfirm}
        onConfirm={confirmAction}
        title={actionLabel?.title ?? ""}
        description={
          actionConfirm.payment
            ? `${actionLabel?.desc ?? ""} (${actionConfirm.payment.receiptNumber})`
            : ""
        }
        intent={actionLabel?.intent ?? "info"}
        confirmLabel={confirmActionType ? confirmActionType.charAt(0).toUpperCase() + confirmActionType.slice(1) : "Confirm"}
        loading={actionSaving}
      />
    </PageContainer>
  );
}
