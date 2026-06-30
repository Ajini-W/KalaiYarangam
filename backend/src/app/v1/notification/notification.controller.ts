import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CurrentUser, Public } from '@/common/decorators';
import { AuthenticatedUser } from '@/common/interfaces';
import { NotificationService } from './notification.service';
import {
  RegisterDeviceDto,
  SendNotificationDto,
  UpdateNotificationPreferenceDto,
} from './dto/notification.dto';

@ApiTags('notification')
@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  list(@CurrentUser() user: AuthenticatedUser, @Query('page') page?: string, @Query('limit') limit?: string) {
    return this.notificationService.list(user.id, user.tenantId, page ? parseInt(page) : 1, limit ? parseInt(limit) : 20);
  }

  @Get('unread-count')
  unreadCount(@CurrentUser() user: AuthenticatedUser) {
    return this.notificationService.unreadCount(user.id);
  }

  @Put(':id/read')
  markRead(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.notificationService.markRead(id, user.id);
  }

  @Put('read-all')
  markAllRead(@CurrentUser() user: AuthenticatedUser) {
    return this.notificationService.markAllRead(user.id);
  }

  @Get('preferences')
  getPreferences(@CurrentUser() user: AuthenticatedUser) {
    return this.notificationService.getPreferences(user.id);
  }

  @Put('preferences')
  updatePreference(@Body() dto: UpdateNotificationPreferenceDto, @CurrentUser() user: AuthenticatedUser) {
    return this.notificationService.updatePreference(user.id, dto);
  }

  @Post('register-device')
  registerDevice(@Body() dto: RegisterDeviceDto, @CurrentUser() user: AuthenticatedUser, @Query('userAgent') userAgent?: string) {
    return this.notificationService.registerDevice(user.id, dto, userAgent);
  }

  @Post('send')
  send(@Body() dto: SendNotificationDto, @CurrentUser() user: AuthenticatedUser) {
    return this.notificationService.sendNotification(dto, user.tenantId);
  }
}
