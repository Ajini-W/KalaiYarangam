import { Module } from '@nestjs/common';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppFeaturesModule } from '@/app/app.module';
import { PrismaModule } from '@/database';
import { HttpExceptionFilter } from '@/common/filters';
import { JwtAuthGuard } from '@/common/guards';
import { ResponseInterceptor } from '@/common/interceptors';
import { EnrollmentModule } from './enrollment/enrollment.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([{
      ttl: 3600000,
      limit: 5,
    }]),
    EnrollmentModule,
    PrismaModule,
    AppFeaturesModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
    { provide: APP_INTERCEPTOR, useClass: ResponseInterceptor },
  ],
})
export class AppModule {}
