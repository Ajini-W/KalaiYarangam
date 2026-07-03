import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { Roles } from '@/common/decorators';
import { RolesGuard } from '@/common/guards';
import { CurrentUser } from '@/common/decorators';
import { AuthenticatedUser } from '@/common/interfaces';
import { ReportsService } from './reports.service';
import { ReportQueryDto } from './dto/reports.dto';

@ApiTags('reports')
@ApiBearerAuth()
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('revenue/export')
  @Roles(UserRole.SUPER_ADMIN, UserRole.OWNER, UserRole.BRANCH_MANAGER)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Export revenue data' })
  revenueExport(@CurrentUser() user: AuthenticatedUser, @Query() query: ReportQueryDto) {
    return this.reportsService.revenueExport(user, query);
  }

  @Get('attendance/export')
  @Roles(UserRole.SUPER_ADMIN, UserRole.OWNER, UserRole.BRANCH_MANAGER, UserRole.TRAINER)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Export attendance data' })
  attendanceExport(@CurrentUser() user: AuthenticatedUser, @Query() query: ReportQueryDto) {
    return this.reportsService.attendanceExport(user, query);
  }

  @Get('enrollment/export')
  @Roles(UserRole.SUPER_ADMIN, UserRole.OWNER, UserRole.BRANCH_MANAGER)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Export enrollment data' })
  enrollmentExport(@CurrentUser() user: AuthenticatedUser, @Query() query: ReportQueryDto) {
    return this.reportsService.enrollmentExport(user, query);
  }

  @Get('progress/export')
  @Roles(UserRole.SUPER_ADMIN, UserRole.OWNER, UserRole.BRANCH_MANAGER, UserRole.TRAINER)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Export student progress data' })
  progressExport(@CurrentUser() user: AuthenticatedUser, @Query() query: ReportQueryDto) {
    return this.reportsService.progressExport(user, query);
  }

  @Get('revenue')
  @Roles(UserRole.SUPER_ADMIN, UserRole.OWNER, UserRole.BRANCH_MANAGER)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Get revenue report with monthly trends' })
  revenue(@CurrentUser() user: AuthenticatedUser, @Query() query: ReportQueryDto) {
    return this.reportsService.revenue(user, query);
  }

  @Get('enrollment')
  @Roles(UserRole.SUPER_ADMIN, UserRole.OWNER, UserRole.BRANCH_MANAGER)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Get enrollment report with status and batch breakdown' })
  enrollment(@CurrentUser() user: AuthenticatedUser, @Query() query: ReportQueryDto) {
    return this.reportsService.enrollment(user, query);
  }

  @Get('attendance')
  @Roles(UserRole.SUPER_ADMIN, UserRole.OWNER, UserRole.BRANCH_MANAGER, UserRole.TRAINER)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Get attendance report with rates and breakdown' })
  attendance(@CurrentUser() user: AuthenticatedUser, @Query() query: ReportQueryDto) {
    return this.reportsService.attendance(user, query);
  }

  @Get('payment-due')
  @Roles(UserRole.SUPER_ADMIN, UserRole.OWNER, UserRole.BRANCH_MANAGER)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Get payment due report with overdue invoices' })
  paymentDue(@CurrentUser() user: AuthenticatedUser, @Query() query: ReportQueryDto) {
    return this.reportsService.paymentDue(user, query);
  }

  @Get('conversion')
  @Roles(UserRole.SUPER_ADMIN, UserRole.OWNER, UserRole.BRANCH_MANAGER)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Get lead-to-student conversion report' })
  conversion(@CurrentUser() user: AuthenticatedUser, @Query() query: ReportQueryDto) {
    return this.reportsService.conversion(user, query);
  }

  @Get('trainer-performance')
  @Roles(UserRole.SUPER_ADMIN, UserRole.OWNER, UserRole.BRANCH_MANAGER)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Get trainer performance report' })
  trainerPerformance(@CurrentUser() user: AuthenticatedUser, @Query() query: ReportQueryDto) {
    return this.reportsService.trainerPerformance(user, query);
  }

  @Get('student-progress')
  @Roles(UserRole.SUPER_ADMIN, UserRole.OWNER, UserRole.BRANCH_MANAGER, UserRole.TRAINER)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Get student progress report with grade distribution' })
  studentProgress(@CurrentUser() user: AuthenticatedUser, @Query() query: ReportQueryDto) {
    return this.reportsService.studentProgress(user, query);
  }

  @Get('batch-utilization')
  @Roles(UserRole.SUPER_ADMIN, UserRole.OWNER, UserRole.BRANCH_MANAGER)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Get batch utilization report with capacity analysis' })
  batchUtilization(@CurrentUser() user: AuthenticatedUser, @Query() query: ReportQueryDto) {
    return this.reportsService.batchUtilization(user, query);
  }
}
