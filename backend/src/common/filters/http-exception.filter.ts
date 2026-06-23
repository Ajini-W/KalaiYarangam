import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const httpStatusCode =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let message = 'Internal server error';
    if (exception instanceof HttpException) {
      const exceptionResponse = exception.getResponse();
      message =
        typeof exceptionResponse === 'string'
          ? exceptionResponse
          : typeof exceptionResponse === 'object' &&
              exceptionResponse !== null &&
              'message' in exceptionResponse
            ? Array.isArray((exceptionResponse as { message: unknown }).message)
              ? ((exceptionResponse as { message: string[] }).message[0] ?? 'An error occurred')
              : ((exceptionResponse as { message: string }).message ?? 'An error occurred')
            : 'An error occurred';
    } else {
      console.error('Unhandled exception:', exception);
    }

    response.status(httpStatusCode).json({
      httpStatusCode,
      message,
      data: null,
      timestamp: new Date().toISOString(),
    });
  }
}
