'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { TextScramble } from '@/components/shared/TextScramble'
import { MagneticButton } from '@/components/shared/MagneticButton'

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
        className="text-neutral-400/90 text-sm font-mono tracking-[0.22em] mb-5"
      >
        hey, i&apos;m
      </motion.p>

      <motion.h1 variants={line} className="mb-7">
        <TextScramble
          text="Joseph Ayinde"
          delay={400}
          speed={45}
          className="text-4xl md:text-6xl lg:text-7xl font-mono font-normal tracking-tight text-neutral-900"
        />
      </motion.h1>

      <motion.p
        variants={line}
        className="text-lg md:text-xl text-neutral-500/95 leading-[1.7] max-w-xl mb-10"
      >
        co-founder &amp; ceo of{' '}
        <a
          href="https://lamlab.ai"
          target="_blank"
          rel="noopener noreferrer"
          className="text-neutral-800 underline underline-offset-4 decoration-neutral-300 hover:decoration-neutral-500 transition-colors duration-300"
        >
          The Learning and Memory Lab
        </a>
        . building a world where humans and machines can learn together.
        polymath. Tar Heel. SF Bay Area.
        <br />
        <span className="inline-flex items-center gap-2 mt-2">
          <span className="relative flex h-1.5 w-1.5 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#3d5c4a]/50 opacity-60" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#3d5c4a]/80" />
          </span>
          <span>
            full-time on{' '}
            <a
              href="https://lamlab.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-800 underline underline-offset-4 decoration-neutral-300 hover:decoration-neutral-500 transition-colors duration-300"
            >
              Lam Lab
            </a>
          </span>
        </span>
      </motion.p>

      <motion.div variants={line} className="flex items-center gap-6">
        <MagneticButton className="inline-block">
          <Link
            href="/projects"
            className="block px-6 py-3 text-sm font-mono tracking-wide border border-neutral-300/80 text-neutral-600 hover:border-neutral-500 hover:text-neutral-900 transition-all duration-300 rounded-md"
          >
            view work
          </Link>
        </MagneticButton>
        <Link
          href="/about"
          className="text-sm text-neutral-400 hover:text-neutral-600 transition-colors duration-300 underline underline-offset-4 decoration-neutral-300 hover:decoration-neutral-400"
        >
          about me
        </Link>
      </motion.div>
    </motion.div>
  )
}
