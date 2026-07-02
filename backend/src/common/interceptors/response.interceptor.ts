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
        const obj = (result ?? {}) as Record<string, unknown>;
        if (obj !== null && typeof obj === 'object' && 'data' in obj) {
          const { message, data, meta } = obj;
          const body: Record<string, unknown> = {
            httpStatusCode: httpResponse.statusCode,
            message: (message as string) ?? 'Success',
            data: data ?? null,
            timestamp: new Date().toISOString(),
          };
          if (meta !== undefined) body.meta = meta;
          return body;
        }
        return {
          httpStatusCode: httpResponse.statusCode,
          message: 'Success',
          data: obj,
          timestamp: new Date().toISOString(),
        };
      }),
    );
  }
}
