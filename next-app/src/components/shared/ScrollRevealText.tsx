'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

interface ScrollRevealTextProps {
  children: string
  className?: string
  highlightWords?: Record<string, string>
}

export function ScrollRevealText({
  children,
  className = '',
  highlightWords = {},
}: ScrollRevealTextProps) {
  const ref = useRef<HTMLParagraphElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-10% 0px' })

  const words = children.split(' ')

  return (
    <p ref={ref} className={className}>
      {words.map((word, i) => {
        const cleanWord = word.replace(/[.,;:!?']/g, '')
        const highlightClass = highlightWords[cleanWord] || ''

        return (
          <span key={i} className="inline-block overflow-hidden">
            <motion.span
              className={`inline-block ${highlightClass}`}
              initial={{ y: '100%', opacity: 0 }}
              animate={isInView ? { y: '0%', opacity: 1 } : { y: '100%', opacity: 0 }}
              transition={{
                duration: 0.5,
                delay: i * 0.02,
                ease: [0.25, 0.4, 0.25, 1],
              }}
            >
              {word}
              {i < words.length - 1 ? '\u00A0' : ''}
            </motion.span>
          </span>
        )
      })}
    </p>
  )
}
