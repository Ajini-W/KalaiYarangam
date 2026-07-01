"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  getFeePlans,
  getFeePlan,
  createFeePlan,
  updateFeePlan,
  activateFeePlan,
  deactivateFeePlan,
  duplicateFeePlan,
  deleteFeePlan,
  type FeePlan,
  type FeePlanStatus,
} from "@/services/finance";
import { getCourses } from "@/services/courses";
import type { SearchableOption } from "@/components/ui/SearchableSelect";

export const feePlanSchema = z.object({
  planName: z.string().min(1, "Plan name is required"),
  courseId: z.string().min(1, "Course is required"),
  validity: z.string().min(1, "Validity is required"),
  admissionFee: z.string().min(1, "Admission fee is required").refine((v) => !isNaN(Number(v)), "Must be a number"),
  tuitionFee: z.string().min(1, "Tuition fee is required").refine((v) => !isNaN(Number(v)), "Must be a number"),
  installments: z.string().min(1, "Installments is required").refine((v) => !isNaN(Number(v)), "Must be a number"),
  discount: z.string().min(1, "Discount is required").refine((v) => !isNaN(Number(v)), "Must be a number"),
});
export type FeePlanFormData = z.infer<typeof feePlanSchema>;

export interface FeePlansState {
  loading: boolean;
  error: boolean;
  feePlans: FeePlan[];
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
  sortKey: string;
  sortDir: "asc" | "desc";
  handleSort: (key: string) => void;
  modalOpen: boolean;
  setModalOpen: (o: boolean) => void;
  editingFeePlan: FeePlan | null;
  saving: boolean;
  openCreate: () => void;
  openEdit: (feePlan: FeePlan) => Promise<void>;
  onSubmit: (data: FeePlanFormData) => Promise<void>;
  actionConfirm: {
    open: boolean;
    feePlan: FeePlan | null;
    action: "activate" | "deactivate" | "delete" | null;
  };
  actionSaving: boolean;
  confirmAction: () => Promise<void>;
  requestAction: (feePlan: FeePlan, action: "activate" | "deactivate" | "delete") => void;
  closeActionConfirm: () => void;
  handleDuplicate: (feePlan: FeePlan) => Promise<void>;
  fetchFeePlans: () => Promise<void>;
  courseOptions: SearchableOption[];
  register: ReturnType<typeof useForm<FeePlanFormData>>["register"];
  errors: ReturnType<typeof useForm<FeePlanFormData>>["formState"]["errors"];
  handleSubmit: ReturnType<typeof useForm<FeePlanFormData>>["handleSubmit"];
  reset: ReturnType<typeof useForm<FeePlanFormData>>["reset"];
}

