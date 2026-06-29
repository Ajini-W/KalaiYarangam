const baseStyle = `
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1f2937; margin: 0; padding: 0; background: #f3f4f6; }
  .container { max-width: 600px; margin: 0 auto; padding: 20px; }
  .card { background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
  .header { padding: 28px 24px; text-align: center; }
  .header-success { background: linear-gradient(135deg, #059669, #10b981); }
  .header-warning { background: linear-gradient(135deg, #d97706, #f59e0b); }
  .header-danger { background: linear-gradient(135deg, #dc2626, #ef4444); }
  .header-info { background: linear-gradient(135deg, #2563eb, #3b82f6); }
  .header h1 { margin: 0; font-size: 20px; color: #fff; font-weight: 600; }
  .header p { margin: 4px 0 0; font-size: 13px; color: rgba(255,255,255,0.85); }
  .body { padding: 24px; }
  .body p { margin: 0 0 14px; font-size: 14px; color: #374151; }
  .detail-box { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; margin: 16px 0; }
  .detail-row { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid #f3f4f6; font-size: 13px; }
  .detail-row:last-child { border-bottom: none; }
  .detail-label { color: #6b7280; }
  .detail-value { color: #111827; font-weight: 500; }
  .alert-box { background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 14px; margin: 16px 0; font-size: 13px; color: #991b1b; }
  .alert-box.warning { background: #fffbeb; border-color: #fde68a; color: #92400e; }
  .btn { display: inline-block; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-size: 14px; font-weight: 500; margin: 4px; }
  .btn-primary { background: #4f46e5; color: #fff; }
  .btn-danger { background: #dc2626; color: #fff; }
  .footer { padding: 16px 24px; text-align: center; font-size: 12px; color: #9ca3af; border-top: 1px solid #e5e7eb; }
`;

function buildHtml(headerClass: string, headerTitle: string, headerSubtitle: string, content: string) {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>${baseStyle}</style></head><body>
<div class="container"><div class="card">
  <div class="header ${headerClass}"><h1>${headerTitle}</h1><p>${headerSubtitle}</p></div>
  <div class="body">${content}</div>
  <div class="footer"><p>&copy; ${new Date().getFullYear()} KalaiArangam. All rights reserved.</p><p>This is a security notification. Please do not reply to this email.</p></div>
</div></div></body></html>`;
}

function detailsBlock(items: [string, string][]) {
  return `<div class="detail-box">${items.map(([k, v]) =>
    `<div class="detail-row"><span class="detail-label">${k}</span><span class="detail-value">${v || 'N/A'}</span></div>`
  ).join('')}</div>`;
}

export const newDeviceLoginTemplate = (vars: Record<string, unknown>) => ({
  subject: `New device login detected — ${vars.browser || 'Unknown'} on ${vars.os || 'Unknown'}`,
  html: buildHtml('header-info', 'New Device Login', 'A new device signed into your account',
    `<p>Hi ${vars.name || 'there'},</p>
     <p>We detected a new login to your account from a device we haven't seen before.</p>
     ${detailsBlock([
       ['Browser', `${vars.browser || 'Unknown'} ${vars.browserVersion || ''}`],
       ['Operating System', `${vars.os || 'Unknown'} ${vars.osVersion || ''}`],
       ['Device', `${vars.deviceName || 'Unknown'}`],
       ['IP Address', `${vars.ipAddress || 'Unknown'}`],
       ['Location', `${vars.location || 'Unknown'}`],
       ['Time (UTC)', `${vars.timestamp || new Date().toISOString()}`],
     ])}
     <p>If this was you, no action is needed. If you don't recognize this login, please secure your account immediately.</p>
     <p style="text-align:center">
       <a href="${vars.securityUrl || '#'}" class="btn btn-primary">Review Activity</a>
       <a href="${vars.revokeUrl || '#'}" class="btn btn-danger">Revoke Session</a>
     </p>`,
  ),
});

export const failedLoginTemplate = (vars: Record<string, unknown>) => ({
  subject: `Failed login attempt on your account`,
  html: buildHtml('header-warning', 'Failed Login Attempt', 'Someone tried to sign in to your account',
    `<p>Hi ${vars.name || 'there'},</p>
     <p>We detected a failed login attempt on your account. Multiple failed attempts may result in your account being temporarily locked.</p>
     ${detailsBlock([
       ['IP Address', `${vars.ipAddress || 'Unknown'}`],
       ['Browser', `${vars.browser || 'Unknown'}`],
       ['Location', `${vars.location || 'Unknown'}`],
       ['Time (UTC)', `${vars.timestamp || new Date().toISOString()}`],
       ['Attempts', `${vars.attempts || '1'}`],
     ])}
     <p>If you didn't attempt to log in, we recommend changing your password and enabling two-factor authentication.</p>
     <p style="text-align:center">
       <a href="${vars.changePasswordUrl || '#'}" class="btn btn-primary">Change Password</a>
     </p>`,
  ),
});

export const passwordChangedTemplate = (vars: Record<string, unknown>) => ({
  subject: `Your password has been changed`,
  html: buildHtml('header-success', 'Password Changed', 'Your account password was updated',
    `<p>Hi ${vars.name || 'there'},</p>
     <p>Your password was successfully changed.</p>
     ${detailsBlock([
       ['Changed At (UTC)', `${vars.timestamp || new Date().toISOString()}`],
       ['IP Address', `${vars.ipAddress || 'Unknown'}`],
       ['Browser', `${vars.browser || 'Unknown'}`],
     ])}
     <p>If you made this change, no further action is needed. If you didn't change your password, please secure your account immediately and contact support.</p>
     <p style="text-align:center">
       <a href="${vars.securityUrl || '#'}" class="btn btn-primary">Review Activity</a>
     </p>`,
  ),
});

export const mfaEnabledTemplate = (vars: Record<string, unknown>) => ({
  subject: `Two-factor authentication has been enabled`,
  html: buildHtml('header-success', 'MFA Enabled', 'Two-factor authentication is now active',
    `<p>Hi ${vars.name || 'there'},</p>
     <p>Two-factor authentication (2FA) has been enabled on your account. Your account is now more secure.</p>
     ${detailsBlock([
       ['Enabled At (UTC)', `${vars.timestamp || new Date().toISOString()}`],
       ['Method', `${vars.method || 'Authenticator App'}`],
     ])}
     <p>Keep your recovery codes in a safe place. You'll need them if you lose access to your authentication device.</p>`,
  ),
});

