import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { LeadsModule } from './leads/leads.module';
import { EventsModule } from './events/events.module';
import { TrainingModule } from './training/training.module';
import { RentalModule } from './rental/rental.module';

@Module({
  imports: [AuthModule, LeadsModule, EventsModule, TrainingModule, RentalModule],
})
export class V1Module {}
