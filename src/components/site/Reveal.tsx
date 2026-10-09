'use client'

import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'
import { useGateOpen } from '@/components/gate/useGateOpen'

const EASE = [0.22, 0.61, 0.36, 1] as const

/** Holds content invisible until the penalty gate opens, then lets it settle in slowly. */
export function Reveal({
  children,
  delay = 0,
  y = 10,
  duration = 1.4,
  className,
  as = 'div',
}: {
  children: ReactNode
  delay?: number
  y?: number
  duration?: number
  className?: string
  as?: 'div' | 'section' | 'p' | 'span' | 'header' | 'footer' | 'nav' | 'figure' | 'aside' | 'h1' | 'li'
}) {
  const open = useGateOpen()
  const reduce = useReducedMotion()
  const Tag = motion[as]
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y }}
      animate={open ? { opacity: 1, y: 0 } : undefined}
      transition={{
        duration: reduce ? 0.3 : duration,
        delay: reduce ? 0 : delay,
        ease: EASE,
        y: reduce ? { duration: 0 } : { duration, delay, ease: EASE },
      }}
    >
      {children}
    </Tag>
  )
}
