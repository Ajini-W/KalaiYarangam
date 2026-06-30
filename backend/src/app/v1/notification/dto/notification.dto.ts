import { IsArray, IsBoolean, IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';
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

export class RegisterDeviceDto {
  @ApiProperty({ example: 'fcm-device-token' })
  @IsString()
  @IsNotEmpty()
  token!: string;

  @ApiProperty({ example: 'web', required: false })
  @IsString()
  @IsOptional()
  platform?: string;
}

export class SendNotificationDto {
  @ApiProperty({ example: 'New Announcement' })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({ example: 'Check out the latest updates' })
  @IsString()
  @IsNotEmpty()
  body!: string;

  @ApiProperty({ example: '/staff/dashboard', required: false })
  @IsString()
  @IsOptional()
  link?: string;

  @ApiProperty({ required: false })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  userIds?: string[];
}

export class UpdateNotificationPreferenceDto {
  @ApiProperty({ example: 'IN_APP' })
  @IsString()
  @IsNotEmpty()
  channel!: string;

  @ApiProperty({ example: 'all' })
  @IsString()
  @IsNotEmpty()
  eventType!: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  enabled!: boolean;
}
