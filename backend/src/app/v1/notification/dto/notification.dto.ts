import { IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendPushDto {
  @ApiProperty({ example: 'fcm-device-token' })
  @IsString()
  @IsNotEmpty()
  token!: string;

  @ApiProperty({ example: 'Hello!' })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({ example: 'You have a new message' })
  @IsString()
  @IsNotEmpty()
  body!: string;

  @ApiProperty({ example: { type: 'order_update', orderId: '123' }, required: false })
  @IsObject()
  @IsOptional()
  data?: Record<string, string>;
}
