import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '@/common/decorators';
import { AuthenticatedUser } from '@/common/interfaces';
import { SchedulesService } from './schedules.service';
import { CalendarQueryDto, CreateScheduleDto, QueryScheduleDto, RescheduleDto, UpdateScheduleDto } from './dto/schedules.dto';

@ApiTags('training/schedules')
@ApiBearerAuth()
@Controller('training/schedules')
export class SchedulesController {
  constructor(private readonly schedulesService: SchedulesService) {}

  @Post()
  create(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateScheduleDto) {
    return this.schedulesService.create(user, dto);
  }

  @Get()
  findAll(@CurrentUser() user: AuthenticatedUser, @Query() query: QueryScheduleDto) {
    return this.schedulesService.findAll(user, query);
  }

  @Get('calendar')
  calendar(@CurrentUser() user: AuthenticatedUser, @Query() query: CalendarQueryDto) {
    return this.schedulesService.calendar(user, query);
  }

  @Get('upcoming')
  upcoming(@CurrentUser() user: AuthenticatedUser) {
    return this.schedulesService.upcoming(user);
  }

  @Get('today')
  today(@CurrentUser() user: AuthenticatedUser) {
    return this.schedulesService.today(user);
  }

  @Get(':id')
  findOne(@CurrentUser() user: AuthenticatedUser, @Param('id', ParseUUIDPipe) id: string) {
    return this.schedulesService.findOne(user, id);
  }

  @Patch(':id')
  update(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateScheduleDto,
  ) {
    return this.schedulesService.update(user, id, dto);
  }

  @Post(':id/cancel')
  cancel(@CurrentUser() user: AuthenticatedUser, @Param('id', ParseUUIDPipe) id: string) {
    return this.schedulesService.cancel(user, id);
  }

  @Post(':id/reschedule')
  reschedule(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: RescheduleDto,
  ) {
    return this.schedulesService.reschedule(user, id, dto);
  }
}
