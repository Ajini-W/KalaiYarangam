import http from "./http";

interface Meta { page: number; pageSize: number; total: number; totalPages: number }

export interface SessionItem {
  id: string;
  userId: string;
  token: string;
  refreshToken: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  deviceInfo: string | null;
  isActive: boolean;
  lastActivity: string;
  expiresAt: string;
  createdAt: string;
  revokedAt: string | null;
  user: { id: string; name: string; email: string; role: string };
}

export interface LoginLogItem {
  id: string;
  userId: string;
  ipAddress: string | null;
  userAgent: string | null;
  accessToken: string | null;
  refreshToken: string | null;
  loginAt: string;
  success: boolean;
  user: { id: string; name: string; email: string; role: string };
}

export interface AuditLogItem {
  id: string;
  userId: string | null;
  tenantId: string | null;
  action: string;
  entity: string;
  entityId: string | null;
  oldValues: Record<string, unknown> | null;
  newValues: Record<string, unknown> | null;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: string;
  user: { id: string; name: string; email: string; role: string } | null;
}

export interface ActivityLogItem {
  id: string;
  userId: string | null;
  tenantId: string | null;
  activity: string;
  details: Record<string, unknown> | null;
  ipAddress: string | null;
  createdAt: string;
  user: { id: string; name: string; email: string; role: string } | null;
}

export interface SecurityEventItem {
  id: string;
  userId: string | null;
  tenantId: string | null;
  eventType: string;
  severity: string;
  message: string;
  ipAddress: string | null;
  userAgent: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: string;
  user: { id: string; name: string; email: string; role: string } | null;
  tenant: { id: string; name: string } | null;
}

export interface SecurityStats {
  activeSessions: number;
  failedLoginsLast24h: number;
  criticalEventsLast7d: number;
  totalAuditLogs: number;
}

export const securityService = {
  async getStats() {
    const { data } = await http.get("/security/stats");
    return data.data as SecurityStats;
  },

  async listSessions(params: { page?: number; pageSize?: number; userId?: string; isActive?: boolean; search?: string }) {
    const { data } = await http.get("/security/sessions", { params });
    return { data: data.data as SessionItem[], meta: data.meta as Meta };
  },

  async revokeSession(id: string) {
    await http.delete(`/security/sessions/${id}`);
  },

  async revokeAllUserSessions(userId: string) {
    await http.delete(`/security/sessions/user/${userId}`);
  },

  async listLoginHistory(params: { page?: number; pageSize?: number; userId?: string; success?: boolean; search?: string; from?: string; to?: string }) {
    const { data } = await http.get("/security/login-history", { params });
    return { data: data.data as LoginLogItem[], meta: data.meta as Meta };
  },

  async listAuditLogs(params: { page?: number; pageSize?: number; userId?: string; action?: string; entity?: string; search?: string; from?: string; to?: string }) {
    const { data } = await http.get("/security/audit-logs", { params });
    return { data: data.data as AuditLogItem[], meta: data.meta as Meta };
  },

  async listActivityLogs(params: { page?: number; pageSize?: number; userId?: string; search?: string; from?: string; to?: string }) {
    const { data } = await http.get("/security/activity-logs", { params });
    return { data: data.data as ActivityLogItem[], meta: data.meta as Meta };
  },

  async listSecurityEvents(params: { page?: number; pageSize?: number; userId?: string; eventType?: string; severity?: string; search?: string; from?: string; to?: string }) {
    const { data } = await http.get("/security/security-events", { params });
    return { data: data.data as SecurityEventItem[], meta: data.meta as Meta };
  },
};
