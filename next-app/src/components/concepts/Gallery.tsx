'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Reveal } from './Reveal'
import { LINKS, PERSON, SOCIALS } from './content'

const sign = 'whitespace-nowrap text-[11px] uppercase tracking-[0.2em] text-[#1b1b1a]/50'
const signLink =
  'group inline-flex items-baseline gap-2 whitespace-nowrap text-[11px] uppercase tracking-[0.2em] text-[#1b1b1a]/60 transition-colors duration-300 hover:text-[#1b1b1a]'

export function Gallery() {
  return (
    <main className="relative min-h-[100svh] overflow-hidden bg-[#efede8] text-[#1b1b1a]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(38% 58% at 50% 30%, rgba(255,253,247,0.95), rgba(255,253,247,0) 70%), linear-gradient(180deg, rgba(0,0,0,0) 78%, rgba(60,52,40,0.07) 100%)',
        }}
      />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-[#1b1b1a]/10 sm:bottom-[64px]" />

      <div className="relative mx-auto flex min-h-[100svh] max-w-[1320px] flex-col px-6 pb-24 pt-7 sm:px-10 sm:pb-[96px]">
        <Reveal as="header" className="flex items-start justify-between gap-6">
          <div className={sign}>
            <span className="block text-[#1b1b1a]/80">Room 1</span>
            <span className="mt-1 block">The Keeper</span>
          </div>
          <nav className="flex gap-6 text-right sm:gap-8">
            <Link href={LINKS.work.href} className={signLink}>
              <span className="hidden text-[#1b1b1a]/35 sm:inline">Room 2</span> Work
              <span className="transition-transform duration-300 group-hover:translate-x-0.5">&rarr;</span>
            </Link>
            <Link href={LINKS.about.href} className={signLink}>
              <span className="hidden text-[#1b1b1a]/35 sm:inline">Room 3</span> About
              <span className="transition-transform duration-300 group-hover:translate-x-0.5">&rarr;</span>
            </Link>
          </nav>
        </Reveal>

        <div className="flex flex-1 flex-col items-center justify-center gap-12 py-10 lg:grid lg:grid-cols-[1fr_auto_1fr] lg:items-end lg:gap-16 lg:py-6">
          <div className="hidden lg:block" />

          <Reveal delay={0.2} y={0} duration={2.2}>
            <figure className="relative bg-[#1d1b19] p-[6px] shadow-[0_2px_3px_rgba(30,25,18,0.18),18px_28px_44px_-22px_rgba(30,25,18,0.45)]">
              <div className="bg-[#fbfaf6] p-[clamp(16px,3.4svh,40px)] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.04)]">
                <div
                  className="relative shadow-[inset_0_0_0_1px_rgba(0,0,0,0.08)]"
                  style={{ height: 'min(58svh, 660px)', aspectRatio: '750 / 1334' }}
                >
                  <Image
                    src="/assets/images/soccer.jpg"
                    alt="Joseph in an orange keeper shirt, fully horizontal mid-dive, fingertips reaching a ball by the post"
                    fill
                    priority
                    sizes="(min-width: 1024px) 380px, 70vw"
                    className="object-cover"
                  />
                </div>
              </div>
            </figure>
          </Reveal>

          <Reveal delay={0.55} className="w-full max-w-[300px] self-center lg:mb-[9svh] lg:self-end">
            <aside className="bg-[#fbfaf6] px-5 py-5 text-[12.5px] leading-[1.55] shadow-[0_1px_2px_rgba(30,25,18,0.12)]">
              <p className="font-semibold">{PERSON.name}</p>
              <p className="text-[#1b1b1a]/60">American and Nigerian</p>
              <p className="mt-3">
                <span className="italic">Keeper, mid-dive</span>
              </p>
              <p className="text-[#1b1b1a]/60">Digital photograph</p>
              <p className="text-[#1b1b1a]/60">Collection of the subject</p>
              <p className="mt-4 text-[#1b1b1a]/80 [text-wrap:pretty]">
                Caught at full stretch, a moment after committing to one side, the subject is
                already past the point of changing his mind. The same commitment runs through the
                rest of his work: a brain-computer interface prototype at Cognition, a computational
                neurosurgery lab in Sydney, learning science at Carnegie Mellon. He currently works
                on growth at Willow and content engineering at Chatbase.
              </p>
            </aside>
          </Reveal>
        </div>

        <Reveal
          as="footer"
          delay={0.8}
          className="flex flex-col gap-3 text-[12px] text-[#1b1b1a]/55 sm:absolute sm:inset-x-10 sm:bottom-0 sm:h-[64px] sm:flex-row sm:items-center sm:justify-between"
        >
          <p>
            Please do not touch the artwork. You are welcome to{' '}
            <a
              href={LINKS.email.href}
              className="text-[#1b1b1a]/80 underline decoration-[#1b1b1a]/25 underline-offset-4 transition-colors hover:decoration-[#1b1b1a]"
            >
              write to it
            </a>
            .
          </p>
          <p className="flex gap-5">
            {SOCIALS.map((s) => (
              <a
                key={s.href}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                className="transition-colors hover:text-[#1b1b1a]"
              >
                {s.label}
              </a>
            ))}
          </p>
        </Reveal>
      </div>
    </main>
  )
}
