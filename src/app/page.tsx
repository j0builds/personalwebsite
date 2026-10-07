import { Hero } from '@/components/home/Hero'
import { Chapters } from '@/components/sections/Chapters'
import { ContactCTA } from '@/components/sections/ContactCTA'
import { Marquee } from '@/components/sections/Marquee'
import { NowSection } from '@/components/sections/NowSection'
import { ResearchList } from '@/components/sections/ResearchList'
import { WorkIndex } from '@/components/sections/WorkIndex'

export default function Home() {
  return (
    <>
      <Hero />
      <Marquee />
      <NowSection />
      <Chapters index="02" />
      <WorkIndex index="03" />
      <ResearchList index="04" />
      <ContactCTA />
    </>
  )
}
