import Image from 'next/image'
import { Reveal } from '@/components/site/Reveal'
import { projects, publications } from '@/lib/data'

export const metadata = {
  title: 'Work',
  description: 'Research, publications, and things built by Joseph Ayinde.',
}

const serif = 'font-[family-name:var(--font-instrument)]'
const rowGrid = 'grid grid-cols-1 gap-3 sm:grid-cols-[200px_1fr] sm:gap-8'

export default function ProjectsPage() {
  const built = projects.filter((p) => p.category === 'built')
  const research = [...publications].sort((a, b) => b.year - a.year)

  return (
    <>
      <Reveal>
        <p className="text-[14px] opacity-65">Work</p>
        <h1 className={`${serif} mt-4 max-w-[900px] text-[clamp(44px,6.4vw,84px)] leading-[0.98] tracking-[-0.015em] [text-wrap:balance]`}>
          Things I&rsquo;ve made, and things I&rsquo;ve studied.
        </h1>
      </Reveal>

      <section className="mt-20">
        <Reveal>
          <h2 className={`${serif} text-[clamp(32px,4vw,44px)] leading-none`}>Built</h2>
        </Reveal>
        <div className="mt-8 border-t border-current/15">
          {built.map((p, i) => (
            <Reveal
              as="section"
              key={p.id}
              delay={0.1 + i * 0.08}
              y={6}
              className={`${rowGrid} border-b border-current/15 py-8`}
            >
              <div>
                {p.image ? (
                  <div className="relative aspect-square w-[120px] overflow-hidden rounded-[3px] ring-1 ring-black/10 sm:w-full sm:max-w-[200px]">
                    <Image src={p.image} alt="" fill sizes="200px" className="object-cover" />
                  </div>
                ) : (
                  <span className="text-[13px] tabular-nums opacity-55">0{i + 1}</span>
                )}
              </div>
              <div className="max-w-[640px]">
                <h3 className={`${serif} text-[clamp(28px,3vw,36px)] leading-[1.05]`}>{p.title}</h3>
                <p className="mt-3 text-[16px] leading-[1.7] opacity-80 [text-wrap:pretty]">{p.description}</p>
                <p className="mt-4 text-[13px] opacity-55">{p.tags.join(' \u00b7 ')}</p>
                {p.link && (
                  <a
                    href={p.link}
                    target={p.external ? '_blank' : undefined}
                    rel={p.external ? 'noreferrer' : undefined}
                    className="mt-4 inline-block text-[14px] underline decoration-current/30 decoration-[1px] underline-offset-[5px] transition-[text-decoration-color] duration-300 hover:decoration-current"
                  >
                    {p.link.replace(/^https?:\/\//, '')} &#8599;
                  </a>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mt-24">
        <Reveal>
          <h2 className={`${serif} text-[clamp(32px,4vw,44px)] leading-none`}>Research</h2>
        </Reveal>
        <div className="mt-8 border-t border-current/15">
          {research.map((pub) => (
            <Reveal
              as="section"
              key={pub.id}
              y={6}
              className={`${rowGrid} border-b border-current/15 py-8`}
            >
              <span className="pt-[6px] text-[13px] tabular-nums opacity-60">{pub.year}</span>
              <div className="max-w-[680px]">
                <h3 className={`${serif} text-[clamp(22px,2.4vw,28px)] leading-[1.15] [text-wrap:balance]`}>
                  {pub.title}
                </h3>
                <p className="mt-2 text-[14px] opacity-75">{pub.authors.join(', ')}</p>
                <p className="mt-0.5 text-[14px] italic opacity-60">{pub.venue}</p>
                <details className="group mt-4">
                  <summary className="inline-flex cursor-pointer list-none items-center gap-2 text-[14px] opacity-75 transition-opacity duration-300 hover:opacity-100 [&::-webkit-details-marker]:hidden">
                    <span
                      aria-hidden
                      className="relative inline-block h-[9px] w-[9px] before:absolute before:left-0 before:top-1/2 before:h-px before:w-full before:-translate-y-1/2 before:bg-current after:absolute after:left-1/2 after:top-0 after:h-full after:w-px after:-translate-x-1/2 after:bg-current after:transition-transform after:duration-300 group-open:after:scale-y-0"
                    />
                    <span className="group-open:hidden">Read the abstract</span>
                    <span className="hidden group-open:inline">Close</span>
                  </summary>
                  <p className="mt-4 text-[15px] leading-[1.75] opacity-80 [text-wrap:pretty]">{pub.abstract}</p>
                  <p className="mt-3 text-[13px] opacity-55">{pub.tags.join(' \u00b7 ')}</p>
                </details>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <Reveal>
        <p className="mt-16 text-[13px] opacity-55">This site was pair-programmed with Claude Code.</p>
      </Reveal>
    </>
  )
}
