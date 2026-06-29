import { BadGatewayException, Injectable, NotFoundException } from '@nestjs/common';
import { env } from '@/config';
import { SendMailDto } from './dto/mail.dto';
import {
  welcomeTemplate,
  verifyEmailTemplate,
  resetPasswordTemplate,
  newDeviceLoginTemplate,
  failedLoginTemplate,
  passwordChangedTemplate,
  mfaEnabledTemplate,
  mfaDisabledTemplate,
  sessionRevokedTemplate,
  suspiciousLoginTemplate,
  accountLockedTemplate,
  apiKeyCreatedTemplate,
  adminRoleGrantedTemplate,
} from './templates';

const templates: Record<string, (vars: Record<string, unknown>) => { subject: string; html: string }> = {
  welcome: welcomeTemplate,
  'verify-email': verifyEmailTemplate,
  'reset-password': resetPasswordTemplate,
  'new-device-login': newDeviceLoginTemplate,
  'failed-login': failedLoginTemplate,
  'password-changed': passwordChangedTemplate,
  'mfa-enabled': mfaEnabledTemplate,
  'mfa-disabled': mfaDisabledTemplate,
  'session-revoked': sessionRevokedTemplate,
  'suspicious-login': suspiciousLoginTemplate,
  'account-locked': accountLockedTemplate,
  'api-key-created': apiKeyCreatedTemplate,
  'admin-role-granted': adminRoleGrantedTemplate,
};

@Injectable()
export class MailService {
  private readonly apiUrl = 'https://api.brevo.com/v3/smtp/email';

  async send(dto: SendMailDto) {
    const compile = templates[dto.template];
    if (!compile) {
      throw new NotFoundException(`Template "${dto.template}" not found`);
    }

    const { subject, html } = compile((dto.variables as Record<string, unknown>) || {});

    const response = await fetch(this.apiUrl, {
      method: 'POST',
      headers: {
        'api-key': env.BREVO_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sender: { name: env.BREVO_FROM_NAME, email: env.BREVO_FROM_EMAIL },
        to: [{ email: dto.to }],
        subject,
        htmlContent: html,
      }),
    });

    const result = (await response.json()) as any;

    if (!response.ok) {
      throw new BadGatewayException(
        `Brevo API error: ${result.message || 'Failed to send email'}`,
      );
    }

    return {
      message: `Mail sent to ${dto.to}`,
      data: { messageId: result.messageId },
    };
  }
}
