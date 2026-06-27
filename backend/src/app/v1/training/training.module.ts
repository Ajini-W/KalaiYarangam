import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { env } from '@/config';
import { TrainingController } from './training.controller';
import { TrainingService } from './training.service';
import { TrainersModule } from './trainers/trainers.module';
import { BatchesModule } from './batches/batches.module';

@Module({
  imports: [
    JwtModule.register({
      secret: env.JWT_SECRET,
      signOptions: { expiresIn: env.JWT_EXPIRES_IN as any },
    }),
    TrainersModule,
    BatchesModule,
  ],
  controllers: [TrainingController],
  providers: [TrainingService],
})
export class TrainingModule {}
