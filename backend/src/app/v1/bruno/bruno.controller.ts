import { Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { BrunoService } from './bruno.service';

@ApiTags('bruno')
@ApiBearerAuth()
@Controller('bruno')
export class BrunoController {
  constructor(private readonly brunoService: BrunoService) {}

  @Post('sync')
  @ApiOperation({ summary: 'Sync all Bruno API collections' })
  async syncAll() {
    await this.brunoService.syncAll();
    return { message: 'Bruno collections synced successfully' };
  }
}
