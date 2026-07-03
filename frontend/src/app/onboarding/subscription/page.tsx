"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { selectSubscription } from "@/services/onboarding";
import { setTokens } from "@/services/api-client";
import { useAuthStore } from "@/store/auth.store";
import type { AuthUser } from "@/services/auth.service";

const PLANS = [
  {
    id: "trial",
    name: "Trial",
    price: "Free",
    period: "15 days",
    description: "Try all features risk-free",
    features: ["Up to 10 students", "1 branch", "Basic reporting", "Email support"],
    highlighted: false,
  },
  {
    id: "starter",
    name: "Starter",
    price: "₹999",
    period: "/month",
    description: "Perfect for small academies",
    features: ["Up to 50 students", "2 branches", "Advanced reporting", "Email & chat support"],
    highlighted: true,
  },
  {
    id: "professional",
    name: "Professional",
    price: "₹2,499",
    period: "/month",
    description: "For growing institutions",
    features: ["Up to 200 students", "5 branches", "Analytics dashboard", "Priority support"],
    highlighted: false,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "₹6,999",
    period: "/month",
    description: "For large organizations",
    features: ["Unlimited students", "Unlimited branches", "Custom integrations", "Dedicated support"],
    highlighted: false,
  },
];

export default function SubscriptionPage() {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);
  const [selected, setSelected] = React.useState("trial");
  const [saving, setSaving] = React.useState(false);

  const handleSubmit = async () => {
    setSaving(true);
    try {
      const res = await selectSubscription({ plan: selected });
      if (res.data.token) {
        const { accessToken, user } = res.data.token;
        setTokens(accessToken, accessToken);
        setUser(user as unknown as AuthUser);
        localStorage.setItem("accessToken", accessToken);
      }
      toast.success("Setup complete! Welcome aboard.");
      router.push(res.data.redirectTo);
    } catch {
      toast.error("Failed to activate subscription");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-text-primary">Choose Your Plan</h1>
        <p className="mt-1 text-sm text-text-secondary">Start with a free trial. No credit card required.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {PLANS.map((plan) => (
          <button
            key={plan.id}
            type="button"
            onClick={() => setSelected(plan.id)}
            className={`relative rounded-[var(--radius-lg)] border-2 p-5 text-left transition-all ${
              selected === plan.id
                ? "border-primary bg-primary/5 shadow-md"
                : "border-border-default bg-surface hover:border-primary/50"
            } ${plan.highlighted ? "ring-2 ring-primary/20" : ""}`}
          >
            {plan.highlighted && (
              <Badge variant="info" className="absolute -top-2.5 right-3">Popular</Badge>
            )}
            <h3 className="text-lg font-bold text-text-primary">{plan.name}</h3>
            <div className="mt-2">
              <span className="text-2xl font-extrabold text-text-primary">{plan.price}</span>
              <span className="text-sm text-text-secondary">{plan.period}</span>
            </div>
            <p className="mt-1 text-sm text-text-secondary">{plan.description}</p>
            <ul className="mt-4 space-y-2">
              {plan.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-text-secondary">
                  <svg className="h-4 w-4 text-success shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  {f}
                </li>
              ))}
            </ul>
          </button>
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        <Button size="lg" onClick={handleSubmit} loading={saving}>
          {selected === "trial" ? "Start Free Trial" : "Subscribe"}
        </Button>
      </div>
    </div>
  );
}
