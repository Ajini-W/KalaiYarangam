import { IsEnum, IsInt, IsOptional, IsString, IsUUID, MaxLength, Min, MinLength } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateDocumentDto {
  @IsUUID()
  studentId!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(200)
  name!: string;

  @IsString()
  @MaxLength(50)
  type!: string;

  @IsString()
  @MaxLength(500)
  fileUrl!: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  fileSize?: number;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  mimeType?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateDocumentDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  name?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class VerifyDocumentDto {
  @IsEnum(['VERIFIED', 'REJECTED'])
  status!: 'VERIFIED' | 'REJECTED';

  @IsOptional()
  @IsString()
  notes?: string;
}

export class QueryDocumentDto {
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
  @IsString()
  @MaxLength(50)
  type?: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  status?: string;
}
