"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useState } from "react";
import { Lock, Eye, EyeOff } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAuthStore } from "@/store/auth.store";

const schema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
type FormData = z.infer<typeof schema>;

export default function ChangePasswordPage() {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const changePassword = useAuthStore((s) => s.changePassword);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    try {
      await changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      toast.success("Password changed successfully!");
      reset();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to change password");
    }
  };

  return (
    <PageContainer title="Change Password" subtitle="Update your account password">
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-lg space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Password</CardTitle>
          </CardHeader>
          <CardBody className="space-y-4 pt-0">
            <Input
              label="Current Password"
              type={showCurrent ? "text" : "password"}
              placeholder="Enter current password"
              required
              error={errors.currentPassword?.message}
              leftAddon={<Lock size={16} />}
              rightAddon={
                <button
                  type="button"
                  onClick={() => setShowCurrent((v) => !v)}
                  className="text-gray-400 hover:text-brand-600 transition-colors focus:outline-none"
                  tabIndex={-1}
                >
                  {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              }
              {...register("currentPassword")}
            />
            <Input
              label="New Password"
              type={showNew ? "text" : "password"}
              placeholder="Min 8 characters"
              required
              error={errors.newPassword?.message}
              leftAddon={<Lock size={16} />}
              rightAddon={
                <button
                  type="button"
                  onClick={() => setShowNew((v) => !v)}
                  className="text-gray-400 hover:text-brand-600 transition-colors focus:outline-none"
                  tabIndex={-1}
                >
                  {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              }
              {...register("newPassword")}
            />
            <Input
              label="Confirm New Password"
              type={showConfirm ? "text" : "password"}
              placeholder="Re-enter new password"
              required
              error={errors.confirmPassword?.message}
              leftAddon={<Lock size={16} />}
              rightAddon={
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  className="text-gray-400 hover:text-brand-600 transition-colors focus:outline-none"
                  tabIndex={-1}
                >
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              }
              {...register("confirmPassword")}
            />
          </CardBody>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" loading={isSubmitting}>
            Change Password
          </Button>
        </div>
      </form>
    </PageContainer>
  );
}
