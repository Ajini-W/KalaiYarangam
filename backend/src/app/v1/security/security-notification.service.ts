import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@/database';
import { MailService } from '@/app/v1/mail/mail.service';
import { env } from '@/config';

export interface SecurityNotificationParams {
  userId: string;
  tenantId?: string;
  eventType: string;
  category?: string;
  severity: 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL';
  title: string;
  message: string;
  emailTemplate?: string;
  emailVariables?: Record<string, unknown>;
  pushTitle?: string;
  pushBody?: string;
  link?: string;
  mandatory?: boolean;
  metadata?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
}

const MANDATORY_EVENT_TYPES = new Set([
  'suspicious_login',
  'account_locked',
  'admin_role_changed',
  'critical_security_event',
]);

@Injectable()
export class SecurityNotificationService {
  private readonly logger = new Logger(SecurityNotificationService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
  ) {}

  async sendSecurityNotification(params: SecurityNotificationParams): Promise<void> {
    const isMandatory = params.mandatory || MANDATORY_EVENT_TYPES.has(params.eventType);

    const [user, preferences] = await Promise.all([
      this.prisma.user.findUnique({
        where: { id: params.userId },
        select: { id: true, name: true, email: true, tenantId: true },
      }),
      this.prisma.notificationPreference.findMany({
        where: { userId: params.userId },
      }),
    ]);

    if (!user) return;

    const prefMap = new Map(preferences.map((p) => [`${p.channel}:${p.eventType}`, p.enabled]));

    const shouldSend = (channel: string) => {
      if (isMandatory) return true;
      const key = `${channel}:${params.eventType}`;
      if (prefMap.has(key)) return prefMap.get(key)!;
      return true;
    };

    // 1. In-App Notification
    if (shouldSend('IN_APP')) {
      try {
        await this.prisma.notification.create({
          data: {
            userId: params.userId,
            tenantId: params.tenantId || user.tenantId || undefined,
            title: params.title,
            body: params.message,
            link: params.link,
            channel: 'IN_APP',
          },
        });
      } catch (error) {
        this.logger.warn(`In-app notification failed for user ${params.userId}: ${(error as Error).message}`);
      }
    }

    // 2. Email Notification
    if (shouldSend('EMAIL') && params.emailTemplate && user.email) {
      try {
        const baseUrl = env.APP_URL || 'https://kalaiarangam.com';
        const variables = {
          name: user.name,
          email: user.email,
          timestamp: new Date().toISOString(),
          ipAddress: params.ipAddress || 'Unknown',
          browser: params.userAgent || 'Unknown',
          securityUrl: `${baseUrl}/super-admin/security-events`,
          changePasswordUrl: `${baseUrl}/dashboard/change-password`,
          revokeUrl: params.link || `${baseUrl}/super-admin/sessions`,
          revokeAllUrl: `${baseUrl}/super-admin/sessions`,
          ...params.emailVariables,
        };

        await this.mailService.send({
          to: user.email,
          template: params.emailTemplate,
          variables,
        });
      } catch (error) {
        this.logger.warn(`Email notification failed for user ${params.userId}: ${(error as Error).message}`);
      }
    }

    // 3. Push Notification
    if (shouldSend('PUSH')) {
      try {
        const devices = await this.prisma.userDevice.findMany({
          where: { userId: params.userId },
        });

        if (devices.length > 0) {
          const { initializeApp, getApps, cert } = await import('firebase-admin/app');
          const { getMessaging } = await import('firebase-admin/messaging');

          if (getApps().length === 0 && env.FIREBASE_SERVICE_ACCOUNT_JSON) {
            try {
              const serviceAccount = JSON.parse(env.FIREBASE_SERVICE_ACCOUNT_JSON);
              initializeApp({ credential: cert(serviceAccount) });
            } catch {
              // Firebase already initialized or not configured
            }
          }

          for (const device of devices) {
            try {
              await getMessaging().send({
                token: device.token,
                notification: {
                  title: params.pushTitle || params.title,
                  body: params.pushBody || params.message,
                },
                ...(params.link && { data: { link: params.link } }),
              });
            } catch (pushError) {
              // Remove invalid tokens
              if ((pushError as any)?.code === 'messaging/registration-token-not-registered') {
                await this.prisma.userDevice.delete({ where: { id: device.id } }).catch(() => {});
              }
            }
          }
        }
      } catch (error) {
        this.logger.warn(`Push notification failed for user ${params.userId}: ${(error as Error).message}`);
      }
    }

    // 4. Log the notification delivery
    try {
      await this.prisma.notificationLog.create({
        data: {
          channel: 'EMAIL',
          recipient: user.email || params.userId,
          subject: params.title,
          body: params.message,
          status: 'SENT',
          eventType: params.eventType,
          metadata: params.metadata as any,
        },
      });
    } catch {
      // Non-critical, don't fail
    }
  }

  async sendBulkSecurityNotifications(
    userIds: string[],
    params: Omit<SecurityNotificationParams, 'userId'>,
  ): Promise<void> {
    await Promise.allSettled(
      userIds.map((userId) =>
        this.sendSecurityNotification({ ...params, userId }),
      ),
    );
  }
}
