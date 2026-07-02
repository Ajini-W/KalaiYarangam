import { IsArray, IsDate, IsEnum, IsInt, IsOptional, IsString, IsUUID, MaxLength, Min, MinLength, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { AttendanceStatus, Gender, TaskType } from '@prisma/client';

// ── Student Import ──────────────────────────────────────────
export class BulkStudentItemDto {
  @IsString()
  @MinLength(2)
  name!: string;

  @IsString()
  @MinLength(10)
  phone!: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  parentName?: string;

  @IsOptional()
  @IsString()
  parentPhone?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  state?: string;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  pincode?: string;

  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @IsOptional()
  @IsString()
  medicalNotes?: string;
}

export class BulkStudentImportDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BulkStudentItemDto)
  students!: BulkStudentItemDto[];

  @IsOptional()
  @IsUUID()
  batchId?: string;
}

// ── Student Export ──────────────────────────────────────────
export class BulkStudentExportDto {
  @IsOptional()
  @IsUUID()
  batchId?: string;

  @IsOptional()
  @IsString()
  status?: string;
}

// ── Attendance ──────────────────────────────────────────────
export class BulkAttendanceRecordDto {
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

export class BulkAttendanceDto {
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
  @Type(() => BulkAttendanceRecordDto)
  records!: BulkAttendanceRecordDto[];
}

// ── Tasks ───────────────────────────────────────────────────
export class BulkTaskItemDto {
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  title!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(TaskType)
  type!: TaskType;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  dueDate?: Date;

  @IsOptional()
  @IsInt()
  @Min(1)
  maxScore?: number;

  @IsOptional()
  @IsString()
  allowLateSubmission?: boolean;
}

export class BulkTaskDto {
  @IsUUID()
  batchId!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BulkTaskItemDto)
  tasks!: BulkTaskItemDto[];
}

// ── Certificates ────────────────────────────────────────────
export class BulkCertificateDto {
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

// ── Jobs ────────────────────────────────────────────────────
export class QueryBulkJobDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  pageSize?: number = 20;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsString()
  status?: string;
}
