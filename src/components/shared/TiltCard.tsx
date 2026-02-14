'use client'

import { useRef, useState, useCallback } from 'react'
import { motion } from 'framer-motion'

interface TiltCardProps {
  children: React.ReactNode
  className?: string
}

export function TiltCard({ children, className = '' }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [transform, setTransform] = useState('')
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 })
  const [borderPosition, setBorderPosition] = useState({ x: 0, y: 0 })

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!ref.current) return
      const rect = ref.current.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width
      const y = (e.clientY - rect.top) / rect.height
      const rotateX = (y - 0.5) * -8
      const rotateY = (x - 0.5) * 8

      setTransform(
        `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`
      )
      setGlare({ x: x * 100, y: y * 100, opacity: 0.06 })
      setBorderPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top })
    },
    []
  )

  const handleMouseLeave = useCallback(() => {
    setTransform('')
    setGlare({ x: 50, y: 50, opacity: 0 })
    setBorderPosition({ x: 0, y: 0 })
  }, [])

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform,
        transition: transform ? 'none' : 'transform 0.5s ease-out',
      }}
      className={`relative ${className}`}
    >
      {/* Animated border glow that follows cursor */}
      <div
        className="pointer-events-none absolute -inset-px rounded-xl z-10 transition-opacity duration-300"
        style={{
          background: borderPosition.x
            ? `radial-gradient(300px circle at ${borderPosition.x}px ${borderPosition.y}px, rgba(0, 135, 83, 0.12), transparent 60%)`
            : 'none',
          opacity: borderPosition.x ? 1 : 0,
        }}
      />

      {/* Glare shimmer */}
      <div
        className="pointer-events-none absolute inset-0 rounded-xl z-10"
        style={{
          background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,${glare.opacity}), transparent 60%)`,
          transition: glare.opacity ? 'none' : 'opacity 0.5s ease-out',
        }}
      />
      {children}
    </motion.div>
  )
}
