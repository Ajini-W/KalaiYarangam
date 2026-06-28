"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { setupBranch } from "@/services/onboarding";

const branchSchema = z.object({
  branchName: z.string().min(2, "Branch name is required"),
  address: z.string().optional(),
  contactNumber: z.string().optional(),
});
type BranchFormData = z.infer<typeof branchSchema>;

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" as const } },
};

export default function BranchSetupPage() {
  const router = useRouter();
  const [saving, setSaving] = React.useState(false);

  const form = useForm<BranchFormData>({
    resolver: zodResolver(branchSchema),
    defaultValues: { branchName: "" },
  });

  const handleSubmit = async (data: BranchFormData) => {
    setSaving(true);
    try {
      const res = await setupBranch({
        branchName: data.branchName,
        address: data.address || undefined,
        contactNumber: data.contactNumber || undefined,
      });
      toast.success("Branch created successfully");
      router.push("/onboarding/module-activation");
    } catch {
      toast.error("Failed to create branch");
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div variants={stagger} initial="hidden" animate="visible">
      <motion.div variants={fadeUp} className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-text-primary">Set Up Your First Branch</h1>
        <p className="mt-1.5 text-sm text-text-secondary">
          Add your primary business location.
        </p>
      </motion.div>

      <form onSubmit={form.handleSubmit(handleSubmit)} className="mx-auto max-w-xl space-y-6">
        <motion.div variants={fadeUp}>
          <Card>
            <CardHeader><CardTitle>Branch Details</CardTitle></CardHeader>
            <CardBody className="space-y-4 pt-0">
              <Input
                label="Branch Name"
                required
                error={form.formState.errors.branchName?.message}
                {...form.register("branchName")}
              />
              <Input
                label="Address"
                {...form.register("address")}
              />
              <Input
                label="Contact Number"
                {...form.register("contactNumber")}
              />
            </CardBody>
          </Card>
        </motion.div>

        <motion.div variants={fadeUp} className="flex justify-end">
          <Button type="submit" loading={saving} rightIcon={!saving ? <ChevronRight className="h-4 w-4" /> : undefined}>
            Save & Continue
          </Button>
        </motion.div>
      </form>
    </motion.div>
  );
}
