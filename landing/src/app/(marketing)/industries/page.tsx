import type { Metadata } from "next";
import { IndustriesSection } from "@/components/marketing/industries";
import { CtaBanner } from "@/components/shared/cta-banner";

export const metadata: Metadata = { title: "Industries" };

export default function IndustriesPage() {
  return (
    <div className="pt-20">
      <IndustriesSection />
      <CtaBanner />
    </div>
  );
}
