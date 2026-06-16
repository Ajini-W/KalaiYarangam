"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

const schema = z.object({ email: z.string().email("Enter a valid email") });
type FormData = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    console.log(data);
    toast.success("Reset link sent! Check your inbox.");
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-text-primary">Forgot password?</h1>
      <p className="mt-1 text-sm text-text-secondary">
        Enter your email and we&apos;ll send a reset link.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4" noValidate>
        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          required
          error={errors.email?.message}
          {...register("email")}
        />
        <Button type="submit" className="w-full" loading={isSubmitting}>
          Send Reset Link
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
