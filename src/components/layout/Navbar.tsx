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

  const handleMouseLeave = () => setPosition({ x: 0, y: 0 })

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
          isActive ? 'text-white' : 'text-white/40 hover:text-white/75'
        }`}
      >
        {label}
        {isActive && (
          <motion.div
            layoutId="nav-indicator"
            className="absolute -bottom-1 left-0 right-0 h-px bg-white/45"
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
      <motion.div
        className="absolute top-0 left-0 right-0 z-10 h-px origin-left bg-white/15"
        style={{ scaleX }}
      />
      <div className="px-6 py-5 md:px-12 md:py-6">
        <div
          className={`absolute inset-0 transition-all duration-500 ${
            scrolled
              ? 'bg-[#07080c]/75 backdrop-blur-lg shadow-[0_1px_0_rgba(255,255,255,0.06)]'
              : 'bg-transparent'
          }`}
        />
        <nav className="relative mx-auto flex max-w-6xl items-center justify-between">
          <Link
            href="/"
            className="font-mono text-sm tracking-[0.22em] text-white/45 transition-colors duration-300 hover:text-white"
          >
            j0
          </Link>
          <ul className="flex items-center gap-6 md:gap-8">
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
