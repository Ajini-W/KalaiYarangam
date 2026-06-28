"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Building2, Users, BookOpen, Award, FileText } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { getOnboardingProgress, selectRole } from "@/services/onboarding";
import { getDashboardRoute } from "@/lib/dashboard-route";
import { useAuthStore } from "@/store/auth.store";

const ROLE_META: Record<string, { bg: string; fg: string; icon: React.ReactNode }> = {
  OWNER: { bg: "bg-blue-100 dark:bg-blue-900/30", fg: "text-blue-600 dark:text-blue-400", icon: <Building2 size={20} /> },
  BRANCH_MANAGER: { bg: "bg-purple-100 dark:bg-purple-900/30", fg: "text-purple-600 dark:text-purple-400", icon: <Users size={20} /> },
  TRAINER: { bg: "bg-emerald-100 dark:bg-emerald-900/30", fg: "text-emerald-600 dark:text-emerald-400", icon: <BookOpen size={20} /> },
  STAFF: { bg: "bg-teal-100 dark:bg-teal-900/30", fg: "text-teal-600 dark:text-teal-400", icon: <Users size={20} /> },
  STUDENT: { bg: "bg-amber-100 dark:bg-amber-900/30", fg: "text-amber-600 dark:text-amber-400", icon: <Award size={20} /> },
  CLIENT: { bg: "bg-rose-100 dark:bg-rose-900/30", fg: "text-rose-600 dark:text-rose-400", icon: <FileText size={20} /> },
};

const ROLES = [
  { value: "OWNER", label: "Business Owner", description: "Manage your business, staff, and students" },
  { value: "BRANCH_MANAGER", label: "Branch Manager", description: "Manage daily operations at a branch" },
  { value: "TRAINER", label: "Trainer", description: "Conduct classes and manage students" },
  { value: "STAFF", label: "Staff", description: "Support daily operations and administration" },
  { value: "STUDENT", label: "Student", description: "Enroll in courses and track progress" },
  { value: "CLIENT", label: "Client", description: "Access quotations, bookings, and invoices" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
} as const;

const STEP_ROUTES: Record<string, string> = {
  ROLE_SELECTION: "/onboarding",
  PROFILE_SETUP: "/onboarding/profile-setup",
  TENANT_SETUP: "/onboarding/tenant-setup",
  BRANCH_SETUP: "/onboarding/branch-setup",
  MODULE_SELECTION: "/onboarding/module-activation",
  SUBSCRIPTION: "/onboarding/subscription",
  SEARCH_TENANT: "/onboarding/tenant-search",
  SELECT_BRANCH: "/onboarding/branch-setup",
  SKILLS_SETUP: "/onboarding/skills-setup",
  COURSE_SELECTION: "/onboarding/course-selection",
};

export default function OnboardingPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const [selectedRole, setSelectedRole] = React.useState<string | null>(null);
  const [saving, setSaving] = React.useState(false);
  const [redirecting, setRedirecting] = React.useState(true);

  React.useEffect(() => {
    (async () => {
      try {
        const res = await getOnboardingProgress();
        const progress = res.data.progress;
        if (progress.isCompleted) {
          router.replace(getDashboardRoute(res.data.user.role));
          return;
        }
        const target = progress.currentStep
          ? STEP_ROUTES[progress.currentStep]
          : null;
        if (target && target !== "/onboarding") {
          router.replace(target);
          return;
        }
      } catch {
        // No progress yet — stay on this page
      } finally {
        setRedirecting(false);
      }
    })();
  }, [router]);

  if (redirecting) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner />
      </div>
    );
  }

  const handleContinue = async () => {
    if (!selectedRole) {
      toast.error("Please select a role to continue");
      return;
    }
    setSaving(true);
    try {
      await selectRole({ role: selectedRole });
      router.push("/onboarding/profile-setup");
    } catch {
      toast.error("Failed to select role. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <motion.div variants={itemVariants} className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-text-primary">Welcome to KalaiArangam</h1>
        <p className="mt-2 text-text-secondary">Select your role to get started with the setup.</p>
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {ROLES.map((role) => {
          const meta = ROLE_META[role.value];
          return (
            <motion.button
              key={role.value}
              type="button"
              onClick={() => setSelectedRole(role.value)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`rounded-[var(--radius-lg)] border-2 p-5 text-left transition-colors ${
                selectedRole === role.value
                  ? "border-primary bg-primary/5 shadow-sm"
                  : "border-border-default bg-surface hover:border-primary/50"
              }`}
            >
              <div className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] ${meta.bg}`}>
                <span className={meta.fg}>{meta.icon}</span>
              </div>
              <h3 className="font-semibold text-text-primary">{role.label}</h3>
              <p className="mt-1 text-sm text-text-secondary">{role.description}</p>
            </motion.button>
          );
        })}
      </motion.div>

      <motion.div variants={itemVariants} className="mt-8 flex justify-center">
        <Button size="lg" onClick={handleContinue} loading={saving} disabled={!selectedRole}>
          Continue
        </Button>
      </motion.div>
    </motion.div>
  );
}
