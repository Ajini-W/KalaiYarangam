export const resetPasswordTemplate = (vars: Record<string, unknown>) => ({
  subject: `Reset your password - KalaiArangam`,
  html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #4f46e5; color: #fff; padding: 24px; text-align: center; border-radius: 8px 8px 0 0; }
    .header h1 { margin: 0; font-size: 24px; }
    .body { padding: 24px; background: #f9fafb; }
    .body p { margin: 0 0 16px; }
    .footer { padding: 16px 24px; text-align: center; font-size: 12px; color: #6b7280; }
    .btn { display: inline-block; padding: 12px 24px; background: #4f46e5; color: #fff; text-decoration: none; border-radius: 6px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Reset Your Password</h1>
    </div>
    <div class="body">
      <p>Hi ${vars.name || 'there'},</p>
      <p>We received a request to reset your password. Click the button below to create a new password:</p>
      <p style="text-align: center;">
        <a href="${vars.resetLink || '#'}" class="btn">Reset Password</a>
      </p>
      <p>Or copy and paste this link in your browser:</p>
      <p style="word-break: break-all; font-size: 13px; color: #4f46e5;">${vars.resetLink || ''}</p>
      <p>This link will expire in 1 hour.</p>
      <p>If you did not request a password reset, you can safely ignore this email.</p>
      <p>Best regards,<br>The KalaiArangam Team</p>
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} KalaiArangam. All rights reserved.</p>
    </div>
  </div>
</body>
</html>`,
});
