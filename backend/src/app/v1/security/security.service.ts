import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { PrismaService } from '@/database';
import { AuditService } from './audit.service';

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
  }) {
    const { page, pageSize, userId, isActive, search } = params;
    const where: Record<string, unknown> = {};
    if (userId) where.userId = userId;
    if (isActive !== undefined) where.isActive = isActive;
    if (search) {
      where.OR = [
        { user: { name: { contains: search, mode: 'insensitive' } } },
        { user: { email: { contains: search, mode: 'insensitive' } } },
        { ipAddress: { contains: search } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.session.findMany({
        where: where as any,
        include: { user: { select: { id: true, name: true, email: true, role: true } } },
        orderBy: { lastActivity: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.prisma.session.count({ where: where as any }),
    ]);

    return {
      message: 'Sessions fetched',
      data,
      meta: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
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
      data: { isActive: false, revokedAt: new Date() },
    });

    // Revoke the associated refresh token too
    if (session.refreshToken) {
      await this.prisma.refreshToken.updateMany({
        where: { token: session.refreshToken },
        data: { revokedAt: new Date() },
      });
    }

    await this.audit.log({
      userId: adminUser.id,
      action: 'SESSION_REVOKE',
      entity: 'Session',
      entityId: sessionId,
      newValues: { revokedAt: new Date().toISOString() },
      oldValues: { isActive: session.isActive },
    });

    return { message: 'Session revoked successfully' };
  }

  async revokeAllUserSessions(userId: string, adminUser: { id: string; role: string }) {
    if (adminUser.role !== UserRole.SUPER_ADMIN) {
      throw new ForbiddenException('Only super admin can revoke sessions');
    }

    const result = await this.prisma.session.updateMany({
      where: { userId, isActive: true },
      data: { isActive: false, revokedAt: new Date() },
    });

    // Revoke all refresh tokens for this user too
    await this.prisma.refreshToken.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });

    await this.audit.log({
      userId: adminUser.id,
      action: 'SESSION_REVOKE',
      entity: 'User',
      entityId: userId,
      newValues: { sessionsRevoked: result.count },
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
  }) {
    const { page, pageSize, userId, success, search, from, to } = params;
    const where: Record<string, unknown> = {};
    if (userId) where.userId = userId;
    if (success !== undefined) where.success = success;
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
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.userLoginLog.findMany({
        where: where as any,
        include: { user: { select: { id: true, name: true, email: true, role: true } } },
        orderBy: { loginAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.prisma.userLoginLog.count({ where: where as any }),
    ]);

    return {
      message: 'Login history fetched',
      data,
      meta: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
    };
  }

  // ── Audit Logs ──────────────────────────────────────────────

  async listAuditLogs(params: {
    page: number;
    pageSize: number;
    userId?: string;
    action?: string;
    entity?: string;
    search?: string;
    from?: string;
    to?: string;
  }) {
    const { page, pageSize, userId, action, entity, search, from, to } = params;
    const where: Record<string, unknown> = {};
    if (userId) where.userId = userId;
    if (action) where.action = action;
    if (entity) where.entity = entity;
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
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.auditLog.findMany({
        where: where as any,
        include: { user: { select: { id: true, name: true, email: true, role: true } } },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.prisma.auditLog.count({ where: where as any }),
    ]);

    return {
      message: 'Audit logs fetched',
      data,
      meta: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
    };
  }

  // ── Activity Logs ───────────────────────────────────────────

  async listActivityLogs(params: {
    page: number;
    pageSize: number;
    userId?: string;
    search?: string;
    from?: string;
    to?: string;
  }) {
    const { page, pageSize, userId, search, from, to } = params;
    const where: Record<string, unknown> = {};
    if (userId) where.userId = userId;
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
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.activityLog.findMany({
        where: where as any,
        include: { user: { select: { id: true, name: true, email: true, role: true } } },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.prisma.activityLog.count({ where: where as any }),
    ]);

    return {
      message: 'Activity logs fetched',
      data,
      meta: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
    };
  }

  // ── Security Events ─────────────────────────────────────────

  async listSecurityEvents(params: {
    page: number;
    pageSize: number;
    userId?: string;
    eventType?: string;
    severity?: string;
    search?: string;
    from?: string;
    to?: string;
  }) {
    const { page, pageSize, userId, eventType, severity, search, from, to } = params;
    const where: Record<string, unknown> = {};
    if (userId) where.userId = userId;
    if (eventType) where.eventType = eventType;
    if (severity) where.severity = severity;
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
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.prisma.securityEvent.count({ where: where as any }),
    ]);

    return {
      message: 'Security events fetched',
      data,
      meta: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
    };
  }

  // ── Dashboard Stats (for super admin) ────────────────────────

  async getDashboardStats() {
    const [activeSessions, failedLogins, criticalEvents, totalAuditLogs] = await Promise.all([
      this.prisma.session.count({ where: { isActive: true } }),
      this.prisma.userLoginLog.count({ where: { success: false, loginAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } } }),
      this.prisma.securityEvent.count({ where: { severity: 'CRITICAL', createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } } }),
      this.prisma.auditLog.count(),
    ]);

    return {
      message: 'Security dashboard stats',
      data: { activeSessions, failedLoginsLast24h: failedLogins, criticalEventsLast7d: criticalEvents, totalAuditLogs },
    };
  }
}
