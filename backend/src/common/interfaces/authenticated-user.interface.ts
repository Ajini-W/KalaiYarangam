import { UserRole } from '@prisma/client';

export interface AuthenticatedUser {
  id: string;
  tenantId: string;
  branchId: string | null;
  email: string;
  name: string;
  role: UserRole;
  emailVerified: boolean;
}
