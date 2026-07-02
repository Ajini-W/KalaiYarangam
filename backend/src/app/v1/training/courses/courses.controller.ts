import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '@/common/decorators';
import { AuthenticatedUser } from '@/common/interfaces';
import { CoursesService } from './courses.service';
import { CreateCourseDto, QueryCourseDto, UpdateCourseDto } from './dto/courses.dto';

@ApiTags('training/courses')
@ApiBearerAuth()
@Controller('training/courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post()
  create(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateCourseDto) {
    return this.coursesService.create(user, dto);
  }

  @Get()
  findAll(@CurrentUser() user: AuthenticatedUser, @Query() query: QueryCourseDto) {
    return this.coursesService.findAll(user, query);
  }

  @Get('stats')
  stats(@CurrentUser() user: AuthenticatedUser) {
    return this.coursesService.stats(user);
  }

  @Get(':id')
  findOne(@CurrentUser() user: AuthenticatedUser, @Param('id', ParseUUIDPipe) id: string) {
    return this.coursesService.findOne(user, id);
  }

  @Patch(':id')
  update(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateCourseDto,
  ) {
    return this.coursesService.update(user, id, dto);
  }

  @Post(':id/archive')
  archive(@CurrentUser() user: AuthenticatedUser, @Param('id', ParseUUIDPipe) id: string) {
    return this.coursesService.archive(user, id);
  }

  @Post(':id/restore')
  restore(@CurrentUser() user: AuthenticatedUser, @Param('id', ParseUUIDPipe) id: string) {
    return this.coursesService.restore(user, id);
  }
}
