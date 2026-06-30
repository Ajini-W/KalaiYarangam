"use client";

import * as React from "react";
import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { requestAccess, getOnboardingProgress } from "@/services/onboarding";
import { useAuthStore } from "@/store/auth.store";
import { setTokens } from "@/services/api-client";

function RequestAccessForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tenantId = searchParams.get("tenantId") || "";
  const [role, setRole] = React.useState<string | null>(null);

  React.useEffect(() => {
    getOnboardingProgress()
      .then((res) => setRole(res.data.progress.selectedRole || res.data.user.role))
      .catch(() => {});
  }, []);

  const [notes, setNotes] = React.useState("");
  const [skills, setSkills] = React.useState("");
  const [saving, setSaving] = React.useState(false);

  const handleSubmit = async () => {
    if (!tenantId) {
      toast.error("No organization selected. Please search and select one.");
      router.push("/onboarding/tenant-search");
      return;
    }
    setSaving(true);
    try {
      const res = await requestAccess({
        tenantId,
        notes,
        skills: skills ? skills.split(",").map((s) => s.trim()) : [],
      });

      // Update auth store with fresh token that includes updated status
      if (res.data?.tokens) {
        const { accessToken, refreshToken, user } = res.data.tokens;
        setTokens(accessToken, refreshToken);
        useAuthStore.getState().setUser(user as any);
      }

      toast.success("Access request submitted! The owner will review your request.");
      const dashboards: Record<string, string> = {
        BRANCH_MANAGER: "/branch-manager/dashboard",
        TRAINER: "/staff/dashboard",
        STAFF: "/staff/dashboard",
        STUDENT: "/student/dashboard",
      };
      window.location.replace(role ? dashboards[role] || "/client/dashboard" : "/client/dashboard");
    } catch {
      toast.error("Failed to submit access request");
    } finally {
      setSaving(false);
    }
  };

  if (!tenantId) {
    return (
      <div className="py-12 text-center">
        <h2 className="text-xl font-semibold text-text-primary">No Organization Selected</h2>
        <p className="mt-2 text-text-secondary">Please search and select an organization first.</p>
        <Button className="mt-4" onClick={() => router.push("/onboarding/tenant-search")}>
          Search Organizations
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-primary">Request Access</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Submit a request to join this organization. The owner will review and approve it.
        </p>
      </div>

      <Card className="max-w-xl">
        <CardBody className="space-y-4">
          <Input label="Organization ID" value={tenantId} disabled />

          <Input label="Skills (comma-separated)" placeholder="e.g. Management, Operations, Training" value={skills} onChange={(e) => setSkills(e.target.value)} />

          <Textarea label="Notes / Message" placeholder="Add any additional information for the owner..." value={notes} onChange={(e) => setNotes(e.target.value)} rows={4} />

          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => router.push("/onboarding/tenant-search")}>
              Back
            </Button>
            <Button onClick={handleSubmit} loading={saving}>
              Submit Request
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

export default function RequestAccessPage() {
  return (
    <Suspense fallback={null}>
      <RequestAccessForm />
    </Suspense>
  );
}
