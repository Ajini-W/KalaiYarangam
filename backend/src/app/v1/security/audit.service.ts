import { Injectable } from '@nestjs/common';
import { AuditAction } from '@prisma/client';
import { PrismaService } from '@/database';
import { parseUserAgent } from '@/common/utils/ua-parser.util';
import { randomBytes } from 'crypto';

@Injectable()
export class AuditService {
  constructor(private readonly prisma: PrismaService) {}

  generateCorrelationId(): string {
    return randomBytes(16).toString('hex');
  }

  async log(params: {
    userId?: string;
    tenantId?: string;
    action: AuditAction;
    entity: string;
    entityId?: string;
    oldValues?: Record<string, unknown>;
    newValues?: Record<string, unknown>;
    ipAddress?: string;
    userAgent?: string;
    correlationId?: string;
    requestId?: string;
    metadata?: Record<string, unknown>;
    description?: string;
  }) {
    const ua = params.userAgent ? parseUserAgent(params.userAgent) : null;
await this.prisma.auditLog.create({
  data: {
    userId: params.userId,
    tenantId: params.tenantId,
    action: params.action,
    entity: params.entity,
    entityId: params.entityId,
    oldValues: params.oldValues as any,
    newValues: params.newValues as any,
    ipAddress: params.ipAddress,
    userAgent: params.userAgent,
    browser: ua?.browser,
    os: ua?.os,
    location: null,
    correlationId: params.correlationId,
    requestId: params.requestId,
    metadata: params.metadata as any,
    description: params.description,
  },
});
  }

  async recordActivity(params: {
    userId?: string;
    tenantId?: string;
    activity: string;
    action?: string;
    resource?: string;
    resourceId?: string;
    details?: Record<string, unknown>;
    previousValues?: Record<string, unknown>;
    newValues?: Record<string, unknown>;
    ipAddress?: string;
    userAgent?: string;
    requestSource?: string;
    executionStatus?: string;
    correlationId?: string;
    projectId?: string;
    workspaceId?: string;
  }) {
    const ua = params.userAgent ? parseUserAgent(params.userAgent) : null;
    await this.prisma.activityLog.create({
      data: {
        userId: params.userId,
        tenantId: params.tenantId,
        activity: params.activity,
        action: params.action,
        resource: params.resource,
        resourceId: params.resourceId,
        details: params.details as any,
        previousValues: params.previousValues as any,
        newValues: params.newValues as any,
        ipAddress: params.ipAddress,
        userAgent: params.userAgent,
        requestSource: params.requestSource,
        executionStatus: params.executionStatus ?? 'SUCCESS',
        correlationId: params.correlationId,
        projectId: params.projectId,
        workspaceId: params.workspaceId,
      },
    });
  }

  async recordSecurityEvent(params: {
    userId?: string;
    tenantId?: string;
    eventType: string;
    category?: string;
    severity: 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL';
    message: string;
    description?: string;
    ipAddress?: string;
    userAgent?: string;
    location?: string;
    city?: string;
    country?: string;
    countryCode?: string;
    correlationId?: string;
    metadata?: Record<string, unknown>;
  }) {
    const ua = params.userAgent ? parseUserAgent(params.userAgent) : null;
    await this.prisma.securityEvent.create({
      data: {
        userId: params.userId,
        tenantId: params.tenantId,
        eventType: params.eventType,
        category: params.category,
        severity: params.severity,
        message: params.message,
        description: params.description,
        ipAddress: params.ipAddress,
        userAgent: params.userAgent,
        browser: ua?.browser,
        os: ua?.os,
        
        location: params.location,
        city: params.city,
        country: params.country,
        countryCode: params.countryCode,
        correlationId: params.correlationId,
        metadata: params.metadata as any,
      },
    });
  }

