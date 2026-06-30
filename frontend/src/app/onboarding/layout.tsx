"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { User, Building2, Search, Send, GitBranch, Puzzle, CreditCard } from "lucide-react";

const STEP_ICONS: Record<string, React.ReactNode> = {
  Role: <User size={14} />,
  Profile: <User size={14} />,
  Tenant: <Building2 size={14} />,
  Branch: <GitBranch size={14} />,
  Modules: <Puzzle size={14} />,
  Subscription: <CreditCard size={14} />,
  Search: <Search size={14} />,
  Request: <Send size={14} />,
};

const OWNER_STEPS = [
  { path: "/onboarding/tenant-setup", label: "Tenant" },
  { path: "/onboarding/branch-setup", label: "Branch" },
  { path: "/onboarding/module-activation", label: "Modules" },
  { path: "/onboarding/subscription", label: "Subscription" },
];

const SEARCH_STEPS = [
  { path: "/onboarding/tenant-search", label: "Search" },
  { path: "/onboarding/request-access", label: "Request" },
];

const BASE_STEPS = [
  { path: "/onboarding", label: "Role" },
  { path: "/onboarding/profile-setup", label: "Profile" },
];

function getActiveSteps(pathname: string) {
  const isOnboarding = pathname === "/onboarding";
  if (isOnboarding) return BASE_STEPS;

  if (pathname.includes("tenant-setup") || pathname.includes("branch-setup") || pathname.includes("module-activation") || pathname.includes("subscription")) {
    return [...BASE_STEPS, ...OWNER_STEPS];
  }
  if (pathname.includes("request-access")) return [...BASE_STEPS, ...SEARCH_STEPS];
  if (pathname.includes("tenant-search")) return [...BASE_STEPS, ...SEARCH_STEPS];
  return BASE_STEPS;
}

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const steps = getActiveSteps(pathname);
  const currentIndex = steps.findIndex((s) => pathname.startsWith(s.path));

  return (
    <div className="bg-surface min-h-screen">
      <div className="mx-auto max-w-3xl px-4 py-8">
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <div className="flex items-center justify-center gap-0">
            {steps.map((step, i) => {
              const isActive = i <= currentIndex;
              const isCurrent = i === currentIndex;
              return (
                <React.Fragment key={step.path}>
                  <div className="flex flex-col items-center">
                    <motion.div
                      layout
                      className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors ${
                        isActive
                          ? "bg-primary text-white shadow-sm shadow-primary/30"
                          : "bg-surface-raised text-text-muted"
                      } ${isCurrent ? "ring-2 ring-primary/30 ring-offset-2 ring-offset-surface" : ""}`}
                      animate={isCurrent ? { scale: [1, 1.12, 1] } : { scale: 1 }}
                      transition={isCurrent ? { duration: 0.4, ease: "easeOut" } : { duration: 0.2 }}
                    >
                      {STEP_ICONS[step.label]}
                    </motion.div>
                    <motion.span
                      className={`mt-1.5 text-xs font-medium ${
                        isActive ? "text-text-primary" : "text-text-muted"
                      }`}
                      animate={{ fontWeight: isCurrent ? 600 : 500 }}
                    >
                      {step.label}
                    </motion.span>
                  </div>
                  {i < steps.length - 1 && (
                    <div className="mx-2 mb-5 w-10 sm:w-16 overflow-hidden rounded-full">
                      <motion.div
                        className="h-0.5 bg-primary origin-left"
                        initial={{ scaleX: 0 }}
                        animate={i < currentIndex ? { scaleX: 1 } : { scaleX: 0 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                      />
                      <div className="h-0.5 bg-border-default -translate-y-0.5" />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
