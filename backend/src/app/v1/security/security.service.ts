import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { PrismaService } from '@/database';
import { AuditService } from './audit.service';
import { paginate, paginationArgs } from '@/common/utils';

@Injectable()
export class SecurityService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  // ── Sessions ────────────────────────────────────────────────

  async listSessions(params: {
    page: number;
    pageSize: number;
    userId?: string;
    isActive?: boolean;
    search?: string;
    deviceType?: string;
    from?: string;
    to?: string;
  }) {
    const { page, pageSize, userId, isActive, search, deviceType, from, to } = params;
    const { skip, take } = paginationArgs(page, pageSize);

    const where: Record<string, unknown> = {};
    if (userId) where.userId = userId;
    if (isActive !== undefined) where.isActive = isActive;
    if (deviceType) where.deviceType = deviceType;
    if (from || to) {
      where.createdAt = {} as Record<string, unknown>;
      if (from) (where.createdAt as Record<string, unknown>).gte = new Date(from);
      if (to) (where.createdAt as Record<string, unknown>).lte = new Date(to);
    }
    if (search) {
      where.OR = [
        { user: { name: { contains: search, mode: 'insensitive' } } },
        { user: { email: { contains: search, mode: 'insensitive' } } },
        { ipAddress: { contains: search } },
        { browser: { contains: search, mode: 'insensitive' } },
        { os: { contains: search, mode: 'insensitive' } },
        { deviceName: { contains: search, mode: 'insensitive' } },
        { location: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.session.findMany({
        where: where as any,
        include: { user: { select: { id: true, name: true, email: true, role: true } } },
        orderBy: { lastActivity: 'desc' },
        skip,
        take,
      }),
      this.prisma.session.count({ where: where as any }),
    ]);

    return {
      message: 'Sessions fetched',
      data,
      meta: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) || 1 },
    };
  }

  async getMySessions(userId: string) {
    const sessions = await this.prisma.session.findMany({
      where: { userId, isActive: true },
      orderBy: { lastActivity: 'desc' },
      select: {
        id: true,
        ipAddress: true,
        browser: true,
        browserVersion: true,
        os: true,
        osVersion: true,
        deviceType: true,
        deviceName: true,
        deviceInfo: true,
        location: true,
        city: true,
        country: true,
        loginMethod: true,
        lastActivity: true,
        createdAt: true,
        expiresAt: true,
      },
    });

    return {
      message: 'My sessions fetched',
      data: sessions,
    };
  }

  async revokeSession(sessionId: string, adminUser: { id: string; role: string; tenantId: string }) {
    const session = await this.prisma.session.findUnique({
      where: { id: sessionId },
      include: { user: true },
    });

    if (!session) throw new NotFoundException('Session not found');
    if (adminUser.role !== UserRole.SUPER_ADMIN) {
      throw new ForbiddenException('Only super admin can revoke sessions');
    }

    await this.prisma.session.update({
      where: { id: sessionId },
      data: { isActive: false, revokedAt: new Date(), revokeReason: 'Admin revoked' },
    });

    if (session.refreshToken) {
      await this.prisma.refreshToken.updateMany({
        where: { token: session.refreshToken },
        data: { revokedAt: new Date() },
      });
    }

    const correlationId = this.audit.generateCorrelationId();
    await this.audit.log({
      userId: adminUser.id,
      action: 'SESSION_REVOKE',
      entity: 'Session',
      entityId: sessionId,
      newValues: { revokedAt: new Date().toISOString(), revokeReason: 'Admin revoked' },
      oldValues: { isActive: session.isActive },
      correlationId,
    });

    return { message: 'Session revoked successfully' };
  }

  async revokeMySession(sessionId: string, userId: string) {
    const session = await this.prisma.session.findUnique({
      where: { id: sessionId },
    });

    if (!session) throw new NotFoundException('Session not found');
    if (session.userId !== userId) throw new ForbiddenException('Not your session');

    await this.prisma.session.update({
      where: { id: sessionId },
      data: { isActive: false, revokedAt: new Date(), revokeReason: 'User revoked' },
    });

    if (session.refreshToken) {
      await this.prisma.refreshToken.updateMany({
        where: { token: session.refreshToken },
        data: { revokedAt: new Date() },
      });
    }

    return { message: 'Session revoked successfully' };
  }

  async revokeAllOtherSessions(currentSessionId: string, userId: string) {
    const result = await this.prisma.session.updateMany({
      where: { userId, isActive: true, id: { not: currentSessionId } },
      data: { isActive: false, revokedAt: new Date(), revokeReason: 'User signed out all other devices' },
    });

    await this.prisma.refreshToken.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });

    return { message: `${result.count} other sessions revoked` };
  }

  async revokeAllUserSessions(userId: string, adminUser: { id: string; role: string }) {
    if (adminUser.role !== UserRole.SUPER_ADMIN) {
      throw new ForbiddenException('Only super admin can revoke sessions');
    }

    const result = await this.prisma.session.updateMany({
      where: { userId, isActive: true },
      data: { isActive: false, revokedAt: new Date(), revokeReason: 'Admin revoked all sessions' },
    });

    await this.prisma.refreshToken.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });

    const correlationId = this.audit.generateCorrelationId();
    await this.audit.log({
      userId: adminUser.id,
      action: 'SESSION_REVOKE',
      entity: 'User',
      entityId: userId,
      newValues: { sessionsRevoked: result.count },
      correlationId,
    });

    return { message: `${result.count} active sessions revoked` };
  }

  // ── Login History ───────────────────────────────────────────

  async listLoginHistory(params: {
    page: number;
    pageSize: number;
    userId?: string;
    success?: boolean;
    search?: string;
    from?: string;
    to?: string;
    loginMethod?: string;
    isSuspicious?: boolean;
    browser?: string;
    os?: string;
    deviceType?: string;
  }) {
    const { page, pageSize, userId, success, search, from, to, loginMethod, isSuspicious, browser, os, deviceType } = params;
    const { skip, take } = paginationArgs(page, pageSize);

    const where: Record<string, unknown> = {};
    if (userId) where.userId = userId;
    if (success !== undefined) where.success = success;
    if (loginMethod) where.loginMethod = loginMethod;
    if (isSuspicious !== undefined) where.isSuspicious = isSuspicious;
    if (browser) where.browser = { contains: browser, mode: 'insensitive' };
    if (os) where.os = { contains: os, mode: 'insensitive' };
    if (deviceType) where.deviceType = deviceType;
    if (from || to) {
      where.loginAt = {} as Record<string, unknown>;
      if (from) (where.loginAt as Record<string, unknown>).gte = new Date(from);
      if (to) (where.loginAt as Record<string, unknown>).lte = new Date(to);
    }
    if (search) {
      where.OR = [
        { user: { name: { contains: search, mode: 'insensitive' } } },
        { user: { email: { contains: search, mode: 'insensitive' } } },
        { ipAddress: { contains: search } },
        { browser: { contains: search, mode: 'insensitive' } },
        { os: { contains: search, mode: 'insensitive' } },
        { location: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.userLoginLog.findMany({
        where: where as any,
        include: { user: { select: { id: true, name: true, email: true, role: true } } },
        orderBy: { loginAt: 'desc' },
        skip,
        take,
      }),
      this.prisma.userLoginLog.count({ where: where as any }),
    ]);

    return {
      message: 'Login history fetched',
      data,
      meta: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) || 1 },
    };
  }

  async getLoginHistoryStats(userId?: string) {
    const where: Record<string, unknown> = {};
    if (userId) where.userId = userId;

    const now = new Date();
    const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const last7d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [
      totalAttempts,
      successfulLogins,
      failedLogins,
      failedLast24h,
      suspiciousLast7d,
      uniqueIpCount,
      uniqueDeviceCount,
      loginsByMethod,
    ] = await Promise.all([
      this.prisma.userLoginLog.count({ where: where as any }),
      this.prisma.userLoginLog.count({ where: { ...where as any, success: true } }),
      this.prisma.userLoginLog.count({ where: { ...where as any, success: false } }),
      this.prisma.userLoginLog.count({ where: { ...where as any, success: false, loginAt: { gte: last24h } } }),
      this.prisma.userLoginLog.count({ where: { ...where as any, isSuspicious: true, loginAt: { gte: last7d } } }),
      this.prisma.userLoginLog.findMany({
        where: { ...where as any, ipAddress: { not: null } },
        distinct: ['ipAddress'],
        select: { ipAddress: true },
      }).then((r) => r.length),
      this.prisma.userLoginLog.findMany({
        where: { ...where as any, deviceFingerprint: { not: null } },
        distinct: ['deviceFingerprint'],
        select: { deviceFingerprint: true },
      }).then((r) => r.length),
      this.prisma.userLoginLog.groupBy({
        by: ['loginMethod'],
        _count: { loginMethod: true },
        where: where as any,
      }),
    ]);

    const methodBreakdown: Record<string, number> = {};
    for (const row of loginsByMethod) {
      methodBreakdown[row.loginMethod] = (row._count as any).loginMethod ?? (row as any)._count ?? 0;
    }

    return {
      message: 'Login history stats',
      data: {
        totalAttempts,
        successfulLogins,
        failedLogins,
        successRate: totalAttempts > 0 ? Math.round((successfulLogins / totalAttempts) * 100) : 0,
        failedLast24h,
        suspiciousLast7d,
        uniqueIpCount,
        uniqueDeviceCount,
        loginsByMethod: methodBreakdown,
      },
    };
  }

  // ── Audit Logs ──────────────────────────────────────────────

  async listAuditLogs(params: {
    page: number;
    pageSize: number;
    userId?: string;
    tenantId?: string;
    action?: string;
    entity?: string;
    search?: string;
    from?: string;
    to?: string;
  }) {
    const { page, pageSize, userId, tenantId, action, entity, search, from, to } = params;
    const { skip, take } = paginationArgs(page, pageSize);

    const where: Record<string, unknown> = {};
    if (userId) where.userId = userId;
    if (tenantId) where.tenantId = tenantId;
    if (action) where.action = action;
    if (entity) where.entity = { contains: entity, mode: 'insensitive' };
    if (from || to) {
      where.createdAt = {} as Record<string, unknown>;
      if (from) (where.createdAt as Record<string, unknown>).gte = new Date(from);
      if (to) (where.createdAt as Record<string, unknown>).lte = new Date(to);
    }
    if (search) {
      where.OR = [
        { user: { name: { contains: search, mode: 'insensitive' } } },
        { user: { email: { contains: search, mode: 'insensitive' } } },
        { entity: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.auditLog.findMany({
        where: where as any,
        include: { user: { select: { id: true, name: true, email: true, role: true } } },
        orderBy: { createdAt: 'desc' },
        skip,
        take,
      }),
      this.prisma.auditLog.count({ where: where as any }),
    ]);

    return {
      message: 'Audit logs fetched',
      data,
      meta: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) || 1 },
    };
  }

  async getAuditLogStats() {
    const now = new Date();
    const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const last7d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [totalLogs, logsLast24h, logsLast7d, actionsByType, topEntities] = await Promise.all([
      this.prisma.auditLog.count(),
      this.prisma.auditLog.count({ where: { createdAt: { gte: last24h } } }),
      this.prisma.auditLog.count({ where: { createdAt: { gte: last7d } } }),
      this.prisma.auditLog.groupBy({
        by: ['action'],
        _count: { action: true },
        orderBy: { _count: { action: 'desc' } },
        take: 10,
      }),
      this.prisma.auditLog.groupBy({
        by: ['entity'],
        _count: { entity: true },
        orderBy: { _count: { entity: 'desc' } },
        take: 10,
      }),
    ]);

    const actionBreakdown: Record<string, number> = {};
    for (const row of actionsByType) actionBreakdown[row.action] = (row._count as any).action ?? (row as any)._count ?? 0;
    const entityBreakdown: Record<string, number> = {};
    for (const row of topEntities) entityBreakdown[row.entity] = (row._count as any).entity ?? (row as any)._count ?? 0;

    return {
      message: 'Audit log stats',
      data: { totalLogs, logsLast24h, logsLast7d, actionsByType: actionBreakdown, topEntities: entityBreakdown },
    };
  }

  // ── Activity Logs ───────────────────────────────────────────

  async listActivityLogs(params: {
    page: number;
    pageSize: number;
    userId?: string;
    tenantId?: string;
    search?: string;
    from?: string;
    to?: string;
    resource?: string;
    action?: string;
    executionStatus?: string;
  }) {
    const { page, pageSize, userId, tenantId, search, from, to, resource, action, executionStatus } = params;
    const { skip, take } = paginationArgs(page, pageSize);

    const where: Record<string, unknown> = {};
    if (userId) where.userId = userId;
    if (tenantId) where.tenantId = tenantId;
    if (resource) where.resource = { contains: resource, mode: 'insensitive' };
    if (action) where.action = action;
    if (executionStatus) where.executionStatus = executionStatus;
    if (from || to) {
      where.createdAt = {} as Record<string, unknown>;
      if (from) (where.createdAt as Record<string, unknown>).gte = new Date(from);
      if (to) (where.createdAt as Record<string, unknown>).lte = new Date(to);
    }
    if (search) {
      where.OR = [
        { user: { name: { contains: search, mode: 'insensitive' } } },
        { user: { email: { contains: search, mode: 'insensitive' } } },
        { activity: { contains: search, mode: 'insensitive' } },
        { resource: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.activityLog.findMany({
        where: where as any,
        include: { user: { select: { id: true, name: true, email: true, role: true } } },
        orderBy: { createdAt: 'desc' },
        skip,
        take,
      }),
      this.prisma.activityLog.count({ where: where as any }),
    ]);

    return {
      message: 'Activity logs fetched',
      data,
      meta: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) || 1 },
    };
  }

  // ── Security Events ─────────────────────────────────────────

  async listSecurityEvents(params: {
    page: number;
    pageSize: number;
    userId?: string;
    tenantId?: string;
    eventType?: string;
    severity?: string;
    category?: string;
    search?: string;
    from?: string;
    to?: string;
    resolved?: boolean;
  }) {
    const { page, pageSize, userId, tenantId, eventType, severity, category, search, from, to, resolved } = params;
    const { skip, take } = paginationArgs(page, pageSize);

    const where: Record<string, unknown> = {};
    if (userId) where.userId = userId;
    if (tenantId) where.tenantId = tenantId;
    if (eventType) where.eventType = { contains: eventType, mode: 'insensitive' };
    if (severity) where.severity = severity;
    if (category) where.category = category;
    if (resolved !== undefined) where.resolved = resolved;
    if (from || to) {
      where.createdAt = {} as Record<string, unknown>;
      if (from) (where.createdAt as Record<string, unknown>).gte = new Date(from);
      if (to) (where.createdAt as Record<string, unknown>).lte = new Date(to);
    }
    if (search) {
      where.OR = [
        { user: { name: { contains: search, mode: 'insensitive' } } },
        { user: { email: { contains: search, mode: 'insensitive' } } },
        { message: { contains: search, mode: 'insensitive' } },
        { eventType: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.securityEvent.findMany({
        where: where as any,
        include: {
          user: { select: { id: true, name: true, email: true, role: true } },
          tenant: { select: { id: true, name: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take,
      }),
      this.prisma.securityEvent.count({ where: where as any }),
    ]);

    return {
      message: 'Security events fetched',
      data,
      meta: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) || 1 },
    };
  }

  async getSecurityEventStats() {
    const now = new Date();
    const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const last7d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [totalEvents, eventsLast24h, criticalLast7d, eventsBySeverity, eventsByCategory, unresolvedCount] = await Promise.all([
      this.prisma.securityEvent.count(),
      this.prisma.securityEvent.count({ where: { createdAt: { gte: last24h } } }),
      this.prisma.securityEvent.count({ where: { severity: 'CRITICAL', createdAt: { gte: last7d } } }),
      this.prisma.securityEvent.groupBy({ by: ['severity'], _count: { severity: true } }),
      this.prisma.securityEvent.groupBy({ by: ['category'], _count: { category: true }, where: { category: { not: null } } }),
      this.prisma.securityEvent.count({ where: { resolved: false } }),
    ]);

    const severityBreakdown: Record<string, number> = {};
    for (const row of eventsBySeverity) severityBreakdown[row.severity] = (row._count as any).severity ?? (row as any)._count ?? 0;
    const categoryBreakdown: Record<string, number> = {};
    for (const row of eventsByCategory) {
      if (row.category) categoryBreakdown[row.category] = (row._count as any).category ?? (row as any)._count ?? 0;
    }

    return {
      message: 'Security event stats',
      data: {
        totalEvents,
        eventsLast24h,
        criticalLast7d,
        unresolvedCount,
        eventsBySeverity: severityBreakdown,
        eventsByCategory: categoryBreakdown,
      },
    };
  }

  // ── Dashboard Stats (for super admin) ────────────────────────

  async getDashboardStats() {
    const now = new Date();
    const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const last7d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const last30d = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const safe = <T>(p: Promise<T>, fallback: T): Promise<T> =>
      p.catch(() => fallback);

    const [
      activeSessions, failedLogins24h, criticalEvents7d, totalAuditLogs,
      totalUsers, totalTenants, tenantsByStatus, pendingAccessRequests,
      suspiciousLogins7d, lockedAccounts, totalSecurityEvents,
    ] = await Promise.all([
      safe(this.prisma.session.count({ where: { isActive: true } }), 0),
      safe(this.prisma.userLoginLog.count({ where: { success: false, loginAt: { gte: last24h } } }), 0),
      safe(this.prisma.securityEvent.count({ where: { severity: 'CRITICAL', createdAt: { gte: last7d } } }), 0),
      safe(this.prisma.auditLog.count(), 0),
      safe(this.prisma.user.count(), 0),
      safe(this.prisma.tenant.count(), 0),
      safe(this.prisma.tenant.groupBy({ by: ['status'], _count: { status: true } }), [] as any[]),
      safe(this.prisma.tenantAccessRequest.count({ where: { status: 'PENDING' } }), 0),
      safe(this.prisma.userLoginLog.count({ where: { isSuspicious: true, loginAt: { gte: last7d } } }), 0),
      safe(this.prisma.user.count({ where: { status: 'SUSPENDED' } }), 0),
      safe(this.prisma.securityEvent.count(), 0),
    ]);

    const [
      recentAuditLogs, recentSecurityEvents, recentLoginAttempts,
    ] = await Promise.all([
      safe(this.prisma.auditLog.findMany({
        orderBy: { createdAt: 'desc' }, take: 10,
        include: { user: { select: { id: true, name: true, email: true, role: true } } },
      }), [] as any[]),
      safe(this.prisma.securityEvent.findMany({
        orderBy: { createdAt: 'desc' }, take: 10,
        include: { user: { select: { id: true, name: true, email: true, role: true } } },
      }), [] as any[]),
      safe(this.prisma.userLoginLog.findMany({
        orderBy: { loginAt: 'desc' }, take: 10,
        include: { user: { select: { id: true, name: true, email: true, role: true } } },
      }), [] as any[]),
    ]);

    const [
      failedLoginTrend, securityEventTrend, sessionsByDeviceType,
      activeSubscriptions, trialSubscriptions,
    ] = await Promise.all([
      safe(this.prisma.userLoginLog.groupBy({
        by: ['success'], _count: { success: true },
        where: { loginAt: { gte: last30d } },
      }), [] as any[]),
      safe(this.prisma.securityEvent.groupBy({
        by: ['severity'], _count: { severity: true },
        where: { createdAt: { gte: last30d } },
      }), [] as any[]),
      safe(this.prisma.session.groupBy({
        by: ['deviceType'], _count: { deviceType: true },
        where: { isActive: true },
      }), [] as any[]),
      safe(this.prisma.subscription.count({ where: { status: 'ACTIVE' } }), 0),
      safe(this.prisma.subscription.count({ where: { status: 'TRIAL' } }), 0),
    ]);

    const statusBreakdown: Record<string, number> = {};
    for (const row of tenantsByStatus) statusBreakdown[row.status] = (row._count as any).status ?? (row as any)._count ?? 0;

    const failedTrend: Record<string, number> = {};
    const successTrend: Record<string, number> = {};
    for (const row of failedLoginTrend) {
      if (row.success) successTrend['success'] = (row._count as any).success ?? (row as any)._count ?? 0;
      else failedTrend['failed'] = (row._count as any).success ?? (row as any)._count ?? 0;
    }

    const severityTrend: Record<string, number> = {};
    for (const row of securityEventTrend) severityTrend[row.severity] = (row._count as any).severity ?? (row as any)._count ?? 0;

    const deviceBreakdown: Record<string, number> = {};
    for (const row of sessionsByDeviceType) deviceBreakdown[row.deviceType] = (row._count as any).deviceType ?? (row as any)._count ?? 0;

    return {
      message: 'Platform dashboard stats',
      data: {
        activeSessions,
        failedLoginsLast24h: failedLogins24h,
        criticalEventsLast7d: criticalEvents7d,
        totalAuditLogs,
        totalUsers,
        totalTenants,
        tenantsByStatus: statusBreakdown,
        activeSubscriptions,
        trialSubscriptions,
        pendingAccessRequests,
        suspiciousLoginsLast7d: suspiciousLogins7d,
        lockedAccounts,
        totalSecurityEvents,
        loginTrend: { failed: failedTrend['failed'] ?? 0, success: successTrend['success'] ?? 0 },
        securityEventTrend: severityTrend,
        sessionsByDeviceType: deviceBreakdown,
        recentAuditLogs,
        recentSecurityEvents,
        recentLoginAttempts,
      },
    };
  }

  // ── CSV Export ──────────────────────────────────────────────

  async exportSessionsCsv(params: { isActive?: boolean; userId?: string }) {
    const where: Record<string, unknown> = {};
    if (params.isActive !== undefined) where.isActive = params.isActive;
    if (params.userId) where.userId = params.userId;

    const sessions = await this.prisma.session.findMany({
      where: where as any,
      include: { user: { select: { name: true, email: true, role: true } } },
      orderBy: { createdAt: 'desc' },
      take: 10000,
    });

    return this.toCsv(sessions.map((s) => ({
      'User': s.user.name,
      'Email': s.user.email,
      'Role': s.user.role,
      'IP Address': s.ipAddress ?? '',
      'Browser': s.browser ?? '',
      'OS': s.os ?? '',
      'Device Type': s.deviceType,
      'Device Name': s.deviceName ?? '',
      'Location': s.location ?? '',
      'Login Method': s.loginMethod,
      'Status': s.isActive ? 'Active' : 'Revoked',
      'Last Activity': s.lastActivity.toISOString(),
      'Created': s.createdAt.toISOString(),
      'Expires': s.expiresAt.toISOString(),
    })));
  }

  async exportLoginHistoryCsv(params: { userId?: string; success?: boolean; from?: string; to?: string }) {
    const where: Record<string, unknown> = {};
    if (params.userId) where.userId = params.userId;
    if (params.success !== undefined) where.success = params.success;
    if (params.from || params.to) {
      where.loginAt = {} as Record<string, unknown>;
      if (params.from) (where.loginAt as Record<string, unknown>).gte = new Date(params.from);
      if (params.to) (where.loginAt as Record<string, unknown>).lte = new Date(params.to);
    }

    const logs = await this.prisma.userLoginLog.findMany({
      where: where as any,
      include: { user: { select: { name: true, email: true } } },
      orderBy: { loginAt: 'desc' },
      take: 10000,
    });

    return this.toCsv(logs.map((l) => ({
      'User': l.user.name,
      'Email': l.user.email,
      'IP Address': l.ipAddress ?? '',
      'Browser': l.browser ?? '',
      'OS': l.os ?? '',
      'Device Type': l.deviceType,
      'Login Method': l.loginMethod,
      'Status': l.success ? 'Success' : 'Failed',
      'Failure Reason': l.failureReason ?? '',
      'Suspicious': l.isSuspicious ? 'Yes' : 'No',
      'Location': l.location ?? '',
      'Login Time': l.loginAt.toISOString(),
    })));
  }

  async exportAuditLogsCsv(params: { userId?: string; action?: string; entity?: string; from?: string; to?: string }) {
    const where: Record<string, unknown> = {};
    if (params.userId) where.userId = params.userId;
    if (params.action) where.action = params.action;
    if (params.entity) where.entity = params.entity;
    if (params.from || params.to) {
      where.createdAt = {} as Record<string, unknown>;
      if (params.from) (where.createdAt as Record<string, unknown>).gte = new Date(params.from);
      if (params.to) (where.createdAt as Record<string, unknown>).lte = new Date(params.to);
    }

    const logs = await this.prisma.auditLog.findMany({
      where: where as any,
      include: { user: { select: { name: true, email: true } } },
      orderBy: { createdAt: 'desc' },
      take: 10000,
    });

    return this.toCsv(logs.map((l) => ({
      'User': l.user?.name ?? 'System',
      'Action': l.action,
      'Entity': l.entity,
      'Entity ID': l.entityId ?? '',
      'Old Values': l.oldValues ? JSON.stringify(l.oldValues) : '',
      'New Values': l.newValues ? JSON.stringify(l.newValues) : '',
      'IP Address': l.ipAddress ?? '',
      'Description': l.description ?? '',
      'Created': l.createdAt.toISOString(),
    })));
  }

  async exportSecurityEventsCsv(params: { severity?: string; eventType?: string; from?: string; to?: string }) {
    const where: Record<string, unknown> = {};
    if (params.severity) where.severity = params.severity;
    if (params.eventType) where.eventType = params.eventType;
    if (params.from || params.to) {
      where.createdAt = {} as Record<string, unknown>;
      if (params.from) (where.createdAt as Record<string, unknown>).gte = new Date(params.from);
      if (params.to) (where.createdAt as Record<string, unknown>).lte = new Date(params.to);
    }

    const events = await this.prisma.securityEvent.findMany({
      where: where as any,
      include: { user: { select: { name: true, email: true } } },
      orderBy: { createdAt: 'desc' },
      take: 10000,
    });

    return this.toCsv(events.map((e) => ({
      'User': e.user?.name ?? 'System',
      'Event Type': e.eventType,
      'Category': e.category ?? '',
      'Severity': e.severity,
      'Message': e.message,
      'IP Address': e.ipAddress ?? '',
      'Browser': e.browser ?? '',
      'OS': e.os ?? '',
      'Location': e.location ?? '',
      'Resolved': e.resolved ? 'Yes' : 'No',
      'Created': e.createdAt.toISOString(),
    })));
  }

  async exportActivityLogsCsv(params: { userId?: string; resource?: string; from?: string; to?: string }) {
    const where: Record<string, unknown> = {};
    if (params.userId) where.userId = params.userId;
    if (params.resource) where.resource = params.resource;
    if (params.from || params.to) {
      where.createdAt = {} as Record<string, unknown>;
      if (params.from) (where.createdAt as Record<string, unknown>).gte = new Date(params.from);
      if (params.to) (where.createdAt as Record<string, unknown>).lte = new Date(params.to);
    }

    const logs = await this.prisma.activityLog.findMany({
      where: where as any,
      include: { user: { select: { name: true, email: true } } },
      orderBy: { createdAt: 'desc' },
      take: 10000,
    });

    return this.toCsv(logs.map((l) => ({
      'User': l.user?.name ?? 'System',
      'Activity': l.activity,
      'Action': l.action ?? '',
      'Resource': l.resource ?? '',
      'Resource ID': l.resourceId ?? '',
      'Status': l.executionStatus ?? '',
      'IP Address': l.ipAddress ?? '',
      'Request Source': l.requestSource ?? '',
      'Created': l.createdAt.toISOString(),
    })));
  }

  private toCsv(rows: Record<string, string>[]): { csv: string; filename: string } {
    if (rows.length === 0) return { csv: '', filename: '' };
    const headers = Object.keys(rows[0]);
    const lines = [
      headers.join(','),
      ...rows.map((row) =>
        headers.map((h) => {
          const val = String(row[h] ?? '');
          return val.includes(',') || val.includes('"') || val.includes('\n')
            ? `"${val.replace(/"/g, '""')}"`
            : val;
        }).join(',')
      ),
    ];
    return { csv: lines.join('\n'), filename: `export_${Date.now()}.csv` };
  }
}
