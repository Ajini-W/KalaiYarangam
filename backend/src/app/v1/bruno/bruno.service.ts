import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

interface BruEndpoint {
  method: string;
  path: string;
  name: string;
  body?: Record<string, unknown>;
  headers?: Record<string, string>;
  auth?: 'inherit' | 'none';
  vars?: Record<string, string>;
  script?: string;
}

@Injectable()
export class BrunoService {
  private readonly collectionsDir: string;

  constructor() {
    this.collectionsDir = path.resolve(process.cwd(), '..', 'KA-api-doc');
  }

  private ensureDir(dir: string) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  private generateBruFile(endpoint: BruEndpoint): string {
    const lines: string[] = [];

    lines.push(`meta {`);
    lines.push(`  name: ${endpoint.name}`);
    lines.push(`  type: http`);
    lines.push(`  seq: 1`);
    lines.push(`}`);
    lines.push(``);

    lines.push(`${endpoint.method} {`);
    lines.push(`  url: {{base-url}}${endpoint.path}`);
    if (endpoint.body) {
      lines.push(`  body: json`);
    }
    lines.push(`  auth: ${endpoint.auth || 'inherit'}`);
    lines.push(`}`);
    lines.push(``);

    if (endpoint.body) {
      lines.push(`body:json {`);
      lines.push(`  ${JSON.stringify(endpoint.body, null, 2)}`);
      lines.push(`}`);
      lines.push(``);
    }

    if (endpoint.vars) {
      lines.push(`vars:post-response {`);
      for (const [key, val] of Object.entries(endpoint.vars)) {
        lines.push(`  ${key}: ${val}`);
      }
      lines.push(`}`);
      lines.push(``);
    }

    if (endpoint.script) {
      lines.push(`script:post-response {`);
      lines.push(`  ${endpoint.script}`);
      lines.push(`}`);
      lines.push(``);
    }

    lines.push(`settings {`);
    lines.push(`  encodeUrl: true`);
    lines.push(`  timeout: 0`);
    lines.push(`}`);
    lines.push(``);

    return lines.join('\n');
  }

  async syncAuthCollection() {
    const dir = path.join(this.collectionsDir, 'Auth');
    this.ensureDir(dir);

    const endpoints: BruEndpoint[] = [
      { method: 'post', path: '/auth/register', name: 'Register', body: { name: '', email: '', phone: '', password: '' } },
      { method: 'post', path: '/auth/login', name: 'Login', body: { type: 'email', email: '', password: '', rememberMe: true }, vars: { accessToken: 'data.accessToken', refreshToken: 'data.refreshToken' }, script: 'const body = res.getBody();\nbru.setVar("accessToken", body.data.accessToken);\nbru.setVar("refreshToken", body.data.refreshToken);' },
      { method: 'post', path: '/auth/verify-email', name: 'Verify Email', body: { token: '' } },
      { method: 'post', path: '/auth/send-verification-token', name: 'Send Verification Token', body: { email: '' } },
      { method: 'post', path: '/auth/forgot-password', name: 'Forgot Password', body: { email: '' } },
      { method: 'post', path: '/auth/reset-password', name: 'Reset Password', body: { token: '', password: '' } },
      { method: 'post', path: '/auth/change-password', name: 'Change Password', body: { currentPassword: '', newPassword: '' } },
      { method: 'post', path: '/auth/refresh', name: 'Token Refresh', body: { refreshToken: '' } },
      { method: 'post', path: '/auth/logout', name: 'Logout', body: { refreshToken: '' } },
      { method: 'get', path: '/auth/me', name: 'Me', auth: 'inherit' },
      { method: 'get', path: '/auth/google', name: 'Google', auth: 'none' },
      { method: 'post', path: '/auth/user-status', name: 'User Status', body: { accessToken: '', status: '' } },
    ];

    for (const ep of endpoints) {
      const fileName = `${ep.name.replace(/\s+/g, ' ')}.bru`;
      fs.writeFileSync(path.join(dir, fileName), this.generateBruFile(ep));
    }
  }

  async syncOnboardingCollection() {
    const dir = path.join(this.collectionsDir, 'Onboarding');
    this.ensureDir(dir);

    const endpoints: BruEndpoint[] = [
      { method: 'get', path: '/onboarding/progress', name: 'Get Onboarding Progress' },
      { method: 'post', path: '/onboarding/role', name: 'Select Role', body: { role: 'OWNER' } },
      { method: 'post', path: '/onboarding/profile', name: 'Setup Profile', body: { fullName: '', mobileNumber: '', address: '', timeZone: 'Asia/Kolkata', preferredLanguage: 'en' } },
      { method: 'post', path: '/onboarding/tenant', name: 'Setup Tenant', body: { businessName: '', businessType: 'Training Institute' } },
      { method: 'post', path: '/onboarding/branch', name: 'Setup Branch', body: { branchName: '', address: '', contactNumber: '' } },
      { method: 'post', path: '/onboarding/modules', name: 'Select Modules', body: { training: true, rental: false, event: false } },
      { method: 'post', path: '/onboarding/subscription', name: 'Select Subscription', body: { plan: 'trial' } },
      { method: 'post', path: '/onboarding/tenants/search', name: 'Search Tenants', body: { name: '', businessType: '' } },
      { method: 'post', path: '/onboarding/request-access', name: 'Request Access', body: { tenantId: '', notes: '' } },
      { method: 'post', path: '/onboarding/complete-client', name: 'Complete Client Onboarding' },
      { method: 'get', path: '/onboarding/access-requests', name: 'List Access Requests' },
      { method: 'post', path: '/onboarding/access-requests/approve', name: 'Approve Access Request', body: { requestId: '', branchId: '' } },
      { method: 'post', path: '/onboarding/access-requests/reject', name: 'Reject Access Request', body: { requestId: '', reason: '' } },
    ];

    for (const ep of endpoints) {
      const fileName = `${ep.name.replace(/\s+/g, ' ')}.bru`;
      fs.writeFileSync(path.join(dir, fileName), this.generateBruFile(ep));
    }
  }

