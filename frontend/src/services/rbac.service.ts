import http from "./http";

export interface Permission {
  id: string;
  module: string;
  action: string;
  description: string | null;
  createdAt: string;
}

export interface RoleWithPermissions {
  role: string;
  permissions: Permission[];
}

export interface UserRoleMapping {
  id: string;
  userId: string;
  role: string;
  tenantId: string | null;
  grantedAt: string;
  grantedBy: string | null;
  user: { id: string; name: string; email: string; role: string };
}

export interface UserListItem {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  role: string;
  status: string;
  emailVerified: boolean;
  tenantId: string | null;
  createdAt: string;
  lastLoginAt: string | null;
}

export interface TenantListItem {
  id: string;
  name: string;
  slug: string;
  industry: string;
  status: string;
  logoUrl: string | null;
  createdAt: string;
  userCount: number;
  branchCount: number;
  subscription: {
    id: string;
    status: string;
    startDate: string;
    endDate: string;
    trialEndsAt: string | null;
    plan: { name: string; slug: string } | null;
  } | null;
}

export interface TenantDetail extends TenantListItem {
  website: string | null;
  phone: string | null;
  email: string | null;
  updatedAt: string;
  accessRequestCount: number;
  brand: {
    id: string;
    primaryColor: string | null;
    secondaryColor: string | null;
    tagline: string | null;
  } | null;
  subscription: TenantListItem['subscription'] & {
    invoices: {
      id: string;
      invoiceNumber: string;
      totalAmount: number;
      currency: string;
      createdAt: string;
    }[];
  } | null;
}

export interface UserDetail extends UserListItem {
  avatarUrl: string | null;
  updatedAt: string;
  userRoleMappings: { role: string; tenant: { name: string } | null }[];
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: { page: number; pageSize: number; total: number; totalPages: number };
}

export const rbacService = {
  async listPermissions(): Promise<Permission[]> {
    const { data } = await http.get("/rbac/permissions");
    return data.data;
  },

  async createPermission(payload: { module: string; action: string; description?: string }): Promise<Permission> {
    const { data } = await http.post("/rbac/permissions", payload);
    return data.data;
  },

  async updatePermission(id: string, payload: { module?: string; action?: string; description?: string }): Promise<Permission> {
    const { data } = await http.put(`/rbac/permissions/${id}`, payload);
    return data.data;
  },

  async deletePermission(id: string): Promise<void> {
    await http.delete(`/rbac/permissions/${id}`);
  },

  async listRoles(): Promise<RoleWithPermissions[]> {
    const { data } = await http.get("/rbac/roles");
    return data.data;
  },

  async updateRolePermissions(role: string, permissionIds: string[]): Promise<{ role: string; permissions: Permission[] }> {
    const { data } = await http.put(`/rbac/roles/${role}`, { permissionIds });
    return data.data;
  },

  async listUserRoles(): Promise<UserRoleMapping[]> {
    const { data } = await http.get("/rbac/user-roles");
    return data.data;
  },

  async assignUserRole(userId: string, role: string): Promise<UserRoleMapping> {
    const { data } = await http.post("/rbac/user-roles", { userId, role });
    return data.data;
  },

  async removeUserRole(id: string): Promise<void> {
    await http.delete(`/rbac/user-roles/${id}`);
  },

  async listUsers(page = 1, pageSize = 10): Promise<PaginatedResponse<UserListItem>> {
    const { data } = await http.get("/rbac/users", { params: { page, pageSize } });
    return data.data;
  },

  async getUser(id: string): Promise<UserDetail> {
    const { data } = await http.get(`/rbac/users/${id}`);
    return data.data;
  },

  async updateUserStatus(id: string, status: string): Promise<UserListItem> {
    const { data } = await http.put(`/rbac/users/${id}/status`, { status });
    return data.data;
  },

  async updateUserRole(id: string, role: string): Promise<UserListItem> {
    const { data } = await http.put(`/rbac/users/${id}/role`, { role });
    return data.data;
  },

  // ── Tenant Management ─────────────────────────────────────────

  async listTenants(page = 1, pageSize = 10): Promise<PaginatedResponse<TenantListItem>> {
    const { data } = await http.get("/rbac/tenants", { params: { page, pageSize } });
    return data.data;
  },

  async getTenant(id: string): Promise<TenantDetail> {
    const { data } = await http.get(`/rbac/tenants/${id}`);
    return data.data;
  },
};
