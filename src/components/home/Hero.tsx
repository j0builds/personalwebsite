'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { NeuralField } from '@/components/home/NeuralField'
import { LamMark } from '@/components/shared/LamMark'
import { LocalTime } from '@/components/shared/LocalTime'
import { MagneticButton } from '@/components/shared/MagneticButton'
import { MaskedLine } from '@/components/shared/Reveal'
import { SITE_CONFIG } from '@/lib/constants'

const EASE = [0.22, 1, 0.36, 1] as const

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.9, delay, ease: EASE },
})

export function Hero() {
  return (
    <section className="relative flex min-h-[100svh] flex-col overflow-hidden px-6 pt-28 pb-8 md:px-12 md:pt-32">
      <NeuralField className="absolute inset-0 h-full w-full [mask-image:radial-gradient(ellipse_at_60%_40%,black_35%,transparent_80%)]" />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 right-[-10%] h-[620px] w-[620px] rounded-full bg-signal/10 blur-[140px]"
      />

      <div className="relative mx-auto flex w-full max-w-7xl flex-1 flex-col">
        <motion.a
          {...fadeUp(0.1)}
          href={SITE_CONFIG.companyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex w-fit items-center gap-2.5 rounded-full border border-paper/12 bg-ink/40 py-1.5 pr-4 pl-2 text-xs text-paper/70 backdrop-blur-md transition-colors duration-300 hover:border-paper/30 hover:text-paper"
        >
          <span className="h-2 w-2 animate-pulse-dot rounded-full bg-signal" />
          <span>Currently building Lucy at The Learning and Memory Lab</span>
          <span className="transition-transform duration-300 group-hover:translate-x-0.5">→</span>
        </motion.a>

        <div className="mt-auto pt-16">
          <motion.p {...fadeUp(0.25)} className="eyebrow mb-6">
            (j0) — Polymath · Tar Heel · SF Bay Area
          </motion.p>

          <h1 className="font-display text-[19vw] leading-[0.86] tracking-[-0.035em] text-paper md:text-[15vw] xl:text-[13.5rem]">
            <MaskedLine delay={0.2}>Joseph</MaskedLine>
            <MaskedLine delay={0.32} className="pl-[8vw] md:pl-[14vw]">
              <span className="italic text-paper/90">Ayinde</span>
              <span className="text-signal">.</span>
            </MaskedLine>
          </h1>

          <div className="mt-10 grid gap-10 border-t hairline pt-8 md:grid-cols-12 md:gap-6">
            <motion.p
              {...fadeUp(0.6)}
              className="max-w-md text-xl leading-snug text-paper/80 md:col-span-5 md:text-2xl"
            >
              Building a world where humans and machines can{' '}
              <span className="font-display text-[1.15em] italic text-paper">learn together</span>.
            </motion.p>

            <motion.dl
              {...fadeUp(0.7)}
              className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm md:col-span-4 md:col-start-7"
            >
              <div>
                <dt className="eyebrow mb-1">Role</dt>
                <dd className="text-paper/80">Co-founder &amp; CEO</dd>
              </div>
              <div>
                <dt className="eyebrow mb-1">Company</dt>
                <dd className="flex items-center gap-2 text-paper/80">
                  <LamMark className="h-4 w-4" /> Lam Lab
                </dd>
              </div>
              <div>
                <dt className="eyebrow mb-1">Based</dt>
                <dd className="text-paper/80">San Francisco</dd>
              </div>
              <div>
                <dt className="eyebrow mb-1">Local time</dt>
                <dd className="text-paper/80 tabular-nums">
                  <LocalTime />
                </dd>
              </div>
            </motion.dl>

            <motion.div
              {...fadeUp(0.8)}
              className="flex items-start gap-5 md:col-span-3 md:justify-end"
            >
              <MagneticButton className="inline-block">
                <a
                  href={SITE_CONFIG.companyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-full bg-paper px-6 py-3 text-sm font-medium text-ink transition-transform duration-300 hover:scale-[1.03]"
                >
                  Enter Lam Lab ↗
                </a>
              </MagneticButton>
              <Link
                href="/about"
                className="py-3 text-sm text-paper/55 underline decoration-paper/20 underline-offset-4 transition-colors duration-300 hover:text-paper hover:decoration-paper/60"
              >
                About me
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
