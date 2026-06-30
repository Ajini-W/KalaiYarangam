import { Injectable, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

export const OAUTH_ERROR_KEY = '_oauthError';

@Injectable()
export class GoogleOAuthGuard extends AuthGuard('google') {
  private readonly logger = new Logger(GoogleOAuthGuard.name);

  handleRequest(err: any, user: any, _info: any): any {
    if (err || !user) {
      const msg = err?.message || 'Google authentication failed';
      this.logger.error(`Google OAuth error: ${msg}`);
      return { [OAUTH_ERROR_KEY]: msg };
    }
    return user;
  }
}