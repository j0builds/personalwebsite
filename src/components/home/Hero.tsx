'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { TextScramble } from '@/components/shared/TextScramble'
import { MagneticButton } from '@/components/shared/MagneticButton'
import { LamLogo } from '@/components/shared/LamLogo'

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
} as const

const line = {
  hidden: { opacity: 0, y: 20, filter: 'blur(10px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.8, ease: [0.25, 0.4, 0.25, 1] as const },
  },
} as const

export function Hero() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="visible"
      className="relative z-10 px-6 md:px-12 max-w-3xl"
    >
      <motion.p
        variants={line}
        className="text-white/50 text-sm font-mono tracking-[0.22em] mb-5"
      >
        hey, i&apos;m
      </motion.p>

      <motion.h1 variants={line} className="mb-7">
        <TextScramble
          text="Joseph Ayinde"
          delay={400}
          speed={45}
          className="text-4xl md:text-6xl lg:text-7xl font-mono font-normal tracking-tight text-white"
        />
      </motion.h1>

      <motion.div variants={line} className="mb-8">
        <a
          href="https://lamlab.ai"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 group"
        >
          <LamLogo
            variant="lockup"
            tone="light"
            markClassName="h-11 w-11 md:h-12 md:w-12"
            priority
          />
          <span className="sr-only">The Learning and Memory Lab</span>
        </a>
      </motion.div>

      <motion.p
        variants={line}
        className="text-lg md:text-xl text-white/70 leading-[1.7] max-w-xl mb-10"
      >
        co-founder &amp; ceo — full-time building a world where humans and
        machines can learn together. polymath. Tar Heel. SF Bay Area.
        <br />
        <span className="inline-flex items-center gap-2 mt-2">
          <span className="relative flex h-1.5 w-1.5 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-300/50 opacity-60" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-sky-300/90" />
          </span>
          <span>
            full-time on{' '}
            <a
              href="https://lamlab.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white underline underline-offset-4 decoration-white/30 hover:decoration-white/70 transition-colors duration-300"
            >
              The Learning and Memory Lab
            </a>
          </span>
        </span>
      </motion.p>

      <motion.div variants={line} className="flex items-center gap-6">
        <MagneticButton className="inline-block">
          <Link
            href="/projects"
            className="block px-6 py-3 text-sm font-mono tracking-wide border border-white/25 text-white/80 hover:border-white/55 hover:text-white transition-all duration-300 rounded-md"
          >
            view work
          </Link>
        </MagneticButton>
        <Link
          href="/about"
          className="text-sm text-white/45 hover:text-white/80 transition-colors duration-300 underline underline-offset-4 decoration-white/25 hover:decoration-white/50"
        >
          about me
        </Link>
      </motion.div>
    </motion.div>
  )
}
