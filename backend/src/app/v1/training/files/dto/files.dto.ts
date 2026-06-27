import { IsInt, IsOptional, IsString, Min, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateFileDto {
  @IsString()
  originalName: string;

  @IsOptional()
  @IsString()
  mimeType?: string;

  @IsOptional()
  @IsNumber()
  size?: number;

  @IsOptional()
  @IsString()
  category?: string;
}

export class QueryFileDto {
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
  category?: string;
}
