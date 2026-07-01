"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  getPayments,
  recordPayment,
  refundPayment,
  type Payment,
  type PaymentStatus,
  type PaymentMethod,
} from "@/services/finance";
import { getStudents } from "@/services/students";
import { getInvoices } from "@/services/finance";
import type { SearchableOption } from "@/components/ui/SearchableSelect";

export const paymentSchema = z.object({
  studentId: z.string().min(1, "Student is required"),
  invoiceId: z.string().min(1, "Invoice is required"),
  amount: z.string().min(1, "Amount is required").refine((v) => !isNaN(Number(v)) && Number(v) > 0, "Must be a positive number"),
  paymentMethod: z.string().min(1, "Payment method is required"),
  transactionId: z.string().optional(),
  referenceNumber: z.string().optional(),
  notes: z.string().optional(),
});
export type PaymentFormData = z.infer<typeof paymentSchema>;

export interface PaymentsState {
  loading: boolean;
  error: boolean;
  payments: Payment[];
  total: number;
  page: number;
  setPage: (p: number) => void;
  pageSize: number;
  search: string;
  setSearch: (s: string) => void;
  statusFilter: string;
  setStatusFilter: (s: string) => void;
  methodFilter: string;
  setMethodFilter: (s: string) => void;
  dateFrom: string;
  setDateFrom: (d: string) => void;
  dateTo: string;
  setDateTo: (d: string) => void;
  sortKey: string;
  sortDir: "asc" | "desc";
  handleSort: (key: string) => void;
  modalOpen: boolean;
  setModalOpen: (o: boolean) => void;
  saving: boolean;
  openCreate: () => void;
  onSubmit: (data: PaymentFormData) => Promise<void>;
  actionConfirm: {
    open: boolean;
    payment: Payment | null;
    action: "refund" | null;
  };
  actionSaving: boolean;
  confirmAction: () => Promise<void>;
  requestAction: (payment: Payment, action: "refund") => void;
  closeActionConfirm: () => void;
  fetchPayments: () => Promise<void>;
  studentOptions: SearchableOption[];
  invoiceOptions: SearchableOption[];
  register: ReturnType<typeof useForm<PaymentFormData>>["register"];
  errors: ReturnType<typeof useForm<PaymentFormData>>["formState"]["errors"];
  handleSubmit: ReturnType<typeof useForm<PaymentFormData>>["handleSubmit"];
  reset: ReturnType<typeof useForm<PaymentFormData>>["reset"];
  summaryCards: {
    total: number;
    collectedToday: number;
    pending: number;
    refunded: number;
  };
}

