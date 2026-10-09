'use client'

import Link from 'next/link'
import { useSyncExternalStore } from 'react'
import { Reveal } from './Reveal'
import { LINKS, PERSON, SOCIALS } from './content'

const PAPER_GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 .35 0 0 0 0 .3 0 0 0 0 .22 0 0 0 .06 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")"

const DESK_GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='260' height='260'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.6' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 .3 0 0 0 0 .24 0 0 0 0 .16 0 0 0 .08 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")"

const ink = 'text-[#2a2620]'
const link =
  'text-[#2a2620] underline decoration-[#b0613f]/45 decoration-[1px] underline-offset-[5px] transition-colors duration-300 hover:text-[#b0613f] hover:decoration-[#b0613f]'

const noSubscribe = () => () => {}
const localDate = () =>
  new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

function useLocalDate() {
  return useSyncExternalStore(noSubscribe, localDate, () => null)
}

export function Letter() {
  const date = useLocalDate()

  return (
    <main
      className="min-h-[100svh] bg-[#ebe4d6] px-4 pb-28 pt-[clamp(28px,8vh,96px)] sm:px-8"
      style={{ backgroundImage: `radial-gradient(120% 80% at 50% 0%, rgba(255,250,240,0.55), rgba(255,250,240,0) 60%), ${DESK_GRAIN}` }}
    >
      <Reveal y={14} duration={1.6}>
        <article
          className={`relative mx-auto max-w-[640px] rounded-[2px] bg-[#fbf8f1] px-[clamp(24px,7vw,80px)] pb-[clamp(40px,8vw,72px)] pt-[clamp(36px,7vw,68px)] font-[family-name:var(--font-newsreader)] ${ink} shadow-[0_1px_0_rgba(60,45,25,0.06),0_2px_6px_-2px_rgba(60,45,25,0.12),0_24px_48px_-24px_rgba(60,45,25,0.28)]`}
          style={{ backgroundImage: PAPER_GRAIN }}
        >
          <header className="flex items-baseline justify-between gap-6 border-b border-[#2a2620]/10 pb-5 font-sans text-[10.5px] uppercase tracking-[0.2em] text-[#2a2620]/50">
            <span>J. Ayinde</span>
            <span className="text-right">{PERSON.home.replace('North Carolina', 'NC')}</span>
          </header>

          <p className="mt-8 h-[22px] text-[15px] italic text-[#2a2620]/55" suppressHydrationWarning>
            {date}
          </p>

          <div className="mt-8 space-y-[1.15em] text-[clamp(17px,2.2vw,19px)] leading-[1.68] [font-feature-settings:'onum','kern'] [hanging-punctuation:first] [text-wrap:pretty]">
            <p>Dear stranger,</p>
            <p>
              Thanks for making the save. That was the only gate here, I promise. Everything past
              it is meant to be slow.
            </p>
            <p>
              I&rsquo;m Joseph, though most of the internet knows me as j0. I grew up in
              Greensboro, studied biology, neuroscience and chemistry at UNC Chapel Hill, and have
              spent the years since working where brains meet software: a computational
              neurosurgery lab in Sydney, the LearnLab at Carnegie Mellon, and Cognition, the
              company I co-founded to build a cognitive OS for learning. These days I work on
              growth at Willow and do content engineering at Chatbase.
            </p>
            <p>
              This page is deliberately quiet. There&rsquo;s nothing to scroll past, no feed, and
              nobody asking for your email. If you&rsquo;d like to see what I&rsquo;ve made,{' '}
              <Link href={LINKS.work.href} className={link}>
                the work is here
              </Link>
              . If you&rsquo;d like the longer story,{' '}
              <Link href={LINKS.about.href} className={link}>
                it&rsquo;s here
              </Link>
              . And if you&rsquo;d just like to talk,{' '}
              <a href={LINKS.email.href} className={link}>
                write back
              </a>
              .
            </p>
            <p>Take your time.</p>
          </div>

          <div className="mt-10">
            <p className="text-[clamp(17px,2.2vw,19px)]">Warmly,</p>
            <p
              aria-label="Joseph"
              className="-ml-1 mt-1 font-[family-name:var(--font-signature)] text-[64px] leading-[0.9] text-[#23324a] [transform:rotate(-4deg)] origin-left"
            >
              Joseph
            </p>
            <p className="mt-3 font-sans text-[11px] uppercase tracking-[0.2em] text-[#2a2620]/50">
              {PERSON.name}
            </p>
          </div>

          <footer className="mt-12 border-t border-[#2a2620]/10 pt-6 text-[15px] leading-[1.7] text-[#2a2620]/75">
            <span className="mr-2 italic">P.S.</span>
            I&rsquo;m also on{' '}
            {SOCIALS.map((s, i) => (
              <span key={s.href}>
                <a href={s.href} target="_blank" rel="noreferrer" className={link}>
                  {s.label}
                </a>
                {i < SOCIALS.length - 2 ? ', ' : i === SOCIALS.length - 2 ? ' and ' : ''}
              </span>
            ))}
            , though I&rsquo;d rather get a letter.
          </footer>
        </article>
      </Reveal>
    </main>
  )
}
