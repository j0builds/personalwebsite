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
      staggerChildren: 0.14,
      delayChildren: 0.12,
    },
  },
} as const

const line = {
  hidden: { opacity: 0, y: 18, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.9, ease: [0.25, 0.4, 0.25, 1] as const },
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
      <motion.div variants={line} className="mb-8">
        <a
          href="https://lamlab.ai"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex opacity-90 transition-opacity duration-300 hover:opacity-100"
        >
          <LamLogo
            variant="lockup"
            tone="dark"
            markClassName="h-10 w-10 md:h-11 md:w-11"
            priority
          />
        </a>
      </motion.div>

      <motion.p
        variants={line}
        className="mb-4 font-mono text-xs tracking-[0.28em] text-[#141311]/40 md:text-sm"
      >
        hey, i&apos;m
      </motion.p>

      <motion.h1 variants={line} className="mb-8">
        <TextScramble
          text="Joseph Ayinde"
          delay={350}
          speed={42}
          className="text-5xl font-mono font-normal tracking-tight text-[#141311] md:text-6xl lg:text-7xl"
        />
      </motion.h1>

      <motion.p
        variants={line}
        className="mb-4 max-w-xl text-xl leading-[1.55] text-[#141311]/72 md:text-2xl"
      >
        building a world where humans and machines can learn together.
      </motion.p>

      <motion.p
        variants={line}
        className="mb-10 max-w-lg text-base leading-relaxed text-[#141311]/50"
      >
        co-founder &amp; ceo of The Learning and Memory Lab. full-time.
        polymath. Tar Heel. SF.
      </motion.p>

      <motion.div variants={line} className="flex items-center gap-7">
        <MagneticButton className="inline-block">
          <Link
            href="/projects"
            className="block rounded-full border border-[#141311]/18 px-7 py-3 font-mono text-sm tracking-wide text-[#141311]/75 transition-all duration-300 hover:border-[#141311]/45 hover:text-[#141311]"
          >
            view work
          </Link>
        </MagneticButton>
        <Link
          href="/about"
          className="font-mono text-sm tracking-wide text-[#141311]/40 underline decoration-[#141311]/15 underline-offset-4 transition-colors duration-300 hover:text-[#141311]/70 hover:decoration-[#141311]/35"
        >
          about me
        </Link>
      </motion.div>
    </motion.div>
  )
}
