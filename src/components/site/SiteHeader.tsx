'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LINKS } from './links'

const NAV = [LINKS.work, LINKS.about] as const

export function SiteHeader() {
  const pathname = usePathname()
  return (
    <header className="mx-auto flex max-w-[1240px] items-baseline justify-between gap-6 px-6 pt-7 sm:px-10">
      <Link
        href="/"
        className="font-[family-name:var(--font-instrument)] text-[22px] leading-none tracking-[-0.005em] transition-opacity duration-300 hover:opacity-70"
      >
        Joseph Ayinde
      </Link>
      <nav className="flex gap-6 text-[14px]">
        {NAV.map((l) => {
          const current = pathname === l.href
          return (
            <Link
              key={l.href}
              href={l.href}
              aria-current={current ? 'page' : undefined}
              className={`underline-offset-[5px] transition-opacity duration-300 ${
                current
                  ? 'underline decoration-current/50 decoration-[1px]'
                  : 'opacity-65 hover:opacity-100'
              }`}
            >
              {l.label}
            </Link>
          )
        })}
        <a href={LINKS.email.href} className="opacity-65 transition-opacity duration-300 hover:opacity-100">
          Email
        </a>
      </nav>
    </header>
  )
}
