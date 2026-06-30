import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { Roles } from '@/common/decorators';
import { RolesGuard } from '@/common/guards';
import { CurrentUser } from '@/common/decorators';
import { AuthenticatedUser } from '@/common/interfaces';
import { DashboardService } from './dashboard.service';

@ApiTags('dashboard')
@ApiBearerAuth()
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('summary')
  @Roles(UserRole.SUPER_ADMIN, UserRole.OWNER, UserRole.BRANCH_MANAGER)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Get dashboard summary statistics' })
  summary(@CurrentUser() user: AuthenticatedUser) {
    return this.dashboardService.summary(user);
  }

  @Get('metrics')
  @Roles(UserRole.SUPER_ADMIN, UserRole.OWNER, UserRole.BRANCH_MANAGER)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Get dashboard metrics and trends' })
  metrics(@CurrentUser() user: AuthenticatedUser) {
    return this.dashboardService.metrics(user);
  }

  @Get('upcoming')
  @Roles(UserRole.SUPER_ADMIN, UserRole.OWNER, UserRole.BRANCH_MANAGER, UserRole.TRAINER)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Get upcoming sessions, tasks, and followups' })
  upcoming(@CurrentUser() user: AuthenticatedUser) {
    return this.dashboardService.upcoming(user);
  }

  @Get('alerts')
  @Roles(UserRole.SUPER_ADMIN, UserRole.OWNER, UserRole.BRANCH_MANAGER)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Get dashboard alerts (overdue payments, tasks, followups)' })
  alerts(@CurrentUser() user: AuthenticatedUser) {
    return this.dashboardService.alerts(user);
  }
}
