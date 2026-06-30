import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { env } from '@/config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  private readonly logger = new Logger(GoogleStrategy.name);

  constructor() {
    super({
      clientID: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${env.API_URL}/${env.API_PREFIX}/auth/google/callback`,
      scope: ['email', 'profile'],
      passReqToCallback: true,
      state: false,
    });
  }

  async validate(
    request: any,
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    try {
      const { id, name, emails, photos } = profile;
      const user = {
        id,
        email: emails?.[0]?.value,
        firstName: name?.givenName,
        lastName: name?.familyName,
        picture: photos?.[0]?.value,
        accessToken,
      };
      this.logger.log(`Google OAuth success for email: ${user.email}`);
      done(null, user);
    } catch (error) {
      this.logger.error(`Google OAuth validate error: ${(error as Error).message}`, (error as Error).stack);
      done(error as Error, undefined);
    }
  }
}
