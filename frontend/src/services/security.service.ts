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
  browser: string | null;
  browserVersion: string | null;
  os: string | null;
  osVersion: string | null;
  deviceType: string;
  deviceName: string | null;
  location: string | null;
  city: string | null;
  country: string | null;
  countryCode: string | null;
  loginMethod: string;
  isActive: boolean;
  lastActivity: string;
  expiresAt: string;
  createdAt: string;
  revokedAt: string | null;
  revokeReason: string | null;
  user: { id: string; name: string; email: string; role: string };
}

export interface LoginLogItem {
  id: string;
  userId: string;
  ipAddress: string | null;
  userAgent: string | null;
  loginAt: string;
  success: boolean;
  loginMethod: string;
  failureReason: string | null;
  browser: string | null;
  browserVersion: string | null;
  os: string | null;
  osVersion: string | null;
  deviceType: string;
  deviceName: string | null;
  deviceFingerprint: string | null;
  location: string | null;
  city: string | null;
  country: string | null;
  isSuspicious: boolean;
  suspiciousReason: string | null;
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
  browser: string | null;
  os: string | null;
  location: string | null;
  correlationId: string | null;
  requestId: string | null;
  metadata: Record<string, unknown> | null;
  description: string | null;
  createdAt: string;
  user: { id: string; name: string; email: string; role: string } | null;
}

export interface ActivityLogItem {
  id: string;
  userId: string | null;
  tenantId: string | null;
  activity: string;
  action: string | null;
  resource: string | null;
  resourceId: string | null;
  details: Record<string, unknown> | null;
  previousValues: Record<string, unknown> | null;
  newValues: Record<string, unknown> | null;
  ipAddress: string | null;
  userAgent: string | null;
  requestSource: string | null;
  executionStatus: string | null;
  correlationId: string | null;
  createdAt: string;
  user: { id: string; name: string; email: string; role: string } | null;
}

export interface SecurityEventItem {
  id: string;
  userId: string | null;
  tenantId: string | null;
  eventType: string;
  category: string | null;
  severity: string;
  message: string;
  description: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  browser: string | null;
  os: string | null;
  deviceType: string | null;
  location: string | null;
  city: string | null;
  country: string | null;
  countryCode: string | null;
  correlationId: string | null;
  metadata: Record<string, unknown> | null;
  resolved: boolean;
  resolvedBy: string | null;
  resolvedAt: string | null;
  createdAt: string;
  user: { id: string; name: string; email: string; role: string } | null;
  tenant: { id: string; name: string } | null;
}

export interface SecurityStats {
  activeSessions: number;
  failedLoginsLast24h: number;
  criticalEventsLast7d: number;
  totalAuditLogs: number;
  totalUsers: number;
  totalTenants: number;
  tenantsByStatus: Record<string, number>;
  activeSubscriptions: number;
  trialSubscriptions: number;
  pendingAccessRequests: number;
  suspiciousLoginsLast7d: number;
  lockedAccounts: number;
  totalSecurityEvents: number;
  loginTrend: { failed: number; success: number };
  securityEventTrend: Record<string, number>;
  sessionsByDeviceType: Record<string, number>;
  recentAuditLogs: AuditLogItem[];
  recentSecurityEvents: SecurityEventItem[];
  recentLoginAttempts: LoginLogItem[];
}

export interface LoginHistoryStats {
  totalAttempts: number;
  successfulLogins: number;
  failedLogins: number;
  successRate: number;
  failedLast24h: number;
  suspiciousLast7d: number;
  uniqueIpCount: number;
  uniqueDeviceCount: number;
  loginsByMethod: Record<string, number>;
}

export interface AuditLogStats {
  totalLogs: number;
  logsLast24h: number;
  logsLast7d: number;
  actionsByType: Record<string, number>;
  topEntities: Record<string, number>;
}

export interface SecurityEventStats {
  totalEvents: number;
  eventsLast24h: number;
  criticalLast7d: number;
  unresolvedCount: number;
  eventsBySeverity: Record<string, number>;
  eventsByCategory: Record<string, number>;
}

