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
import { IndustryType, UserRole, UserStatus } from '@prisma/client';
import { PrismaService } from '@/database';
import { env } from '@/config';
import { MailService } from '@/app/v1/mail/mail.service';
import { AuthenticatedUser } from '@/common/interfaces';
import {
  LoginDto,
  RegisterDto,
  RefreshTokenDto,
  UpdateUserStatusDto,
  VerifyEmailDto,
} from './dto/auth.dto';

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  async register(dto: RegisterDto) {
    const [existingEmail, existingPhone, existingBusiness] = await Promise.all([
      this.prisma.user.findUnique({ where: { email: dto.email } }),
      dto.phone ? this.prisma.user.findUnique({ where: { phone: dto.phone } }) : null,
      this.prisma.tenant.findUnique({ where: { name: dto.businessName } }),
    ]);

    if (existingEmail) {
      throw new ConflictException('A user with this email already exists');
    }

    if (existingPhone) {
      throw new ConflictException('A user with this phone number already exists');
    }

    if (existingBusiness) {
      throw new ConflictException('A business with this name already exists');
    }

    const slug = slugify(dto.businessName);
    const passwordHash = await bcrypt.hash(dto.password, 10);

    // Fields must match prisma User model
    const verificationToken = randomBytes(32).toString('hex');
    const verificationTokenExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const tenant = await this.prisma.tenant.create({
      data: {
        name: dto.businessName,
        slug,
        industry: dto.industry as IndustryType,
        users: {
          create: {
            email: dto.email,
            passwordHash,
            name: dto.name,
            phone: dto.phone,
            role: UserRole.OWNER,
            status: UserStatus.PENDING,
            verificationToken,
            verificationTokenExpiresAt,
          },
        },
      },
      include: { users: true },
    });

    const user = (tenant as any).users[0];

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
      data: this.buildAuthResponse(user),
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

  async login(dto: LoginDto, ipAddress?: string, userAgent?: string) {
    const user = await this.prisma.user.findFirst({
      where: { email: dto.email, status: UserStatus.ACTIVE },
    });

    if (!user) {
      throw new UnauthorizedException('User not found. Please check your email or register.');
    }

    const valid = await bcrypt.compare(dto.password, user.passwordHash);

    if (!user || !valid) {
      await this.prisma.userLoginLog.create({
        data: { userId: user.id, ipAddress, userAgent, success: false },
      });
      throw new UnauthorizedException('Invalid password');
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const tokens = await this.generateTokens(user);

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
        ...this.toPayload(user),
        ...tokens,
        emailVerified: user.status === UserStatus.ACTIVE,
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
    emailVerifiedAt?: Date | null;
  }) {
    const payload = this.toPayload(user);

    const accessToken = this.jwtService.sign(payload);

    const refreshToken = this.jwtService.sign(
      { sub: user.id },
      { secret: env.JWT_REFRESH_SECRET, expiresIn: env.JWT_REFRESH_EXPIRES_IN as any },
    );

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

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
  }) {
    return {
      id: user.id,
      tenantId: user.tenantId ?? '',
      branchId: null,
      email: user.email,
      name: user.name,
      role: user.role,
    };
  }

  private buildAuthResponse(user: {
    id: string;
    tenantId: string | null;
    email: string;
    name: string;
    role: AuthenticatedUser['role'];
  }) {
    const payload = this.toPayload(user);
    return {
      user: payload,
      accessToken: this.jwtService.sign(payload),
    };
  }
}

