import { IsArray, IsDate, IsEnum, IsInt, IsOptional, IsString, IsUUID, MaxLength, Min, MinLength, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { AttendanceStatus } from '@prisma/client';

export class QueryAttendanceDto {
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
  batchId?: string;

  @IsOptional()
  @IsUUID()
  classSessionId?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  dateFrom?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  dateTo?: Date;
}

export class CreateAttendanceRecordDto {
  @IsUUID()
  studentId!: string;

  @IsEnum(AttendanceStatus)
  status!: AttendanceStatus;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  remarks?: string;

  @IsOptional()
  @IsString()
  checkInTime?: string;
}

export class CreateAttendanceDto {
  @IsUUID()
  batchId!: string;

  @IsOptional()
  @IsUUID()
  classSessionId?: string;

  @Type(() => Date)
  @IsDate()
  date!: Date;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateAttendanceRecordDto)
  records!: CreateAttendanceRecordDto[];
}

export class UpdateAttendanceRecordDto {
  @IsUUID()
  studentId!: string;

  @IsEnum(AttendanceStatus)
  status!: AttendanceStatus;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  remarks?: string;

  @IsOptional()
  @IsString()
  checkInTime?: string;
}

export class UpdateAttendanceDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateAttendanceRecordDto)
  records!: UpdateAttendanceRecordDto[];
}

export class BulkAttendanceExceptionDto {
  @IsUUID()
  studentId!: string;

  @IsEnum(AttendanceStatus)
  status!: AttendanceStatus;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  remarks?: string;
}

export class BulkMarkAttendanceDto {
  @IsUUID()
  batchId!: string;

  @IsOptional()
  @IsUUID()
  classSessionId?: string;

  @Type(() => Date)
  @IsDate()
  date!: Date;

  @IsEnum(AttendanceStatus)
  defaultStatus!: AttendanceStatus;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BulkAttendanceExceptionDto)
  exceptions?: BulkAttendanceExceptionDto[];
}

export class AttendanceSummaryDto {
  @IsOptional()
  @IsUUID()
  studentId?: string;

  @IsOptional()
  @IsUUID()
  batchId?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  dateFrom?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  dateTo?: Date;
}
