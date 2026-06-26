import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { UserRole, UserStatus } from '@prisma/client';
import { PrismaService } from '@/database';
import { AuditService } from '@/app/v1/security/audit.service';
import {
  CreatePermissionDto,
  UpdatePermissionDto,
  UpdateRolePermissionsDto,
  AssignUserRoleDto,
  UpdateUserStatusDto,
  UpdateUserRoleDto,
} from './dto/rbac.dto';

@Injectable()
export class RbacService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  // ── Permissions ──────────────────────────────────────────────

  async listPermissions() {
    const permissions = await this.prisma.permission.findMany({ orderBy: [{ module: 'asc' }, { action: 'asc' }] });
    return { message: 'Permissions fetched successfully', data: permissions };
  }

  async createPermission(dto: CreatePermissionDto) {
    const existing = await this.prisma.permission.findUnique({
      where: { module_action: { module: dto.module, action: dto.action } },
    });
    if (existing) throw new ConflictException(`Permission "${dto.module}:${dto.action}" already exists`);

    const permission = await this.prisma.permission.create({ data: dto });
    return { message: 'Permission created successfully', data: permission };
  }

  async updatePermission(id: string, dto: UpdatePermissionDto) {
    const existing = await this.prisma.permission.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Permission not found');

    if (dto.module && dto.action) {
      const dup = await this.prisma.permission.findUnique({
        where: { module_action: { module: dto.module, action: dto.action } },
      });
      if (dup && dup.id !== id) throw new ConflictException('Another permission with this module+action already exists');
    }

    const permission = await this.prisma.permission.update({ where: { id }, data: dto });
    return { message: 'Permission updated successfully', data: permission };
  }

  async deletePermission(id: string) {
    const existing = await this.prisma.permission.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Permission not found');

    await this.prisma.permission.delete({ where: { id } });
    return { message: 'Permission deleted successfully', data: null };
  }

  // ── Role Permissions ─────────────────────────────────────────

  async listRoles() {
    const roles = await this.prisma.rolePermission.findMany({
      include: { permission: true },
      orderBy: { role: 'asc' },
    });

    const grouped: Record<string, { role: string; permissions: { id: string; module: string; action: string; description: string | null }[] }> = {};
    for (const rp of roles) {
      if (!grouped[rp.role]) {
        grouped[rp.role] = { role: rp.role, permissions: [] };
      }
      grouped[rp.role].permissions.push(rp.permission);
    }

    return { message: 'Roles fetched successfully', data: Object.values(grouped) };
  }

  async updateRolePermissions(role: UserRole, dto: UpdateRolePermissionsDto) {
    if (!Object.values(UserRole).includes(role)) {
      throw new BadRequestException(`Invalid role: ${role}`);
    }

    const permissions = await this.prisma.permission.findMany({
      where: { id: { in: dto.permissionIds } },
    });
    if (permissions.length !== dto.permissionIds.length) {
      throw new NotFoundException('One or more permissions not found');
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.rolePermission.deleteMany({ where: { role } });
      if (dto.permissionIds.length > 0) {
        await tx.rolePermission.createMany({
          data: dto.permissionIds.map((permissionId) => ({ role, permissionId })),
        });
      }
    });

    const updated = await this.prisma.rolePermission.findMany({
      where: { role },
      include: { permission: true },
    });

    return {
      message: 'Role permissions updated successfully',
      data: { role, permissions: updated.map((rp) => rp.permission) },
    };
  }

  // ── User Role Assignments ────────────────────────────────────

  async listUserRoles() {
    const mappings = await this.prisma.userRoleMapping.findMany({
      include: {
        user: { select: { id: true, name: true, email: true, role: true } },
      },
      orderBy: { grantedAt: 'desc' },
    });
    return { message: 'User role assignments fetched successfully', data: mappings };
  }

  async assignUserRole(dto: AssignUserRoleDto) {
    const user = await this.prisma.user.findUnique({ where: { id: dto.userId } });
    if (!user) throw new NotFoundException('User not found');

    const existing = await this.prisma.userRoleMapping.findUnique({
      where: { userId_role_tenantId: { userId: dto.userId, role: dto.role, tenantId: user.tenantId ?? '' } },
    });
    if (existing) throw new ConflictException('User already has this role assigned');

    const mapping = await this.prisma.userRoleMapping.create({
      data: {
        userId: dto.userId,
        role: dto.role,
        tenantId: user.tenantId,
      },
      include: {
        user: { select: { id: true, name: true, email: true, role: true } },
      },
    });
    return { message: 'Role assigned successfully', data: mapping };
  }

  async removeUserRole(id: string) {
    const existing = await this.prisma.userRoleMapping.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Role assignment not found');

    await this.prisma.userRoleMapping.delete({ where: { id } });
    return { message: 'Role assignment removed successfully', data: null };
  }

  // ── User Management ──────────────────────────────────────────

  async listUsers(page = 1, pageSize = 10) {
    const skip = (page - 1) * pageSize;
    const raw = await this.prisma.user.findMany({
      skip,
      take: pageSize,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        status: true,
        verifiedAt: true,
        tenantId: true,
        createdAt: true,
        lastLoginAt: true,
      },
    });
    const total = await this.prisma.user.count();
    const users = raw.map((u) => ({ ...u, emailVerified: u.verifiedAt !== null }));

    return {
      message: 'Users fetched successfully',
      data: { data: users, meta: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) } },
    };
  }

  async getUser(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        status: true,
        verifiedAt: true,
        avatarUrl: true,
        tenantId: true,
        createdAt: true,
        updatedAt: true,
        lastLoginAt: true,
      },
    });
    if (!user) throw new NotFoundException('User not found');

    const userRoleMappings = await this.prisma.userRoleMapping.findMany({
      where: { userId: id },
      include: { tenant: { select: { name: true } } },
    });

    const data = { ...user, emailVerified: user.verifiedAt !== null, userRoleMappings };
    return { message: 'User fetched successfully', data };
  }

  async updateUserStatus(id: string, dto: UpdateUserStatusDto) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    const oldStatus = user.status;
    const raw = await this.prisma.user.update({
      where: { id },
      data: { status: dto.status },
      select: { id: true, name: true, email: true, role: true, status: true, verifiedAt: true, updatedAt: true },
    });
    const updated = { ...raw, emailVerified: raw.verifiedAt !== null };

    await this.audit.log({
      userId: id,
      tenantId: user.tenantId ?? undefined,
      action: 'STATUS_CHANGE',
      entity: 'User',
      entityId: id,
      oldValues: { status: oldStatus },
      newValues: { status: dto.status },
    });

    return { message: `User status updated to ${dto.status}`, data: updated };
  }

  async updateUserRole(id: string, dto: UpdateUserRoleDto) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    const oldRole = user.role;
    const raw = await this.prisma.user.update({
      where: { id },
      data: { role: dto.role },
      select: { id: true, name: true, email: true, role: true, status: true, verifiedAt: true, updatedAt: true },
    });
    const data = { ...raw, emailVerified: raw.verifiedAt !== null };

    await this.audit.log({
      userId: id,
      tenantId: user.tenantId ?? undefined,
      action: 'ROLE_CHANGE',
      entity: 'User',
      entityId: id,
      oldValues: { role: oldRole },
      newValues: { role: dto.role },
    });

    return { message: `User role updated to ${dto.role}`, data };
  }

  // ── Tenant Management (Super Admin) ──────────────────────────

  async listTenants(page = 1, pageSize = 10) {
    const skip = (page - 1) * pageSize;
    const [tenants, total] = await Promise.all([
      this.prisma.tenant.findMany({
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: { select: { users: true, branches: true } },
          subscriptions: {
            where: { status: { in: ['TRIAL', 'ACTIVE'] } },
            orderBy: { createdAt: 'desc' },
            take: 1,
            include: { plan: { select: { name: true, slug: true } } },
          },
        },
      }),
      this.prisma.tenant.count(),
    ]);

    const data = tenants.map((t) => ({
      id: t.id,
      name: t.name,
      slug: t.slug,
      industry: t.industry,
      status: t.status,
      logoUrl: t.logoUrl,
      createdAt: t.createdAt,
      userCount: t._count.users,
      branchCount: t._count.branches,
      subscription: t.subscriptions[0] ?? null,
    }));

    return {
      message: 'Tenants fetched successfully',
      data: { data, meta: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) } },
    };
  }

  async getTenant(id: string) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id },
      include: {
        brand: true,
        _count: { select: { users: true, branches: true, accessRequests: true } },
        subscriptions: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          include: {
            plan: { select: { name: true, slug: true, price: true, interval: true, trialDays: true } },
            invoices: { orderBy: { createdAt: 'desc' }, take: 5 },
          },
        },
      },
    });

    if (!tenant) throw new NotFoundException('Tenant not found');

    return {
      message: 'Tenant fetched successfully',
      data: {
        ...tenant,
        userCount: tenant._count.users,
        branchCount: tenant._count.branches,
        accessRequestCount: tenant._count.accessRequests,
        subscription: tenant.subscriptions[0] ?? null,
        brand: tenant.brand,
      },
    };
  }
}
