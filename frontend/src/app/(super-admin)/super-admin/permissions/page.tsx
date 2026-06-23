"use client";

import * as React from "react";
import { Plus, Pencil, Trash2, Save, X } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Table, type Column } from "@/components/ui/Table";
import { Card, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Spinner } from "@/components/ui/Spinner";
import { rbacService, type Permission } from "@/services/rbac.service";
import { toast } from "sonner";

export default function PermissionManagementPage() {
  const [permissions, setPermissions] = React.useState<Permission[]>([]);
  const [loading, setLoading] = React.useState(true);

  const [showForm, setShowForm] = React.useState(false);
  const [formModule, setFormModule] = React.useState("");
  const [formAction, setFormAction] = React.useState("");
  const [formDesc, setFormDesc] = React.useState("");
  const [saving, setSaving] = React.useState(false);

  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [editModule, setEditModule] = React.useState("");
  const [editAction, setEditAction] = React.useState("");
  const [editDesc, setEditDesc] = React.useState("");

  const fetchPermissions = React.useCallback(async () => {
    setLoading(true);
    try {
      const data = await rbacService.listPermissions();
      setPermissions(data);
    } catch { /* ignore */ } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => { fetchPermissions(); }, [fetchPermissions]);

  const handleCreate = async () => {
    if (!formModule.trim() || !formAction.trim()) {
      toast.error("Module and action are required");
      return;
    }
    setSaving(true);
    try {
      await rbacService.createPermission({ module: formModule.trim(), action: formAction.trim(), description: formDesc.trim() || undefined });
      toast.success("Permission created");
      setFormModule(""); setFormAction(""); setFormDesc(""); setShowForm(false);
      fetchPermissions();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (p: Permission) => {
    setEditingId(p.id);
    setEditModule(p.module);
    setEditAction(p.action);
    setEditDesc(p.description ?? "");
  };

  const cancelEdit = () => { setEditingId(null); };

  const handleUpdate = async () => {
    if (!editingId || !editModule.trim() || !editAction.trim()) {
      toast.error("Module and action are required");
      return;
    }
    setSaving(true);
    try {
      await rbacService.updatePermission(editingId, { module: editModule.trim(), action: editAction.trim(), description: editDesc.trim() || undefined });
      toast.success("Permission updated");
      cancelEdit();
      fetchPermissions();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this permission?")) return;
    try {
      await rbacService.deletePermission(id);
      toast.success("Permission deleted");
      fetchPermissions();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const columns: Column<Permission>[] = [
    {
      key: "module",
      header: "Module",
      render: (r) =>
        editingId === r.id ? (
          <Input value={editModule} onChange={(e) => setEditModule(e.target.value)} className="w-28 h-8 text-xs" />
        ) : (
          <Badge variant="brand">{r.module}</Badge>
        ),
    },
    {
      key: "action",
      header: "Action",
      render: (r) =>
        editingId === r.id ? (
          <Input value={editAction} onChange={(e) => setEditAction(e.target.value)} className="w-28 h-8 text-xs" />
        ) : (
          <span className="font-mono text-sm">{r.action}</span>
        ),
    },
    {
      key: "description",
      header: "Description",
      render: (r) =>
        editingId === r.id ? (
          <Input value={editDesc} onChange={(e) => setEditDesc(e.target.value)} className="w-40 h-8 text-xs" />
        ) : (
          r.description ?? <span className="text-text-disabled">—</span>
        ),
    },
    {
      key: "createdAt",
      header: "Created",
      render: (r) => new Date(r.createdAt).toLocaleDateString(),
    },
    {
      key: "id",
      header: "",
      className: "w-24",
      render: (r) =>
        editingId === r.id ? (
          <div className="flex items-center gap-1">
            <button onClick={handleUpdate} disabled={saving} className="p-1 text-success hover:text-success"><Save size={14} /></button>
            <button onClick={cancelEdit} className="p-1 text-text-secondary hover:text-text-primary"><X size={14} /></button>
          </div>
        ) : (
          <div className="flex items-center gap-1">
            <button onClick={() => startEdit(r)} className="p-1 text-text-secondary hover:text-text-primary" title="Edit"><Pencil size={14} /></button>
            <button onClick={() => handleDelete(r.id)} className="p-1 text-danger hover:text-danger" title="Delete"><Trash2 size={14} /></button>
          </div>
        ),
    },
  ];

  if (loading) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center py-20"><Spinner size="xl" /></div>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title="Permission Management"
      subtitle="Define granular permissions (module:action pairs) for role-based access control."
      actions={
        <Button variant="primary" leftIcon={<Plus size={16} />} onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "Add Permission"}
        </Button>
      }
    >
      {showForm && (
        <Card className="mb-6">
          <CardBody>
            <div className="flex flex-wrap items-end gap-3">
              <Input label="Module" placeholder="e.g. users" value={formModule} onChange={(e) => setFormModule(e.target.value)} className="w-40" />
              <Input label="Action" placeholder="e.g. create" value={formAction} onChange={(e) => setFormAction(e.target.value)} className="w-40" />
              <Input label="Description" placeholder="What this permission allows" value={formDesc} onChange={(e) => setFormDesc(e.target.value)} className="w-60" />
              <Button size="sm" loading={saving} onClick={handleCreate}>Create</Button>
            </div>
          </CardBody>
        </Card>
      )}

      <Table
        columns={columns}
        data={permissions}
        loading={false}
        emptyTitle="No permissions defined"
        emptyDescription="Permissions are module:action pairs that can be assigned to roles."
      />
    </PageContainer>
  );
}
