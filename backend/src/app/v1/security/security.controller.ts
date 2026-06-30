import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Query,
  Body,
  Req,
  UseGuards,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiBody } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { Request } from 'express';
import { Roles } from '@/common/decorators';
import { RolesGuard } from '@/common/guards';
import { CurrentUser } from '@/common/decorators';
import { AuthenticatedUser } from '@/common/interfaces';
import { SecurityService } from './security.service';
import {
  CreateAuditLogDto,
  CreateActivityLogDto,
  CreateSecurityEventDto,
} from './dto/security.dto';

@ApiTags('security')
@Controller('security')
export class SecurityController {
  constructor(private readonly securityService: SecurityService) {}

  // ── Create Audit Log ─────────────────────────────────────────

  @Post('audit-logs')
  @ApiOperation({ summary: 'Create an audit log entry' })
  @ApiBody({ type: CreateAuditLogDto })
  createAuditLog(@Body() dto: CreateAuditLogDto, @Req() req: Request) {
    const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0] ?? req.ip;
    const userAgent = req.headers['user-agent'] as string | undefined;
    return this.securityService.createAuditLog(dto, { ipAddress: ip, userAgent });
  }

  // ── Create Activity Log ──────────────────────────────────────

  @Post('activity-logs')
  @ApiOperation({ summary: 'Create an activity log entry' })
  @ApiBody({ type: CreateActivityLogDto })
  createActivityLog(@Body() dto: CreateActivityLogDto, @Req() req: Request) {
    const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0] ?? req.ip;
    return this.securityService.createActivityLog(dto, { ipAddress: ip });
  }

  // ── Create Security Event ────────────────────────────────────

  @Post('security-events')
  @ApiOperation({ summary: 'Create a security event entry' })
  @ApiBody({ type: CreateSecurityEventDto })
  createSecurityEvent(@Body() dto: CreateSecurityEventDto, @Req() req: Request) {
    const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0] ?? req.ip;
    const userAgent = req.headers['user-agent'] as string | undefined;
    return this.securityService.createSecurityEvent(dto, { ipAddress: ip, userAgent });
  }

  // ── Dashboard Stats (Super Admin only) ─────────────────────

  @Get('stats')
  @Roles(UserRole.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Get security dashboard statistics' })
  getStats() {
    return this.securityService.getDashboardStats();
  }

  // ── Sessions ────────────────────────────────────────────────

  @Get('sessions')
  @Roles(UserRole.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'List active sessions' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'pageSize', required: false })
  @ApiQuery({ name: 'userId', required: false })
  @ApiQuery({ name: 'isActive', required: false })
  @ApiQuery({ name: 'search', required: false })
  listSessions(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('pageSize', new DefaultValuePipe(20), ParseIntPipe) pageSize: number,
    @Query('userId') userId?: string,
    @Query('isActive') isActive?: string,
    @Query('search') search?: string,
  ) {
    return this.securityService.listSessions({
      page,
      pageSize,
      userId,
      isActive: isActive !== undefined ? isActive === 'true' : undefined,
      search,
    });
  }

  @Delete('sessions/:id')
  @Roles(UserRole.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Revoke a session' })
  revokeSession(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.securityService.revokeSession(id, user);
  }

  @Delete('sessions/user/:userId')
  @Roles(UserRole.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Revoke all sessions for a user' })
  revokeAllUserSessions(@Param('userId') userId: string, @CurrentUser() user: AuthenticatedUser) {
    return this.securityService.revokeAllUserSessions(userId, user);
  }

  // ── Login History ───────────────────────────────────────────

  @Get('login-history')
  @Roles(UserRole.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'List login history' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'pageSize', required: false })
  @ApiQuery({ name: 'userId', required: false })
  @ApiQuery({ name: 'success', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'from', required: false })
  @ApiQuery({ name: 'to', required: false })
  listLoginHistory(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('pageSize', new DefaultValuePipe(20), ParseIntPipe) pageSize: number,
    @Query('userId') userId?: string,
    @Query('success') success?: string,
    @Query('search') search?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.securityService.listLoginHistory({
      page,
      pageSize,
      userId,
      success: success !== undefined ? success === 'true' : undefined,
      search,
      from,
      to,
    });
  }

  // ── Audit Logs ──────────────────────────────────────────────

  @Get('audit-logs')
  @Roles(UserRole.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'List audit logs' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'pageSize', required: false })
  @ApiQuery({ name: 'userId', required: false })
  @ApiQuery({ name: 'action', required: false })
  @ApiQuery({ name: 'entity', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'from', required: false })
  @ApiQuery({ name: 'to', required: false })
  listAuditLogs(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('pageSize', new DefaultValuePipe(20), ParseIntPipe) pageSize: number,
    @Query('userId') userId?: string,
    @Query('action') action?: string,
    @Query('entity') entity?: string,
    @Query('search') search?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.securityService.listAuditLogs({ page, pageSize, userId, action, entity, search, from, to });
  }

  // ── Activity Logs ───────────────────────────────────────────

  @Get('activity-logs')
  @Roles(UserRole.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'List activity logs' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'pageSize', required: false })
  @ApiQuery({ name: 'userId', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'from', required: false })
  @ApiQuery({ name: 'to', required: false })
  listActivityLogs(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('pageSize', new DefaultValuePipe(20), ParseIntPipe) pageSize: number,
    @Query('userId') userId?: string,
    @Query('search') search?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.securityService.listActivityLogs({ page, pageSize, userId, search, from, to });
  }

  // ── Security Events ─────────────────────────────────────────

  @Get('security-events')
  @Roles(UserRole.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'List security events' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'pageSize', required: false })
  @ApiQuery({ name: 'userId', required: false })
  @ApiQuery({ name: 'eventType', required: false })
  @ApiQuery({ name: 'severity', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'from', required: false })
  @ApiQuery({ name: 'to', required: false })
  listSecurityEvents(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('pageSize', new DefaultValuePipe(20), ParseIntPipe) pageSize: number,
    @Query('userId') userId?: string,
    @Query('eventType') eventType?: string,
    @Query('severity') severity?: string,
    @Query('search') search?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.securityService.listSecurityEvents({ page, pageSize, userId, eventType, severity, search, from, to });
  }
}
