import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '@/common/decorators';
import { AuthenticatedUser } from '@/common/interfaces';
import { ProgressService } from './progress.service';
import { CreateProgressDto, ProgressSummaryDto, QueryProgressDto, RecalculateProgressDto, UpdateProgressDto } from './dto/progress.dto';

@ApiTags('class/progress')
@ApiBearerAuth()
@Controller('class/progress')
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Post()
  create(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateProgressDto) {
    return this.progressService.create(user, dto);
  }

  @Get()
  findAll(@CurrentUser() user: AuthenticatedUser, @Query() query: QueryProgressDto) {
    return this.progressService.findAll(user, query);
  }

  @Get('summary')
  summary(@CurrentUser() user: AuthenticatedUser, @Query() query: ProgressSummaryDto) {
    return this.progressService.summary(user, query);
  }

  @Post('recalculate')
  recalculate(@CurrentUser() user: AuthenticatedUser, @Body() dto: RecalculateProgressDto) {
    return this.progressService.recalculate(user, dto);
  }

  @Get(':id')
  findOne(@CurrentUser() user: AuthenticatedUser, @Param('id', ParseUUIDPipe) id: string) {
    return this.progressService.findOne(user, id);
  }

  @Patch(':id')
  update(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateProgressDto,
  ) {
    return this.progressService.update(user, id, dto);
  }
}
