import { Injectable } from '@nestjs/common';
import { AuditAction } from '@prisma/client';
import { PrismaService } from '@/database';

@Injectable()
export class AuditService {
  constructor(private readonly prisma: PrismaService) {}

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
  }) {
    await this.prisma.auditLog.create({ data: params as any });
  }

  async recordActivity(params: {
    userId?: string;
    tenantId?: string;
    activity: string;
    details?: Record<string, unknown>;
    ipAddress?: string;
  }) {
    await this.prisma.activityLog.create({ data: params as any });
  }

  async recordSecurityEvent(params: {
    userId?: string;
    tenantId?: string;
    eventType: string;
    severity: 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL';
    message: string;
    ipAddress?: string;
    userAgent?: string;
    metadata?: Record<string, unknown>;
  }) {
    await this.prisma.securityEvent.create({ data: params as any });
  }
}
