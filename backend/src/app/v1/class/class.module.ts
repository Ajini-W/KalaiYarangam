import { Module } from '@nestjs/common';
import { AttendanceModule } from './attendance/attendance.module';
import { TasksModule } from './tasks/tasks.module';
import { ProgressModule } from './progress/progress.module';

@Module({
  imports: [AttendanceModule, TasksModule, ProgressModule],
})
export class ClassModule {}
