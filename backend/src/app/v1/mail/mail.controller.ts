import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '@/common/decorators';
import { MailService } from './mail.service';
import { SendMailDto } from './dto/mail.dto';

@ApiTags('mail')
@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Public()
  @Post('send')
  send(@Body() dto: SendMailDto) {
    return this.mailService.send(dto);
  }
}
