import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-4 text-center">
      <div>
        <p className="text-6xl font-bold text-brand mb-4">404</p>
        <h1 className="text-2xl font-bold text-white mb-4">Page not found</h1>
        <p className="text-zinc-500 mb-8">The page you&apos;re looking for doesn&apos;t exist.</p>
        <Link href="/" className="rounded-md bg-brand px-6 py-3 text-sm font-semibold text-black hover:bg-brand/90 transition-colors">
          Back to Home
        </Link>
      </div>
    </div>
  );
}
