import Link from "next/link";

export default function NotFound() {
  return (
    <div className="bg-surface flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
      <span className="text-border text-7xl font-bold">404</span>
      <div>
        <h1 className="text-text-primary text-xl font-semibold">Page Not Found</h1>
        <p className="text-text-secondary mt-1 text-sm">
          The page you&apos;re looking for doesn&apos;t exist.
        </p>
      </div>
      <Link
        href="/login"
        className="bg-brand-500 hover:bg-brand-600 mt-2 inline-flex h-9 items-center rounded-[var(--radius-md)] px-4 text-sm font-medium text-white transition-colors"
      >
        Go to home page
      </Link>
    </div>
  );
}
