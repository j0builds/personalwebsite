'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export function CustomCursor() {
  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)
  const scale = useMotionValue(1)
  const opacity = useMotionValue(1)
  const rotate = useMotionValue(0)
  const ref = useRef<HTMLDivElement>(null)
  const lastX = useRef(0)
  const mouseDown = useRef(false)
  const [selecting, setSelecting] = useState(false)

  const springConfig = { damping: 25, stiffness: 250, mass: 0.5 }
  const smoothX = useSpring(cursorX, springConfig)
  const smoothY = useSpring(cursorY, springConfig)
  const smoothScale = useSpring(scale, { damping: 20, stiffness: 300 })
  const smoothRotate = useSpring(rotate, { damping: 15, stiffness: 100 })

  useEffect(() => {
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
    if (isTouchDevice) {
      opacity.set(0)
      return
    }

    const hasTextSelection = () => {
      const sel = window.getSelection()
      return sel !== null && !sel.isCollapsed && (sel.toString().length > 0)
    }

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX - 12)
      cursorY.set(e.clientY - 12)

      const dx = e.clientX - lastX.current
      if (!selecting) {
        rotate.set(rotate.get() + dx * 2)
      } else {
        const tilt = Math.max(-30, Math.min(30, dx * 3))
        rotate.set(tilt - 45)
      }
      lastX.current = e.clientX
    }

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (
        target.closest('a') ||
        target.closest('button') ||
        target.closest('[data-cursor-hover]')
      ) {
        scale.set(1.8)
      }
    }

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (
        target.closest('a') ||
        target.closest('button') ||
        target.closest('[data-cursor-hover]')
      ) {
        scale.set(1)
      }
    }

    const handleMouseDown = () => {
      mouseDown.current = true
      scale.set(0.7)
    }

    const handleMouseUp = () => {
      mouseDown.current = false
      scale.set(1)
      // Keep highlighter if there's still an active selection
      if (!hasTextSelection()) {
        setSelecting(false)
      }
    }

    const handleSelectionChange = () => {
      if (hasTextSelection()) {
        // Only show highlighter when actively dragging to select
        if (mouseDown.current) {
          setSelecting(true)
        }
      } else {
        setSelecting(false)
      }
    }

    window.addEventListener('mousemove', moveCursor)
    document.addEventListener('mouseover', handleMouseOver)
    document.addEventListener('mouseout', handleMouseOut)
    document.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('mouseup', handleMouseUp)
    document.addEventListener('selectionchange', handleSelectionChange)

    return () => {
      window.removeEventListener('mousemove', moveCursor)
      document.removeEventListener('mouseover', handleMouseOver)
      document.removeEventListener('mouseout', handleMouseOut)
      document.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('mouseup', handleMouseUp)
      document.removeEventListener('selectionchange', handleSelectionChange)
    }
  }, [cursorX, cursorY, scale, opacity, rotate, selecting])

  return (
    <motion.div
      ref={ref}
      className="fixed top-0 left-0 w-6 h-6 pointer-events-none z-[9999] hidden md:block select-none"
      style={{
        x: smoothX,
        y: smoothY,
        scale: smoothScale,
        rotate: smoothRotate,
        opacity,
        fontSize: '24px',
        lineHeight: 1,
      }}
      aria-hidden
    >
      {selecting ? '\u{1F58D}\u{FE0F}' : '\u26BD'}
    </motion.div>
  )
}
