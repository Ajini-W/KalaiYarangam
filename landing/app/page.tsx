import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { Hero } from '@/components/sections/hero'
import { TrustedBy } from '@/components/sections/trusted-by'
import { Industries } from '@/components/sections/industries'
import { Modules } from '@/components/sections/modules'
import { PlatformFeatures } from '@/components/sections/platform-features'
import { Walkthrough } from '@/components/sections/walkthrough'
import { DashboardShowcase } from '@/components/sections/dashboard-showcase'
import { Tutorials } from '@/components/sections/tutorials'
import { Pricing } from '@/components/sections/pricing'
import { Testimonials } from '@/components/sections/testimonials'
import { Faq } from '@/components/sections/faq'
import { FinalCta } from '@/components/sections/final-cta'

export default function Page() {
  return (
    <div className="min-h-dvh bg-background">
      <SiteHeader />
      <main>
        <Hero />
        <TrustedBy />
        <Industries />
        <Modules />
        <PlatformFeatures />
        <Walkthrough />
        <DashboardShowcase />
        <Tutorials />
        <Pricing />
        <Testimonials />
        <Faq />
        <FinalCta />
      </main>
      <SiteFooter />
    </div>
  )
}
