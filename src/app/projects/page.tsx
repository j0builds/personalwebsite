import { ContactCTA } from '@/components/sections/ContactCTA'
import { ResearchList } from '@/components/sections/ResearchList'
import { WorkIndex } from '@/components/sections/WorkIndex'
import { MaskedLine } from '@/components/shared/Reveal'
import { projects, publications } from '@/lib/data'

export const metadata = {
  title: 'Work',
  description:
    'Research and products from Joseph Ayinde — The Learning and Memory Lab, Lucy, Butterfly, and more.',
}

export default function ProjectsPage() {
  const builtCount = projects.filter((p) => p.category === 'built').length

  return (
    <>
      <section className="px-6 pt-36 pb-4 md:px-12 md:pt-44">
        <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-12">
          <div className="md:col-span-9">
            <p className="eyebrow mb-8">Work &amp; Research</p>
            <h1 className="font-display text-6xl leading-[0.9] tracking-[-0.03em] md:text-8xl lg:text-[8.5rem]">
              <MaskedLine delay={0.1}>Built, studied,</MaskedLine>
              <MaskedLine delay={0.2}>
                <span className="italic text-paper/75">remembered</span>
                <span className="text-signal">.</span>
              </MaskedLine>
            </h1>
          </div>
          <dl className="grid grid-cols-2 gap-6 self-end md:col-span-3">
            <div>
              <dt className="eyebrow mb-1">Products</dt>
              <dd className="font-display text-5xl">{String(builtCount).padStart(2, '0')}</dd>
            </div>
            <div>
              <dt className="eyebrow mb-1">Papers</dt>
              <dd className="font-display text-5xl">{String(publications.length).padStart(2, '0')}</dd>
            </div>
          </dl>
        </div>
      </section>
      <WorkIndex index="01" />
      <ResearchList index="02" />
      <ContactCTA />
    </>
  )
}
