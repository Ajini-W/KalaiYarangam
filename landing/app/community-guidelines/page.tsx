import type { Metadata } from 'next'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { Breadcrumbs } from '@/components/content/breadcrumbs'
import { generateMetadata as genMeta } from '@/lib/seo'

export const metadata: Metadata = genMeta({
  title: 'Community Guidelines',
  description:
    'Guidelines for participating in the kalaiArangam community, forums, and support channels.',
  url: 'https://kalaiArangam.com/community-guidelines',
})

export default function CommunityGuidelinesPage() {
  return (
    <div className="min-h-dvh bg-background">
      <SiteHeader />
      <main className="px-4 pb-24 pt-28">
        <div className="mx-auto max-w-3xl">
          <Breadcrumbs items={[{ label: 'Community Guidelines' }]} />

          <h1 className="mb-8 font-heading text-4xl font-bold tracking-tight sm:text-5xl">
            Community Guidelines
          </h1>

          <div className="prose prose-gray dark:prose-invert max-w-none space-y-8">
            <section>
              <h2 id="welcome">Welcome</h2>
              <p>
                The kalaiArangam community is a space for business owners, trainers, and operators
                to share knowledge, ask questions, and help each other succeed. These guidelines
                help keep our community safe, productive, and welcoming for everyone.
              </p>
            </section>

            <section>
              <h2 id="be-respectful">Be Respectful</h2>
              <p>
                Treat every community member with respect. Disagreements are natural, but personal
                attacks, harassment, and discrimination are not tolerated. Focus on ideas, not individuals.
              </p>
            </section>

            <section>
              <h2 id="share-knowledge">Share Knowledge</h2>
              <p>
                Help others by sharing your experiences, tips, and best practices. If you have found
                a solution to a common problem, consider writing a tutorial or guide.
              </p>
            </section>

            <section>
              <h2 id="ask-questions">Ask Questions</h2>
              <p>
                No question is too basic. Whether you are just getting started or have been using the
                platform for years, we are here to help. Provide as much context as possible when asking.
              </p>
            </section>

            <section>
              <h2 id="reporting">Reporting Issues</h2>
              <p>
                If you experience or witness behavior that violates these guidelines, please report it to{' '}
                <a href="mailto:community@kalaiArangam.com">community@kalaiArangam.com</a>.
                All reports are handled confidentially.
              </p>
            </section>

            <section>
              <h2 id="consequences">Consequences</h2>
              <p>
                Violations of these guidelines may result in warnings, temporary suspension, or
                permanent removal from the community, depending on severity and repetition.
              </p>
            </section>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
