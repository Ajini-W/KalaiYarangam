import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-surface px-6 text-center">
      <span className="text-7xl font-bold text-border">404</span>
      <div>
        <h1 className="text-xl font-semibold text-text-primary">Page Not Found</h1>
        <p className="mt-1 text-sm text-text-secondary">The page you&apos;re looking for doesn&apos;t exist.</p>
      </div>
      <Link
        href="/dashboard"
        className="mt-2 inline-flex h-9 items-center rounded-[var(--radius-md)] bg-brand-500 px-4 text-sm font-medium text-white hover:bg-brand-600 transition-colors"
      >
        Go to Dashboard
      </Link>
    </div>
  );
}
