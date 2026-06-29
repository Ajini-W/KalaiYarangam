"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  getTransfers,
  createTransfer,
  approveTransfer,
  rejectTransfer,
  cancelTransfer,
  type Transfer,
  type TransferStatus,
} from "@/services/transfers";
import { getBatches } from "@/services/batches";
import { getEnrollments } from "@/services/enrollments";
import type { SearchableOption } from "@/components/ui/SearchableSelect";

export const transferSchema = z.object({
  enrollmentId: z.string().min(1, "Enrollment is required"),
  toBatchId: z.string().min(1, "Target batch is required"),
  reason: z.string().min(10, "Please provide a reason (at least 10 characters)"),
});
export type TransferFormData = z.infer<typeof transferSchema>;

export interface TransfersState {
  loading: boolean;
  error: boolean;
  transfers: Transfer[];
  total: number;
  page: number;
  setPage: (p: number) => void;
  pageSize: number;
  search: string;
  setSearch: (s: string) => void;
  statusFilter: string;
  setStatusFilter: (s: string) => void;
  modalOpen: boolean;
  setModalOpen: (o: boolean) => void;
  saving: boolean;
  openCreate: () => void;
  onSubmit: (data: TransferFormData) => Promise<void>;
  approveConfirm: { open: boolean; transfer: Transfer | null };
  rejectConfirm: { open: boolean; transfer: Transfer | null };
  cancelConfirm: { open: boolean; transfer: Transfer | null };
  actionSaving: boolean;
  handleApprove: () => Promise<void>;
  handleReject: () => Promise<void>;
  handleCancel: () => Promise<void>;
  requestApprove: (t: Transfer) => void;
  requestReject: (t: Transfer) => void;
  requestCancel: (t: Transfer) => void;
  closeApprove: () => void;
  closeReject: () => void;
  closeCancel: () => void;
  enrollmentOptions: SearchableOption[];
  batchOptions: SearchableOption[];
  register: ReturnType<typeof useForm<TransferFormData>>["register"];
  errors: ReturnType<typeof useForm<TransferFormData>>["formState"]["errors"];
  handleSubmit: ReturnType<typeof useForm<TransferFormData>>["handleSubmit"];
  reset: ReturnType<typeof useForm<TransferFormData>>["reset"];
}

export function useTransfers(): TransfersState {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);
  const [transfers, setTransfers] = React.useState<Transfer[]>([]);
  const [total, setTotal] = React.useState(0);
  const [page, setPage] = React.useState(1);
  const [pageSize] = React.useState(10);
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("");

  const [modalOpen, setModalOpen] = React.useState(false);
  const [saving, setSaving] = React.useState(false);

  const [approveConfirm, setApproveConfirm] = React.useState<{ open: boolean; transfer: Transfer | null }>({
    open: false, transfer: null,
  });
  const [rejectConfirm, setRejectConfirm] = React.useState<{ open: boolean; transfer: Transfer | null }>({
    open: false, transfer: null,
  });
  const [cancelConfirm, setCancelConfirm] = React.useState<{ open: boolean; transfer: Transfer | null }>({
    open: false, transfer: null,
  });
  const [actionSaving, setActionSaving] = React.useState(false);

  const [enrollmentOptions, setEnrollmentOptions] = React.useState<SearchableOption[]>([]);
  const [batchOptions, setBatchOptions] = React.useState<SearchableOption[]>([]);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<TransferFormData>({
    resolver: zodResolver(transferSchema),
  });

  const fetchTransfers = React.useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await getTransfers({
        page,
        pageSize,
        search: search || undefined,
        status: (statusFilter as TransferStatus) || undefined,
      });
      setTransfers(res.data.items);
      setTotal(res.data.total);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, search, statusFilter]);

  React.useEffect(() => {
    fetchTransfers();
  }, [fetchTransfers]);

  const fetchOptions = React.useCallback(async () => {
    try {
      const [batchesRes, enrollmentsRes] = await Promise.all([
        getBatches(),
        getEnrollments({ pageSize: 100 }),
      ]);
      setBatchOptions(
        batchesRes.data.items.map((b) => ({
          value: b.id,
          label: b.name,
          secondary: b.courseName,
        })),
      );
      setEnrollmentOptions(
        enrollmentsRes.data.items.map((e) => ({
          value: e.id,
          label: `${e.studentName} - ${e.courseName}`,
          secondary: e.batchName,
        })),
      );
    } catch {
      // Options are non-critical
    }
  }, []);

  React.useEffect(() => {
    if (modalOpen) fetchOptions();
  }, [modalOpen, fetchOptions]);

  const openCreate = () => {
    reset({ enrollmentId: "", toBatchId: "", reason: "" });
    setModalOpen(true);
  };

  const onSubmit = async (data: TransferFormData) => {
    setSaving(true);
    try {
      await createTransfer(data);
      toast.success("Transfer request created");
      setModalOpen(false);
      await fetchTransfers();
    } catch {
      toast.error("Failed to create transfer request");
    } finally {
      setSaving(false);
    }
  };

  const requestApprove = (t: Transfer) => setApproveConfirm({ open: true, transfer: t });
  const requestReject = (t: Transfer) => setRejectConfirm({ open: true, transfer: t });
  const requestCancel = (t: Transfer) => setCancelConfirm({ open: true, transfer: t });
  const closeApprove = () => setApproveConfirm({ open: false, transfer: null });
  const closeReject = () => setRejectConfirm({ open: false, transfer: null });
  const closeCancel = () => setCancelConfirm({ open: false, transfer: null });

  const handleApprove = async () => {
    const t = approveConfirm.transfer;
    if (!t) return;
    setActionSaving(true);
    try {
      await approveTransfer(t.id);
      toast.success("Transfer approved");
      closeApprove();
      await fetchTransfers();
    } catch {
      toast.error("Failed to approve transfer");
    } finally {
      setActionSaving(false);
    }
  };

  const handleReject = async () => {
    const t = rejectConfirm.transfer;
    if (!t) return;
    setActionSaving(true);
    try {
      await rejectTransfer(t.id);
      toast.success("Transfer rejected");
      closeReject();
      await fetchTransfers();
    } catch {
      toast.error("Failed to reject transfer");
    } finally {
      setActionSaving(false);
    }
  };

  const handleCancel = async () => {
    const t = cancelConfirm.transfer;
    if (!t) return;
    setActionSaving(true);
    try {
      await cancelTransfer(t.id);
      toast.success("Transfer cancelled");
      closeCancel();
      await fetchTransfers();
    } catch {
      toast.error("Failed to cancel transfer");
    } finally {
      setActionSaving(false);
    }
  };

  return {
    loading, error, transfers, total,
    page, setPage, pageSize,
    search, setSearch,
    statusFilter, setStatusFilter,
    modalOpen, setModalOpen,
    saving,
    openCreate, onSubmit,
    approveConfirm, rejectConfirm, cancelConfirm,
    actionSaving,
    handleApprove, handleReject, handleCancel,
    requestApprove, requestReject, requestCancel,
    closeApprove, closeReject, closeCancel,
    enrollmentOptions, batchOptions,
    register, errors, handleSubmit, reset,
  };
}
