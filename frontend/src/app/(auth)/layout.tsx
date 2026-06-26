import type { Metadata } from "next";

export const metadata: Metadata = { title: "Authentication - KalaiArangam" };

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh lg:min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-gray-50 to-gray-100 dark:from-gray-900 dark:via-gray-900 dark:to-gray-950 lg:p-6 xl:p-8 transition-colors duration-500">
      {children}
    </div>
  );
}
