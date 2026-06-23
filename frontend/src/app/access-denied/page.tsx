"use client";

import { ShieldAlert } from "lucide-react";
import Link from "next/link";

export default function AccessDenied() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center bg-surface">
      <ShieldAlert size={64} className="text-danger" />
      <span className="text-6xl font-bold text-border">403</span>
      <div>
        <h1 className="text-xl font-semibold text-text-primary">Access Denied</h1>
        <p className="text-text-secondary mt-1 text-sm max-w-sm">
          You don&apos;t have permission to access this page. Contact your administrator if you believe this is a mistake.
        </p>
      </div>
      <Link
        href="/login"
        className="bg-primary text-primary-foreground hover:opacity-80 mt-2 inline-flex h-9 items-center rounded-[var(--radius-md)] px-4 text-sm font-medium transition-colors"
      >
        Go to home page
      </Link>
    </div>
  );
}