export const mfaDisabledTemplate = (vars: Record<string, unknown>) => ({
  subject: `Two-factor authentication has been disabled`,
  html: buildHtml('header-warning', 'MFA Disabled', 'Two-factor authentication was turned off',
    `<p>Hi ${vars.name || 'there'},</p>
     <p>Two-factor authentication (2FA) has been disabled on your account.</p>
     ${detailsBlock([
       ['Disabled At (UTC)', `${vars.timestamp || new Date().toISOString()}`],
       ['IP Address', `${vars.ipAddress || 'Unknown'}`],
     ])}
     <p>If you didn't make this change, please secure your account immediately.</p>
     <p style="text-align:center">
       <a href="${vars.securityUrl || '#'}" class="btn btn-danger">Secure Account</a>
     </p>`,
  ),
});

export const sessionRevokedTemplate = (vars: Record<string, unknown>) => ({
  subject: `A session on your account has been revoked`,
  html: buildHtml('header-info', 'Session Revoked', 'A device was signed out from your account',
    `<p>Hi ${vars.name || 'there'},</p>
     <p>A session on your account has been revoked.</p>
     ${detailsBlock([
       ['Device', `${vars.deviceName || 'Unknown'}`],
       ['Browser', `${vars.browser || 'Unknown'}`],
       ['IP Address', `${vars.ipAddress || 'Unknown'}`],
       ['Revoked At (UTC)', `${vars.timestamp || new Date().toISOString()}`],
     ])}
     <p>If you didn't revoke this session, please review your account security.</p>`,
  ),
});

export const suspiciousLoginTemplate = (vars: Record<string, unknown>) => ({
  subject: `Suspicious login detected on your account`,
  html: buildHtml('header-danger', 'Suspicious Login Detected', 'Unusual activity on your account',
    `<p>Hi ${vars.name || 'there'},</p>
     <p>We detected unusual login activity on your account that may indicate unauthorized access.</p>
     ${detailsBlock([
       ['Reason', `${vars.reason || 'Unusual location or device'}`],
       ['IP Address', `${vars.ipAddress || 'Unknown'}`],
       ['Browser', `${vars.browser || 'Unknown'}`],
       ['Location', `${vars.location || 'Unknown'}`],
       ['Time (UTC)', `${vars.timestamp || new Date().toISOString()}`],
     ])}
     <div class="alert-box"><strong>Security Alert:</strong> If this wasn't you, immediately change your password and revoke all sessions.</div>
     <p style="text-align:center">
       <a href="${vars.changePasswordUrl || '#'}" class="btn btn-danger">Change Password</a>
       <a href="${vars.revokeAllUrl || '#'}" class="btn btn-primary">Revoke All Sessions</a>
     </p>`,
  ),
});

export const accountLockedTemplate = (vars: Record<string, unknown>) => ({
  subject: `Your account has been temporarily locked`,
  html: buildHtml('header-danger', 'Account Locked', 'Too many failed login attempts',
    `<p>Hi ${vars.name || 'there'},</p>
     <p>Your account has been temporarily locked due to too many failed login attempts.</p>
     ${detailsBlock([
       ['Locked At (UTC)', `${vars.timestamp || new Date().toISOString()}`],
       ['Reason', `${vars.reason || 'Exceeded maximum login attempts'}`],
       ['Unlock At (UTC)', `${vars.unlockTime || '30 minutes from now'}`],
     ])}
     <p>If you didn't make these attempts, please contact support immediately.</p>`,
  ),
});

export const apiKeyCreatedTemplate = (vars: Record<string, unknown>) => ({
  subject: `New API key created on your account`,
  html: buildHtml('header-info', 'API Key Created', 'A new API key was generated',
    `<p>Hi ${vars.name || 'there'},</p>
     <p>A new API key was created on your account.</p>
     ${detailsBlock([
       ['Key Name', `${vars.keyName || 'Unnamed'}`],
       ['Created At (UTC)', `${vars.timestamp || new Date().toISOString()}`],
       ['IP Address', `${vars.ipAddress || 'Unknown'}`],
     ])}
     <p>Keep your API key secure. If you didn't create this key, please revoke it immediately.</p>`,
  ),
});

export const adminRoleGrantedTemplate = (vars: Record<string, unknown>) => ({
  subject: `You have been granted admin privileges`,
  html: buildHtml('header-success', 'Admin Access Granted', 'Your role has been elevated',
    `<p>Hi ${vars.name || 'there'},</p>
     <p>You have been granted administrator privileges on <strong>${vars.organization || 'the platform'}</strong>.</p>
     ${detailsBlock([
       ['New Role', `${vars.newRole || 'Admin'}`],
       ['Granted By', `${vars.grantedBy || 'System'}`],
       ['Time (UTC)', `${vars.timestamp || new Date().toISOString()}`],
     ])}
     <p>If you didn't expect this change, please contact support.</p>`,
  ),
});
