import { AboutIntro } from '@/components/about/AboutIntro'
import { FieldNotes } from '@/components/about/FieldNotes'
import { Chapters } from '@/components/sections/Chapters'
import { ContactCTA } from '@/components/sections/ContactCTA'
import { Marquee } from '@/components/sections/Marquee'

export const metadata = {
  title: 'About',
  description:
    'Joseph Ayinde | Co-Founder & CEO of The Learning and Memory Lab. Polymath. Tar Heel. SF Bay Area.',
}

export default function AboutPage() {
  return (
    <>
      <AboutIntro />
      <FieldNotes />
      <Chapters index="01" />
      <Marquee />
      <ContactCTA />
    </>
  )
}
