"use client";

import * as React from "react";
import { useRouter, usePathname } from "next/navigation";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { MobileNav } from "./MobileNav";
import { ProfileDialog } from "@/components/shared/ProfileDialog";
import { cn } from "@/lib/cn";
import { useAuthStore } from "@/store/auth.store";

interface AppShellProps { children: React.ReactNode; className?: string }

export function AppShell({ children, className }: AppShellProps) {
  const router = useRouter();
  const pathname = usePathname();
  const initialize = useAuthStore((s) => s.initialize);
  const user = useAuthStore((s) => s.user);
  const isLoading = useAuthStore((s) => s.isLoading);
  const [collapsed, setCollapsed] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const redirectedRef = React.useRef(false);

  React.useEffect(() => {
    initialize();
  }, [initialize]);

  React.useEffect(() => {
    if (isLoading || redirectedRef.current) return;
    if (!user) return;

    // Users who have submitted an access request are waiting for approval — don't redirect back to onboarding
    const noRedirectStatuses = ["ACCESS_REQUESTED", "PENDING_APPROVAL", "APPROVED", "ACTIVE"];
    const needsOnboarding = !user.tenantId
      && user.role !== "CLIENT"
      && user.role !== "SUPER_ADMIN"
      && !noRedirectStatuses.includes(user.status);
    if (needsOnboarding && !pathname.startsWith("/onboarding")) {
      redirectedRef.current = true;
      router.replace("/onboarding");
    }
  }, [user, isLoading, pathname, router]);

  const toggleMenu = () => {
    if (window.innerWidth < 768) {
      setMobileOpen((o) => !o);
    } else {
      setCollapsed((c) => !c);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-surface-raised">
      {/* Desktop sidebar */}
      <div className="hidden md:flex shrink-0">
        <Sidebar collapsed={collapsed} />
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/40 md:hidden"
            onClick={() => setMobileOpen(false)}
            aria-hidden
          />
          <div className="fixed inset-y-0 left-0 z-50 flex md:hidden">
            <Sidebar collapsed={false} onClose={() => setMobileOpen(false)} />
          </div>
        </>
      )}

      {/* Main area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar onMenuToggle={toggleMenu} />
        <main
          id="main-content"
          className={cn("flex-1 overflow-y-auto pb-16 md:pb-0", className)}
        >
          {children}
        </main>
      </div>

      {/* Bottom nav — mobile only */}
      <MobileNav />

      {/* Profile dialog */}
      <ProfileDialog />
    </div>
  );
}
