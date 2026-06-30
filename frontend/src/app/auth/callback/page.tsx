"use client";

import { Suspense, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
import { getDashboardRoute } from "@/lib/dashboard-route";

function CallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const handleOAuthCallback = useAuthStore((s) => s.handleOAuthCallback);
  const called = useRef(false);

  useEffect(() => {
    if (called.current) return;
    called.current = true;

    const accessToken = searchParams.get("accessToken");
    const refreshToken = searchParams.get("refreshToken");

    if (!accessToken) {
      window.location.replace("/login?error=no_token");
      return;
    }

    // Safety timeout — redirect to login if callback takes > 15s
    const timeout = setTimeout(() => {
      window.location.replace("/login?error=session_expired");
    }, 15000);

    handleOAuthCallback(accessToken, refreshToken ?? undefined)
      .then((user) => {
        clearTimeout(timeout);
        const noRedirectStatuses = ["ACCESS_REQUESTED", "PENDING_APPROVAL", "APPROVED", "ACTIVE"];
        const needsOnboarding = !user.tenantId
          && user.role !== "CLIENT"
          && !noRedirectStatuses.includes(user.status);
        const dest = needsOnboarding ? "/onboarding" : getDashboardRoute(user.role);
        window.location.replace(dest);
      })
      .catch(() => {
        clearTimeout(timeout);
        window.location.replace("/login?error=session_expired");
      });
  }, [searchParams, handleOAuthCallback]);

  return (
    <div className="flex flex-col items-center gap-4">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="text-sm font-medium text-text-secondary">Completing sign in…</p>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
      <Suspense
        fallback={
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm font-medium text-text-secondary">Completing sign in…</p>
          </div>
        }
      >
        <CallbackHandler />
      </Suspense>
    </div>
  );
}
