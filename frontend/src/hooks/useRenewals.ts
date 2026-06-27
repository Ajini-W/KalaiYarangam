"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  getRenewals,
  createRenewal,
  approveRenewal,
  rejectRenewal,
  cancelRenewal,
  type Renewal,
  type RenewalStatus,
} from "@/services/renewals";
import { getEnrollments } from "@/services/enrollments";
import type { SearchableOption } from "@/components/ui/SearchableSelect";

export const renewalSchema = z.object({
  enrollmentId: z.string().min(1, "Enrollment is required"),
  newEndDate: z.string().min(1, "New end date is required"),
  fee: z.string().min(1, "Fee is required").refine((v) => !isNaN(Number(v)), "Must be a number"),
});
export type RenewalFormData = z.infer<typeof renewalSchema>;

export interface RenewalsState {
  loading: boolean;
  error: boolean;
  renewals: Renewal[];
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
  onSubmit: (data: RenewalFormData) => Promise<void>;
  approveConfirm: { open: boolean; renewal: Renewal | null };
  rejectConfirm: { open: boolean; renewal: Renewal | null };
  cancelConfirm: { open: boolean; renewal: Renewal | null };
  actionSaving: boolean;
  handleApprove: () => Promise<void>;
  handleReject: () => Promise<void>;
  handleCancel: () => Promise<void>;
  requestApprove: (r: Renewal) => void;
  requestReject: (r: Renewal) => void;
  requestCancel: (r: Renewal) => void;
  closeApprove: () => void;
  closeReject: () => void;
  closeCancel: () => void;
  enrollmentOptions: SearchableOption[];
  register: ReturnType<typeof useForm<RenewalFormData>>["register"];
  errors: ReturnType<typeof useForm<RenewalFormData>>["formState"]["errors"];
  handleSubmit: ReturnType<typeof useForm<RenewalFormData>>["handleSubmit"];
  reset: ReturnType<typeof useForm<RenewalFormData>>["reset"];
}

export function useRenewals(): RenewalsState {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);
  const [renewals, setRenewals] = React.useState<Renewal[]>([]);
  const [total, setTotal] = React.useState(0);
  const [page, setPage] = React.useState(1);
  const [pageSize] = React.useState(10);
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("");

  const [modalOpen, setModalOpen] = React.useState(false);
  const [saving, setSaving] = React.useState(false);

  const [approveConfirm, setApproveConfirm] = React.useState<{ open: boolean; renewal: Renewal | null }>({
    open: false, renewal: null,
  });
  const [rejectConfirm, setRejectConfirm] = React.useState<{ open: boolean; renewal: Renewal | null }>({
    open: false, renewal: null,
  });
  const [cancelConfirm, setCancelConfirm] = React.useState<{ open: boolean; renewal: Renewal | null }>({
    open: false, renewal: null,
  });
  const [actionSaving, setActionSaving] = React.useState(false);

  const [enrollmentOptions, setEnrollmentOptions] = React.useState<SearchableOption[]>([]);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<RenewalFormData>({
    resolver: zodResolver(renewalSchema),
  });

  const fetchRenewals = React.useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await getRenewals({
        page,
        pageSize,
        search: search || undefined,
        status: (statusFilter as RenewalStatus) || undefined,
      });
      setRenewals(res.data.items);
      setTotal(res.data.total);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, search, statusFilter]);

  React.useEffect(() => {
    fetchRenewals();
  }, [fetchRenewals]);

  const fetchOptions = React.useCallback(async () => {
    try {
      const enrollmentsRes = await getEnrollments({ pageSize: 100 });
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
    reset({ enrollmentId: "", newEndDate: "", fee: "0" });
    setModalOpen(true);
  };

  const onSubmit = async (data: RenewalFormData) => {
    setSaving(true);
    try {
      await createRenewal({
        enrollmentId: data.enrollmentId,
        newEndDate: data.newEndDate,
        fee: Number(data.fee),
      });
      toast.success("Renewal request created");
      setModalOpen(false);
      await fetchRenewals();
    } catch {
      toast.error("Failed to create renewal request");
    } finally {
      setSaving(false);
    }
  };

  const requestApprove = (r: Renewal) => setApproveConfirm({ open: true, renewal: r });
  const requestReject = (r: Renewal) => setRejectConfirm({ open: true, renewal: r });
  const requestCancel = (r: Renewal) => setCancelConfirm({ open: true, renewal: r });
  const closeApprove = () => setApproveConfirm({ open: false, renewal: null });
  const closeReject = () => setRejectConfirm({ open: false, renewal: null });
  const closeCancel = () => setCancelConfirm({ open: false, renewal: null });

  const handleApprove = async () => {
    const r = approveConfirm.renewal;
    if (!r) return;
    setActionSaving(true);
    try {
      await approveRenewal(r.id);
      toast.success("Renewal approved");
      closeApprove();
      await fetchRenewals();
    } catch {
      toast.error("Failed to approve renewal");
    } finally {
      setActionSaving(false);
    }
  };

  const handleReject = async () => {
    const r = rejectConfirm.renewal;
    if (!r) return;
    setActionSaving(true);
    try {
      await rejectRenewal(r.id);
      toast.success("Renewal rejected");
      closeReject();
      await fetchRenewals();
    } catch {
      toast.error("Failed to reject renewal");
    } finally {
      setActionSaving(false);
    }
  };

  const handleCancel = async () => {
    const r = cancelConfirm.renewal;
    if (!r) return;
    setActionSaving(true);
    try {
      await cancelRenewal(r.id);
      toast.success("Renewal cancelled");
      closeCancel();
      await fetchRenewals();
    } catch {
      toast.error("Failed to cancel renewal");
    } finally {
      setActionSaving(false);
    }
  };

  return {
    loading, error, renewals, total,
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
    enrollmentOptions,
    register, errors, handleSubmit, reset,
  };
}
