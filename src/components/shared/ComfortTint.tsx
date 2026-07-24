'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export function ComfortTint() {
  const [visible, setVisible] = useState(false)

  const triggerTint = useCallback(() => {
    setVisible(true)
    setTimeout(() => setVisible(false), 4200)
  }, [])

  useEffect(() => {
    const scheduleNext = () => {
      const delay = (90 + Math.random() * 40) * 1000
      return setTimeout(() => {
        triggerTint()
        timerRef = scheduleNext()
      }, delay)
    }

    let timerRef = scheduleNext()
    return () => clearTimeout(timerRef)
  }, [triggerTint])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 2.2, ease: 'easeInOut' }}
          className="pointer-events-none fixed inset-0 z-[9998]"
          style={{
            background:
              'radial-gradient(ellipse at 55% 40%, rgba(255,255,255,0.05) 0%, transparent 55%)',
          }}
          aria-hidden
        />
      )}
    </AnimatePresence>
  )
}
