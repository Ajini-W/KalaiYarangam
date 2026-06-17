import { IsEmail, IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendMailDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  @IsNotEmpty()
  to!: string;

  @ApiProperty({ example: 'welcome' })
  @IsString()
  @IsNotEmpty()
  template!: string;

  @ApiProperty({ example: { name: 'John', email: 'john@example.com' } })
  @IsObject()
  @IsOptional()
  variables?: Record<string, unknown>;
}
