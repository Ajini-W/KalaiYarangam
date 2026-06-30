import { Controller, Get, Post, Body, Param, Query, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { Roles } from '@/common/decorators';
import { RolesGuard } from '@/common/guards';
import { CurrentUser } from '@/common/decorators';
import { AuthenticatedUser } from '@/common/interfaces';
import { BulkService } from './bulk.service';
import {
  BulkStudentImportDto,
  BulkStudentExportDto,
  BulkAttendanceDto,
  BulkTaskDto,
  BulkCertificateDto,
  QueryBulkJobDto,
} from './dto/bulk.dto';

@ApiTags('bulk')
@ApiBearerAuth()
@Controller('bulk')
export class BulkController {
  constructor(private readonly bulkService: BulkService) {}

  @Post('students/import')
  @Roles(UserRole.SUPER_ADMIN, UserRole.OWNER, UserRole.BRANCH_MANAGER)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Bulk import students with optional batch enrollment' })
  importStudents(@CurrentUser() user: AuthenticatedUser, @Body() dto: BulkStudentImportDto) {
    return this.bulkService.importStudents(user, dto);
  }

  @Post('students/export')
  @Roles(UserRole.SUPER_ADMIN, UserRole.OWNER, UserRole.BRANCH_MANAGER)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Bulk export students with filters' })
  exportStudents(@CurrentUser() user: AuthenticatedUser, @Body() dto: BulkStudentExportDto) {
    return this.bulkService.exportStudents(user, dto);
  }

  @Post('attendance')
  @Roles(UserRole.SUPER_ADMIN, UserRole.OWNER, UserRole.BRANCH_MANAGER, UserRole.TRAINER)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Bulk mark attendance for a session' })
  markAttendance(@CurrentUser() user: AuthenticatedUser, @Body() dto: BulkAttendanceDto) {
    return this.bulkService.markAttendance(user, dto);
  }

  @Post('tasks')
  @Roles(UserRole.SUPER_ADMIN, UserRole.OWNER, UserRole.BRANCH_MANAGER, UserRole.TRAINER)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Bulk create tasks for a batch' })
  createTasks(@CurrentUser() user: AuthenticatedUser, @Body() dto: BulkTaskDto) {
    return this.bulkService.createTasks(user, dto);
  }

  @Post('certificates')
  @Roles(UserRole.SUPER_ADMIN, UserRole.OWNER, UserRole.BRANCH_MANAGER)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Bulk generate certificates for a batch' })
  generateCertificates(@CurrentUser() user: AuthenticatedUser, @Body() dto: BulkCertificateDto) {
    return this.bulkService.generateCertificates(user, dto);
  }

  @Get('jobs')
  @Roles(UserRole.SUPER_ADMIN, UserRole.OWNER, UserRole.BRANCH_MANAGER)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'List all bulk jobs' })
  listJobs(@CurrentUser() user: AuthenticatedUser, @Query() query: QueryBulkJobDto) {
    return this.bulkService.listJobs(user, query);
  }

  @Get('jobs/:jobId')
  @Roles(UserRole.SUPER_ADMIN, UserRole.OWNER, UserRole.BRANCH_MANAGER)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Get bulk job status and result' })
  getJob(@CurrentUser() user: AuthenticatedUser, @Param('jobId', ParseUUIDPipe) jobId: string) {
    return this.bulkService.getJob(user, jobId);
  }
}
