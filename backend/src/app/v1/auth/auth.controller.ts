import { Body, Controller, Get, HttpCode, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { Throttle } from '@nestjs/throttler';
import { CurrentUser, Public } from '@/common/decorators';
import { AuthThrottlerGuard, GoogleOAuthGuard } from '@/common/guards';
import { AuthenticatedUser } from '@/common/interfaces';
import { AuthService } from './auth.service';
import {
  AuthErrorLogDto,
  ChangePasswordDto,
  ForgotPasswordDto,
  LoginDto,
  RegisterDto,
  RefreshTokenDto,
  ResetPasswordDto,
  SendVerificationTokenDto,
  UpdateUserStatusDto,
  VerifyEmailDto,
} from './dto/auth.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  @UseGuards(AuthThrottlerGuard)
  @Throttle({ default: { limit: 3, ttl: 3600000 } })
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Public()
  @Post('verify-email')
  @HttpCode(200)
  verifyEmail(@Body() dto: VerifyEmailDto) {
    return this.authService.verifyEmail(dto);
  }

  @Public()
  @Post('send-verification-token')
  @HttpCode(200)
  sendVerificationToken(@Body() dto: SendVerificationTokenDto) {
    return this.authService.sendVerificationToken(dto);
  }

  @Public()
  @Post('forgot-password')
  @HttpCode(200)
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto);
  }

  @Public()
  @Post('reset-password')
  @HttpCode(200)
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }

  @Post('change-password')
  @HttpCode(200)
  changePassword(@Body() dto: ChangePasswordDto, @CurrentUser() user: AuthenticatedUser) {
    return this.authService.changePassword(dto, user.id);
  }

  @Public()
  @Post('login')
  @UseGuards(AuthThrottlerGuard)
  @Throttle({ default: { limit: 15, ttl: 3600000 } })
  login(@Body() dto: LoginDto, @Req() req: Request) {
    const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0] ?? req.ip;
    return this.authService.login(dto, ip, req.headers['user-agent']);
  }

  @Public()
  @Post('refresh')
  @UseGuards(AuthThrottlerGuard)
  @Throttle({ default: { limit: 10, ttl: 3600000 } })
  refresh(@Body() dto: RefreshTokenDto) {
    return this.authService.refresh(dto);
  }

  @Public()
  @Post('logout')
  logout(@Body() dto: RefreshTokenDto) {
    return this.authService.logout(dto.refreshToken);
  }

  @Public()
  @Get('google')
  @UseGuards(GoogleOAuthGuard)
  @ApiOperation({ summary: 'Initiate Google OAuth login' })
  async googleAuth(@Req() req: Request) {
    // Initiates the Google OAuth flow
  }

  @Public()
  @Get('google/callback')
  @UseGuards(GoogleOAuthGuard)
  @ApiOperation({ summary: 'Google OAuth callback' })
  async googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
    const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0] ?? req.ip;
    const result = await this.authService.googleLogin(req as any, ip, req.headers['user-agent']);

    const { accessToken, refreshToken } = result.data;
    const frontendUrl = process.env.APP_URL;
    res.redirect(
      `${frontendUrl}/auth/callback?accessToken=${accessToken}&refreshToken=${refreshToken}`,
    );
  }

  @Get('me')
  me(@CurrentUser() user: AuthenticatedUser) {
    return this.authService.me(user);
  }

  @Public()
  @Post('user-status')
  updateUserStatus(@Body() dto: UpdateUserStatusDto) {
    return this.authService.updateUserStatus(dto);
  }

  @Public()
  @Post('error-log')
  logAuthError(@Body() dto: AuthErrorLogDto) {
    return this.authService.logAuthError(
      dto.errorCode,
      dto.errorMessage,
      dto.provider,
      dto.userId,
      dto.metadata,
    );
  }
}

