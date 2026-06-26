"use client";

import * as React from "react";
import { usePathname } from "next/navigation";

const OWNER_STEPS = [
  { path: "/onboarding/tenant-setup", label: "Tenant", step: 3 },
];

const SEARCH_STEPS = [
  { path: "/onboarding/tenant-search", label: "Search", step: 3 },
  { path: "/onboarding/request-access", label: "Request", step: 4 },
];

const BASE_STEPS = [
  { path: "/onboarding", label: "Role", step: 1 },
  { path: "/onboarding/profile-setup", label: "Profile", step: 2 },
];

function getActiveSteps(pathname: string) {
  const isOnboarding = pathname === "/onboarding";
  if (isOnboarding) return BASE_STEPS;

  if (pathname.includes("tenant-setup")) return [...BASE_STEPS, ...OWNER_STEPS];
  if (pathname.includes("request-access")) return [...BASE_STEPS, ...SEARCH_STEPS];
  if (pathname.includes("tenant-search")) return [...BASE_STEPS, ...SEARCH_STEPS];
  return BASE_STEPS;
}

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const steps = getActiveSteps(pathname);
  const currentIndex = steps.findIndex((s) => pathname.startsWith(s.path));
  const currentStep = currentIndex >= 0 ? currentIndex + 1 : 0;

  return (
    <div className="bg-surface min-h-screen">
      <div className="mx-auto max-w-3xl px-4 py-8">
        {/* Progress bar */}
        <div className="mb-10">
          <div className="flex items-center justify-between">
            {steps.map((step, i) => {
              const isActive = i <= currentIndex;
              const isCurrent = i === currentIndex;
              return (
                <div key={step.path} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                        isActive
                          ? "bg-primary text-white"
                          : "bg-surface-raised text-text-muted"
                      } ${isCurrent ? "ring-2 ring-primary/30 ring-offset-2 ring-offset-surface" : ""}`}
                    >
                      {step.step}
                    </div>
                    <span className={`mt-1 text-xs ${isActive ? "font-medium text-text-primary" : "text-text-muted"}`}>
                      {step.label}
                    </span>
                  </div>
                  {i < steps.length - 1 && (
                    <div className={`mx-2 mt-[-1.5rem] h-0.5 w-8 sm:w-16 ${i < currentIndex ? "bg-primary" : "bg-border-default"}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {children}
      </div>
    </div>
  );
}
