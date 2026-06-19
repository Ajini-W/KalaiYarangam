export interface TemplateVariables {
  name?: string;
  email?: string;
  [key: string]: unknown;
}

export const welcomeTemplate = (vars: TemplateVariables) => ({
  subject: `Welcome to KalaiArangam, ${vars.name || 'User'}!`,
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
      <h1>Welcome to KalaiArangam!</h1>
    </div>
    <div class="body">
      <p>Hi ${vars.name || 'there'},</p>
      <p>Thank you for joining KalaiArangam! We're excited to have you on board.</p>
      <p>Your account has been created successfully with the email <strong>${vars.email || ''}</strong>.</p>
      <p>You can now log in and start exploring all the features we have to offer.</p>
      <p style="text-align: center;">
        <a href="${vars.appUrl || '#'}" class="btn">Get Started</a>
      </p>
      <p>If you have any questions, feel free to reach out to our support team.</p>
      <p>Best regards,<br>The KalaiArangam Team</p>
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} KalaiArangam. All rights reserved.</p>
    </div>
  </div>
</body>
</html>`,
});
