"use client";

import { Suspense, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
import { authService } from "@/services/auth.service";

function CallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setUser = useAuthStore((s) => s.setUser);
  const called = useRef(false);

  useEffect(() => {
    if (called.current) return;
    called.current = true;

    const accessToken = searchParams.get("accessToken");
    const refreshToken = searchParams.get("refreshToken");

    if (!accessToken) {
      router.replace("/login?error=no_token");
      return;
    }

    localStorage.setItem("accessToken", accessToken);
    if (refreshToken) {
      localStorage.setItem("refreshToken", refreshToken);
    }

    authService
      .me()
      .then((user) => {
        setUser(user);
        router.replace("/dashboard");
      })
      .catch(() => {
        router.replace("/login?error=session_expired");
      });
  }, [searchParams, router, setUser]);

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
