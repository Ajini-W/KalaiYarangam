import {
  IsString,
  IsOptional,
  IsEnum,
  IsObject,
  MinLength,
  MaxLength,
  IsIn,
  IsUUID,
} from 'class-validator';
import { AuditAction } from '@prisma/client';

const SEVERITY_VALUES = ['INFO', 'WARNING', 'ERROR', 'CRITICAL'] as const;

export class CreateAuditLogDto {
  @IsOptional()
  @IsUUID('4')
  userId?: string;

  @IsOptional()
  @IsUUID('4')
  tenantId?: string;

  @IsEnum(AuditAction)
  action!: AuditAction;

  @IsString()
  @MinLength(1)
  @MaxLength(100)
  entity!: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  entityId?: string;

  @IsOptional()
  @IsObject()
  oldValues?: Record<string, unknown>;

  @IsOptional()
  @IsObject()
  newValues?: Record<string, unknown>;
}

export class CreateActivityLogDto {
  @IsOptional()
  @IsUUID('4')
  userId?: string;

  @IsOptional()
  @IsUUID('4')
  tenantId?: string;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  activity!: string;

  @IsOptional()
  @IsObject()
  details?: Record<string, unknown>;
}

export class CreateSecurityEventDto {
  @IsOptional()
  @IsUUID('4')
  userId?: string;

  @IsOptional()
  @IsUUID('4')
  tenantId?: string;

  @IsString()
  @MinLength(1)
  @MaxLength(100)
  eventType!: string;

  @IsString()
  @IsIn(SEVERITY_VALUES)
  severity!: string;

  @IsString()
  @MinLength(1)
  message!: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}
