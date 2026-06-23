"use client";

import * as React from "react";
import { Plus, Pencil, Power, PowerOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { PageContainer } from "@/components/layout/PageContainer";
import { Table, type Column } from "@/components/ui/Table";
import { Modal, ConfirmModal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { getBranches, createBranch, updateBranch, updateBranchStatus, type Branch } from "@/services/branches";

const branchSchema = z.object({
  name: z.string().min(1, "Name is required"),
  code: z.string().min(1, "Code is required"),
  email: z.string().email("Valid email required"),
  phone: z.string().min(10, "Valid phone required"),
  address: z.string().min(5, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  pincode: z.string().min(4, "Valid pincode required"),
});
type BranchFormData = z.infer<typeof branchSchema>;

export default function BranchesSettingsPage() {
  const [loading, setLoading] = React.useState(true);
  const [branches, setBranches] = React.useState<Branch[]>([]);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [editingBranch, setEditingBranch] = React.useState<Branch | null>(null);
  const [saving, setSaving] = React.useState(false);
  const [statusConfirm, setStatusConfirm] = React.useState<{ open: boolean; branch: Branch | null }>({
    open: false, branch: null,
  });
  const [statusSaving, setStatusSaving] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<BranchFormData>({
    resolver: zodResolver(branchSchema),
  });

  const fetchBranches = React.useCallback(async () => {
    try {
      const res = await getBranches();
      setBranches(res.data);
    } catch {
      toast.error("Failed to load branches");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchBranches();
  }, [fetchBranches]);

  const openCreate = () => {
    setEditingBranch(null);
    reset({ name: "", code: "", email: "", phone: "", address: "", city: "", state: "", pincode: "" });
    setModalOpen(true);
  };

  const openEdit = (branch: Branch) => {
    setEditingBranch(branch);
    reset({
      name: branch.name,
      code: branch.code,
      email: branch.email,
      phone: branch.phone,
      address: branch.address,
      city: branch.city,
      state: branch.state,
      pincode: branch.pincode,
    });
    setModalOpen(true);
  };

  const onSubmit = async (data: BranchFormData) => {
    setSaving(true);
    try {
      if (editingBranch) {
        await updateBranch(editingBranch.id, data);
        toast.success("Branch updated");
      } else {
        await createBranch(data);
        toast.success("Branch created");
      }
      setModalOpen(false);
      await fetchBranches();
    } catch {
      toast.error(editingBranch ? "Failed to update branch" : "Failed to create branch");
    } finally {
      setSaving(false);
    }
  };

  const confirmToggleStatus = async () => {
    const branch = statusConfirm.branch;
    if (!branch) return;
    setStatusSaving(true);
    try {
      await updateBranchStatus(branch.id, { isActive: !branch.isActive });
      toast.success(branch.isActive ? "Branch deactivated" : "Branch activated");
      setStatusConfirm({ open: false, branch: null });
      await fetchBranches();
    } catch {
      toast.error("Failed to update branch status");
    } finally {
      setStatusSaving(false);
    }
  };

  const columns: Column<Branch>[] = [
    { key: "code", header: "Code" },
    { key: "name", header: "Name" },
    { key: "city", header: "City" },
    {
      key: "isActive",
      header: "Status",
      render: (row) => (
        <Badge variant={row.isActive ? "success" : "danger"}>
          {row.isActive ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "",
      render: (row) => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={() => openEdit(row)}>
            <Pencil size={14} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setStatusConfirm({ open: true, branch: row })}
          >
            {row.isActive ? <PowerOff size={14} className="text-danger" /> : <Power size={14} className="text-success" />}
          </Button>
        </div>
      ),
    },
  ];

  return (
    <PageContainer
      title="Branches"
      subtitle="Manage your business locations"
      actions={
        <Button leftIcon={<Plus size={16} />} onClick={openCreate}>
          Add Branch
        </Button>
      }
    >
      <Table
        columns={columns}
        data={branches}
        loading={loading}
        emptyTitle="No branches yet"
        emptyDescription="Add your first branch to get started"
      />

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingBranch ? "Edit Branch" : "Add Branch"}
        size="lg"
        footer={
          <>
            <Button variant="outline" onClick={() => setModalOpen(false)} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={handleSubmit(onSubmit)} loading={saving}>
              {editingBranch ? "Save Changes" : "Create Branch"}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input label="Branch Name" required error={errors.name?.message} {...register("name")} />
            <Input label="Branch Code" required error={errors.code?.message} {...register("code")} />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input label="Email" type="email" required error={errors.email?.message} {...register("email")} />
            <Input label="Phone" type="tel" required error={errors.phone?.message} {...register("phone")} />
          </div>
          <Input label="Address" required error={errors.address?.message} {...register("address")} />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Input label="City" required error={errors.city?.message} {...register("city")} />
            <Input label="State" required error={errors.state?.message} {...register("state")} />
            <Input label="Pincode" required error={errors.pincode?.message} {...register("pincode")} />
          </div>
        </div>
      </Modal>

      <ConfirmModal
        open={statusConfirm.open}
        onClose={() => setStatusConfirm({ open: false, branch: null })}
        onConfirm={confirmToggleStatus}
        title={statusConfirm.branch?.isActive ? "Deactivate Branch" : "Activate Branch"}
        description={
          statusConfirm.branch?.isActive
            ? `Are you sure you want to deactivate ${statusConfirm.branch?.name}?`
            : `Are you sure you want to activate ${statusConfirm.branch?.name}?`
        }
        intent={statusConfirm.branch?.isActive ? "danger" : "info"}
        confirmLabel={statusConfirm.branch?.isActive ? "Deactivate" : "Activate"}
        loading={statusSaving}
      />
    </PageContainer>
  );
}
