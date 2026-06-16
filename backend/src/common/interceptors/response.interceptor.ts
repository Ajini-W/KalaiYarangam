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
    const response = context.switchToHttp().getResponse<Response>();

    return next.handle().pipe(
      map(({ message, data } = {}) => ({
        httpStatusCode: response.statusCode,
        message: message ?? 'Success',
        data: data ?? null,
        timestamp: new Date().toISOString(),
      })),
    );
  }
}