export function useFeePlans(): FeePlansState {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);
  const [feePlans, setFeePlans] = React.useState<FeePlan[]>([]);
  const [total, setTotal] = React.useState(0);
  const [page, setPage] = React.useState(1);
  const [pageSize] = React.useState(10);
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("");
  const [courseFilter, setCourseFilter] = React.useState("");
  const [sortKey, setSortKey] = React.useState("");
  const [sortDir, setSortDir] = React.useState<"asc" | "desc">("asc");

  const [modalOpen, setModalOpen] = React.useState(false);
  const [editingFeePlan, setEditingFeePlan] = React.useState<FeePlan | null>(null);
  const [saving, setSaving] = React.useState(false);

  const [actionConfirm, setActionConfirm] = React.useState<{
    open: boolean;
    feePlan: FeePlan | null;
    action: "activate" | "deactivate" | "delete" | null;
  }>({ open: false, feePlan: null, action: null });
  const [actionSaving, setActionSaving] = React.useState(false);

  const [courseOptions, setCourseOptions] = React.useState<SearchableOption[]>([]);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<FeePlanFormData>({
    resolver: zodResolver(feePlanSchema),
  });

  const fetchFeePlans = React.useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await getFeePlans({
        page,
        pageSize,
        search: search || undefined,
        status: (statusFilter as FeePlanStatus) || undefined,
        courseId: courseFilter || undefined,
        sortBy: sortKey || undefined,
        sortDir: sortKey ? sortDir : undefined,
      });
      setFeePlans(res.data.items);
      setTotal(res.data.total);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, search, statusFilter, courseFilter, sortKey, sortDir]);

  React.useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(false);
      try {
        const res = await getFeePlans({
          page,
          pageSize,
          search: search || undefined,
          status: (statusFilter as FeePlanStatus) || undefined,
          courseId: courseFilter || undefined,
          sortBy: sortKey || undefined,
          sortDir: sortKey ? sortDir : undefined,
        });
        setFeePlans(res.data.items);
        setTotal(res.data.total);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [page, pageSize, search, statusFilter, courseFilter, sortKey, sortDir]);

  React.useEffect(() => {
    const load = async () => {
      try {
        const res = await getCourses();
        setCourseOptions(
          res.data.items.map((c) => ({
            value: c.id,
            label: c.name,
          })),
        );
      } catch {
        // non-critical
      }
    };
    load();
  }, []);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const openCreate = () => {
    setEditingFeePlan(null);
    reset({
      planName: "", courseId: "", validity: "",
      admissionFee: "0", tuitionFee: "0", installments: "1", discount: "0",
    });
    setModalOpen(true);
  };

  const openEdit = async (feePlan: FeePlan) => {
    setEditingFeePlan(feePlan);
    const full = await getFeePlan(feePlan.id);
    const fp = full.data;
    reset({
      planName: fp.planName,
      courseId: fp.courseId,
      validity: fp.validity,
      admissionFee: String(fp.admissionFee),
      tuitionFee: String(fp.tuitionFee),
      installments: String(fp.installments),
      discount: String(fp.discount),
    });
    setModalOpen(true);
  };

  const onSubmit = async (data: FeePlanFormData) => {
    setSaving(true);
    try {
      const payload = {
        planName: data.planName,
        courseId: data.courseId,
        validity: data.validity,
        admissionFee: Number(data.admissionFee),
        tuitionFee: Number(data.tuitionFee),
        installments: Number(data.installments),
        discount: Number(data.discount),
      };
      if (editingFeePlan) {
        await updateFeePlan(editingFeePlan.id, payload);
        toast.success("Fee plan updated");
      } else {
        await createFeePlan(payload);
        toast.success("Fee plan created");
      }
      setModalOpen(false);
      await fetchFeePlans();
    } catch {
      toast.error(editingFeePlan ? "Failed to update fee plan" : "Failed to create fee plan");
    } finally {
      setSaving(false);
    }
  };

  const requestAction = (
    feePlan: FeePlan,
    action: "activate" | "deactivate" | "delete",
  ) => {
    setActionConfirm({ open: true, feePlan, action });
  };

  const closeActionConfirm = () => {
    setActionConfirm({ open: false, feePlan: null, action: null });
  };

  const confirmAction = async () => {
    const { feePlan, action } = actionConfirm;
    if (!feePlan || !action) return;
    setActionSaving(true);
    try {
      switch (action) {
        case "activate":
          await activateFeePlan(feePlan.id);
          toast.success("Fee plan activated");
          break;
        case "deactivate":
          await deactivateFeePlan(feePlan.id);
          toast.success("Fee plan deactivated");
          break;
        case "delete":
          await deleteFeePlan(feePlan.id);
          toast.success("Fee plan deleted");
          break;
      }
      closeActionConfirm();
      await fetchFeePlans();
    } catch {
      toast.error(`Failed to ${action} fee plan`);
    } finally {
      setActionSaving(false);
    }
  };

  const handleDuplicate = async (feePlan: FeePlan) => {
    try {
      await duplicateFeePlan(feePlan.id);
      toast.success("Fee plan duplicated");
      await fetchFeePlans();
    } catch {
      toast.error("Failed to duplicate fee plan");
    }
  };

  return {
    loading, error, feePlans, total,
    page, setPage, pageSize,
    search, setSearch,
    statusFilter, setStatusFilter,
    courseFilter, setCourseFilter,
    sortKey, sortDir, handleSort,
    modalOpen, setModalOpen,
    editingFeePlan, saving,
    openCreate, openEdit, onSubmit,
    actionConfirm, actionSaving, confirmAction, requestAction, closeActionConfirm,
    handleDuplicate,
    fetchFeePlans,
    courseOptions,
    register, errors, handleSubmit, reset,
  };
}
