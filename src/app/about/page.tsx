import { BioSection } from '@/components/about/BioSection'
import { ExperienceTimeline } from '@/components/about/ExperienceTimeline'
import { ContactSection } from '@/components/about/ContactSection'
import { PageTransition } from '@/components/shared/PageTransition'

export const metadata = {
  title: 'About',
  description:
    'Joseph Ayinde | ex-OpenAI MTS, CMU Scholar, CEO of Cognition, neurosurgery researcher.',
}

export default function AboutPage() {
  return (
    <PageTransition>
      <div className="max-w-3xl mx-auto px-6 md:px-12 pt-32 pb-24">
        <BioSection />
        <ExperienceTimeline />
        <ContactSection />
      </div>
    </PageTransition>
  )
}
