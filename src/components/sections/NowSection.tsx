'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { LamMark } from '@/components/shared/LamMark'
import { Reveal } from '@/components/shared/Reveal'
import { SITE_CONFIG } from '@/lib/constants'

const pillars = [
  { k: 'Lucy', v: 'An AI-native L&D platform for humans and machines.' },
  { k: 'Thesis', v: 'Your company becomes a system that learns and consolidates itself.' },
  { k: 'Backed by', v: 'Angels from Stanford to the US Military. Founders, Inc. & The Residency.' },
]

export function NowSection() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const rotate = useTransform(scrollYProgress, [0, 1], [-14, 14])
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.86, 1, 0.92])

  return (
    <section id="now" className="px-6 py-28 md:px-12 md:py-40">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <p className="eyebrow mb-10">
            <span className="text-signal">01</span> / Now
          </p>
        </Reveal>

        <div
          ref={ref}
          className="relative overflow-hidden rounded-[2rem] border hairline bg-gradient-to-br from-ink-2 via-ink to-ink p-8 md:p-14"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -right-24 -bottom-24 h-[480px] w-[480px] rounded-full bg-signal/[0.08] blur-[120px]"
          />
          <div className="relative grid items-center gap-14 md:grid-cols-12">
            <div className="md:col-span-7">
              <Reveal>
                <h2 className="font-display text-5xl leading-[0.95] tracking-[-0.02em] md:text-7xl">
                  The Learning
                  <br />
                  <span className="italic text-paper/80">and Memory</span> Lab
                </h2>
              </Reveal>
              <Reveal delay={0.1}>
                <p className="mt-8 max-w-lg text-lg leading-relaxed text-paper/60">
                  Full-time as co-founder &amp; CEO. The throughline of everything I&apos;ve
                  done is learning itself — how humans remember, how machines adapt, and how
                  both get better together. That is what the lab is for.
                </p>
              </Reveal>

              <dl className="mt-12 divide-y divide-paper/10 border-y hairline">
                {pillars.map((p, i) => (
                  <Reveal
                    key={p.k}
                    delay={0.15 + i * 0.07}
                    y={12}
                    className="grid grid-cols-[7rem_1fr] gap-6 py-5 text-sm md:grid-cols-[9rem_1fr]"
                  >
                    <dt className="eyebrow pt-0.5">{p.k}</dt>
                    <dd className="text-paper/75">{p.v}</dd>
                  </Reveal>
                ))}
              </dl>

              <Reveal delay={0.35}>
                <a
                  href={SITE_CONFIG.companyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group mt-10 inline-flex items-center gap-3 text-sm text-paper/80 transition-colors hover:text-paper"
                >
                  <span className="underline decoration-paper/25 underline-offset-[6px] group-hover:decoration-signal">
                    lamlab.ai
                  </span>
                  <span className="grid h-8 w-8 place-items-center rounded-full border border-paper/20 transition-all duration-300 group-hover:rotate-45 group-hover:border-signal group-hover:text-signal">
                    ↗
                  </span>
                </a>
              </Reveal>
            </div>

            <motion.div
              style={{ rotate, scale }}
              className="relative mx-auto aspect-square w-full max-w-[380px] md:col-span-5"
            >
              <div className="absolute inset-0 rounded-full border border-paper/10" />
              <div className="absolute inset-[12%] rounded-full border border-dashed border-paper/10" />
              <div className="absolute inset-[24%] rounded-full bg-paper/[0.03]" />
              <LamMark
                animated
                title="The Learning and Memory Lab"
                className="absolute inset-[26%] h-[48%] w-[48%] text-paper drop-shadow-[0_0_40px_rgba(122,240,176,0.25)]"
              />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
