import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser, Public } from '@/common/decorators';
import { AuthenticatedUser } from '@/common/interfaces';
import { TrainingService } from './training.service';
import { CreateBatchDto, CreateBranchDto, CreateStudentDto, CreateTenantDto, QueryPaginationDto, UpdateBranchDto, UpdateBranchStatusDto, UpdateBrandingDto, UpdateTenantDto, UpdateTenantSettingsDto } from './dto/training.dto';

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

  @Post('branches')
  createBranch(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateBranchDto) {
    return this.trainingService.createBranch(user, dto);
  }

  @Get('branches')
  findBranches(@CurrentUser() user: AuthenticatedUser, @Query() query: QueryPaginationDto) {
    return this.trainingService.findBranches(user, query);
  }

  @Get('branches/:id')
  findOneBranch(@CurrentUser() user: AuthenticatedUser, @Param('id', ParseUUIDPipe) id: string) {
    return this.trainingService.findOneBranch(user, id);
  }

  @Patch('branches/:id')
  updateBranch(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateBranchDto,
  ) {
    return this.trainingService.updateBranch(user, id, dto);
  }

  @Patch('branches/:id/status')
  updateBranchStatus(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateBranchStatusDto,
  ) {
    return this.trainingService.updateBranchStatus(user, id, dto);
  }

  @Get('settings')
  getTenantSettings(@CurrentUser() user: AuthenticatedUser) {
    return this.trainingService.getTenantSettings(user);
  }

  @Post('settings')
  createTenantSettings(@CurrentUser() user: AuthenticatedUser, @Body() dto: UpdateTenantSettingsDto) {
    return this.trainingService.createTenantSettings(user, dto);
  }

  @Patch('settings')
  updateTenantSettings(@CurrentUser() user: AuthenticatedUser, @Body() dto: UpdateTenantSettingsDto) {
    return this.trainingService.updateTenantSettings(user, dto);
  }

  @Get('branding')
  getBranding(@CurrentUser() user: AuthenticatedUser) {
    return this.trainingService.getBranding(user);
  }

  @Patch('branding')
  updateBranding(@CurrentUser() user: AuthenticatedUser, @Body() dto: UpdateBrandingDto) {
    return this.trainingService.updateBranding(user, dto);
  }
}
