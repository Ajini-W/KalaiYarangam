import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { Hero } from '@/components/sections/hero'
// import { TrustedBy } from '@/components/sections/trusted-by'
import { WhoIsThisFor } from '@/components/sections/who-is-this-for'
import { ProblemsWeSolve } from '@/components/sections/problems-we-solve'
import { HowItWorks } from '@/components/sections/how-it-works'
import { FeaturesOverview } from '@/components/sections/features-overview'
import { Modules } from '@/components/sections/modules'
import { WhyChooseUs } from '@/components/sections/why-choose-us'
import { PricingPreview } from '@/components/sections/pricing-preview'
// import { Tutorials } from '@/components/sections/tutorials'
import { LatestBlogs } from '@/components/sections/latest-blogs'
import { Faq } from '@/components/sections/faq'
import { FinalCta } from '@/components/sections/final-cta'

export default function Page() {
  return (
    <div className="min-h-dvh bg-background">
      <SiteHeader />
      <main>
        <Hero />
        {/* <TrustedBy /> */}
        <WhoIsThisFor />
        <ProblemsWeSolve />
        <HowItWorks />
        <FeaturesOverview />
        <Modules />
        <WhyChooseUs />
        <PricingPreview />
        {/* <Tutorials /> */}
        <LatestBlogs />
        <Faq />
        <FinalCta />
      </main>
      <SiteFooter />
    </div>
  )
}
