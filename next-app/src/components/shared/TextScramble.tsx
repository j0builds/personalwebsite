'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*'

interface TextScrambleProps {
  text: string
  className?: string
  delay?: number
  speed?: number
}

export function TextScramble({
  text,
  className = '',
  delay = 0,
  speed = 50,
}: TextScrambleProps) {
  const [displayed, setDisplayed] = useState('')
  const [started, setStarted] = useState(false)
  const frameRef = useRef(0)
  const resolvedRef = useRef(0)

  const scramble = useCallback(() => {
    const target = text
    const totalFrames = target.length
    let frame = 0

    const tick = () => {
      let output = ''
      for (let i = 0; i < target.length; i++) {
        if (target[i] === ' ') {
          output += ' '
        } else if (i < frame) {
          output += target[i]
        } else {
          output += chars[Math.floor(Math.random() * chars.length)]
        }
      }
      setDisplayed(output)
      frame++
      if (frame <= totalFrames) {
        frameRef.current = window.setTimeout(tick, speed)
      }
    }

    // Start with all scrambled
    let initial = ''
    for (let i = 0; i < target.length; i++) {
      initial += target[i] === ' ' ? ' ' : chars[Math.floor(Math.random() * chars.length)]
    }
    setDisplayed(initial)

    // Begin resolving after a brief scramble period
    setTimeout(tick, 300)
  }, [text, speed])

  useEffect(() => {
    const timer = setTimeout(() => {
      setStarted(true)
      scramble()
    }, delay)

    return () => {
      clearTimeout(timer)
      if (frameRef.current) clearTimeout(frameRef.current)
    }
  }, [delay, scramble])

  if (!started) return <span className={className}>&nbsp;</span>

  return <span className={className}>{displayed}</span>
}
