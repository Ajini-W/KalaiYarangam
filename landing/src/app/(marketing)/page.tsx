import { Hero } from "@/components/marketing/hero";
import { FeaturesSection } from "@/components/marketing/features";
import { IndustriesSection } from "@/components/marketing/industries";
import { StatsSection } from "@/components/marketing/stats";
import { ComparisonSection } from "@/components/marketing/comparison";
import { PricingSection } from "@/components/marketing/pricing";
import { TestimonialsSection } from "@/components/marketing/testimonials";
import { FaqSection } from "@/components/marketing/faq";
import { CtaBanner } from "@/components/shared/cta-banner";

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturesSection />
      <IndustriesSection />
      <StatsSection />
      <ComparisonSection />
      <PricingSection />
      <TestimonialsSection />
      <FaqSection />
      <CtaBanner />
    </>
  );
}
