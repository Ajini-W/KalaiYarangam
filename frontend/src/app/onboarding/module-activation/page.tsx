"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ModuleToggleCard } from "@/components/forms/ModuleToggleCard";
import { selectModules } from "@/services/onboarding";

export default function ModuleActivationPage() {
  const router = useRouter();
  const [saving, setSaving] = React.useState(false);
  const [modules, setModules] = React.useState({
    training: true,
    rental: false,
    event: false,
  });

  const handleToggle = (key: "training" | "rental" | "event") => {
    setModules((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await selectModules({
        training: modules.training,
        rental: modules.rental,
        event: modules.event,
      });
      toast.success("Modules activated successfully");
      router.push("/onboarding/subscription");
    } catch {
      toast.error("Failed to save module configuration");
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-primary">Activate Your Modules</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Choose the business modules you need.
        </p>
      </div>

      <div className="mx-auto max-w-xl space-y-4">
        <Card>
          <CardHeader><CardTitle>Available Modules</CardTitle></CardHeader>
          <CardBody className="space-y-3 pt-0">
            <ModuleToggleCard
              title="Training Management"
              description="Manage batches, students, courses, and attendance"
              enabled={modules.training}
              onToggle={() => handleToggle("training")}
              disabled={saving}
            />
            <ModuleToggleCard
              title="Rental Management"
              description="Manage inventory, bookings, and rentals"
              enabled={modules.rental}
              onToggle={() => handleToggle("rental")}
              disabled={saving}
            />
            <ModuleToggleCard
              title="Event Management"
              description="Create and manage events, workshops, and sessions"
              enabled={modules.event}
              onToggle={() => handleToggle("event")}
              disabled={saving}
            />
          </CardBody>
        </Card>

        <div className="flex justify-end">
          <Button onClick={handleSave} loading={saving}>
            Save & Continue
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
