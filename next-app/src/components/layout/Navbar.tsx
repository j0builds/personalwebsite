'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, useScroll, useSpring, useMotionValueEvent } from 'framer-motion'
import { useState, useRef } from 'react'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/projects', label: 'Projects' },
  { href: '/about', label: 'About' },
]

function MagneticNavLink({
  href,
  label,
  isActive,
}: {
  href: string
  label: string
  isActive: boolean
}) {
  const ref = useRef<HTMLLIElement>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    setPosition({ x: x * 0.15, y: y * 0.15 })
  }

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 })
  }

  return (
    <li
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        transition: position.x === 0 ? 'transform 0.4s ease-out' : 'none',
      }}
    >
      <Link
        href={href}
        className={`relative text-sm tracking-wide transition-colors duration-300 ${
          isActive
            ? 'text-neutral-900'
            : 'text-neutral-400 hover:text-neutral-600'
        }`}
      >
        {label}
        {isActive && (
          <motion.div
            layoutId="nav-indicator"
            className="absolute -bottom-1 left-0 right-0 h-px bg-neutral-500"
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
          />
        )}
      </Link>
    </li>
  )
}

export function Navbar() {
  const pathname = usePathname()
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })
  const [scrolled, setScrolled] = useState(false)

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    setScrolled(latest > 0.01)
  })

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Scroll progress bar */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-[2px] bg-neutral-900/10 origin-left z-10"
        style={{ scaleX }}
      />

      <div className="px-6 py-4 md:px-12 md:py-6">
        <div
          className={`absolute inset-0 transition-all duration-500 ${
            scrolled
              ? 'bg-[#fafafa]/90 backdrop-blur-lg shadow-[0_1px_0_rgba(0,0,0,0.04)]'
              : 'bg-[#fafafa]/80 backdrop-blur-md'
          }`}
        />
        <nav className="relative flex items-center justify-between max-w-6xl mx-auto">
          <Link
            href="/"
            className="font-mono text-sm tracking-widest text-neutral-400 hover:text-neutral-900 transition-colors duration-300"
          >
            j0
          </Link>

          <ul className="flex items-center gap-5 md:gap-8">
            {navLinks.map(({ href, label }) => (
              <MagneticNavLink
                key={href}
                href={href}
                label={label}
                isActive={pathname === href}
              />
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}
