import { IsOptional, IsString, IsIn, MinLength, MaxLength, IsArray, ArrayNotEmpty, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { UserRole, UserStatus } from '@prisma/client';

export class QueryPaginationDto {
  @IsOptional()
  @Type(() => Number)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  pageSize?: number = 10;
}

export class CreatePermissionDto {
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  module!: string;

  @IsString()
  @MinLength(2)
  @MaxLength(100)
  action!: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  description?: string;
}

export class UpdatePermissionDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  module?: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  action?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  description?: string;
}

export class UpdateRolePermissionsDto {
  @IsArray()
  @IsUUID('4', { each: true })
  @ArrayNotEmpty()
  permissionIds!: string[];
}

export class AssignUserRoleDto {
  @IsUUID()
  userId!: string;

  @IsString()
  @IsIn(Object.values(UserRole))
  role!: UserRole;
}

export class UpdateUserStatusDto {
  @IsString()
  @IsIn(Object.values(UserStatus))
  status!: UserStatus;
}

export class UpdateUserRoleDto {
  @IsString()
  @IsIn(Object.values(UserRole))
  role!: UserRole;
}
