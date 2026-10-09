import Image from 'next/image'
import { Reveal } from '@/components/site/Reveal'
import { LINKS, SOCIALS } from '@/components/site/links'
import { experiences } from '@/lib/data'

export const metadata = {
  title: 'About',
  description:
    'Joseph Ayinde | CMU Scholar, CEO of Cognition, neurosurgery researcher.',
}

const PHOTOS = [
  {
    src: '/assets/images/neurosurgery.jpg',
    alt: 'Joseph in surgical scrubs and a mask beside a colleague in an operating theatre',
    caption: 'Computational Neurosurgery Lab, Sydney',
    year: '2023',
    position: 'object-[58%_50%]',
  },
  {
    src: '/assets/images/launch.jpg',
    alt: 'Joseph sitting in front of an Innovate Carolina sign',
    caption: 'LAUNCH Chapel Hill',
    year: '2024',
    position: 'object-[62%_50%]',
  },
  {
    src: '/assets/images/cmu.jpg',
    alt: 'Joseph smiling at the camera outdoors',
    caption: 'Carnegie Mellon LearnLab',
    year: '2025',
    position: 'object-[50%_35%]',
  },
] as const

const serif = 'font-[family-name:var(--font-instrument)]'
const prose = 'text-[17px] leading-[1.75] opacity-85 [text-wrap:pretty]'

export default function AboutPage() {
  return (
    <>
      <Reveal>
        <p className="text-[14px] opacity-65">About</p>
        <h1 className={`${serif} mt-4 text-[clamp(44px,6.4vw,84px)] leading-[0.98] tracking-[-0.015em]`}>
          The longer story.
        </h1>
      </Reveal>

      <Reveal delay={0.2} className="mt-12 max-w-[640px] space-y-6">
        <p className={prose}>
          I&rsquo;m from Greensboro, North Carolina, and I&rsquo;m a dual citizen of the United
          States and Nigeria. Most of my work happens at the edges: between biology and technology,
          between neuroscience and artificial intelligence, between what we know and what
          we&rsquo;re still finding out.
        </p>
        <p className={prose}>
          I arrived at UNC Chapel Hill at 18 as one of 25 students worldwide selected for the
          Chancellor&rsquo;s Science Scholars program, and graduated with honors in biology,
          neuroscience and chemistry.
        </p>
        <p className={prose}>
          In 2023 I became the first undergraduate intern at the world&rsquo;s first computational
          neurosurgery lab, in Sydney. I shadowed more than 80 operations and led a research
          project on AI ethics in neurosurgery under Prof. Antonio Di Ieva.
        </p>
        <p className={prose}>
          I co-founded Cognition (formerly HEALLY), a cognitive OS for learning. We prototyped and
          tested a non-invasive EEG-AI brain-computer interface, ran human-subject usability
          trials, and raised more than $150K with partners including Google DeepMind, NVIDIA and
          Carnegie Mellon&rsquo;s LearnLab.
        </p>
        <p className={prose}>
          My research spans operator theory for learning dynamics and evolutionary biology, the
          latter on an NSF-funded project in the Pfennig Lab. In 2025 I was a Computational Models
          of Learning Scholar at Carnegie Mellon&rsquo;s LearnLab.
        </p>
        <p className={prose}>
          Today I work on growth at Willow and do content engineering at Chatbase.
        </p>
      </Reveal>

      <Reveal delay={0.35} y={0} duration={1.8}>
        <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-6">
          {PHOTOS.map((p) => (
            <figure key={p.src}>
              <div className="relative aspect-[4/3] overflow-hidden rounded-[3px] sm:aspect-[4/5] shadow-[0_24px_48px_-28px_rgba(10,15,30,0.55)] ring-1 ring-black/10">
                <Image
                  src={p.src}
                  alt={p.alt}
                  fill
                  sizes="(min-width: 640px) 32vw, 92vw"
                  className={`object-cover ${p.position}`}
                />
              </div>
              <figcaption className="mt-3 flex items-baseline justify-between gap-4 text-[13px]">
                <span className="opacity-80">{p.caption}</span>
                <span className="tabular-nums opacity-55">{p.year}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </Reveal>

      <section className="mt-24">
        <Reveal>
          <h2 className={`${serif} text-[clamp(32px,4vw,44px)] leading-none`}>Along the way</h2>
        </Reveal>
        <ol className="mt-8 border-t border-current/15">
          {experiences.map((e) => (
            <Reveal
              as="li"
              key={e.id}
              y={6}
              duration={1}
              className="grid grid-cols-1 gap-1 border-b border-current/15 py-5 sm:grid-cols-[200px_1fr] sm:gap-8"
            >
              <span className="pt-[3px] text-[13px] tabular-nums opacity-60">{e.period}</span>
              <div className="max-w-[640px]">
                <p className="text-[16px] font-medium">{e.role}</p>
                <p className="mt-0.5 text-[15px] opacity-75">{e.organization}</p>
                {e.description && (
                  <p className="mt-2 text-[14px] leading-[1.65] opacity-65">{e.description}</p>
                )}
              </div>
            </Reveal>
          ))}
        </ol>
      </section>

      <section className="mt-24 max-w-[640px]">
        <Reveal>
          <h2 className={`${serif} text-[clamp(32px,4vw,44px)] leading-none`}>Write to me</h2>
          <p className={`${prose} mt-6`}>
            I&rsquo;m always glad to hear from fellow builders, researchers and anyone who&rsquo;s
            curious. Email is the best way to reach me.
          </p>
          <a
            href={LINKS.email.href}
            className={`${serif} mt-6 inline-block text-[clamp(24px,3vw,32px)] underline decoration-current/30 decoration-[1px] underline-offset-[6px] transition-[text-decoration-color] duration-300 hover:decoration-current`}
          >
            {LINKS.email.href.replace('mailto:', '')}
          </a>
          <p className="mt-6 flex gap-6 text-[14px]">
            {SOCIALS.map((s) => (
              <a
                key={s.href}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                className="opacity-70 underline decoration-current/30 underline-offset-[5px] transition-opacity duration-300 hover:opacity-100"
              >
                {s.label}
              </a>
            ))}
          </p>
        </Reveal>
      </section>
    </>
  )
}
