import { BioSection } from '@/components/about/BioSection'
import { ContactSection } from '@/components/about/ContactSection'
import { PageTransition } from '@/components/shared/PageTransition'

export const metadata = {
  title: 'About',
  description:
    'Joseph Ayinde | Co-Founder & CEO of The Learning and Memory Lab. Polymath. Tar Heel. SF Bay Area.',
}

export default function AboutPage() {
  return (
    <PageTransition>
      <div className="max-w-3xl mx-auto px-6 md:px-12 pt-32 pb-24">
        <BioSection />
        <ContactSection />
      </div>
    </PageTransition>
  )
}
