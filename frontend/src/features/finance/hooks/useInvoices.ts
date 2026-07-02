"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  getInvoices,
  createInvoice,
  type Invoice,
  type InvoiceStatus,
} from "@/services/finance";
import { getStudents } from "@/services/students";
import { getCourses } from "@/services/courses";
import { getFeePlans } from "@/services/finance";
import type { SearchableOption } from "@/components/ui/SearchableSelect";

export const invoiceSchema = z.object({
  studentId: z.string().min(1, "Student is required"),
  feePlanId: z.string().min(1, "Fee plan is required"),
  issueDate: z.string().min(1, "Issue date is required"),
  dueDate: z.string().min(1, "Due date is required"),
  notes: z.string().optional(),
});
export type InvoiceFormData = z.infer<typeof invoiceSchema>;

export interface InvoicesState {
  loading: boolean;
  error: boolean;
  invoices: Invoice[];
  total: number;
  page: number;
  setPage: (p: number) => void;
  pageSize: number;
  search: string;
  setSearch: (s: string) => void;
  statusFilter: string;
  setStatusFilter: (s: string) => void;
  courseFilter: string;
  setCourseFilter: (s: string) => void;
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
  onSubmit: (data: InvoiceFormData) => Promise<void>;
  fetchInvoices: () => Promise<void>;
  studentOptions: SearchableOption[];
  feePlanOptions: SearchableOption[];
  courseOptions: SearchableOption[];
  register: ReturnType<typeof useForm<InvoiceFormData>>["register"];
  errors: ReturnType<typeof useForm<InvoiceFormData>>["formState"]["errors"];
  handleSubmit: ReturnType<typeof useForm<InvoiceFormData>>["handleSubmit"];
  reset: ReturnType<typeof useForm<InvoiceFormData>>["reset"];
  summaryCards: {
    total: number;
    paid: number;
    partial: number;
    overdue: number;
  };
}

export function useInvoices(): InvoicesState {
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

  const [modalOpen, setModalOpen] = React.useState(false);
  const [saving, setSaving] = React.useState(false);

  const [studentOptions, setStudentOptions] = React.useState<SearchableOption[]>([]);
  const [feePlanOptions, setFeePlanOptions] = React.useState<SearchableOption[]>([]);
  const [courseOptions, setCourseOptions] = React.useState<SearchableOption[]>([]);
  const [summaryCards, setSummaryCards] = React.useState({ total: 0, paid: 0, partial: 0, overdue: 0 });

  const { register, handleSubmit, formState: { errors }, reset } = useForm<InvoiceFormData>({
    resolver: zodResolver(invoiceSchema),
  });

  const fetchInvoices = React.useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await getInvoices({
        page,
        pageSize,
        search: search || undefined,
        status: (statusFilter as InvoiceStatus) || undefined,
        courseId: courseFilter || undefined,
        dateFrom: dateFrom || undefined,
        dateTo: dateTo || undefined,
        sortBy: sortKey || undefined,
        sortDir: sortKey ? sortDir : undefined,
      });
      setInvoices(res.data.items);
      setTotal(res.data.total);

      const all = res.data.items;
      setSummaryCards({
        total: res.data.total,
        paid: all.filter((i) => i.status === "paid").length,
        partial: all.filter((i) => i.status === "partial").length,
        overdue: all.filter((i) => i.status === "overdue").length,
      });
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, search, statusFilter, courseFilter, dateFrom, dateTo, sortKey, sortDir]);

  React.useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(false);
      try {
        const res = await getInvoices({
          page,
          pageSize,
          search: search || undefined,
          status: (statusFilter as InvoiceStatus) || undefined,
          courseId: courseFilter || undefined,
          dateFrom: dateFrom || undefined,
          dateTo: dateTo || undefined,
          sortBy: sortKey || undefined,
          sortDir: sortKey ? sortDir : undefined,
        });
        setInvoices(res.data.items);
        setTotal(res.data.total);

        const all = res.data.items;
        setSummaryCards({
          total: res.data.total,
          paid: all.filter((i) => i.status === "paid").length,
          partial: all.filter((i) => i.status === "partial").length,
          overdue: all.filter((i) => i.status === "overdue").length,
        });
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [page, pageSize, search, statusFilter, courseFilter, dateFrom, dateTo, sortKey, sortDir]);

  React.useEffect(() => {
    if (!modalOpen) return;
    const load = async () => {
      try {
        const [studentsRes, coursesRes] = await Promise.all([
          getStudents(),
          getCourses(),
        ]);
        setStudentOptions(
          studentsRes.data.items.map((s) => ({
            value: s.id,
            label: s.name,
            secondary: s.email,
          })),
        );
        setCourseOptions(
          coursesRes.data.items.map((c) => ({
            value: c.id,
            label: c.name,
          })),
        );

        const feePlansRes = await getFeePlans({ pageSize: 100 });
        setFeePlanOptions(
          feePlansRes.data.items.map((fp) => ({
            value: fp.id,
            label: fp.planName,
            secondary: fp.courseName,
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
    reset({ studentId: "", feePlanId: "", issueDate: "", dueDate: "", notes: "" });
    setModalOpen(true);
  };

  const onSubmit = async (data: InvoiceFormData) => {
    setSaving(true);
    try {
      await createInvoice({
        studentId: data.studentId,
        feePlanId: data.feePlanId,
        issueDate: data.issueDate,
        dueDate: data.dueDate,
        notes: data.notes || undefined,
      });
      toast.success("Invoice created");
      setModalOpen(false);
      await fetchInvoices();
    } catch {
      toast.error("Failed to create invoice");
    } finally {
      setSaving(false);
    }
  };

  return {
    loading, error, invoices, total,
    page, setPage, pageSize,
    search, setSearch,
    statusFilter, setStatusFilter,
    courseFilter, setCourseFilter,
    dateFrom, setDateFrom, dateTo, setDateTo,
    sortKey, sortDir, handleSort,
    modalOpen, setModalOpen,
    saving,
    openCreate, onSubmit,
    fetchInvoices,
    studentOptions, feePlanOptions, courseOptions,
    register, errors, handleSubmit, reset,
    summaryCards,
  };
}
