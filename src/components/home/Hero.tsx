'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { TextScramble } from '@/components/shared/TextScramble'
import { MagneticButton } from '@/components/shared/MagneticButton'

const roles = [
  { prefix: 'currently founder at', label: 'Cognition', href: 'https://cognitionus.com' },
  { prefix: 'currently content engineer at', label: 'Chatbase', href: undefined },
  { prefix: 'currently at', label: 'Willow', href: undefined },
] as const

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

function RotatingRole() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % roles.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const role = roles[index]

  return (
    <span className="inline-flex items-center gap-2 mt-1">
      <span className="relative flex h-2 w-2 shrink-0">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
      </span>
      <AnimatePresence mode="wait">
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
          transition={{ duration: 0.4, ease: [0.25, 0.4, 0.25, 1] }}
        >
          {role.prefix}{' '}
          {role.href ? (
            <a
              href={role.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-700 underline underline-offset-4 decoration-neutral-300 hover:decoration-neutral-500 transition-colors duration-300"
            >
              {role.label}
            </a>
          ) : (
            <span className="text-neutral-700">{role.label}</span>
          )}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

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
        className="text-neutral-400 text-sm font-mono tracking-widest mb-4"
      >
        hey, i&apos;m
      </motion.p>

      <motion.h1 variants={line} className="mb-6">
        <TextScramble
          text="Joseph Ayinde"
          delay={400}
          speed={45}
          className="text-4xl md:text-6xl lg:text-7xl font-mono font-normal tracking-tight bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-500 bg-clip-text text-transparent"
        />
      </motion.h1>

      <motion.p
        variants={line}
        className="text-lg md:text-xl text-neutral-500 leading-relaxed max-w-xl mb-10"
      >
        22-year-old world-class scientist and builder. research at the
        intersection of neuroscience and machine learning, building in the
        human potential space. ex-OpenAI, ex-Scale AI, US NSF, Australian NIHI. founder of{' '}
        <a
          href="https://cognitionus.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-neutral-700 underline underline-offset-4 decoration-neutral-300 hover:decoration-neutral-500 transition-colors duration-300"
        >
          Cognition
        </a>
        .
        <br />
        <RotatingRole />
      </motion.p>

      <motion.div variants={line} className="flex items-center gap-6">
        <MagneticButton className="inline-block">
          <Link
            href="/projects"
            className="block px-6 py-3 text-sm font-mono tracking-wide border border-neutral-300 text-neutral-600 hover:border-neutral-500 hover:text-neutral-900 transition-all duration-300 rounded-lg hover:shadow-[0_0_20px_rgba(0,0,0,0.05)]"
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
