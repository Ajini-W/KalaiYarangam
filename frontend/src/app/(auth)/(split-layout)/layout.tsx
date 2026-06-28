"use client";

import { AuthFormProvider } from "@/store/auth-form.context";
import { AuthLeftPanel } from "@/components/ui/AuthBackground";

export default function SplitAuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthFormProvider>
      <div className="w-full max-w-[1020px] min-h-dvh sm:min-h-0 lg:min-h-[640px] grid grid-cols-1 lg:grid-cols-[38%_62%] lg:rounded-3xl overflow-hidden lg:shadow-2xl lg:shadow-gray-900/10 dark:lg:shadow-black/40 lg:border lg:border-gray-200/60 dark:lg:border-gray-700/40 bg-white dark:bg-gray-900 transition-colors duration-500">
        <AuthLeftPanel />
        <div className="flex flex-col bg-white dark:bg-gray-900 lg:rounded-r-3xl lg:rounded-l-none transition-colors duration-500">
          {children}
        </div>
      </div>
    </AuthFormProvider>
  );
}
