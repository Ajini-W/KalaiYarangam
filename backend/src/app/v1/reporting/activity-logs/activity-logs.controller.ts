import {
  Controller,
  Get,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { ActivityLogsService } from './activity-logs.service';

@Controller('activity-logs')
export class ActivityLogsController {
  constructor(
    private readonly activityLogsService: ActivityLogsService,
  ) {}

  @Get()
  listActivityLogs(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe)
    page: number,

    @Query('pageSize', new DefaultValuePipe(20), ParseIntPipe)
    pageSize: number,

    @Query('userId')
    userId?: string,

    @Query('search')
    search?: string,

    @Query('from')
    from?: string,

    @Query('to')
    to?: string,
  ) {
    return this.activityLogsService.listActivityLogs({
      page,
      pageSize,
      userId,
      search,
      from,
      to,
    });
  }
}