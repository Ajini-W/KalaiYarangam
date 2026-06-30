import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Query,
  Res,
  UseGuards,
  DefaultValuePipe,
  ParseIntPipe,
  Req,
  Body,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { ApiTags, ApiOperation, ApiQuery, ApiBody } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
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
@UseGuards(RolesGuard)
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
  @Roles(UserRole.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Get security dashboard statistics' })
  getStats() {
    return this.securityService.getDashboardStats();
  }

  // ── Sessions ────────────────────────────────────────────────

  @Get('sessions')
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'List all sessions (admin)' })
  @Roles(UserRole.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'List active sessions' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'pageSize', required: false })
  @ApiQuery({ name: 'userId', required: false })
  @ApiQuery({ name: 'isActive', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'deviceType', required: false })
  @ApiQuery({ name: 'from', required: false })
  @ApiQuery({ name: 'to', required: false })
  listSessions(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('pageSize', new DefaultValuePipe(20), ParseIntPipe) pageSize: number,
    @Query('userId') userId?: string,
    @Query('isActive') isActive?: string,
    @Query('search') search?: string,
    @Query('deviceType') deviceType?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.securityService.listSessions({
      page,
      pageSize,
      userId,
      isActive: isActive !== undefined ? isActive === 'true' : undefined,
      search,
      deviceType,
      from,
      to,
    });
  }

  @Get('sessions/my')
  @ApiOperation({ summary: 'Get my active sessions' })
  getMySessions(@CurrentUser() user: AuthenticatedUser) {
    return this.securityService.getMySessions(user.id);
  }

  @Delete('sessions/:id')
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Revoke a session (admin)' })
  @Roles(UserRole.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Revoke a session' })
  revokeSession(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.securityService.revokeSession(id, user);
  }

  @Delete('sessions/:id/revoke')
  @ApiOperation({ summary: 'Revoke own session' })
  revokeMySession(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.securityService.revokeMySession(id, user.id);
  }

  @Delete('sessions/others/revoke')
  @ApiOperation({ summary: 'Revoke all other sessions' })
  revokeOtherSessions(@CurrentUser() user: AuthenticatedUser, @Req() req: Request) {
    const sessionId = (req.headers['x-session-id'] as string) || '';
    return this.securityService.revokeAllOtherSessions(sessionId, user.id);
  }

  @Delete('sessions/user/:userId')
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Revoke all sessions for a user (admin)' })
  @Roles(UserRole.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Revoke all sessions for a user' })
  revokeAllUserSessions(@Param('userId') userId: string, @CurrentUser() user: AuthenticatedUser) {
    return this.securityService.revokeAllUserSessions(userId, user);
  }

  // ── Login History ───────────────────────────────────────────

  @Get('login-history')
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'List login history (admin)' })
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
  @ApiQuery({ name: 'loginMethod', required: false })
  @ApiQuery({ name: 'isSuspicious', required: false })
  @ApiQuery({ name: 'browser', required: false })
  @ApiQuery({ name: 'os', required: false })
  @ApiQuery({ name: 'deviceType', required: false })
  listLoginHistory(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('pageSize', new DefaultValuePipe(20), ParseIntPipe) pageSize: number,
    @Query('userId') userId?: string,
    @Query('success') success?: string,
    @Query('search') search?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('loginMethod') loginMethod?: string,
    @Query('isSuspicious') isSuspicious?: string,
    @Query('browser') browser?: string,
    @Query('os') os?: string,
    @Query('deviceType') deviceType?: string,
  ) {
    return this.securityService.listLoginHistory({
      page,
      pageSize,
      userId,
      success: success !== undefined ? success === 'true' : undefined,
      search,
      from,
      to,
      loginMethod,
      isSuspicious: isSuspicious !== undefined ? isSuspicious === 'true' : undefined,
      browser,
      os,
      deviceType,
    });
  }

  @Get('login-history/stats')
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get login history statistics' })
  getLoginHistoryStats(@Query('userId') userId?: string) {
    return this.securityService.getLoginHistoryStats(userId);
  }

  // ── Audit Logs ──────────────────────────────────────────────

  @Get('audit-logs')
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'List audit logs (admin)' })
  @Roles(UserRole.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'List audit logs' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'pageSize', required: false })
  @ApiQuery({ name: 'userId', required: false })
  @ApiQuery({ name: 'tenantId', required: false })
  @ApiQuery({ name: 'action', required: false })
  @ApiQuery({ name: 'entity', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'from', required: false })
  @ApiQuery({ name: 'to', required: false })
  listAuditLogs(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('pageSize', new DefaultValuePipe(20), ParseIntPipe) pageSize: number,
    @Query('userId') userId?: string,
    @Query('tenantId') tenantId?: string,
    @Query('action') action?: string,
    @Query('entity') entity?: string,
    @Query('search') search?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.securityService.listAuditLogs({ page, pageSize, userId, tenantId, action, entity, search, from, to });
  }

  @Get('audit-logs/stats')
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get audit log statistics' })
  getAuditLogStats() {
    return this.securityService.getAuditLogStats();
  }

  // ── Activity Logs ───────────────────────────────────────────

  @Get('activity-logs')
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'List activity logs (admin)' })
  @Roles(UserRole.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'List activity logs' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'pageSize', required: false })
  @ApiQuery({ name: 'userId', required: false })
  @ApiQuery({ name: 'tenantId', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'from', required: false })
  @ApiQuery({ name: 'to', required: false })
  @ApiQuery({ name: 'resource', required: false })
  @ApiQuery({ name: 'action', required: false })
  @ApiQuery({ name: 'executionStatus', required: false })
  listActivityLogs(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('pageSize', new DefaultValuePipe(20), ParseIntPipe) pageSize: number,
    @Query('userId') userId?: string,
    @Query('tenantId') tenantId?: string,
    @Query('search') search?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('resource') resource?: string,
    @Query('action') action?: string,
    @Query('executionStatus') executionStatus?: string,
  ) {
    return this.securityService.listActivityLogs({ page, pageSize, userId, tenantId, search, from, to, resource, action, executionStatus });
  }

  // ── Security Events ─────────────────────────────────────────

  @Get('security-events')
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'List security events (admin)' })
  @Roles(UserRole.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'List security events' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'pageSize', required: false })
  @ApiQuery({ name: 'userId', required: false })
  @ApiQuery({ name: 'tenantId', required: false })
  @ApiQuery({ name: 'eventType', required: false })
  @ApiQuery({ name: 'severity', required: false })
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'from', required: false })
  @ApiQuery({ name: 'to', required: false })
  @ApiQuery({ name: 'resolved', required: false })
  listSecurityEvents(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('pageSize', new DefaultValuePipe(20), ParseIntPipe) pageSize: number,
    @Query('userId') userId?: string,
    @Query('tenantId') tenantId?: string,
    @Query('eventType') eventType?: string,
    @Query('severity') severity?: string,
    @Query('category') category?: string,
    @Query('search') search?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('resolved') resolved?: string,
  ) {
    return this.securityService.listSecurityEvents({
      page,
      pageSize,
      userId,
      tenantId,
      eventType,
      severity,
      category,
      search,
      from,
      to,
      resolved: resolved !== undefined ? resolved === 'true' : undefined,
    });
  }

  @Get('security-events/stats')
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get security event statistics' })
  getSecurityEventStats() {
    return this.securityService.getSecurityEventStats();
  }

  // ── CSV Exports ─────────────────────────────────────────────

  @Get('export/sessions')
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Export sessions as CSV' })
  async exportSessions(
    @Res() res: Response,
    @Query('isActive') isActive?: string,
    @Query('userId') userId?: string,
  ) {
    const { csv } = await this.securityService.exportSessionsCsv({
      isActive: isActive !== undefined ? isActive === 'true' : undefined,
      userId,
    });
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="sessions_${Date.now()}.csv"`);
    res.send(csv);
  }

  @Get('export/login-history')
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Export login history as CSV' })
  async exportLoginHistory(
    @Res() res: Response,
    @Query('userId') userId?: string,
    @Query('success') success?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    const { csv } = await this.securityService.exportLoginHistoryCsv({
      userId,
      success: success !== undefined ? success === 'true' : undefined,
      from,
      to,
    });
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="login_history_${Date.now()}.csv"`);
    res.send(csv);
  }

  @Get('export/audit-logs')
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Export audit logs as CSV' })
  async exportAuditLogs(
    @Res() res: Response,
    @Query('userId') userId?: string,
    @Query('action') action?: string,
    @Query('entity') entity?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    const { csv } = await this.securityService.exportAuditLogsCsv({ userId, action, entity, from, to });
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="audit_logs_${Date.now()}.csv"`);
    res.send(csv);
  }

  @Get('export/security-events')
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Export security events as CSV' })
  async exportSecurityEvents(
    @Res() res: Response,
    @Query('severity') severity?: string,
    @Query('eventType') eventType?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    const { csv } = await this.securityService.exportSecurityEventsCsv({ severity, eventType, from, to });
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="security_events_${Date.now()}.csv"`);
    res.send(csv);
  }

  @Get('export/activity-logs')
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Export activity logs as CSV' })
  async exportActivityLogs(
    @Res() res: Response,
    @Query('userId') userId?: string,
    @Query('resource') resource?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    const { csv } = await this.securityService.exportActivityLogsCsv({ userId, resource, from, to });
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="activity_logs_${Date.now()}.csv"`);
    res.send(csv);
  }
}
