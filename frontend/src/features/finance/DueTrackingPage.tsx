"use client";

import * as React from "react";
import { Eye, Download, Printer, Bell } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { StatCard } from "@/components/ui/Card";
import { Table, type Column } from "@/components/ui/Table";
import { Pagination } from "@/components/ui/Pagination";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { SearchBar } from "@/components/ui/SearchBar";
import { FilterBar, type FilterDef } from "@/components/ui/FilterBar";
import { Select } from "@/components/ui/Select";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { SkeletonTable } from "@/components/ui/Skeleton";
import { getInvoices, type Invoice, type InvoiceStatus } from "@/services/finance";
import { getCourses, type Course } from "@/services/courses";
import { useAuthStore } from "@/store/auth.store";
import { toast } from "sonner";
import { FileText, DollarSign, AlertTriangle, Clock } from "lucide-react";
import { cn } from "@/lib/cn";

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

function getDaysRemaining(dueDate: string): number {
  const due = new Date(dueDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);
  return Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

function getPriorityBadge(status: string, dueDate: string): { variant: "danger" | "warning" | "info" | "success"; label: string } {
  if (status === "overdue") return { variant: "danger", label: "Overdue" };
  if (status === "partial") return { variant: "warning", label: "Partial Paid" };
  if (status === "paid") return { variant: "success", label: "Paid" };
  const days = getDaysRemaining(dueDate);
  if (days === 0) return { variant: "danger", label: "Due Today" };
  if (days < 0) return { variant: "danger", label: "Overdue" };
  return { variant: "info", label: "Upcoming" };
}

export default function DueTrackingPage() {
  const user = useAuthStore((s) => s.user);
  const role = user?.role ?? "";
  const userId = user?.id ?? "";

  const isSuperAdmin = role === "SUPER_ADMIN";
  const isOwner = role === "OWNER";
  const isBranchManager = role === "BRANCH_MANAGER";
  const isStudent = role === "STUDENT";
  const isClient = role === "CLIENT";

  const canDownload = isSuperAdmin || isOwner || isBranchManager || isStudent || isClient;
  const canPrint = isSuperAdmin || isOwner;
  const canRemind = isSuperAdmin || isOwner;

  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);
  const [invoices, setInvoices] = React.useState<Invoice[]>([]);
  const [total, setTotal] = React.useState(0);
  const [page, setPage] = React.useState(1);
  const [pageSize] = React.useState(10);
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("");
  const [courseFilter, setCourseFilter] = React.useState("");
  const [dateFrom, setDateFrom] = React.useState("");
  const [dateTo, setDateTo] = React.useState("");
  const [sortKey, setSortKey] = React.useState("");
  const [sortDir, setSortDir] = React.useState<"asc" | "desc">("asc");
  const [viewInvoice, setViewInvoice] = React.useState<Invoice | null>(null);

  const [courseOptions, setCourseOptions] = React.useState<{ value: string; label: string }[]>([]);

  React.useEffect(() => {
    getCourses().then((res) => {
      setCourseOptions(
        res.data.items.map((c: Course) => ({ value: c.id, label: c.name })),
      );
    }).catch(() => {});
  }, []);

  const fetchInvoices = React.useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const params: Record<string, unknown> = {
        page,
        pageSize,
        search: search || undefined,
        status: (statusFilter as InvoiceStatus) || undefined,
        courseId: courseFilter || undefined,
        dateFrom: dateFrom || undefined,
        dateTo: dateTo || undefined,
        sortBy: sortKey || undefined,
        sortDir: sortKey ? sortDir : undefined,
      };
      if (isStudent || isClient) {
        params.studentId = userId;
      }
      const res = await getInvoices(params);
      setInvoices(res.data.items);
      setTotal(res.data.total);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, search, statusFilter, courseFilter, dateFrom, dateTo, sortKey, sortDir, userId, isStudent, isClient]);

  React.useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const summaryCards = React.useMemo(() => {
    const totalDue = invoices.reduce((s, inv) => s + inv.dueAmount, 0);
    const overdue = invoices.filter((i) => i.status === "overdue");
    const dueToday = invoices.filter((i) => getDaysRemaining(i.dueDate) === 0);
    const upcoming = invoices.filter((i) => {
      const days = getDaysRemaining(i.dueDate);
      return days > 0 && i.status !== "paid";
    });
    return {
      totalDue,
      overdueAmount: overdue.reduce((s, inv) => s + inv.dueAmount, 0),
      dueTodayAmount: dueToday.reduce((s, inv) => s + inv.dueAmount, 0),
      upcomingAmount: upcoming.reduce((s, inv) => s + inv.dueAmount, 0),
    };
  }, [invoices]);

  const columns: Column<Invoice>[] = React.useMemo(() => [
    { key: "invoiceNumber", header: "Invoice #", sortable: true },
    { key: "studentName", header: "Student", sortable: true },
    { key: "courseName", header: "Course" },
    {
      key: "totalAmount",
      header: "Total",
      render: (row) => (
        <span className="text-sm text-text-secondary tabular-nums">${row.totalAmount.toLocaleString()}</span>
      ),
    },
    {
      key: "dueAmount",
      header: "Outstanding",
      render: (row) => (
        <span className={cn(
          "text-base font-bold tabular-nums",
          row.dueAmount > 0 ? "text-danger" : "text-success",
        )}>
          ${row.dueAmount.toLocaleString()}
        </span>
      ),
    },
    {
      key: "progress",
      header: "Progress",
      render: (row) => {
        const paidPct = row.totalAmount > 0 ? Math.round((row.paidAmount / row.totalAmount) * 100) : 0;
        return (
          <div className="flex items-center gap-2 min-w-[100px]">
            <div className="flex-1 h-1.5 bg-surface-overlay rounded-full overflow-hidden">
              <div
                className="h-full bg-success rounded-full transition-all"
                style={{ width: `${paidPct}%` }}
              />
            </div>
            <span className="text-xs text-text-secondary tabular-nums w-8 text-right">{paidPct}%</span>
          </div>
        );
      },
    },
    {
      key: "dueDate",
      header: "Days Left",
      render: (row) => {
        const days = getDaysRemaining(row.dueDate);
        const isOverdue = row.status === "overdue" || days < 0;
        const isDueToday = days === 0;
        const isSoon = days > 0 && days <= 7;
        return (
          <span className={cn(
            "font-semibold tabular-nums",
            isOverdue && "text-danger",
            isDueToday && "text-warning",
            isSoon && "text-warning",
            !isOverdue && !isDueToday && !isSoon && "text-text-secondary",
          )}>
            {isOverdue ? `${Math.abs(days)}d overdue` : isDueToday ? "Due today" : `${days}d left`}
          </span>
        );
      },
    },
    {
      key: "priority",
      header: "Priority",
      render: (row) => {
        const { variant, label } = getPriorityBadge(row.status, row.dueDate);
        return <Badge variant={variant} size="sm">{label}</Badge>;
      },
    },
    {
      key: "actions",
      header: "",
      render: (row) => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="xs" onClick={() => { setViewInvoice(row); toast.info("Viewing invoice details"); }} title="View Invoice">
            <Eye size={14} />
          </Button>
          {canDownload && (
            <Button variant="ghost" size="xs" onClick={() => toast.success("Downloading invoice...")} title="Download Invoice">
              <Download size={14} />
            </Button>
          )}
          {canPrint && (
            <Button variant="ghost" size="xs" onClick={() => { window.print(); toast.info("Printing invoice..."); }} title="Print Invoice">
              <Printer size={14} />
            </Button>
          )}
          {canRemind && (
            <Button variant="ghost" size="xs" onClick={() => toast.success("Reminder sent")} title="Send Reminder">
              <Bell size={14} />
            </Button>
          )}
        </div>
      ),
    },
  ], [canDownload, canPrint, canRemind]);

  return (
    <PageContainer
      title="Due Tracking"
      subtitle="Collection & Outstanding Dues Workspace"
    >
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Due"
          value={`$${summaryCards.totalDue.toLocaleString()}`}
          icon={<DollarSign size={20} />}
          deltaType={summaryCards.totalDue > 0 ? "decrease" : "increase"}
        />
        <StatCard
          title="Overdue"
          value={`$${summaryCards.overdueAmount.toLocaleString()}`}
          icon={<AlertTriangle size={20} />}
          deltaType="decrease"
        />
        <StatCard
          title="Due Today"
          value={`$${summaryCards.dueTodayAmount.toLocaleString()}`}
          icon={<Clock size={20} />}
          deltaType={summaryCards.dueTodayAmount > 0 ? "decrease" : "neutral"}
        />
        <StatCard
          title="Upcoming"
          value={`$${summaryCards.upcomingAmount.toLocaleString()}`}
          icon={<FileText size={20} />}
          deltaType="neutral"
        />
      </div>

      <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <SearchBar
          value={search}
          onChange={(v) => { setSearch(v); setPage(1); }}
          placeholder="Search by student or invoice #…"
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
          <Select
            options={[{ value: "", label: "All Courses" }, ...courseOptions]}
            value={courseFilter}
            onChange={(e) => { setCourseFilter(e.target.value); setPage(1); }}
            className="w-44"
            aria-label="Filter by course"
          />
          <FilterBar
            filters={statusFilters}
            active={{ status: statusFilter }}
            onChange={(key, value) => { setStatusFilter(value); setPage(1); }}
            onClear={() => {
              setStatusFilter("");
              setCourseFilter("");
              setDateFrom("");
              setDateTo("");
              setPage(1);
            }}
          />
        </div>
      </div>

      {loading ? (
        <SkeletonTable rows={5} />
      ) : error || invoices.length === 0 ? (
        <EmptyState
          title="No due records found"
          description={search || statusFilter || courseFilter ? "Try adjusting your search or filters" : "Outstanding dues will appear here once invoices are generated."}
        />
      ) : (
        <>
          <Table
            columns={columns}
            data={invoices}
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
        open={!!viewInvoice}
        onClose={() => setViewInvoice(null)}
        title={`Invoice Details — ${viewInvoice?.invoiceNumber ?? ""}`}
        size="md"
        footer={
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => setViewInvoice(null)}>
              Close
            </Button>
            {canDownload && (
              <Button variant="outline" leftIcon={<Download size={14} />} onClick={() => toast.success("Downloading invoice...")}>
                Download Invoice
              </Button>
            )}
            {canPrint && (
              <Button variant="outline" leftIcon={<Printer size={14} />} onClick={() => { window.print(); toast.info("Printing invoice..."); }}>
                Print Invoice
              </Button>
            )}
          </div>
        }
      >
        {viewInvoice && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-medium text-text-secondary">Invoice Number</p>
                <p className="text-sm font-semibold text-text-primary">{viewInvoice.invoiceNumber}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-text-secondary">Status</p>
                <div className="mt-0.5">
                  <Badge variant={getPriorityBadge(viewInvoice.status, viewInvoice.dueDate).variant} size="sm">
                    {getPriorityBadge(viewInvoice.status, viewInvoice.dueDate).label}
                  </Badge>
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-text-secondary">Student</p>
                <p className="text-sm text-text-primary">{viewInvoice.studentName}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-text-secondary">Course</p>
                <p className="text-sm text-text-primary">{viewInvoice.courseName}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-text-secondary">Fee Plan</p>
                <p className="text-sm text-text-primary">{viewInvoice.feePlanName}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-text-secondary">Due Date</p>
                <p className="text-sm font-semibold text-text-primary">
                  {new Date(viewInvoice.dueDate).toLocaleDateString()}
                  <span className={cn(
                    "ml-2 text-xs",
                    getDaysRemaining(viewInvoice.dueDate) < 0 ? "text-danger" : "text-text-secondary",
                  )}>
                    ({getDaysRemaining(viewInvoice.dueDate) > 0
                      ? `${getDaysRemaining(viewInvoice.dueDate)} days remaining`
                      : getDaysRemaining(viewInvoice.dueDate) === 0
                        ? "Due today"
                        : `${Math.abs(getDaysRemaining(viewInvoice.dueDate))} days overdue`})
                  </span>
                </p>
              </div>
            </div>

            <div className="rounded-[var(--radius-md)] bg-surface-raised p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-text-primary">Payment Progress</span>
                <span className="text-xs text-text-secondary tabular-nums">
                  ${viewInvoice.paidAmount.toLocaleString()} / ${viewInvoice.totalAmount.toLocaleString()}
                </span>
              </div>
              <div className="w-full h-2.5 bg-surface-overlay rounded-full overflow-hidden">
                <div
                  className="h-full bg-success rounded-full transition-all"
                  style={{ width: `${viewInvoice.totalAmount > 0 ? Math.round((viewInvoice.paidAmount / viewInvoice.totalAmount) * 100) : 0}%` }}
                />
              </div>
              <div className="flex justify-between mt-2 text-xs text-text-secondary">
                <span className="text-success font-medium">Paid: ${viewInvoice.paidAmount.toLocaleString()}</span>
                <span className="text-danger font-medium">Due: ${viewInvoice.dueAmount.toLocaleString()}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-medium text-text-secondary">Total Amount</p>
                <p className="text-sm font-semibold text-text-primary">${viewInvoice.totalAmount.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-text-secondary">Issue Date</p>
                <p className="text-sm text-text-primary">{new Date(viewInvoice.issueDate).toLocaleDateString()}</p>
              </div>
            </div>
            {viewInvoice.notes && (
              <div>
                <p className="text-xs font-medium text-text-secondary">Notes</p>
                <p className="text-sm text-text-primary">{viewInvoice.notes}</p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </PageContainer>
  );
}
