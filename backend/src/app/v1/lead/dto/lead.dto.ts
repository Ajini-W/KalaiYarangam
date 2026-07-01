import { IsBoolean, IsEmail, IsEnum, IsOptional, IsString, IsUUID, MinLength } from 'class-validator';
import { Type } from 'class-transformer';
import { LeadSource, LeadStatus } from '@prisma/client';

export class CreateLeadDto {
  @IsString()
  @MinLength(2)
  name!: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsString()
  @MinLength(10)
  phone!: string;

  @IsOptional()
  @IsString()
  course?: string;

  @IsOptional()
  @IsString()
  branchId?: string;

  @IsOptional()
  @IsEnum(LeadSource)
  source?: LeadSource;

  @IsOptional()
  @IsEnum(LeadStatus)
  status?: LeadStatus;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsUUID()
  assignedTo?: string;

  @IsOptional()
  @IsString()
  nextFollowUp?: string;
}

export class UpdateLeadDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(10)
  phone?: string;

  @IsOptional()
  @IsString()
  course?: string;

  @IsOptional()
  @IsString()
  branchId?: string;

  @IsOptional()
  @IsEnum(LeadSource)
  source?: LeadSource;

  @IsOptional()
  @IsEnum(LeadStatus)
  status?: LeadStatus;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsUUID()
  assignedTo?: string;

  @IsOptional()
  @IsString()
  nextFollowUp?: string;
}

export class QueryLeadDto {
  @IsOptional()
  @Type(() => Number)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  pageSize?: number = 10;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  source?: string;

  @IsOptional()
  @IsString()
  branchId?: string;

  @IsOptional()
  @IsString()
  assignedTo?: string;

  @IsOptional()
  @IsString()
  sortBy?: string;

  @IsOptional()
  @IsString()
  sortDir?: 'asc' | 'desc';
}

export class CreateFollowupDto {
  @IsString()
  notes!: string;

  @IsOptional()
  @IsString()
  outcome?: string;

  @IsOptional()
  @IsString()
  nextDate?: string;

  @IsOptional()
  @IsString()
  contactedVia?: string;
}

export class UpdateFollowupDto {
  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  outcome?: string;

  @IsOptional()
  @IsString()
  nextDate?: string;

  @IsOptional()
  @IsString()
  contactedVia?: string;
}

export class AssignLeadDto {
  @IsUUID()
  assignedTo!: string;
}

export class ConvertLeadDto {
  @IsString()
  @MinLength(2)
  studentName!: string;

  @IsOptional()
  @IsString()
  @MinLength(10)
  studentPhone?: string;

  @IsOptional()
  @IsEmail()
  studentEmail?: string;

  @IsOptional()
  @IsString()
  batchId?: string;
}

export class BulkAssignDto {
  @IsUUID('4', { each: true })
  leadIds!: string[];

  @IsUUID()
  assignedTo!: string;
}

export class BulkActionDto {
  @IsUUID('4', { each: true })
  leadIds!: string[];
}
