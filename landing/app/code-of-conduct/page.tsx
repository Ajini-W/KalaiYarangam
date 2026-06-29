import type { Metadata } from 'next'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { Breadcrumbs } from '@/components/content/breadcrumbs'
import { generateMetadata as genMeta } from '@/lib/seo'

export const metadata: Metadata = genMeta({
  title: 'Code of Conduct',
  description:
    'Our community code of conduct for kalaiArangam users, contributors, and team members.',
  url: 'https://kalaiArangam.com/code-of-conduct',
})

export default function CodeOfConductPage() {
  return (
    <div className="min-h-dvh bg-background">
      <SiteHeader />
      <main className="px-4 pb-24 pt-28">
        <div className="mx-auto max-w-3xl">
          <Breadcrumbs items={[{ label: 'Code of Conduct' }]} />

          <h1 className="mb-8 font-heading text-4xl font-bold tracking-tight sm:text-5xl">
            Code of Conduct
          </h1>

          <div className="prose prose-gray dark:prose-invert max-w-none space-y-8">
            <section>
              <h2 id="our-pledge">Our Pledge</h2>
              <p>
                We are committed to making participation in our community a harassment-free experience for
                everyone, regardless of age, body size, disability, ethnicity, gender identity and expression,
                level of experience, nationality, personal appearance, race, religion, or sexual identity
                and orientation.
              </p>
            </section>

            <section>
              <h2 id="our-standards">Our Standards</h2>
              <p>Examples of behavior that contributes to a positive environment:</p>
              <ul>
                <li>Using welcoming and inclusive language</li>
                <li>Being respectful of differing viewpoints and experiences</li>
                <li>Gracefully accepting constructive criticism</li>
                <li>Focusing on what is best for the community</li>
                <li>Showing empathy towards other community members</li>
              </ul>
              <p>Examples of unacceptable behavior:</p>
              <ul>
                <li>The use of sexualized language or imagery and unwelcome sexual attention</li>
                <li>Trolling, insulting or derogatory comments, and personal or political attacks</li>
                <li>Public or private harassment</li>
                <li>Publishing others private information without explicit permission</li>
                <li>Other conduct which could reasonably be considered inappropriate in a professional setting</li>
              </ul>
            </section>

            <section>
              <h2 id="enforcement-responsibilities">Enforcement Responsibilities</h2>
              <p>
                Community leaders are responsible for clarifying and enforcing our standards of acceptable
                behavior and will take appropriate and fair corrective action in response to any behavior
                that they deem inappropriate, threatening, offensive, or harmful.
              </p>
            </section>

            <section>
              <h2 id="scope">Scope</h2>
              <p>
                This Code of Conduct applies within all community spaces, and also applies when
                an individual is officially representing the community in public spaces.
              </p>
            </section>

            <section>
              <h2 id="enforcement">Enforcement</h2>
              <p>
                Instances of abusive, harassing, or otherwise unacceptable behavior may be reported to
                the community leaders responsible for enforcement at{' '}
                <a href="mailto:conduct@kalaiArangam.com">conduct@kalaiArangam.com</a>.
              </p>
              <p>
                All complaints will be reviewed and investigated promptly and fairly.
              </p>
            </section>

            <section>
              <h2 id="attribution">Attribution</h2>
              <p>
                This Code of Conduct is adapted from the Contributor Covenant, version 2.1,
                available at{' '}
                <a href="https://www.contributor-covenant.org/version/2/1/code_of_conduct.html" target="_blank" rel="noopener noreferrer">
                  contributor-covenant.org
                </a>.
              </p>
            </section>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