  async recordLoginAttempt(params: {
    userId: string;
    ipAddress?: string;
    userAgent?: string;
    success: boolean;
    
    deviceFingerprint?: string;
    location?: string;
    city?: string;
    country?: string;
    countryCode?: string;
    latitude?: number;
    longitude?: number;
    isSuspicious?: boolean;
    suspiciousReason?: string;
    metadata?: Record<string, unknown>;
    accessToken?: string;
    refreshToken?: string;
  }) {
    const ua = params.userAgent ? parseUserAgent(params.userAgent) : null;
    return this.prisma.userLoginLog.create({
      data: {
        userId: params.userId,
        ipAddress: params.ipAddress,
        userAgent: params.userAgent,
        accessToken: params.accessToken,
        refreshToken: params.refreshToken,
        success: params.success,
       
        browser: ua?.browser,
        browserVersion: ua?.browserVersion,
        os: ua?.os,
        osVersion: ua?.osVersion,
        
        deviceName: ua?.deviceName,
        deviceFingerprint: params.deviceFingerprint,
        location: params.location,
        city: params.city,
        country: params.country,
        countryCode: params.countryCode,
        latitude: params.latitude,
        longitude: params.longitude,
        isSuspicious: params.isSuspicious ?? false,
        suspiciousReason: params.suspiciousReason,
        metadata: params.metadata as any,
      },
    });
  }

  async recordSession(params: {
    userId: string;
    token: string;
    refreshToken?: string;
    ipAddress?: string;
    userAgent?: string;
   
    expiresAt: Date;
  }) {
    const ua = params.userAgent ? parseUserAgent(params.userAgent) : null;
    return this.prisma.session.create({
      data: {
        userId: params.userId,
        token: params.token,
        refreshToken: params.refreshToken,
        ipAddress: params.ipAddress,
        userAgent: params.userAgent,
        deviceInfo: ua ? `${ua.deviceName} · ${ua.browser} ${ua.browserVersion} · ${ua.os}` : null,
        browser: ua?.browser,
        browserVersion: ua?.browserVersion,
        os: ua?.os,
        osVersion: ua?.osVersion,
        
        
        expiresAt: params.expiresAt,
      },
    });
  }

  async updateSessionActivity(sessionId: string) {
    return this.prisma.session.update({
      where: { id: sessionId },
      data: { lastActivity: new Date() },
    });
  }

  async detectSuspiciousLogin(params: {
    userId: string;
    ipAddress?: string;
    userAgent?: string;
    deviceFingerprint?: string;
  }): Promise<{ isSuspicious: boolean; reasons: string[] }> {
    const reasons: string[] = [];
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000);

    const recentLogins = await this.prisma.userLoginLog.findMany({
      where: {
        userId: params.userId,
        loginAt: { gte: oneHourAgo },
        success: true,
      },
      orderBy: { loginAt: 'desc' },
      take: 20,
    });

    if (recentLogins.length >= 5) {
      reasons.push('Multiple successful logins within 1 hour');
    }

    if (params.ipAddress) {
      const sameIpLogins = recentLogins.filter((l) => l.ipAddress === params.ipAddress);
      const differentIpLogins = recentLogins.filter((l) => l.ipAddress !== params.ipAddress);
      if (differentIpLogins.length > 0 && sameIpLogins.length === 0) {
        const lastDiffIp = differentIpLogins[0];
        if (lastDiffIp.loginAt > fiveMinAgo) {
          reasons.push('Login from new IP address within 5 minutes of different location');
        }
      }
    }

    if (params.userAgent) {
      const ua = parseUserAgent(params.userAgent);
      const differentBrowserLogins = recentLogins.filter((l) => {
        if (!l.userAgent) return false;
        const prev = parseUserAgent(l.userAgent);
        return prev.browser !== ua.browser || prev.os !== ua.os;
      });
      if (differentBrowserLogins.length > 0) {
        reasons.push('Login from different browser/OS combination');
      }
    }

    return { isSuspicious: reasons.length > 0, reasons };
  }
}
