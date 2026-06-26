"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
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

export default function ModuleActivationPage() {
  const router = useRouter();
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
      router.push("/dashboard");
    } catch {
      toast.error("Failed to save module configuration");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-primary">Activate Your Modules</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Choose the business modules you need.
        </p>
      </div>

      <div className="space-y-4">
        {loading ? (
          <Card>
            <CardBody className="space-y-4">
              <Skeleton className="h-16 w-full rounded-[var(--radius-md)]" />
              <Skeleton className="h-16 w-full rounded-[var(--radius-md)]" />
              <Skeleton className="h-16 w-full rounded-[var(--radius-md)]" />
            </CardBody>
          </Card>
        ) : (
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
        )}

        <div className="flex justify-end">
          <Button onClick={handleSave} loading={saving}>
            Save & Continue
          </Button>
        </div>
      </div>
    </div>
  );
}
