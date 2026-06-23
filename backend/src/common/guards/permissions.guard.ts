import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '@/common/decorators/permissions.decorator';
import { PrismaService } from '@/database';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    if (!user) return false;

    const roles = [user.role];

    const extraRoles = await this.prisma.userRoleMapping.findMany({
      where: { userId: user.id },
      select: { role: true },
    });
    roles.push(...extraRoles.map((r) => r.role));

    const uniqueRoles = [...new Set(roles)];

    const rolePermissions = await this.prisma.rolePermission.findMany({
      where: { role: { in: uniqueRoles } },
      include: { permission: true },
    });

    const userPermissionKeys = rolePermissions.map(
      (rp) => `${rp.permission.module}:${rp.permission.action}`,
    );

    return requiredPermissions.every((p) => userPermissionKeys.includes(p));
  }
}
