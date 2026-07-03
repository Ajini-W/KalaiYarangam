import { IsBoolean, IsEmail, IsInt, IsOptional, IsString, IsUUID, Min, MinLength } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTrainerDto {
  @IsString()
  @MinLength(2)
  name!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(10)
  phone!: string;

  @IsString()
  @MinLength(6)
  password!: string;

  @IsOptional()
  @IsString()
  specialties?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateTrainerDto {
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
  specialties?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateTrainerStatusDto {
  @IsBoolean()
  isActive!: boolean;
}

export class QueryTrainerDto {
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
  @IsString()
  status?: string;

  @IsOptional()
  @IsUUID()
  branchId?: string;
}
