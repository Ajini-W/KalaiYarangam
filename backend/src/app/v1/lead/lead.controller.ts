import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '@/common/decorators';
import { AuthenticatedUser } from '@/common/interfaces';
import { LeadService } from './lead.service';
import {
  CreateLeadDto, UpdateLeadDto, QueryLeadDto,
  CreateFollowupDto, UpdateFollowupDto,
  AssignLeadDto, ConvertLeadDto, BulkAssignDto,
} from './dto/lead.dto';

@ApiTags('leads')
@ApiBearerAuth()
@Controller('leads')
export class LeadController {
  constructor(private readonly leadService: LeadService) {}

  @Post()
  create(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateLeadDto) {
    return this.leadService.create(user, dto);
  }

  @Get()
  findAll(@CurrentUser() user: AuthenticatedUser, @Query() query: QueryLeadDto) {
    return this.leadService.findAll(user, query);
  }

  @Get('stats')
  getStats(@CurrentUser() user: AuthenticatedUser) {
    return this.leadService.getStats(user);
  }

  @Get('students')
  getStudents(@CurrentUser() user: AuthenticatedUser, @Query() query: { search?: string; page?: number; pageSize?: number }) {
    return this.leadService.getStudentsList(user, query);
  }

  @Get(':id')
  findOne(@CurrentUser() user: AuthenticatedUser, @Param('id', ParseUUIDPipe) id: string) {
    return this.leadService.findOne(user, id);
  }

  @Patch(':id')
  update(@CurrentUser() user: AuthenticatedUser, @Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateLeadDto) {
    return this.leadService.update(user, id, dto);
  }

  @Delete(':id')
  remove(@CurrentUser() user: AuthenticatedUser, @Param('id', ParseUUIDPipe) id: string) {
    return this.leadService.remove(user, id);
  }

  @Post(':id/assign')
  assign(@CurrentUser() user: AuthenticatedUser, @Param('id', ParseUUIDPipe) id: string, @Body() dto: AssignLeadDto) {
    return this.leadService.assignCounsellor(user, id, dto);
  }

  @Post('bulk-assign')
  bulkAssign(@CurrentUser() user: AuthenticatedUser, @Body() dto: BulkAssignDto) {
    return this.leadService.bulkAssign(user, dto);
  }

  @Post(':id/archive')
  archive(@CurrentUser() user: AuthenticatedUser, @Param('id', ParseUUIDPipe) id: string) {
    return this.leadService.archive(user, id);
  }

  @Post(':id/restore')
  restore(@CurrentUser() user: AuthenticatedUser, @Param('id', ParseUUIDPipe) id: string) {
    return this.leadService.restore(user, id);
  }

  @Post(':id/convert')
  convert(@CurrentUser() user: AuthenticatedUser, @Param('id', ParseUUIDPipe) id: string, @Body() dto: ConvertLeadDto) {
    return this.leadService.convert(user, id, dto);
  }

  /* ─── Followups ─────────────────────────────────────────── */

  @Post(':leadId/followups')
  createFollowup(
    @CurrentUser() user: AuthenticatedUser,
    @Param('leadId', ParseUUIDPipe) leadId: string,
    @Body() dto: CreateFollowupDto,
  ) {
    return this.leadService.createFollowup(user, leadId, dto);
  }

  @Get(':leadId/followups')
  findFollowups(
    @CurrentUser() user: AuthenticatedUser,
    @Param('leadId', ParseUUIDPipe) leadId: string,
  ) {
    return this.leadService.findFollowups(user, leadId);
  }

  @Patch('followups/:id')
  updateFollowup(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateFollowupDto,
  ) {
    return this.leadService.updateFollowup(user, id, dto);
  }

  @Delete('followups/:id')
  removeFollowup(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.leadService.removeFollowup(user, id);
  }
}
