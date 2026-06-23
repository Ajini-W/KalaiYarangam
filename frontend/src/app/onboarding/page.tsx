"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { selectRole } from "@/services/onboarding";

const ROLES = [
  { value: "OWNER", label: "Business Owner", description: "Manage your business, staff, and students", icon: "🏢" },
  { value: "BRANCH_MANAGER", label: "Branch Manager", description: "Manage daily operations at a branch", icon: "🏪" },
  { value: "TRAINER", label: "Staff / Trainer", description: "Conduct classes and manage students", icon: "👨‍🏫" },
  { value: "STUDENT", label: "Student", description: "Enroll in courses and track progress", icon: "🎓" },
  { value: "CLIENT", label: "Client", description: "Access quotations, bookings, and invoices", icon: "🤝" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = React.useState<string | null>(null);
  const [saving, setSaving] = React.useState(false);

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
    <div>
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-text-primary">Welcome to KalaiArangam</h1>
        <p className="mt-2 text-text-secondary">Select your role to get started with the setup.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {ROLES.map((role) => (
          <button
            key={role.value}
            type="button"
            onClick={() => setSelectedRole(role.value)}
            className={`rounded-[var(--radius-lg)] border-2 p-5 text-left transition-all hover:shadow-md ${
              selectedRole === role.value
                ? "border-primary bg-primary/5 shadow-sm"
                : "border-border-default bg-surface hover:border-primary/50"
            }`}
          >
            <div className="mb-2 text-3xl">{role.icon}</div>
            <h3 className="font-semibold text-text-primary">{role.label}</h3>
            <p className="mt-1 text-sm text-text-secondary">{role.description}</p>
          </button>
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        <Button size="lg" onClick={handleContinue} loading={saving} disabled={!selectedRole}>
          Continue
        </Button>
      </div>
    </div>
  );
}
