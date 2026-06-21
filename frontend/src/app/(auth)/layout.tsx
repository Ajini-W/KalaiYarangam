import type { Metadata } from "next";

export const metadata: Metadata = { title: "Authentication - KalaiArangam" };

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 p-3 sm:p-6 transition-colors duration-500">
      {/* Glass Card Container — max 1000px, 40/60 split on desktop */}
      <div
        className="w-full max-w-[1020px] lg:min-h-[620px] grid grid-cols-1 lg:grid-cols-[38%_62%] rounded-3xl overflow-hidden shadow-2xl shadow-gray-900/8 dark:shadow-black/30 border border-white/70 dark:border-gray-700/50 bg-white dark:bg-gray-900 transition-colors duration-500"
      >
        {children}
      </div>
    </div>
  );
}
