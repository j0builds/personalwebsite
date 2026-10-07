import { projects } from '@/lib/data'
import { Reveal } from '@/components/shared/Reveal'
import { SectionHeading } from './SectionHeading'

export function WorkIndex({ index = '03' }: { index?: string }) {
  const built = projects.filter((p) => p.category === 'built')

  return (
    <section id="work" className="px-6 py-28 md:px-12 md:py-40">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          index={index}
          label="Work"
          title={
            <>
              Things brought from <span className="italic text-paper/70">idea</span> to reality.
            </>
          }
          aside="Products for humans and machines that learn — from SMS tutors to a digital twin of what you know."
        />

        <ul className="border-b hairline">
          {built.map((p, i) => {
            const Row = p.link ? 'a' : 'div'
            return (
              <Reveal as="li" key={p.id} delay={i * 0.06} y={16}>
                <Row
                  {...(p.link
                    ? {
                        href: p.link,
                        target: p.external ? '_blank' : undefined,
                        rel: p.external ? 'noopener noreferrer' : undefined,
                      }
                    : { tabIndex: 0, 'data-cursor-hover': true })}
                  className="group relative block border-t hairline py-8 outline-none md:py-10"
                >
                  <span
                    aria-hidden
                    className="absolute inset-0 origin-bottom scale-y-0 bg-paper/[0.03] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-y-100 group-focus-visible:scale-y-100"
                  />
                  <div className="relative grid grid-cols-[2.5rem_1fr_auto] items-baseline gap-4 md:grid-cols-12 md:gap-6">
                    <span className="font-mono text-xs text-paper/35 md:col-span-1">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <h3 className="font-display text-4xl leading-none tracking-[-0.01em] text-paper transition-transform duration-500 group-hover:translate-x-2 md:col-span-6 md:text-6xl">
                      {p.title}
                    </h3>
                    <span className="hidden text-sm text-paper/45 md:col-span-4 md:block">
                      {p.meta}
                    </span>
                    <span className="text-right text-xl text-paper/40 transition-all duration-500 group-hover:-rotate-45 group-hover:text-signal md:col-span-1">
                      {p.link ? '↗' : '→'}
                    </span>
                  </div>
                  <div className="relative grid grid-rows-[0fr] transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:grid-rows-[1fr] group-focus-visible:grid-rows-[1fr] [@media(hover:none)]:grid-rows-[1fr]">
                    <div className="overflow-hidden">
                      <div className="grid gap-4 pt-6 md:grid-cols-12 md:gap-6">
                        <p className="text-xs text-paper/45 md:hidden">{p.meta}</p>
                        <p className="max-w-xl text-sm leading-relaxed text-paper/60 md:col-span-6 md:col-start-2 md:text-base">
                          {p.description}
                        </p>
                        <ul className="flex flex-wrap content-start gap-2 md:col-span-4 md:col-start-8">
                          {p.tags.map((t) => (
                            <li
                              key={t}
                              className="rounded-full border border-paper/12 px-3 py-1 font-mono text-[11px] text-paper/50"
                            >
                              {t}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </Row>
              </Reveal>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
