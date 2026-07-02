import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '@/common/decorators';
import { AuthenticatedUser } from '@/common/interfaces';
import { TrainersService } from './trainers.service';
import { CreateTrainerDto, QueryTrainerDto, UpdateTrainerDto, UpdateTrainerStatusDto } from './dto/trainers.dto';

@ApiTags('training/trainers')
@ApiBearerAuth()
@Controller('training/trainers')
export class TrainersController {
  constructor(private readonly trainersService: TrainersService) {}

  @Post()
  create(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateTrainerDto) {
    return this.trainersService.create(user, dto);
  }

  @Get()
  findAll(@CurrentUser() user: AuthenticatedUser, @Query() query: QueryTrainerDto) {
    return this.trainersService.findAll(user, query);
  }

  @Get(':id')
  findOne(@CurrentUser() user: AuthenticatedUser, @Param('id', ParseUUIDPipe) id: string) {
    return this.trainersService.findOne(user, id);
  }

  @Patch(':id')
  update(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateTrainerDto,
  ) {
    return this.trainersService.update(user, id, dto);
  }

  @Patch(':id/status')
  updateStatus(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateTrainerStatusDto,
  ) {
    return this.trainersService.updateStatus(user, id, dto);
  }

  @Post(':id/archive')
  archive(@CurrentUser() user: AuthenticatedUser, @Param('id', ParseUUIDPipe) id: string) {
    return this.trainersService.archive(user, id);
  }

  @Post(':id/restore')
  restore(@CurrentUser() user: AuthenticatedUser, @Param('id', ParseUUIDPipe) id: string) {
    return this.trainersService.restore(user, id);
  }

  @Get(':id/batches')
  findBatches(@CurrentUser() user: AuthenticatedUser, @Param('id', ParseUUIDPipe) id: string) {
    return this.trainersService.findBatches(user, id);
  }

  @Get(':id/schedule')
  findSchedule(@CurrentUser() user: AuthenticatedUser, @Param('id', ParseUUIDPipe) id: string) {
    return this.trainersService.findSchedule(user, id);
  }

  @Get(':id/attendance')
  findAttendance(@CurrentUser() user: AuthenticatedUser, @Param('id', ParseUUIDPipe) id: string) {
    return this.trainersService.findAttendance(user, id);
  }

  @Get(':id/workload')
  findWorkload(@CurrentUser() user: AuthenticatedUser, @Param('id', ParseUUIDPipe) id: string) {
    return this.trainersService.findWorkload(user, id);
  }
}
