import { Module } from '@nestjs/common';
import { AttendanceModule } from './attendance/attendance.module';
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [AttendanceModule, TasksModule],
})
export class ClassModule {}
