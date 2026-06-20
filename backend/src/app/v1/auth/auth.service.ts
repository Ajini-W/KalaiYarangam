import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { IndustryType, UserRole, UserStatus } from '@prisma/client';
import { PrismaService } from '@/database';
import { env } from '@/config';
import { MailService } from '@/app/v1/mail/mail.service';
import { AuthenticatedUser } from '@/common/interfaces';
import { LoginDto, RegisterDto, UpdateUserStatusDto, VerifyEmailDto } from './dto/auth.dto';

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
    const verificationToken = randomBytes(32).toString('hex');

    const tenant = await this.prisma.tenant.create({
      data: {
        name: dto.businessName,
        slug,
        industry: dto.industry as IndustryType,
        branches: {
          create: { name: 'Main Branch', isDefault: true },
        },
        users: {
          create: {
            email: dto.email,
            passwordHash,
            name: dto.name,
            phone: dto.phone,
            role: 'OWNER',
            status: UserStatus.PENDING,
            verificationToken,
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
      throw new BadRequestException('Invalid or expired verification token');
    }

    if (user.status === UserStatus.ACTIVE) {
      throw new BadRequestException('Email is already verified');
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        status: UserStatus.ACTIVE,
        verificationToken: null,
        verifiedAt: new Date(),
      },
    });

    return { message: 'Email verified successfully. You can now log in.' };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.status === UserStatus.INACTIVE) {
      throw new UnauthorizedException('Your account has been deactivated. Please contact your administrator.');
    }

    if (user.status === UserStatus.SUSPENDED) {
      throw new UnauthorizedException('Your account has been suspended. Please contact your administrator.');
    }

    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const response = this.buildAuthResponse(user);
    return {
      message: 'Login successful',
      data: {
        ...response,
        emailVerified: user.status === UserStatus.ACTIVE,
      },
    };
  }

  async updateUserStatus(dto: UpdateUserStatusDto) {
    let adminUser: AuthenticatedUser;
    try {
      adminUser = this.jwtService.verify(dto.accessToken);
    } catch {
      throw new UnauthorizedException('Invalid or expired accessToken');
    }

    if (adminUser.role !== UserRole.OWNER && adminUser.role !== UserRole.SUPER_ADMIN) {
      throw new ForbiddenException('Forbidden resource');
    }

    const targetId = dto.userId || adminUser.id;

    const target = await this.prisma.user.findUnique({
      where: { id: targetId },
    });

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

  private buildAuthResponse(user: {
    id: string;
    tenantId: string | null;
    email: string;
    name: string;
    role: AuthenticatedUser['role'];
  }) {
    const payload: AuthenticatedUser = {
      id: user.id,
      tenantId: user.tenantId ?? '',
      branchId: null,
      email: user.email,
      name: user.name,
      role: user.role,
    };

    return {
      user: payload,
      accessToken: this.jwtService.sign(payload),
    };
  }
}
