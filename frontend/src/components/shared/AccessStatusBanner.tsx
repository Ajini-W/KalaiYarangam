"use client";

import * as React from "react";
import { Clock, XCircle, Search, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useAuthStore } from "@/store/auth.store";
import { useRouter } from "next/navigation";

export function AccessStatusBanner() {
  const user = useAuthStore((s) => s.user);
  const router = useRouter();

  if (!user) return null;

  if (user.status === "ACCESS_REQUESTED") {
    return (
      <div className="mb-6 rounded-[var(--radius-md)] border border-warning/30 bg-warning-light p-4">
        <div className="flex items-start gap-3">
          <Clock size={20} className="text-warning mt-0.5 shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-warning-700">Access Request Pending</p>
            <p className="text-sm text-text-secondary mt-1">
              Your access request is awaiting approval from the organization owner or branch manager.
              You&apos;ll receive a notification once your request is reviewed.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

export function RejectedAccessBanner({ onSearchTenant }: { onSearchTenant?: () => void }) {
  const user = useAuthStore((s) => s.user);
  const router = useRouter();

  if (!user) return null;

  if (user.status === "PROFILE_COMPLETED" && (user.role === "STAFF" || user.role === "TRAINER" || user.role === "STUDENT")) {
    return (
      <div className="mb-6 rounded-[var(--radius-md)] border border-danger/30 bg-danger-light p-4">
        <div className="flex items-start gap-3">
          <XCircle size={20} className="text-danger mt-0.5 shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-danger-700">Access Request Not Approved</p>
            <p className="text-sm text-text-secondary mt-1">
              Your previous access request was not approved. You can search for another organization to request access to.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/onboarding/tenant-search")}
            leftIcon={<Search size={14} />}
          >
            Find Organization
          </Button>
        </div>
      </div>
    );
  }

  return null;
}
