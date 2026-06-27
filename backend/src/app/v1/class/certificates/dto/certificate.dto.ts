import { IsArray, IsDate, IsEnum, IsInt, IsObject, IsOptional, IsString, IsUUID, Min, MinLength, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export enum CertificateStatusFilter {
  ACTIVE = 'ACTIVE',
  REVOKED = 'REVOKED',
}

export class CreateCertificateDto {
  @IsUUID()
  studentId!: string;

  @IsUUID()
  templateId!: string;

  @IsOptional()
  @IsUUID()
  batchId?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  courseName?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  issuedDate?: Date;

  @IsOptional()
  @IsObject()
  data?: Record<string, unknown>;
}

export class GenerateBulkCertificateDto {
  @IsUUID()
  batchId!: string;

  @IsUUID()
  templateId!: string;

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  studentIds?: string[];

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  issuedDate?: Date;
}

export class QueryCertificateDto {
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
  @IsUUID()
  studentId?: string;

  @IsOptional()
  @IsEnum(CertificateStatusFilter)
  status?: CertificateStatusFilter;
}

export class RevokeCertificateDto {
  @IsOptional()
  @IsString()
  reason?: string;
}