export function usePayments(): PaymentsState {
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

  const [modalOpen, setModalOpen] = React.useState(false);
  const [saving, setSaving] = React.useState(false);

  const [actionConfirm, setActionConfirm] = React.useState<{
    open: boolean;
    payment: Payment | null;
    action: "refund" | null;
  }>({ open: false, payment: null, action: null });
  const [actionSaving, setActionSaving] = React.useState(false);

  const [studentOptions, setStudentOptions] = React.useState<SearchableOption[]>([]);
  const [invoiceOptions, setInvoiceOptions] = React.useState<SearchableOption[]>([]);
  const [summaryCards, setSummaryCards] = React.useState({ total: 0, collectedToday: 0, pending: 0, refunded: 0 });

  const { register, handleSubmit, formState: { errors }, reset } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
  });

  const fetchPayments = React.useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await getPayments({
        page,
        pageSize,
        search: search || undefined,
        status: (statusFilter as PaymentStatus) || undefined,
        paymentMethod: (methodFilter as PaymentMethod) || undefined,
        dateFrom: dateFrom || undefined,
        dateTo: dateTo || undefined,
        sortBy: sortKey || undefined,
        sortDir: sortKey ? sortDir : undefined,
      });
      setPayments(res.data.items);
      setTotal(res.data.total);

      const today = new Date().toISOString().slice(0, 10);
      setSummaryCards({
        total: res.data.total,
        collectedToday: res.data.items.filter((p) => p.createdAt.slice(0, 10) === today && p.status === "completed").length,
        pending: res.data.items.filter((p) => p.status === "pending").length,
        refunded: res.data.items.filter((p) => p.status === "refunded").length,
      });
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, search, statusFilter, methodFilter, dateFrom, dateTo, sortKey, sortDir]);

  React.useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(false);
      try {
        const res = await getPayments({
          page,
          pageSize,
          search: search || undefined,
          status: (statusFilter as PaymentStatus) || undefined,
          paymentMethod: (methodFilter as PaymentMethod) || undefined,
          dateFrom: dateFrom || undefined,
          dateTo: dateTo || undefined,
          sortBy: sortKey || undefined,
          sortDir: sortKey ? sortDir : undefined,
        });
        setPayments(res.data.items);
        setTotal(res.data.total);

        const today = new Date().toISOString().slice(0, 10);
        setSummaryCards({
          total: res.data.total,
          collectedToday: res.data.items.filter((p) => p.createdAt.slice(0, 10) === today && p.status === "completed").length,
          pending: res.data.items.filter((p) => p.status === "pending").length,
          refunded: res.data.items.filter((p) => p.status === "refunded").length,
        });
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [page, pageSize, search, statusFilter, methodFilter, dateFrom, dateTo, sortKey, sortDir]);

  React.useEffect(() => {
    if (!modalOpen) return;
    const load = async () => {
      try {
        const studentsRes = await getStudents();
        setStudentOptions(
          studentsRes.data.items.map((s) => ({
            value: s.id,
            label: s.name,
            secondary: s.email,
          })),
        );

        const invoicesRes = await getInvoices({ pageSize: 100 });
        setInvoiceOptions(
          invoicesRes.data.items.map((inv) => ({
            value: inv.id,
            label: `${inv.invoiceNumber} - ${inv.studentName}`,
            secondary: `$${inv.dueAmount.toLocaleString()}`,
          })),
        );
      } catch {
        // non-critical
      }
    };
    load();
  }, [modalOpen]);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const openCreate = () => {
    reset({
      studentId: "", invoiceId: "", amount: "",
      paymentMethod: "", transactionId: "",
      referenceNumber: "", notes: "",
    });
    setModalOpen(true);
  };

  const onSubmit = async (data: PaymentFormData) => {
    setSaving(true);
    try {
      await recordPayment({
        studentId: data.studentId,
        invoiceId: data.invoiceId,
        amount: Number(data.amount),
        paymentMethod: data.paymentMethod as PaymentMethod,
        transactionId: data.transactionId || undefined,
        referenceNumber: data.referenceNumber || undefined,
        notes: data.notes || undefined,
      });
      toast.success("Payment recorded");
      setModalOpen(false);
      await fetchPayments();
    } catch {
      toast.error("Failed to record payment");
    } finally {
      setSaving(false);
    }
  };

  const requestAction = (payment: Payment, action: "refund") => {
    setActionConfirm({ open: true, payment, action });
  };

  const closeActionConfirm = () => {
    setActionConfirm({ open: false, payment: null, action: null });
  };

  const confirmAction = async () => {
    const { payment, action } = actionConfirm;
    if (!payment || !action) return;
    setActionSaving(true);
    try {
      switch (action) {
        case "refund":
          await refundPayment(payment.id);
          toast.success("Payment refunded");
          break;
      }
      closeActionConfirm();
      await fetchPayments();
    } catch {
      toast.error("Failed to refund payment");
    } finally {
      setActionSaving(false);
    }
  };

  return {
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
    actionConfirm, actionSaving, confirmAction, requestAction, closeActionConfirm,
    fetchPayments,
    studentOptions, invoiceOptions,
    register, errors, handleSubmit, reset,
    summaryCards,
  };
}
