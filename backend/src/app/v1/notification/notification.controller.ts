import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '@/common/decorators';
import { NotificationService } from './notification.service';
import { SendPushDto } from './dto/notification.dto';

@ApiTags('notification')
@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Public()
  @Post('push')
  sendPush(@Body() dto: SendPushDto) {
    return this.notificationService.sendPush(dto);
  }
}
