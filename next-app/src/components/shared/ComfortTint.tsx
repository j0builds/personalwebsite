'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export function ComfortTint() {
  const [visible, setVisible] = useState(false)

  const triggerTint = useCallback(() => {
    setVisible(true)
    setTimeout(() => setVisible(false), 3000)
  }, [])

  useEffect(() => {
    const scheduleNext = () => {
      // Random interval between 75-105 seconds (centered around 90s)
      const delay = (75 + Math.random() * 30) * 1000
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
          transition={{ duration: 1.5, ease: 'easeInOut' }}
          className="fixed inset-0 pointer-events-none z-[9998]"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(255, 244, 214, 0.12) 0%, rgba(255, 236, 179, 0.06) 60%, transparent 100%)',
          }}
          aria-hidden
        />
      )}
    </AnimatePresence>
  )
}
