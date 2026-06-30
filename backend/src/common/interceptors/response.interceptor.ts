import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Response } from 'express';
import { Observable, map } from 'rxjs';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const httpResponse = context.switchToHttp().getResponse<Response>();

    return next.handle().pipe(
      map((result: unknown) => {
        const { message, data, meta } = (result ?? {}) as { message?: string; data?: unknown; meta?: unknown };
        const body: Record<string, unknown> = {
          httpStatusCode: httpResponse.statusCode,
          message: message ?? 'Success',
          data: data ?? null,
          timestamp: new Date().toISOString(),
        };
        if (meta !== undefined) body.meta = meta;
        return body;
      }),
    );
  }
}
