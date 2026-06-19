import type { Metadata } from "next";
import { FaqSection } from "@/components/marketing/faq";
import { CtaBanner } from "@/components/shared/cta-banner";

export const metadata: Metadata = { title: "FAQ" };

export default function FaqPage() {
  return (
    <div className="pt-20">
      <FaqSection />
      <CtaBanner />
    </div>
  );
}
