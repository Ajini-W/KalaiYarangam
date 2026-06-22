"use client";

import * as React from "react";
import { toast } from "sonner";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { ModuleToggleCard } from "@/components/forms/ModuleToggleCard";
import { getModules, updateModules, type ModuleFlags } from "@/services/modules";

const MODULE_CONFIG: { key: keyof ModuleFlags; title: string; description: string }[] = [
  {
    key: "trainingManagement",
    title: "Training Management",
    description: "Manage batches, students, courses, and attendance",
  },
  {
    key: "rentalManagement",
    title: "Rental Management",
    description: "Manage inventory, bookings, and rentals",
  },
  {
    key: "eventManagement",
    title: "Event Management",
    description: "Create and manage events, workshops, and sessions",
  },
];

export default function ModulesSettingsPage() {
  const [loading, setLoading] = React.useState(true);
  const [modules, setModules] = React.useState<ModuleFlags>({
    trainingManagement: false,
    rentalManagement: false,
    eventManagement: false,
  });
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const res = await getModules();
        if (!mounted) return;
        setModules(res.data);
      } catch {
        if (!mounted) return;
        toast.error("Failed to load module configuration");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => { mounted = false; };
  }, []);

  const handleToggle = (key: keyof ModuleFlags) => {
    setModules((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateModules(modules);
      toast.success("Module configuration saved");
    } catch {
      toast.error("Failed to save module configuration");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <PageContainer title="Modules" subtitle="Enable or disable business modules">
        <div className="max-w-xl space-y-4">
          <Card>
            <CardBody className="space-y-4">
              <Skeleton className="h-16 w-full rounded-[var(--radius-md)]" />
              <Skeleton className="h-16 w-full rounded-[var(--radius-md)]" />
              <Skeleton className="h-16 w-full rounded-[var(--radius-md)]" />
            </CardBody>
          </Card>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title="Modules"
      subtitle="Enable or disable business modules"
      actions={
        <Button onClick={handleSave} loading={saving}>
          Save Configuration
        </Button>
      }
    >
      <div className="max-w-xl space-y-4">
        <Card>
          <CardHeader><CardTitle>Available Modules</CardTitle></CardHeader>
          <CardBody className="space-y-3 pt-0">
            {MODULE_CONFIG.map((mod) => (
              <ModuleToggleCard
                key={mod.key}
                title={mod.title}
                description={mod.description}
                enabled={modules[mod.key]}
                onToggle={() => handleToggle(mod.key)}
                disabled={saving}
              />
            ))}
          </CardBody>
        </Card>
      </div>
    </PageContainer>
  );
}
