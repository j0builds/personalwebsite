'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { SOCIAL_LINKS } from '@/lib/constants'

export function CopyEmail({ className = '' }: { className?: string }) {
  const [copied, setCopied] = useState(false)
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(SOCIAL_LINKS.email)
      setCopied(true)
      window.clearTimeout(timer.current)
      timer.current = window.setTimeout(() => setCopied(false), 1800)
    } catch {
      window.location.href = `mailto:${SOCIAL_LINKS.email}`
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className={`group relative inline-flex items-center gap-3 rounded-full border border-paper/15 bg-paper/[0.04] py-2 pr-2 pl-5 font-mono text-sm text-paper/80 backdrop-blur transition-colors duration-300 hover:border-paper/35 hover:text-paper ${className}`}
      aria-live="polite"
    >
      <span>{SOCIAL_LINKS.email}</span>
      <span className="relative grid h-8 min-w-[4.5rem] place-items-center overflow-hidden rounded-full bg-paper px-3 text-[11px] tracking-[0.14em] text-ink uppercase">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={copied ? 'copied' : 'copy'}
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -12, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {copied ? 'copied' : 'copy'}
          </motion.span>
        </AnimatePresence>
      </span>
    </button>
  )
}
