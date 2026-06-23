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
};
