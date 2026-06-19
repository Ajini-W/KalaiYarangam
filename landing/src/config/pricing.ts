export type PricingPlan = {
  id: string;
  name: string;
  price: string;
  period: string;
  badge?: string;
  description: string;
  features: string[];
  cta: string;
  highlighted?: boolean;
};

export const pricingPlans: PricingPlan[] = [
  {
    id: "starter",
    name: "Starter",
    price: "₹2,999",
    period: "/mo",
    description: "Perfect for small training centers and rental shops getting started.",
    features: [
      "Up to 50 bookings/month",
      "1 business location",
      "Online booking page",
      "Email notifications",
      "Basic analytics",
      "Customer management",
    ],
    cta: "Get Started",
  },
  {
    id: "growth",
    name: "Growth",
    price: "₹6,999",
    period: "/mo",
    badge: "Most Popular",
    description: "For growing businesses that need more power and automation.",
    features: [
      "Unlimited bookings",
      "Up to 5 locations",
      "Custom booking portal",
      "SMS & Email notifications",
      "Advanced analytics",
      "Payment integrations",
      "Staff management",
      "Priority support",
    ],
    cta: "Get Started",
    highlighted: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "Full-scale solution for large organizations and franchises.",
    features: [
      "Unlimited everything",
      "Unlimited locations",
      "White-label platform",
      "API access",
      "Custom integrations",
      "Dedicated account manager",
      "SLA guarantee",
      "Onboarding & training",
    ],
    cta: "Contact Us",
  },
];
