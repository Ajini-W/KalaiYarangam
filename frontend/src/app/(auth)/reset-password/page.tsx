"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

const schema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirm: z.string(),
  })
  .refine((d) => d.password === d.confirm, {
    message: "Passwords do not match",
    path: ["confirm"],
  });
type FormData = z.infer<typeof schema>;

export default function ResetPasswordPage() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    console.log(data);
    toast.success("Password updated! Please sign in.");
    router.push("/login");
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-text-primary">Set new password</h1>
      <p className="mt-1 text-sm text-text-secondary">Must be at least 8 characters.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4" noValidate>
        <Input label="New Password"     type="password" placeholder="••••••••" required error={errors.password?.message} {...register("password")} />
        <Input label="Confirm Password" type="password" placeholder="••••••••" required error={errors.confirm?.message}  {...register("confirm")} />
        <Button type="submit" className="w-full" loading={isSubmitting}>
          Update Password
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-text-secondary">
        <Link href="/login" className="font-medium text-brand-600 hover:underline">
          ← Back to sign in
        </Link>
      </p>
    </div>
  );
}