  async syncTenantCollection() {
    const dir = path.join(this.collectionsDir, 'Tenant');
    this.ensureDir(dir);

    const endpoints: BruEndpoint[] = [
      { method: 'get', path: '/training/tenant', name: 'Get Tenant' },
      { method: 'patch', path: '/training/tenant', name: 'Update Tenant', body: { name: '', phone: '', email: '', website: '', logoUrl: '' } },
      { method: 'post', path: '/training/branches', name: 'Create Branch', body: { name: '', address: '', phone: '', email: '' } },
      { method: 'get', path: '/training/branches', name: 'List Branches' },
      { method: 'get', path: '/training/branches/:id', name: 'Get Branch' },
      { method: 'patch', path: '/training/branches/:id', name: 'Update Branch', body: { name: '', address: '' } },
      { method: 'patch', path: '/training/branches/:id/status', name: 'Update Branch Status', body: { isActive: true } },
      { method: 'get', path: '/training/settings', name: 'Get Tenant Settings' },
      { method: 'post', path: '/training/settings', name: 'Create Tenant Settings', body: { timezone: 'Asia/Kolkata', currency: 'INR' } },
      { method: 'patch', path: '/training/settings', name: 'Update Tenant Settings', body: { timezone: 'Asia/Kolkata' } },
      { method: 'get', path: '/training/branding', name: 'Get Branding' },
      { method: 'patch', path: '/training/branding', name: 'Update Branding', body: { primaryColor: '#3B82F6', secondaryColor: '#10B981', tagline: '' } },
      { method: 'get', path: '/training/modules', name: 'Get Modules' },
      { method: 'patch', path: '/training/modules', name: 'Update Modules', body: { trainingManagement: true, rentalManagement: false, eventManagement: false } },
    ];

    for (const ep of endpoints) {
      const fileName = `${ep.name.replace(/\s+/g, ' ')}.bru`;
      fs.writeFileSync(path.join(dir, fileName), this.generateBruFile(ep));
    }
  }

  async syncSubscriptionCollection() {
    const dir = path.join(this.collectionsDir, 'Subscriptions');
    this.ensureDir(dir);

    const endpoints: BruEndpoint[] = [
      { method: 'get', path: '/subscriptions', name: 'List Subscriptions' },
      { method: 'get', path: '/subscriptions/current', name: 'Current Subscription' },
      { method: 'post', path: '/subscriptions/upgrade', name: 'Upgrade Subscription', body: { planId: '' } },
      { method: 'post', path: '/subscriptions/cancel', name: 'Cancel Subscription' },
    ];

    for (const ep of endpoints) {
      const fileName = `${ep.name.replace(/\s+/g, ' ')}.bru`;
      fs.writeFileSync(path.join(dir, fileName), this.generateBruFile(ep));
    }
  }

  async syncSecurityCollection() {
    const dir = path.join(this.collectionsDir, 'Security');
    this.ensureDir(dir);

    const endpoints: BruEndpoint[] = [
      { method: 'get', path: '/security/stats', name: 'Security - Stats' },
      { method: 'get', path: '/security/sessions', name: 'Security - List Sessions' },
      { method: 'delete', path: '/security/sessions/:id', name: 'Security - Revoke Session' },
      { method: 'delete', path: '/security/sessions/user/:userId', name: 'Security - Revoke All User Sessions' },
      { method: 'get', path: '/security/login-history', name: 'Security - Login History' },
      { method: 'get', path: '/security/audit-logs', name: 'Security - Audit Logs' },
      { method: 'get', path: '/security/activity-logs', name: 'Security - Activity Logs' },
      { method: 'get', path: '/security/security-events', name: 'Security - Security Events' },
    ];

    for (const ep of endpoints) {
      const fileName = `${ep.name.replace(/\s+/g, ' ')}.bru`;
      fs.writeFileSync(path.join(dir, fileName), this.generateBruFile(ep));
    }
  }

  async syncAll() {
    await Promise.all([
      this.syncAuthCollection(),
      this.syncOnboardingCollection(),
      this.syncTenantCollection(),
      this.syncSubscriptionCollection(),
      this.syncSecurityCollection(),
    ]);
  }

  async syncOnEvent(event: string, data: Record<string, unknown>) {
    // Auto-sync relevant collections based on events
    switch (event) {
      case 'user.created':
      case 'user.updated':
        await this.syncAuthCollection();
        break;
      case 'tenant.created':
      case 'tenant.updated':
        await this.syncTenantCollection();
        break;
      case 'subscription.created':
      case 'subscription.updated':
        await this.syncSubscriptionCollection();
        break;
      case 'onboarding.completed':
        await this.syncOnboardingCollection();
        break;
      default:
        break;
    }
  }
}
