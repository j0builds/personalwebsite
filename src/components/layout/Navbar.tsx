'use client'

import { motion, useMotionValueEvent, useScroll, useSpring } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { LamMark } from '@/components/shared/LamMark'
import { OPEN_COMMAND_MENU } from '@/components/shared/CommandMenu'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/projects', label: 'Work' },
  { href: '/about', label: 'About' },
]

export function Navbar() {
  const pathname = usePathname()
  const { scrollY, scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 })
  const [scrolled, setScrolled] = useState(false)

  useMotionValueEvent(scrollY, 'change', (y) => setScrolled(y > 24))

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 md:px-8 md:pt-5">
      <motion.div
        aria-hidden
        className="fixed inset-x-0 top-0 h-px origin-left bg-signal/70"
        style={{ scaleX: progress }}
      />
      <nav
        aria-label="Primary"
        className={`mx-auto flex max-w-7xl items-center justify-between rounded-full border py-2 pr-2 pl-4 transition-all duration-500 ${
          scrolled
            ? 'border-paper/10 bg-ink/70 shadow-[0_10px_40px_-12px_rgba(0,0,0,0.6)] backdrop-blur-xl'
            : 'border-transparent bg-transparent'
        }`}
      >
        <Link
          href="/"
          className="group flex items-center gap-2.5 text-paper/80 transition-colors hover:text-paper"
          aria-label="Joseph Ayinde — home"
        >
          <LamMark className="h-5 w-5 transition-transform duration-500 group-hover:rotate-[-8deg]" />
          <span className="font-mono text-xs tracking-[0.22em]">J0</span>
        </Link>

        <div className="flex items-center gap-1">
          <ul className="flex items-center">
            {navLinks.map(({ href, label }) => {
              const active = href === '/' ? pathname === '/' : pathname.startsWith(href)
              return (
                <li key={href}>
                  <Link
                    href={href}
                    aria-current={active ? 'page' : undefined}
                    className={`relative block rounded-full px-3.5 py-2 text-sm transition-colors duration-300 ${
                      active ? 'text-ink' : 'text-paper/55 hover:text-paper'
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 rounded-full bg-paper"
                        transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                      />
                    )}
                    <span className="relative">{label}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
          <button
            type="button"
            onClick={() => window.dispatchEvent(new Event(OPEN_COMMAND_MENU))}
            className="ml-1 hidden items-center gap-1.5 rounded-full border border-paper/12 px-3 py-2 font-mono text-[11px] text-paper/50 transition-colors hover:border-paper/30 hover:text-paper sm:flex"
            aria-label="Open command menu"
          >
            <kbd className="font-mono">⌘</kbd>
            <kbd className="font-mono">K</kbd>
          </button>
        </div>
      </nav>
    </header>
  )
}
