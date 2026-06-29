import { Module } from '@nestjs/common';
import { FeePlanController } from './fee-plan.controller';
import { FeePlanService } from './fee-plan.service';
import { PrismaModule } from 'src/database/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [FeePlanController],
  providers: [FeePlanService],
})
export class FeePlanModule {}