import { Module } from '@nestjs/common';
import { BrunoService } from './bruno.service';
import { BrunoController } from './bruno.controller';

@Module({
  controllers: [BrunoController],
  providers: [BrunoService],
  exports: [BrunoService],
})
export class BrunoModule {}
