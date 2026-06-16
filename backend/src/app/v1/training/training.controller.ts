import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '@/common/decorators';
import { AuthenticatedUser } from '@/common/interfaces';
import { TrainingService } from './training.service';
import { CreateBatchDto, CreateStudentDto, QueryPaginationDto } from './dto/training.dto';

@ApiTags('training')
@ApiBearerAuth()
@Controller('training')
export class TrainingController {
  constructor(private readonly trainingService: TrainingService) {}

  @Get('batches')
  findBatches(@CurrentUser() user: AuthenticatedUser, @Query() query: QueryPaginationDto) {
    return this.trainingService.findBatches(user, query);
  }

  @Post('batches')
  createBatch(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateBatchDto) {
    return this.trainingService.createBatch(user, dto);
  }

  @Get('students')
  findStudents(@CurrentUser() user: AuthenticatedUser, @Query() query: QueryPaginationDto) {
    return this.trainingService.findStudents(user, query);
  }

  @Post('students')
  createStudent(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateStudentDto) {
    return this.trainingService.createStudent(user, dto);
  }
}
