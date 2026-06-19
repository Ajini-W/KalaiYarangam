import { Injectable, ExecutionContext } from '@nestjs/common';
import { ThrottlerGuard, ThrottlerException } from '@nestjs/throttler';

@Injectable()
export class AuthThrottlerGuard extends ThrottlerGuard {
  protected async throwThrottlingException(context: ExecutionContext): Promise<void> {
    throw new ThrottlerException('Too many attempts. Please try again after 1 hour.');
  }

  protected async getTracker(req: Record<string, any>): Promise<string> {
    // Track by IP + email combination for login attempts
    const email = req.body?.email || 'anonymous';
    const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.ip || 'unknown';
    return `${ip}-${email}`;
  }
}
