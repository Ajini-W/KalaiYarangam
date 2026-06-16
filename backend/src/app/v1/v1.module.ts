import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { TrainingModule } from './training/training.module';

@Module({
  imports: [AuthModule, TrainingModule],
})
export class V1Module {}
