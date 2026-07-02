import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '@/common/decorators';
import { AuthenticatedUser } from '@/common/interfaces';
import { BatchesService } from './batches.service';
import { AssignTrainerDto, CreateBatchDto, DuplicateBatchDto, QueryBatchDto, RemoveTrainerDto, UpdateBatchDto, UpdateBatchStatusDto } from './dto/batches.dto';

@ApiTags('training/batches')
@ApiBearerAuth()
@Controller('training/batches')
export class BatchesController {
  constructor(private readonly batchesService: BatchesService) {}

  @Post()
  create(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateBatchDto) {
    return this.batchesService.create(user, dto);
  }

  @Get()
  findAll(@CurrentUser() user: AuthenticatedUser, @Query() query: QueryBatchDto) {
    return this.batchesService.findAll(user, query);
  }

  @Get('statistics')
  statistics(@CurrentUser() user: AuthenticatedUser) {
    return this.batchesService.statistics(user);
  }

  @Get(':id')
  findOne(@CurrentUser() user: AuthenticatedUser, @Param('id', ParseUUIDPipe) id: string) {
    return this.batchesService.findOne(user, id);
  }

  @Patch(':id')
  update(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateBatchDto,
  ) {
    return this.batchesService.update(user, id, dto);
  }

  @Patch(':id/status')
  updateStatus(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateBatchStatusDto,
  ) {
    return this.batchesService.updateStatus(user, id, dto);
  }

  @Post(':id/archive')
  archive(@CurrentUser() user: AuthenticatedUser, @Param('id', ParseUUIDPipe) id: string) {
    return this.batchesService.archive(user, id);
  }

  @Post(':id/restore')
  restore(@CurrentUser() user: AuthenticatedUser, @Param('id', ParseUUIDPipe) id: string) {
    return this.batchesService.restore(user, id);
  }

  @Post(':id/duplicate')
  duplicate(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: DuplicateBatchDto,
  ) {
    return this.batchesService.duplicate(user, id, dto);
  }

  @Post(':id/assign-trainer')
  assignTrainer(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: AssignTrainerDto,
  ) {
    return this.batchesService.assignTrainer(user, id, dto);
  }

  @Post(':id/remove-trainer')
  removeTrainer(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: RemoveTrainerDto,
  ) {
    return this.batchesService.removeTrainer(user, id, dto);
  }

  @Get(':id/students')
  findStudents(@CurrentUser() user: AuthenticatedUser, @Param('id', ParseUUIDPipe) id: string) {
    return this.batchesService.findStudents(user, id);
  }

  @Get(':id/schedules')
  findSchedules(@CurrentUser() user: AuthenticatedUser, @Param('id', ParseUUIDPipe) id: string) {
    return this.batchesService.findSchedules(user, id);
  }

  @Get(':id/attendance')
  findAttendance(@CurrentUser() user: AuthenticatedUser, @Param('id', ParseUUIDPipe) id: string) {
    return this.batchesService.findAttendance(user, id);
  }

  @Get(':id/progress')
  findProgress(@CurrentUser() user: AuthenticatedUser, @Param('id', ParseUUIDPipe) id: string) {
    return this.batchesService.findProgress(user, id);
  }

  @Get(':id/waitlist')
  findWaitlist(@CurrentUser() user: AuthenticatedUser, @Param('id', ParseUUIDPipe) id: string) {
    return this.batchesService.findWaitlist(user, id);
  }

  @Get(':id/capacity')
  capacity(@CurrentUser() user: AuthenticatedUser, @Param('id', ParseUUIDPipe) id: string) {
    return this.batchesService.capacity(user, id);
  }
}
