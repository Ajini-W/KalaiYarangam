import type { Metadata } from "next";

export const metadata: Metadata = { title: "Sign In" };

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Brand panel — hidden on mobile */}
      <div className="bg-brand-600 hidden flex-col items-start justify-between p-12 lg:flex">
        <span className="text-2xl font-bold text-white">KalaiArangam</span>
        <div>
          <p className="text-3xl leading-snug font-bold text-white">
            Manage your business
            <br />
            from one place.
          </p>
          <p className="text-brand-200 mt-3 text-sm">
            Training · Rental · Events — all in one ERP platform.
          </p>
        </div>
        <p className="text-brand-300 text-xs">© 2026 KalaiArangam</p>
      </div>

      {/* Form panel */}
      <div className="bg-surface flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <p className="text-brand-600 mb-8 text-center text-xl font-bold lg:hidden">
            KalaiArangam
          </p>
          {children}
        </div>
      </div>
    </div>
  );
}
