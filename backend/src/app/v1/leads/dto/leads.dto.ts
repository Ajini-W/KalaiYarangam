import { IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { LeadStatus } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

export class CreateLeadDto {
  @IsString()
  @MinLength(2)
  name!: string;

  @IsString()
  @MinLength(10)
  phone!: string;

  @IsOptional()
  @IsString()
  course?: string;

  @IsOptional()
  @IsString()
  source?: string;

  @IsOptional()
  @IsEnum(LeadStatus)
  status?: LeadStatus;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class QueryLeadsDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  pageSize?: number = 10;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(LeadStatus)
  status?: LeadStatus;
}
