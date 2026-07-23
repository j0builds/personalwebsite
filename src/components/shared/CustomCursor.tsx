'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export function CustomCursor() {
  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)
  const scale = useMotionValue(1)
  const opacity = useMotionValue(1)
  const ref = useRef<HTMLDivElement>(null)
  const mouseDown = useRef(false)
  const [hovering, setHovering] = useState(false)

  const springConfig = { damping: 28, stiffness: 320, mass: 0.4 }
  const smoothX = useSpring(cursorX, springConfig)
  const smoothY = useSpring(cursorY, springConfig)
  const smoothScale = useSpring(scale, { damping: 22, stiffness: 280 })

  useEffect(() => {
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
    if (isTouchDevice) {
      opacity.set(0)
      return
    }

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX - 6)
      cursorY.set(e.clientY - 6)
    }

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (
        target.closest('a') ||
        target.closest('button') ||
        target.closest('[data-cursor-hover]')
      ) {
        setHovering(true)
        scale.set(2.2)
      }
    }

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (
        target.closest('a') ||
        target.closest('button') ||
        target.closest('[data-cursor-hover]')
      ) {
        setHovering(false)
        scale.set(1)
      }
    }

    const handleMouseDown = () => {
      mouseDown.current = true
      scale.set(0.75)
    }

    const handleMouseUp = () => {
      mouseDown.current = false
      scale.set(hovering ? 2.2 : 1)
    }

    window.addEventListener('mousemove', moveCursor)
    document.addEventListener('mouseover', handleMouseOver)
    document.addEventListener('mouseout', handleMouseOut)
    document.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      window.removeEventListener('mousemove', moveCursor)
      document.removeEventListener('mouseover', handleMouseOver)
      document.removeEventListener('mouseout', handleMouseOut)
      document.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [cursorX, cursorY, scale, opacity, hovering])

  return (
    <motion.div
      ref={ref}
      className="fixed top-0 left-0 pointer-events-none z-[9999] hidden md:block select-none"
      style={{
        x: smoothX,
        y: smoothY,
        scale: smoothScale,
        opacity,
      }}
      aria-hidden
    >
      <div
        className="h-3 w-3 rounded-full border border-neutral-500/50 bg-neutral-800/15 backdrop-blur-[1px]"
        style={{
          boxShadow: '0 0 0 1px rgba(255,255,255,0.35) inset',
        }}
      />
    </motion.div>
  )
}
