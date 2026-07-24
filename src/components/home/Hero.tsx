'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { MagneticButton } from '@/components/shared/MagneticButton'

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.15 },
  },
} as const

const item = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] as const },
  },
} as const

export function Hero() {
  return (
    <section className="relative z-10 flex min-h-screen items-center px-6 md:px-12 lg:px-16">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-8">
        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          className="max-w-xl"
        >
          <motion.a
            variants={item}
            href="https://lamlab.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="mb-10 inline-flex items-center gap-3 text-white/70 transition-colors duration-300 hover:text-white"
          >
            <Image
              src="/assets/brand/lam.png"
              alt=""
              width={40}
              height={40}
              priority
              className="h-9 w-9"
              aria-hidden
            />
            <span className="font-sans text-sm leading-tight tracking-tight">
              <span className="block">The Learning</span>
              <span className="block">and Memory Lab</span>
            </span>
          </motion.a>

          <motion.h1
            variants={item}
            className="mb-6 font-sans text-5xl font-medium tracking-tight text-white md:text-6xl lg:text-7xl"
          >
            Joseph Ayinde
          </motion.h1>

          <motion.p
            variants={item}
            className="mb-5 max-w-md font-sans text-xl leading-snug text-white/75 md:text-2xl"
          >
            building a world where humans and machines can learn together.
          </motion.p>

          <motion.p
            variants={item}
            className="mb-10 font-mono text-xs tracking-[0.18em] text-white/40 uppercase"
          >
            Co-Founder &amp; CEO · Full-time · SF
          </motion.p>

          <motion.div variants={item} className="flex items-center gap-6">
            <MagneticButton className="inline-block">
              <a
                href="https://lamlab.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-full bg-white px-7 py-3 font-mono text-sm tracking-wide text-[#0a0a0b] transition-opacity duration-300 hover:opacity-90"
              >
                enter Lam Lab
              </a>
            </MagneticButton>
            <Link
              href="/about"
              className="font-mono text-sm tracking-wide text-white/45 underline decoration-white/20 underline-offset-4 transition-colors duration-300 hover:text-white/80 hover:decoration-white/45"
            >
              about me
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto flex h-[260px] w-[260px] items-center justify-center md:h-[360px] md:w-[360px] lg:h-[420px] lg:w-[420px]"
        >
          <Image
            src="/assets/brand/lam.png"
            alt="The Learning and Memory Lab"
            width={420}
            height={420}
            priority
            className="h-full w-full object-contain"
          />
        </motion.div>
      </div>
    </section>
  )
}
