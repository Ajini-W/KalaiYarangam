import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IndustryType, OnboardingStep, UserRole, UserStatus, AccessRequestStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '@/database';
import { AuthenticatedUser } from '@/common/interfaces';
import { env } from '@/config';
import {
  ApproveAccessDto,
  BranchSetupDto,
  ModuleSelectionDto,
  ProfileSetupDto,
  RejectAccessDto,
  RequestAccessDto,
  SearchTenantDto,
  SelectRoleDto,
  SubscriptionSelectionDto,
  TenantSetupDto,
} from './dto/onboarding.dto';

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function toPayload(user: { id: string; tenantId: string | null; email: string; name: string; role: string }) {
  return { id: user.id, tenantId: user.tenantId ?? '', branchId: null, email: user.email, name: user.name, role: user.role };
}

@Injectable()
export class OnboardingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async getProgress(userId: string) {
    let progress = await this.prisma.onboardingProgress.findUnique({
      where: { userId },
    });

    if (!progress) {
      progress = await this.prisma.onboardingProgress.create({
        data: { userId },
      });
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { status: true, role: true, email: true, name: true },
    });

    return {
      message: 'Onboarding progress retrieved',
      data: {
        progress,
        user,
        isFirstLogin: user?.status === UserStatus.NEW_USER || user?.status === UserStatus.REGISTERED,
      },
    };
  }

  async selectRole(userId: string, dto: SelectRoleDto) {
    if (!Object.values(UserRole).includes(dto.role)) {
      throw new BadRequestException(`Invalid role: ${dto.role}`);
    }

    if (dto.role === UserRole.SUPER_ADMIN) {
      throw new BadRequestException('Cannot select SUPER_ADMIN role');
    }

    const [user, progress] = await Promise.all([
      this.prisma.user.findUnique({ where: { id: userId } }),
      this.prisma.onboardingProgress.findUnique({ where: { userId } }),
    ]);

    if (!user) throw new NotFoundException('User not found');

    // If user already has a role != STAFF (default), don't allow role change
    if (user.role !== UserRole.STAFF && user.role !== dto.role) {
      // Allow but just update progress
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: userId },
        data: { role: dto.role },
      });

      await tx.onboardingProgress.upsert({
        where: { userId },
        update: {
          selectedRole: dto.role,
          currentStep: OnboardingStep.PROFILE_SETUP,
        },
        create: {
          userId,
          selectedRole: dto.role,
          currentStep: OnboardingStep.PROFILE_SETUP,
        },
      });
    });

    return {
      message: 'Role selected successfully',
      data: { role: dto.role, nextStep: OnboardingStep.PROFILE_SETUP },
    };
  }

  async setupProfile(userId: string, dto: ProfileSetupDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { onboarding: true },
    });

    if (!user) throw new NotFoundException('User not found');

    const role = user.role;
    const now = new Date();

    await this.prisma.$transaction(async (tx) => {
      await tx.userProfile.upsert({
        where: { userId },
        update: {
          dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : undefined,
          gender: dto.gender as any,
          addressLine1: dto.address,
          bio: dto.companyName,
        },
        create: {
          userId,
          dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : undefined,
          gender: dto.gender as any,
          addressLine1: dto.address,
          bio: dto.companyName,
        },
      });

      await tx.user.update({
        where: { id: userId },
        data: { name: dto.fullName },
      });

      // Determine next step based on role
      const nextStep = this.getNextStepAfterProfile(role);

      // For CLIENT: complete onboarding immediately
      if (role === UserRole.CLIENT) {
        await tx.onboardingProgress.upsert({
          where: { userId },
          update: { currentStep: OnboardingStep.COMPLETED, isCompleted: true, completedAt: now },
          create: { userId, selectedRole: role, currentStep: OnboardingStep.COMPLETED, isCompleted: true, completedAt: now },
        });

        await tx.user.update({
          where: { id: userId },
          data: { status: UserStatus.ACTIVE },
        });
      } else {
        await tx.onboardingProgress.upsert({
          where: { userId },
          update: { currentStep: nextStep },
          create: { userId, selectedRole: role, currentStep: nextStep },
        });

        if (user.status === UserStatus.NEW_USER || user.status === UserStatus.REGISTERED) {
          await tx.user.update({
            where: { id: userId },
            data: { status: UserStatus.PROFILE_COMPLETED },
          });
        }
      }
    });

    if (role === UserRole.CLIENT) {
      return {
        message: 'Profile setup completed. Onboarding finished.',
        data: { nextStep: OnboardingStep.COMPLETED, completed: true, redirectTo: '/client/dashboard' },
      };
    }

    return {
      message: 'Profile setup completed',
      data: { nextStep: this.getNextStepAfterProfile(role) },
    };
  }

  private getNextStepAfterProfile(role: UserRole): OnboardingStep {
    switch (role) {
      case UserRole.OWNER:
        return OnboardingStep.TENANT_SETUP;
      case UserRole.BRANCH_MANAGER:
        return OnboardingStep.SEARCH_TENANT;
      case UserRole.TRAINER:
      case UserRole.STAFF:
        return OnboardingStep.SEARCH_TENANT;
      case UserRole.STUDENT:
        return OnboardingStep.SEARCH_TENANT;
      case UserRole.CLIENT:
        return OnboardingStep.COMPLETED;
      default:
        return OnboardingStep.PROFILE_SETUP;
    }
  }

  // ── Business Owner Flow ─────────────────────────────────────

  async setupTenant(userId: string, dto: TenantSetupDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { onboarding: true },
    });

    if (!user) throw new NotFoundException('User not found');
    if (user.role !== UserRole.OWNER) {
      throw new BadRequestException('Only Business Owners can setup a tenant');
    }

    const now = new Date();
    const slug = slugify(dto.businessName);
    const existing = await this.prisma.tenant.findUnique({ where: { slug } });
    if (existing) {
      throw new ConflictException('Business name is already registered');
    }

    const result = await this.prisma.$transaction(async (tx) => {
      const tenant = await tx.tenant.create({
        data: {
          name: dto.businessName,
          slug,
          industry: dto.businessType as IndustryType,
          ...(dto.address ? {} : {}),
        },
      });

      if (dto.primaryColor || dto.secondaryColor) {
        await tx.tenantBrand.upsert({
          where: { tenantId: tenant.id },
          update: {
            primaryColor: dto.primaryColor,
            secondaryColor: dto.secondaryColor,
          },
          create: {
            tenantId: tenant.id,
            primaryColor: dto.primaryColor,
            secondaryColor: dto.secondaryColor,
          },
        });
      }

      if (dto.logo) {
        await tx.tenant.update({
          where: { id: tenant.id },
          data: { logoUrl: dto.logo },
        });
      }

      // Link user to tenant
      await tx.user.update({
        where: { id: userId },
        data: { tenantId: tenant.id },
      });

      await tx.userRoleMapping.create({
        data: { userId, role: UserRole.OWNER, tenantId: tenant.id },
      });

      // Create tenant modules
      const modules = [IndustryType.TRAINING, IndustryType.RENTAL, IndustryType.EVENT];
      for (const mod of modules) {
        await tx.tenantModule.create({
          data: {
            tenantId: tenant.id,
            module: mod,
            isEnabled: mod === IndustryType.TRAINING,
          },
        });
      }

      // Update onboarding progress — Owner flow: tenant → dashboard
      await tx.onboardingProgress.update({
        where: { userId },
        data: { currentStep: OnboardingStep.COMPLETED, isCompleted: true, completedAt: now },
      });

      await tx.user.update({
        where: { id: userId },
        data: { status: UserStatus.ACTIVE },
      });

      return tenant;
    });

    const updatedUser = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, tenantId: true, email: true, name: true, role: true },
    });

    const payload = toPayload(updatedUser!);
    const accessToken = this.jwtService.sign(payload);

    return {
      message: 'Tenant created successfully. Onboarding completed.',
      data: {
        tenant: { id: result.id, name: result.name, slug: result.slug },
        token: { accessToken, user: payload },
        redirectTo: '/owner/dashboard',
      },
    };
  }

  async setupBranch(userId: string, dto: BranchSetupDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { onboarding: true },
    });

    if (!user) throw new NotFoundException('User not found');
    if (!user.tenantId) throw new BadRequestException('Tenant not found. Complete tenant setup first.');

    const result = await this.prisma.$transaction(async (tx) => {
      const branch = await tx.branch.create({
        data: {
          tenantId: user.tenantId!,
          name: dto.branchName,
          address: dto.address,
          phone: dto.contactNumber,
          isDefault: true,
        },
      });

      // Link user to branch
      await tx.userBranch.create({
        data: { userId, branchId: branch.id, isPrimary: true },
      });

      // Update onboarding progress
      await tx.onboardingProgress.update({
        where: { userId },
        data: { currentStep: OnboardingStep.MODULE_SELECTION },
      });

      return branch;
    });

    return {
      message: 'Branch created successfully',
      data: { branch: { id: result.id, name: result.name, isDefault: result.isDefault }, nextStep: OnboardingStep.MODULE_SELECTION },
    };
  }

  async selectModules(userId: string, dto: ModuleSelectionDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { onboarding: true },
    });

    if (!user) throw new NotFoundException('User not found');
    if (!user.tenantId) throw new BadRequestException('Tenant not found');

    await this.prisma.$transaction(async (tx) => {
      const modules: { module: IndustryType; isEnabled: boolean }[] = [
        { module: IndustryType.TRAINING, isEnabled: dto.training },
        { module: IndustryType.RENTAL, isEnabled: dto.rental },
        { module: IndustryType.EVENT, isEnabled: dto.event },
      ];

      for (const m of modules) {
        await tx.tenantModule.upsert({
          where: { tenantId_module: { tenantId: user.tenantId!, module: m.module } },
          update: { isEnabled: m.isEnabled, enabledAt: m.isEnabled ? new Date() : null },
          create: { tenantId: user.tenantId!, module: m.module, isEnabled: m.isEnabled, enabledAt: m.isEnabled ? new Date() : null },
        });
      }

      await tx.onboardingProgress.update({
        where: { userId },
        data: { currentStep: OnboardingStep.SUBSCRIPTION },
      });
    });

    return { message: 'Modules selected successfully', data: { nextStep: OnboardingStep.SUBSCRIPTION } };
  }

  async selectSubscription(userId: string, dto: SubscriptionSelectionDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { onboarding: true },
    });

    if (!user) throw new NotFoundException('User not found');
    if (!user.tenantId) throw new BadRequestException('Tenant not found');

    const plan = await this.prisma.plan.findFirst({
      where: { slug: dto.plan, isActive: true },
    });

    if (!plan) throw new NotFoundException('Plan not found');

    const now = new Date();
    const trialEnd = new Date(now);
    trialEnd.setDate(trialEnd.getDate() + (plan.trialDays || 15));

    await this.prisma.$transaction(async (tx) => {
      await tx.subscription.create({
        data: {
          tenantId: user.tenantId!,
          planId: plan.id,
          status: 'TRIAL',
          startDate: now,
          endDate: trialEnd,
          trialEndsAt: trialEnd,
          autoRenew: true,
        },
      });

      await tx.user.update({
        where: { id: userId },
        data: { status: UserStatus.ACTIVE },
      });

      await tx.onboardingProgress.update({
        where: { userId },
        data: { currentStep: OnboardingStep.COMPLETED, isCompleted: true, completedAt: now },
      });
    });

    const updatedUser = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, tenantId: true, email: true, name: true, role: true },
    });

    const payload = toPayload(updatedUser!);
    const accessToken = this.jwtService.sign(payload);

    return {
      message: 'Onboarding completed successfully',
      data: {
        token: { accessToken, user: payload },
        redirectTo: '/owner/dashboard',
      },
    };
  }

  // ── Tenant Search (for Branch Manager, Staff, Student) ──────

  async searchTenants(dto: SearchTenantDto) {
    const where: any = { status: 'ACTIVE' };

    if (dto.name) {
      where.name = { contains: dto.name, mode: 'insensitive' };
    }
    if (dto.businessType) {
      where.industry = dto.businessType as IndustryType;
    }
    if (dto.location) {
      where.OR = [
        { branches: { some: { city: { contains: dto.location, mode: 'insensitive' } } } },
        { branches: { some: { state: { contains: dto.location, mode: 'insensitive' } } } },
      ];
    }

    const tenants = await this.prisma.tenant.findMany({
      where,
      select: {
        id: true,
        name: true,
        slug: true,
        industry: true,
        logoUrl: true,
        branches: {
          select: { id: true, name: true, city: true, state: true },
          where: { isActive: true },
        },
      },
      take: 20,
    });

    return { message: 'Tenants found', data: tenants };
  }

  // ── Request Access (Branch Manager, Staff, Student) ─────────

  async requestAccess(userId: string, dto: RequestAccessDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { onboarding: true },
    });

    if (!user) throw new NotFoundException('User not found');

    const tenant = await this.prisma.tenant.findUnique({ where: { id: dto.tenantId } });
    if (!tenant) throw new NotFoundException('Tenant not found');

    // Check for existing pending request
    const existingRequest = await this.prisma.tenantAccessRequest.findFirst({
      where: { userId, tenantId: dto.tenantId, status: AccessRequestStatus.PENDING },
    });

    if (existingRequest) {
      throw new ConflictException('You already have a pending access request for this tenant');
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.tenantAccessRequest.create({
        data: {
          tenantId: dto.tenantId,
          userId,
          role: user.role,
          status: AccessRequestStatus.PENDING,
          notes: dto.notes,
          preferredBranchId: dto.preferredBranchId,
          skills: dto.skills || [],
          specialization: dto.specialization,
          courseId: dto.courseId,
        },
      });

      await tx.user.update({
        where: { id: userId },
        data: { status: UserStatus.ACCESS_REQUESTED },
      });

      await tx.onboardingProgress.upsert({
        where: { userId },
        update: { currentStep: OnboardingStep.COMPLETED, isCompleted: true },
        create: { userId, selectedRole: user.role, currentStep: OnboardingStep.COMPLETED, isCompleted: true },
      });
    });

    return {
      message: 'Access request submitted. Waiting for approval.',
      data: { status: AccessRequestStatus.PENDING },
    };
  }

  // ── Complete Onboarding for Client ──────────────────────────

  async completeClientOnboarding(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    if (user.role !== UserRole.CLIENT) {
      throw new BadRequestException('This endpoint is for CLIENT role only');
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: userId },
        data: { status: UserStatus.ACTIVE },
      });

      await tx.onboardingProgress.upsert({
        where: { userId },
        update: { currentStep: OnboardingStep.COMPLETED, isCompleted: true, completedAt: new Date() },
        create: { userId, selectedRole: UserRole.CLIENT, currentStep: OnboardingStep.COMPLETED, isCompleted: true, completedAt: new Date() },
      });
    });

    return { message: 'Onboarding completed', data: { redirectTo: '/client/dashboard' } };
  }

  // ── Approval Workflow ───────────────────────────────────────

  async listAccessRequests(user: AuthenticatedUser, statusFilter?: AccessRequestStatus) {
    if (!user.tenantId) {
      throw new BadRequestException('You must belong to a tenant to manage access requests');
    }

    // Only OWNER and BRANCH_MANAGER can view requests
    if (user.role !== UserRole.OWNER && user.role !== UserRole.BRANCH_MANAGER && user.role !== UserRole.SUPER_ADMIN) {
      throw new BadRequestException('You do not have permission to view access requests');
    }

    const where: any = { tenantId: user.tenantId };
    if (statusFilter) {
      where.status = statusFilter;
    }

    const requests = await this.prisma.tenantAccessRequest.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, email: true, phone: true, role: true } },
        tenant: { select: { id: true, name: true } },
        branch: { select: { id: true, name: true } },
        reviewer: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return { message: 'Access requests retrieved', data: requests };
  }

  async approveAccessRequest(user: AuthenticatedUser, dto: ApproveAccessDto) {
    if (!user.tenantId) throw new BadRequestException('No tenant context');

    const request = await this.prisma.tenantAccessRequest.findUnique({
      where: { id: dto.requestId },
      include: { user: true },
    });

    if (!request) throw new NotFoundException('Access request not found');
    if (request.tenantId !== user.tenantId) {
      throw new BadRequestException('This request belongs to a different tenant');
    }
    if (request.status !== AccessRequestStatus.PENDING) {
      throw new BadRequestException(`Request is already ${request.status.toLowerCase()}`);
    }

    const branchId = dto.branchId || request.preferredBranchId;

    await this.prisma.$transaction(async (tx) => {
      // Update request status
      await tx.tenantAccessRequest.update({
        where: { id: dto.requestId },
        data: {
          status: AccessRequestStatus.APPROVED,
          reviewedBy: user.id,
          reviewedAt: new Date(),
          branchId,
        },
      });

      // Assign role and tenant to user
      const role = dto.role || request.role;
      await tx.user.update({
        where: { id: request.userId },
        data: {
          tenantId: user.tenantId,
          role,
          status: UserStatus.APPROVED,
        },
      });

      // Create user-role mapping
      await tx.userRoleMapping.upsert({
        where: { userId_role_tenantId: { userId: request.userId, role, tenantId: user.tenantId! } },
        update: {},
        create: { userId: request.userId, role, tenantId: user.tenantId! },
      });

      // Link to branch if provided
      if (branchId) {
        await tx.userBranch.upsert({
          where: { userId_branchId: { userId: request.userId, branchId } },
          update: { isPrimary: true },
          create: { userId: request.userId, branchId, isPrimary: true },
        });

        // For staff/trainers, also add staff_branch_mapping
        if (role === UserRole.TRAINER || role === UserRole.STAFF) {
          await tx.staffBranchMapping.upsert({
            where: { userId_branchId: { userId: request.userId, branchId } },
            update: { isPrimary: true, tenantId: user.tenantId },
            create: { userId: request.userId, branchId, isPrimary: true, tenantId: user.tenantId },
          });
        }
      }

      // Update onboarding progress
      await tx.onboardingProgress.upsert({
        where: { userId: request.userId },
        update: { isCompleted: true, completedAt: new Date(), currentStep: OnboardingStep.COMPLETED },
        create: { userId: request.userId, selectedRole: role, isCompleted: true, completedAt: new Date(), currentStep: OnboardingStep.COMPLETED },
      });
    });

    return { message: 'Access request approved', data: { status: AccessRequestStatus.APPROVED } };
  }

  async rejectAccessRequest(user: AuthenticatedUser, dto: RejectAccessDto) {
    if (!user.tenantId) throw new BadRequestException('No tenant context');

    const request = await this.prisma.tenantAccessRequest.findUnique({
      where: { id: dto.requestId },
    });

    if (!request) throw new NotFoundException('Access request not found');
    if (request.tenantId !== user.tenantId) {
      throw new BadRequestException('This request belongs to a different tenant');
    }
    if (request.status !== AccessRequestStatus.PENDING) {
      throw new BadRequestException(`Request is already ${request.status.toLowerCase()}`);
    }

    await this.prisma.tenantAccessRequest.update({
      where: { id: dto.requestId },
      data: {
        status: AccessRequestStatus.REJECTED,
        reviewedBy: user.id,
        reviewedAt: new Date(),
        rejectionReason: dto.reason,
      },
    });

    return { message: 'Access request rejected', data: { status: AccessRequestStatus.REJECTED } };
  }

  async blockUser(user: AuthenticatedUser, userId: string) {
    if (!user.tenantId) throw new BadRequestException('No tenant context');

    const target = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!target) throw new NotFoundException('User not found');
    if (target.tenantId !== user.tenantId) {
      throw new BadRequestException('Cannot block user from a different tenant');
    }

    await this.prisma.tenantAccessRequest.updateMany({
      where: { userId, tenantId: user.tenantId },
      data: { status: AccessRequestStatus.BLOCKED },
    });

    await this.prisma.user.update({
      where: { id: userId },
      data: { status: UserStatus.SUSPENDED },
    });

    return { message: 'User blocked successfully' };
  }
}
