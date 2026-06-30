"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { useProfileModal } from "@/store/profile.store";
import { getDashboardRoute } from "@/lib/dashboard-route";

export default function ProfilePage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    useProfileModal.getState().setOpen(true);
    router.replace(getDashboardRoute(user?.role ?? ""));
  }, [router, user]);

  return null;
}
