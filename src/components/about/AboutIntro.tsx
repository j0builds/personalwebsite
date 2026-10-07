'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'
import { useRef } from 'react'
import { MaskedLine } from '@/components/shared/Reveal'

const EASE = [0.22, 1, 0.36, 1] as const

export function AboutIntro() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '12%'])

  return (
    <section ref={ref} className="px-6 pt-36 pb-20 md:px-12 md:pt-44 md:pb-28">
      <div className="mx-auto grid max-w-7xl gap-14 md:grid-cols-12 md:gap-6">
        <div className="md:col-span-7">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="eyebrow mb-8"
          >
            About
          </motion.p>
          <h1 className="font-display text-6xl leading-[0.9] tracking-[-0.03em] md:text-8xl lg:text-[8.5rem]">
            <MaskedLine delay={0.1}>Scientist.</MaskedLine>
            <MaskedLine delay={0.2}>
              <span className="italic text-paper/75">Builder.</span>
            </MaskedLine>
            <MaskedLine delay={0.3}>
              Polymath<span className="text-signal">.</span>
            </MaskedLine>
          </h1>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.5, ease: EASE }}
            className="mt-12 max-w-xl space-y-5 text-lg leading-relaxed text-paper/60"
          >
            <p>
              <span className="text-paper">Joseph Ayinde</span> is a world-class scientist and builder from
              Greensboro, North Carolina — a dual citizen of the United States and Nigeria, now
              based in the San Francisco Bay Area.
            </p>
            <p>
              Now co-founder &amp; CEO of{' '}
              <span className="text-paper">The Learning and Memory Lab</span>, building{' '}
              <span className="text-paper">Lucy</span> — an AI-native L&amp;D platform for humans
              and machines.
            </p>
          </motion.div>
        </div>

        <motion.figure
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, delay: 0.25, ease: EASE }}
          className="relative md:col-span-4 md:col-start-9 md:self-end"
        >
          <div className="relative aspect-[3/4] overflow-hidden rounded-[1.5rem] border hairline">
            <motion.div style={{ y }} className="absolute inset-[-8%]">
              <Image
                src="/assets/images/unc.JPG"
                alt="Joseph Ayinde looking out over Chapel Hill"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover grayscale-[0.35] transition-[filter] duration-700 hover:grayscale-0"
              />
            </motion.div>
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />
          </div>
          <figcaption className="eyebrow mt-4 flex justify-between">
            <span>Chapel Hill, NC</span>
            <span>Tar Heel</span>
          </figcaption>
        </motion.figure>
      </div>
    </section>
  )
}
