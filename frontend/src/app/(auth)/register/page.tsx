"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";

const schema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().min(10, "Enter a valid phone number"),
  businessName: z.string().min(2, "Business name is required"),
  industry: z.string().min(1, "Select an industry"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});
type FormData = z.infer<typeof schema>;

const industries = [
  { value: "training", label: "Training / Coaching" },
  { value: "rental",   label: "Rental Business" },
  { value: "events",   label: "Event Management" },
];

export default function RegisterPage() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    console.log(data);
    toast.success("Account created! Check your email to verify.");
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-text-primary">Create your account</h1>
      <p className="mt-1 text-sm text-text-secondary">Start your 15-day free trial</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4" noValidate>
        <Input label="Full Name"      type="text"     placeholder="Abishek Kumar"  required error={errors.name?.message}         {...register("name")} />
        <Input label="Email"          type="email"    placeholder="you@example.com" required error={errors.email?.message}        {...register("email")} />
        <Input label="Phone"          type="tel"      placeholder="+91 98765 43210" required error={errors.phone?.message}        {...register("phone")} />
        <Input label="Business Name"  type="text"     placeholder="My Academy"      required error={errors.businessName?.message} {...register("businessName")} />
        <Select
          label="Industry"
          placeholder="Select industry"
          options={industries}
          required
          error={errors.industry?.message}
          {...register("industry")}
        />
        <Input label="Password" type="password" placeholder="Min 8 characters" required error={errors.password?.message} {...register("password")} />

        <Button type="submit" className="w-full" loading={isSubmitting}>
          Create Account
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-text-secondary">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-brand-600 hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
