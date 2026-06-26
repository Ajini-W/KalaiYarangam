const roleRoutes: Record<string, string> = {
  SUPER_ADMIN: "/super-admin/dashboard",
  OWNER: "/owner/dashboard",
  BRANCH_MANAGER: "/branch-manager/dashboard",
  TRAINER: "/staff/dashboard",
  STAFF: "/staff/dashboard",
  STUDENT: "/student/dashboard",
  CLIENT: "/client/dashboard",
};

export function getDashboardRoute(role: string): string {
  return roleRoutes[role] || "/login";
}
