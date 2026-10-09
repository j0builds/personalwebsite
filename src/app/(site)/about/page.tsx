import Image from 'next/image'
import { Reveal } from '@/components/site/Reveal'
import { LINKS, SOCIALS } from '@/components/site/links'

export const metadata = {
  title: 'About',
  description:
    'Joseph Ayinde | Co-Founder & CEO of The Learning and Memory Lab. Polymath. Tar Heel. SF Bay Area.',
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
const inlineLink =
  'underline decoration-current/30 decoration-[1px] underline-offset-[5px] transition-[text-decoration-color] duration-300 hover:decoration-current'

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
          I&rsquo;m from Greensboro, North Carolina, a dual citizen of the United States and
          Nigeria, and these days I live in the San Francisco Bay Area. Most of my work happens at
          the edges: between biology and technology, between how people learn and how machines do.
        </p>
        <p className={prose}>
          I&rsquo;m the co-founder and CEO of{' '}
          <a href={LINKS.lab.href} target="_blank" rel="noreferrer" className={inlineLink}>
            The Learning and Memory Lab
          </a>
          . We&rsquo;re building Lucy, an AI-native learning and development platform for humans
          and machines. We&rsquo;re backed by angels from Stanford to the US military, and
          affiliated with Founders, Inc. and The Residency.
        </p>
        <p className={prose}>
          It started early. At 6 I built a flashcard game on an iPod and ended up on the local
          news. At 18 I arrived at UNC Chapel Hill as one of 25 students worldwide selected for the
          Chancellor&rsquo;s Science Scholars program.
        </p>
        <p className={prose}>
          At 19 I grew HEALLY into a globally recognised learning company with more than $150K in
          funding, and flew alone to Sydney for a neurosurgical apprenticeship under Dr. Antonio Di
          Ieva and Dr. Eric Suero Molina, in the world&rsquo;s first computational neurosurgery lab.
        </p>
        <p className={prose}>
          At 20 I won my first international science award and my first national business award,
          and worked at Scale AI. At 21 I did research through the NSF and the US Department of
          Defense. In May 2025 I graduated from UNC with degrees in biology, neuroscience and
          chemistry, and went on to Carnegie Mellon as a Neuroscience and Machine Learning Scholar.
        </p>
        <p className={prose}>
          The throughline is learning itself: how people remember, how machines adapt, and how both
          get better together. That&rsquo;s what the lab is for.
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

      <section className="mt-24 max-w-[640px]">
        <Reveal>
          <h2 className={`${serif} text-[clamp(32px,4vw,44px)] leading-none`}>Write to me</h2>
          <p className={`${prose} mt-6`}>
            I&rsquo;m always glad to hear from founders, operators, investors, and HR and L&amp;D
            leaders who care about how humans and machines learn together. Email is the best way to
            reach me.
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
