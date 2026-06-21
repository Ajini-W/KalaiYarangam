import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
  GoneException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { UserRole, UserStatus } from '@prisma/client';
import { PrismaService } from '@/database';
import { env } from '@/config';
import { MailService } from '@/app/v1/mail/mail.service';
import { AuthenticatedUser } from '@/common/interfaces';
import {
  LoginDto,
  RegisterDto,
  RefreshTokenDto,
  SendVerificationTokenDto,
  UpdateUserStatusDto,
  VerifyEmailDto,
} from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  async register(dto: RegisterDto) {
    const [existingEmailUser, existingPhoneUser] = await Promise.all([
      this.prisma.user.findUnique({ where: { email: dto.email } }),
      dto.phone
        ? this.prisma.user.findUnique({ where: { phone: dto.phone } })
        : null,
    ]);

    if (existingEmailUser) {
      throw new ConflictException('A user with this email already exists');
    }

    if (existingPhoneUser) {
      throw new ConflictException('A user with this phone number already exists');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const verificationToken = randomBytes(32).toString('hex');
    const verificationTokenExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        passwordHash,
        name: dto.name,
        phone: dto.phone,
        role: UserRole.STAFF,
        status: UserStatus.PENDING,
        verificationToken,
        verificationTokenExpiresAt,
      },
    });

    try {
      await this.mailService.send({
        to: dto.email,
        template: 'verify-email',
        variables: {
          name: dto.name,
          email: dto.email,
          verificationLink: `${env.APP_URL}/verify-email?token=${verificationToken}`,
        },
      });
    } catch {
      // Email failure should not block registration
    }

    return {
      message: 'Registration successful. Please check your email to verify your account.',
      data: await this.buildAuthResponse(user),
    };
  }

  async verifyEmail(dto: VerifyEmailDto) {
    const user = await this.prisma.user.findUnique({
      where: { verificationToken: dto.token },
    });

    if (!user) {
      throw new BadRequestException('Invalid verification token');
    }

    if (user.status === UserStatus.ACTIVE) {
      throw new BadRequestException('Email is already verified');
    }

    if (
      user.verificationTokenExpiresAt &&
      user.verificationTokenExpiresAt < new Date()
    ) {
      throw new GoneException('Verification token expired');
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        status: UserStatus.ACTIVE,
        verificationToken: null,
        verificationTokenExpiresAt: null,
        verifiedAt: new Date(),
      },
    });

    return { message: 'Email verified successfully', data: { emailVerified: true } };
  }

  async sendVerificationToken(dto: SendVerificationTokenDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new NotFoundException('User not found with this email');
    }

    if (user.status === UserStatus.ACTIVE) {
      throw new BadRequestException('Email is already verified');
    }

    const verificationToken = randomBytes(32).toString('hex');
    const verificationTokenExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await this.prisma.user.update({
      where: { id: user.id },
      data: { verificationToken, verificationTokenExpiresAt },
    });

    try {
      await this.mailService.send({
        to: dto.email,
        template: 'verify-email',
        variables: {
          name: user.name,
          email: dto.email,
          verificationLink: `${env.APP_URL}/verify-email?token=${verificationToken}`,
        },
      });
    } catch {
      // Email failure should not block the response
    }

    return { message: 'Verification email sent. Please check your inbox.' };
  }

  async login(dto: LoginDto, ipAddress?: string, userAgent?: string) {
    const user = await this.prisma.user.findFirst({
      where:
        dto.type === 'phone' && dto.phone
          ? { phone: dto.phone }
          : { email: dto.email },
    });

    if (!user) {
      const field = dto.type === 'phone' ? 'phone number' : 'email';
      throw new UnauthorizedException(`User not found with this ${field}. Please check or register.`);
    }

    if (user.status === UserStatus.INACTIVE || user.status === UserStatus.SUSPENDED) {
      throw new UnauthorizedException('Account is inactive or suspended. Please contact support.');
    }

    const valid = await bcrypt.compare(dto.password, user.passwordHash);

    if (!valid) {
      await this.prisma.userLoginLog.create({
        data: { userId: user.id, ipAddress, userAgent, success: false },
      });
      throw new UnauthorizedException('Invalid password');
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const tokens = await this.generateTokens(user, dto.rememberMe);

    await this.prisma.userLoginLog.create({
      data: {
        userId: user.id,
        ipAddress,
        userAgent,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        success: true,
      },
    });

    return {
      message: 'Login successful',
      data: {
        user: this.toPayload(user),
        ...tokens,
        rememberMe: dto.rememberMe ?? false,
      },
    };
  }

  async logout(refreshToken: string) {
    const storedToken = await this.prisma.refreshToken.findUnique({
      where: { token: refreshToken },
    });

    if (!storedToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (storedToken.revokedAt) {
      throw new UnauthorizedException('Token is already revoked');
    }

    await this.prisma.refreshToken.update({
      where: { id: storedToken.id },
      data: { revokedAt: new Date() },
    });

    return { message: 'Logged out successfully' };
  }

  async refresh(dto: RefreshTokenDto) {
    const stored = await this.prisma.refreshToken.findUnique({
      where: { token: dto.refreshToken },
      include: { user: true },
    });

    if (!stored || stored.revokedAt || stored.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    if (stored.user.status !== UserStatus.ACTIVE) {
      throw new UnauthorizedException('Account is inactive');
    }

    await this.prisma.refreshToken.update({
      where: { id: stored.id },
      data: { revokedAt: new Date() },
    });

    const tokens = await this.generateTokens(stored.user);

    return {
      message: 'Token refreshed',
      data: { user: this.toPayload(stored.user), ...tokens },
    };
  }

  async updateUserStatus(dto: UpdateUserStatusDto) {
    let adminUser: AuthenticatedUser;
    try {
      adminUser = this.jwtService.verify(dto.accessToken);
    } catch {
      throw new UnauthorizedException('Invalid or expired accessToken');
    }

    if (
      adminUser.role !== UserRole.OWNER &&
      adminUser.role !== UserRole.SUPER_ADMIN
    ) {
      throw new ForbiddenException('Forbidden resource');
    }

    const targetId = dto.userId || adminUser.id;
    const target = await this.prisma.user.findUnique({ where: { id: targetId } });

    if (!target) {
      throw new NotFoundException('User not found');
    }

    if (adminUser.role !== UserRole.SUPER_ADMIN && target.tenantId !== adminUser.tenantId) {
      throw new ForbiddenException('You can only manage users in your own tenant');
    }

    const status = dto.status as UserStatus;

    const updated = await this.prisma.user.update({
      where: { id: targetId },
      data: { status },
      select: { id: true, email: true, name: true, role: true, status: true },
    });

    return { message: `User status updated to ${status}`, data: updated };
  }

  me(user: AuthenticatedUser) {
    return { message: 'User profile retrieved', data: user };
  }

  private async generateTokens(user: {
    id: string;
    tenantId: string | null;
    email: string;
    name: string;
    role: AuthenticatedUser['role'];
    status?: string;
  }, rememberMe?: boolean) {
    const payload = this.toPayload(user);

    const accessToken = this.jwtService.sign(payload);

    const refreshExpiresIn = rememberMe ? '30d' : env.JWT_REFRESH_EXPIRES_IN;
    const refreshToken = this.jwtService.sign(
      { sub: user.id },
      { secret: env.JWT_REFRESH_SECRET, expiresIn: refreshExpiresIn as any },
    );

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + (rememberMe ? 30 : 7));

    await this.prisma.refreshToken.create({
      data: { userId: user.id, token: refreshToken, expiresAt },
    });

    return { accessToken, refreshToken };
  }

  async googleLogin(req: any, ipAddress?: string, userAgent?: string) {
    if (!req.user) {
      throw new UnauthorizedException('No user from google');
    }

    const googleUser = req.user;

    // Check if user exists
    let user = await this.prisma.user.findFirst({
      where: { email: googleUser.email },
    });

    if (!user) {
      // Create user if not exists (Without a tenant by default)
      user = await this.prisma.user.create({
        data: {
          email: googleUser.email,
          passwordHash: await bcrypt.hash(Math.random().toString(36).slice(-8), 10), // Random password
          name: googleUser.firstName ? `${googleUser.firstName} ${googleUser.lastName || ''}`.trim() : googleUser.email,
          role: 'STAFF', // Defaulting to staff or could be specific role
          status: 'ACTIVE',
        },
      });
    } else if (user.status !== UserStatus.ACTIVE) {
      throw new UnauthorizedException('Account is inactive');
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const tokens = await this.generateTokens({
      ...user,
      role: user.role as AuthenticatedUser['role']
    });

    await this.prisma.userLoginLog.create({
      data: {
        userId: user.id,
        ipAddress,
        userAgent,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        success: true,
      },
    });

    return { message: 'Google login successful', data: { user: this.toPayload(user as any), ...tokens } };
  }

  private toPayload(user: {
    id: string;
    tenantId: string | null;
    email: string;
    name: string;
    role: AuthenticatedUser['role'];
    status?: string;
  }) {
    return {
      id: user.id,
      tenantId: user.tenantId ?? '',
      branchId: null,
      email: user.email,
      name: user.name,
      role: user.role,
      emailVerified: user.status === 'ACTIVE',
    };
  }

  private async buildAuthResponse(user: {
    id: string;
    tenantId: string | null;
    email: string;
    name: string;
    role: AuthenticatedUser['role'];
    status: string;
  }) {
    const tokens = await this.generateTokens(user);
    return {
      user: this.toPayload(user),
      ...tokens,
    };
  }
}

