import type { Metadata } from "next";
import { PricingSection } from "@/components/marketing/pricing";
import { FaqSection } from "@/components/marketing/faq";
import { CtaBanner } from "@/components/shared/cta-banner";

export const metadata: Metadata = { title: "Pricing" };

export default function PricingPage() {
  return (
    <>
      <div className="pt-20">
        <PricingSection />
        <FaqSection />
        <CtaBanner />
      </div>
    </>
  );
}
