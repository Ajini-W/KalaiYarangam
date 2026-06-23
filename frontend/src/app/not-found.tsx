"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NotFound() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => router.replace("/login"), 5000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="bg-surface flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
      <span className="text-border text-7xl font-bold">404</span>
      <div>
        <h1 className="text-text-primary text-xl font-semibold">Page Not Found</h1>
        <p className="text-text-secondary mt-1 text-sm">
          The page you&apos;re looking for doesn&apos;t exist.
        </p>
        <p className="text-text-secondary mt-2 text-xs">Redirecting to login in 5 seconds...</p>
      </div>
      <Link
        href="/login"
        className="bg-primary text-primary-foreground hover:opacity-80 mt-2 inline-flex h-9 items-center rounded-[var(--radius-md)] px-4 text-sm font-medium transition-colors"
      >
        Go to login
      </Link>
    </div>
  );
}
