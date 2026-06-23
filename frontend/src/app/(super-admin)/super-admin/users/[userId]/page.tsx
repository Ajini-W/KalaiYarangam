"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Shield, ShieldOff } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { Select } from "@/components/ui/Select";
import { rbacService, type UserDetail } from "@/services/rbac.service";
import { useAuthStore } from "@/store/auth.store";
import { toast } from "sonner";

const ROLES = [
  { value: "SUPER_ADMIN", label: "Super Admin" },
  { value: "OWNER", label: "Owner" },
  { value: "BRANCH_MANAGER", label: "Branch Manager" },
  { value: "TRAINER", label: "Trainer" },
  { value: "STAFF", label: "Staff" },
  { value: "STUDENT", label: "Student" },
  { value: "CLIENT", label: "Client" },
];

const STATUSES = [
  { value: "ACTIVE", label: "Active" },
  { value: "INACTIVE", label: "Inactive" },
  { value: "SUSPENDED", label: "Suspended" },
  { value: "PENDING", label: "Pending" },
];

export default function UserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.userId as string;
  const currentUser = useAuthStore((s) => s.user);

  const [user, setUser] = React.useState<UserDetail | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [selectedRole, setSelectedRole] = React.useState("");
  const [selectedStatus, setSelectedStatus] = React.useState("");

  React.useEffect(() => {
    (async () => {
      try {
        const u = await rbacService.getUser(userId);
        setUser(u);
        setSelectedRole(u.role);
        setSelectedStatus(u.status);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [userId]);

  const handleSaveRole = async () => {
    if (!selectedRole || selectedRole === user?.role) return;
    setSaving(true);
    try {
      await rbacService.updateUserRole(userId, selectedRole);
      toast.success("Role updated successfully");
      setUser((prev) => prev ? { ...prev, role: selectedRole } : prev);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveStatus = async () => {
    if (!selectedStatus || selectedStatus === user?.status) return;
    setSaving(true);
    try {
      const updated = await rbacService.updateUserStatus(userId, selectedStatus);
      toast.success(`Status updated to ${selectedStatus}`);
      setUser((prev) => prev ? { ...prev, status: selectedStatus } : prev);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center py-20"><Spinner size="xl" /></div>
      </PageContainer>
    );
  }

  if (!user) {
    return (
      <PageContainer>
        <p className="text-text-secondary text-center py-20">User not found.</p>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title={user.name}
      subtitle={user.email}
      back={() => router.push("/super-admin/users")}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader><CardTitle>User Info</CardTitle></CardHeader>
          <CardBody className="space-y-3">
            <div>
              <p className="text-xs text-text-secondary uppercase tracking-wide">Name</p>
              <p className="text-sm font-medium">{user.name}</p>
            </div>
            <div>
              <p className="text-xs text-text-secondary uppercase tracking-wide">Email</p>
              <p className="text-sm font-medium">{user.email}</p>
            </div>
            <div>
              <p className="text-xs text-text-secondary uppercase tracking-wide">Phone</p>
              <p className="text-sm font-medium">{user.phone ?? "—"}</p>
            </div>
            <div>
              <p className="text-xs text-text-secondary uppercase tracking-wide">Role</p>
              <Badge variant="brand">{user.role}</Badge>
            </div>
            <div>
              <p className="text-xs text-text-secondary uppercase tracking-wide">Status</p>
              <Badge variant={user.status === "ACTIVE" ? "success" : user.status === "PENDING" ? "info" : user.status === "SUSPENDED" ? "danger" : "warning"}>
                {user.status}
              </Badge>
            </div>
            <div>
              <p className="text-xs text-text-secondary uppercase tracking-wide">Email Verified</p>
              <p className="text-sm font-medium">{user.emailVerified ? "Yes" : "No"}</p>
            </div>
            <div>
              <p className="text-xs text-text-secondary uppercase tracking-wide">Joined</p>
              <p className="text-sm font-medium">{new Date(user.createdAt).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-xs text-text-secondary uppercase tracking-wide">Last Login</p>
              <p className="text-sm font-medium">{user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString() : "—"}</p>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader><CardTitle>Change Role</CardTitle></CardHeader>
          <CardBody className="space-y-3">
            <Select
              label="New Role"
              options={ROLES}
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
            />
            <Button
              variant="primary"
              size="sm"
              loading={saving}
              disabled={selectedRole === user.role}
              onClick={handleSaveRole}
              leftIcon={<Shield size={14} />}
            >
              Update Role
            </Button>
          </CardBody>
        </Card>

        <Card>
          <CardHeader><CardTitle>Change Status</CardTitle></CardHeader>
          <CardBody className="space-y-3">
            <Select
              label="New Status"
              options={STATUSES}
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            />
            <Button
              variant={selectedStatus === "ACTIVE" ? "primary" : selectedStatus === "SUSPENDED" ? "danger" : "secondary"}
              size="sm"
              loading={saving}
              disabled={selectedStatus === user.status}
              onClick={handleSaveStatus}
              leftIcon={selectedStatus === "ACTIVE" ? <Shield size={14} /> : <ShieldOff size={14} />}
            >
              Update Status
            </Button>
          </CardBody>
        </Card>
      </div>

      {user.userRoleMappings.length > 0 && (
        <Card className="mt-6">
          <CardHeader><CardTitle>Additional Role Assignments</CardTitle></CardHeader>
          <CardBody>
            <ul className="space-y-2">
              {user.userRoleMappings.map((m, i) => (
                <li key={i} className="flex items-center gap-2 text-sm">
                  <Badge variant="brand">{m.role}</Badge>
                  {m.tenant && <span className="text-text-secondary">{m.tenant.name}</span>}
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>
      )}
    </PageContainer>
  );
}
