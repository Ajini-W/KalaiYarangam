import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '@/common/decorators';
import { AuthenticatedUser } from '@/common/interfaces';
import { AttendanceService } from './attendance.service';
import { AttendanceSummaryDto, BulkMarkAttendanceDto, CreateAttendanceDto, QueryAttendanceDto, UpdateAttendanceDto } from './dto/attendance.dto';

@ApiTags('class/attendance')
@ApiBearerAuth()
@Controller('class/attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post()
  create(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateAttendanceDto) {
    return this.attendanceService.create(user, dto);
  }

  @Get()
  findAll(@CurrentUser() user: AuthenticatedUser, @Query() query: QueryAttendanceDto) {
    return this.attendanceService.findAll(user, query);
  }

  @Get('summary')
  summary(@CurrentUser() user: AuthenticatedUser, @Query() query: AttendanceSummaryDto) {
    return this.attendanceService.summary(user, query);
  }

  @Post('bulk')
  bulkMark(@CurrentUser() user: AuthenticatedUser, @Body() dto: BulkMarkAttendanceDto) {
    return this.attendanceService.bulkMark(user, dto);
  }

  @Get(':id')
  findOne(@CurrentUser() user: AuthenticatedUser, @Param('id', ParseUUIDPipe) id: string) {
    return this.attendanceService.findOne(user, id);
  }

  @Patch(':id')
  update(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateAttendanceDto,
  ) {
    return this.attendanceService.update(user, id, dto);
  }
}
