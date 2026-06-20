import { Body, Controller, Get, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser, Public } from '@/common/decorators';
import { AuthenticatedUser } from '@/common/interfaces';
import { TrainingService } from './training.service';
import { CreateBatchDto, CreateStudentDto, CreateTenantDto, QueryPaginationDto, UpdateTenantDto } from './dto/training.dto';

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

  @Public()
  @Post('tenant')
  createTenant(@Body() dto: CreateTenantDto) {
    return this.trainingService.createTenant(dto);
  }

  @ApiBearerAuth()
  @Get('tenant')
  getTenant(@CurrentUser() user: AuthenticatedUser) {
    return this.trainingService.getTenant(user);
  }

  @ApiBearerAuth()
  @Patch('tenant')
  updateTenant(@CurrentUser() user: AuthenticatedUser, @Body() dto: UpdateTenantDto) {
    return this.trainingService.updateTenant(user, dto);
  }
}
