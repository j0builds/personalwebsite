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
          className="fixed inset-0 pointer-events-none z-[9998]"
          style={{
            background:
              'radial-gradient(ellipse at 45% 35%, rgba(127, 176, 230, 0.1) 0%, rgba(7, 12, 26, 0.02) 55%, transparent 100%)',
          }}
          aria-hidden
        />
      )}
    </AnimatePresence>
  )
}
