"use client";

import * as React from "react";
import { Plus, Save, X } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Spinner } from "@/components/ui/Spinner";
import { rbacService, type RoleWithPermissions, type Permission } from "@/services/rbac.service";
import { toast } from "sonner";

const ROLES = [
  { value: "SUPER_ADMIN", label: "Super Admin" },
  { value: "OWNER", label: "Owner" },
  { value: "BRANCH_MANAGER", label: "Branch Manager" },
  { value: "STAFF", label: "Staff / Trainer" },
  { value: "STUDENT", label: "Student" },
  { value: "CLIENT", label: "Client" },
];

export default function RoleManagementPage() {
  const [roles, setRoles] = React.useState<RoleWithPermissions[]>([]);
  const [allPermissions, setAllPermissions] = React.useState<Permission[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [editingRole, setEditingRole] = React.useState<string | null>(null);
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set());
  const [saving, setSaving] = React.useState(false);

  const fetchData = React.useCallback(async () => {
    setLoading(true);
    try {
      const [r, p] = await Promise.all([rbacService.listRoles(), rbacService.listPermissions()]);
      setRoles(r);
      setAllPermissions(p);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => { fetchData(); }, [fetchData]);

  const startEditing = (role: string) => {
    const roleData = roles.find((r) => r.role === role);
    setEditingRole(role);
    setSelectedIds(new Set(roleData?.permissions.map((p) => p.id) ?? []));
  };

  const cancelEditing = () => {
    setEditingRole(null);
    setSelectedIds(new Set());
  };

  const togglePermission = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const savePermissions = async () => {
    if (!editingRole) return;
    setSaving(true);
    try {
      const updated = await rbacService.updateRolePermissions(editingRole, Array.from(selectedIds));
      setRoles((prev) =>
        prev.map((r) =>
          r.role === editingRole ? { role: r.role, permissions: updated.permissions } : r
        )
      );
      toast.success(`Permissions updated for ${ROLES.find((r) => r.value === editingRole)?.label}`);
      setEditingRole(null);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to update permissions");
    } finally {
      setSaving(false);
    }
  };

  const groupedPermissions = allPermissions.reduce<Record<string, Permission[]>>((acc, p) => {
    if (!acc[p.module]) acc[p.module] = [];
    acc[p.module].push(p);
    return acc;
  }, {});

  if (loading) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center py-20"><Spinner size="xl" /></div>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title="Role Management"
      subtitle="Manage permissions for each role."
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {ROLES.map((roleDef) => {
          const roleData = roles.find((r) => r.role === roleDef.value);
          const isEditing = editingRole === roleDef.value;
          const permissionCount = roleData?.permissions.length ?? 0;

          return (
            <Card key={roleDef.value}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{roleDef.label}</CardTitle>
                  <Badge variant="brand">{permissionCount} permissions</Badge>
                </div>
              </CardHeader>
              <CardBody>
                {isEditing ? (
                  <div className="space-y-4">
                    <div className="max-h-80 space-y-3 overflow-y-auto">
                      {Object.entries(groupedPermissions).map(([module, perms]) => (
                        <div key={module}>
                          <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary mb-1">{module}</p>
                          <div className="flex flex-wrap gap-1.5">
                            {perms.map((p) => (
                              <button
                                key={p.id}
                                onClick={() => togglePermission(p.id)}
                                className={`inline-flex items-center gap-1 rounded-[var(--radius-xs)] px-2 py-1 text-xs font-medium transition-colors ${
                                  selectedIds.has(p.id)
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-surface-overlay text-text-secondary hover:bg-border"
                                }`}
                              >
                                {p.action}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="primary" loading={saving} onClick={savePermissions} leftIcon={<Save size={14} />}>
                        Save
                      </Button>
                      <Button size="sm" variant="ghost" onClick={cancelEditing} leftIcon={<X size={14} />}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    {permissionCount === 0 ? (
                      <p className="text-sm text-text-secondary">No permissions assigned.</p>
                    ) : (
                      <div className="flex flex-wrap gap-1.5">
                        {roleData?.permissions.slice(0, 10).map((p) => (
                          <Badge key={p.id} variant="outline" size="sm">{p.module}:{p.action}</Badge>
                        ))}
                        {permissionCount > 10 && (
                          <Badge variant="default" size="sm">+{permissionCount - 10} more</Badge>
                        )}
                      </div>
                    )}
                    <div className="mt-3">
                      <Button size="xs" variant="outline" onClick={() => startEditing(roleDef.value)}>
                        Edit Permissions
                      </Button>
                    </div>
                  </div>
                )}
              </CardBody>
            </Card>
          );
        })}
      </div>
    </PageContainer>
  );
}
