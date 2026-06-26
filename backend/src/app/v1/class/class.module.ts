import { Module } from '@nestjs/common';
import { AttendanceModule } from './attendance/attendance.module';
import { TasksModule } from './tasks/tasks.module';
import { ProgressModule } from './progress/progress.module';
import { CertificatesModule } from './certificates/certificates.module';
import { CertificateTemplateModule } from './certificate-templates/certificate-template.module';

@Module({
  imports: [AttendanceModule, TasksModule, ProgressModule, CertificatesModule, CertificateTemplateModule],
})
export class ClassModule {}
