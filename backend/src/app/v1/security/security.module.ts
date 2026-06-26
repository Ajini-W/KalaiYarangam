import { Module, Global } from '@nestjs/common';
import { PrismaService } from '@/database';
import { SecurityController } from './security.controller';
import { SecurityService } from './security.service';
import { AuditService } from './audit.service';

@Global()
@Module({
  controllers: [SecurityController],
  providers: [SecurityService, AuditService],
  exports: [AuditService, SecurityService],
})
export class SecurityModule {}