export const securityService = {
  // ── Dashboard ──────────────────────────────────────────────
  async getStats() {
    const { data } = await http.get("/security/stats");
    return data.data as SecurityStats;
  },

  // ── Sessions ───────────────────────────────────────────────
  async listSessions(params: {
    page?: number; pageSize?: number; userId?: string; isActive?: boolean;
    search?: string; deviceType?: string; from?: string; to?: string;
  }) {
    const { data } = await http.get("/security/sessions", { params });
    return { data: (data.data ?? []) as SessionItem[], meta: (data.meta ?? { page: 1, pageSize: 20, total: 0, totalPages: 0 }) as Meta };
  },

  async getMySessions() {
    const { data } = await http.get("/security/sessions/my");
    return data.data as SessionItem[];
  },

  async revokeSession(id: string) {
    await http.delete(`/security/sessions/${id}`);
  },

  async revokeMySession(id: string) {
    await http.delete(`/security/sessions/${id}/revoke`);
  },

  async revokeOtherSessions() {
    await http.delete("/security/sessions/others/revoke");
  },

  async revokeAllUserSessions(userId: string) {
    await http.delete(`/security/sessions/user/${userId}`);
  },

  // ── Login History ──────────────────────────────────────────
  async listLoginHistory(params: {
    page?: number; pageSize?: number; userId?: string; success?: boolean;
    search?: string; from?: string; to?: string; loginMethod?: string;
    isSuspicious?: boolean; browser?: string; os?: string; deviceType?: string;
  }) {
    const { data } = await http.get("/security/login-history", { params });
    return { data: (data.data ?? []) as LoginLogItem[], meta: (data.meta ?? { page: 1, pageSize: 20, total: 0, totalPages: 0 }) as Meta };
  },

  async getLoginHistoryStats(userId?: string) {
    const { data } = await http.get("/security/login-history/stats", { params: { userId } });
    return data.data as LoginHistoryStats;
  },

  // ── Audit Logs ─────────────────────────────────────────────
  async listAuditLogs(params: {
    page?: number; pageSize?: number; userId?: string; tenantId?: string;
    action?: string; entity?: string; search?: string; from?: string; to?: string;
  }) {
    const { data } = await http.get("/security/audit-logs", { params });
    return { data: (data.data ?? []) as AuditLogItem[], meta: (data.meta ?? { page: 1, pageSize: 20, total: 0, totalPages: 0 }) as Meta };
  },

  async getAuditLogStats() {
    const { data } = await http.get("/security/audit-logs/stats");
    return data.data as AuditLogStats;
  },

  // ── Activity Logs ──────────────────────────────────────────
  async listActivityLogs(params: {
    page?: number; pageSize?: number; userId?: string; tenantId?: string;
    search?: string; from?: string; to?: string; resource?: string;
    action?: string; executionStatus?: string;
  }) {
    const { data } = await http.get("/security/activity-logs", { params });
    return { data: (data.data ?? []) as ActivityLogItem[], meta: (data.meta ?? { page: 1, pageSize: 20, total: 0, totalPages: 0 }) as Meta };
  },

  // ── Security Events ────────────────────────────────────────
  async listSecurityEvents(params: {
    page?: number; pageSize?: number; userId?: string; tenantId?: string;
    eventType?: string; severity?: string; category?: string; search?: string;
    from?: string; to?: string; resolved?: boolean;
  }) {
    const { data } = await http.get("/security/security-events", { params });
    return { data: (data.data ?? []) as SecurityEventItem[], meta: (data.meta ?? { page: 1, pageSize: 20, total: 0, totalPages: 0 }) as Meta };
  },

  async getSecurityEventStats() {
    const { data } = await http.get("/security/security-events/stats");
    return data.data as SecurityEventStats;
  },

  // ── CSV Exports ────────────────────────────────────────────
  async exportSessionsCsv(params: { isActive?: boolean; userId?: string }) {
    const response = await http.get("/security/export/sessions", { params, responseType: "blob" });
    return response.data as Blob;
  },

  async exportLoginHistoryCsv(params: { userId?: string; success?: boolean; from?: string; to?: string }) {
    const response = await http.get("/security/export/login-history", { params, responseType: "blob" });
    return response.data as Blob;
  },

  async exportAuditLogsCsv(params: { userId?: string; action?: string; entity?: string; from?: string; to?: string }) {
    const response = await http.get("/security/export/audit-logs", { params, responseType: "blob" });
    return response.data as Blob;
  },

  async exportSecurityEventsCsv(params: { severity?: string; eventType?: string; from?: string; to?: string }) {
    const response = await http.get("/security/export/security-events", { params, responseType: "blob" });
    return response.data as Blob;
  },

  async exportActivityLogsCsv(params: { userId?: string; resource?: string; from?: string; to?: string }) {
    const response = await http.get("/security/export/activity-logs", { params, responseType: "blob" });
    return response.data as Blob;
  },
};

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
