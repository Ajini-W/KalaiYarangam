import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post, Put, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { CurrentUser } from '@/common/decorators';
import { AuthenticatedUser } from '@/common/interfaces';
import { RbacService } from './rbac.service';
import {
  AssignUserRoleDto,
  CreatePermissionDto,
  QueryPaginationDto,
  UpdatePermissionDto,
  UpdateRolePermissionsDto,
  UpdateUserRoleDto,
  UpdateUserStatusDto,
} from './dto/rbac.dto';

@ApiTags('rbac')
@ApiBearerAuth()
@Controller('rbac')
export class RbacController {
  constructor(private readonly rbacService: RbacService) {}

  // ── Permissions ──────────────────────────────────────────────

  @Get('permissions')
  listPermissions() {
    return this.rbacService.listPermissions();
  }

  @Post('permissions')
  createPermission(@Body() dto: CreatePermissionDto) {
    return this.rbacService.createPermission(dto);
  }

  @Put('permissions/:id')
  updatePermission(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdatePermissionDto) {
    return this.rbacService.updatePermission(id, dto);
  }

  @Delete('permissions/:id')
  deletePermission(@Param('id', ParseUUIDPipe) id: string) {
    return this.rbacService.deletePermission(id);
  }

  // ── Role Permissions ─────────────────────────────────────────

  @Get('roles')
  listRoles() {
    return this.rbacService.listRoles();
  }

  @Put('roles/:role')
  updateRolePermissions(@Param('role') role: UserRole, @Body() dto: UpdateRolePermissionsDto) {
    return this.rbacService.updateRolePermissions(role, dto);
  }

  // ── User Role Assignments ────────────────────────────────────

  @Get('user-roles')
  listUserRoles() {
    return this.rbacService.listUserRoles();
  }

  @Post('user-roles')
  assignUserRole(@Body() dto: AssignUserRoleDto) {
    return this.rbacService.assignUserRole(dto);
  }

  @Delete('user-roles/:id')
  removeUserRole(@Param('id', ParseUUIDPipe) id: string) {
    return this.rbacService.removeUserRole(id);
  }

  // ── User Management ──────────────────────────────────────────

  @Get('users')
  listUsers(@Query() query: QueryPaginationDto) {
    return this.rbacService.listUsers(query.page, query.pageSize);
  }

  @Get('users/:id')
  getUser(@Param('id', ParseUUIDPipe) id: string) {
    return this.rbacService.getUser(id);
  }

  @Put('users/:id/status')
  updateUserStatus(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateUserStatusDto) {
    return this.rbacService.updateUserStatus(id, dto);
  }

  @Put('users/:id/role')
  updateUserRole(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateUserRoleDto) {
    return this.rbacService.updateUserRole(id, dto);
  }
}
