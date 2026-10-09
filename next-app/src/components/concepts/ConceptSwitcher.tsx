'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useGateOpen } from '@/components/gate/useGateOpen'
import { CONCEPTS } from './content'

/** Review-only control for flipping between the five homepage concepts. */
export function ConceptSwitcher() {
  const pathname = usePathname()
  const router = useRouter()
  const open = useGateOpen()
  const slug = pathname.split('/')[2]
  const index = CONCEPTS.findIndex((c) => c.slug === slug)

  const prev = index >= 0 ? CONCEPTS[(index + CONCEPTS.length - 1) % CONCEPTS.length] : null
  const next = index >= 0 ? CONCEPTS[(index + 1) % CONCEPTS.length] : null

  useEffect(() => {
    if (!open || !prev || !next) return
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      const t = e.target as HTMLElement | null
      if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return
      if (e.key === 'ArrowLeft') router.push(`/concepts/${prev.slug}`)
      if (e.key === 'ArrowRight') router.push(`/concepts/${next.slug}`)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, prev, next, router])

  if (index < 0 || !prev || !next) return null
  const current = CONCEPTS[index]

  return (
    <nav
      aria-label="Homepage concepts"
      className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 transition-opacity duration-700"
      style={{ opacity: open ? 1 : 0, pointerEvents: open ? 'auto' : 'none' }}
    >
      <div className="flex h-9 items-center rounded-full bg-[rgba(24,24,22,0.72)] pl-1 pr-1 text-[12px] leading-none text-white/90 shadow-[0_6px_24px_-8px_rgba(0,0,0,0.45)] ring-1 ring-white/10 backdrop-blur-md font-sans">
        <Link
          href={`/concepts/${prev.slug}`}
          aria-label={`Previous concept: ${prev.name}`}
          className="grid h-7 w-7 place-items-center rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-white"
        >
          <Chevron dir="left" />
        </Link>
        <span className="whitespace-nowrap px-2 tabular-nums tracking-[0.02em]">
          <span className="text-white/50">{index + 1} / {CONCEPTS.length}</span>
          <span className="mx-2 inline-block h-3 w-px translate-y-[1px] bg-white/20 align-baseline" />
          <span>{current.name}</span>
        </span>
        <Link
          href={`/concepts/${next.slug}`}
          aria-label={`Next concept: ${next.name}`}
          className="grid h-7 w-7 place-items-center rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-white"
        >
          <Chevron dir="right" />
        </Link>
        <Link
          href="/concepts"
          className="ml-0.5 rounded-full px-2.5 py-[7px] text-white/60 transition-colors hover:bg-white/10 hover:text-white"
        >
          All
        </Link>
      </div>
    </nav>
  )
}

function Chevron({ dir }: { dir: 'left' | 'right' }) {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden>
      <path
        d={dir === 'left' ? 'M7.5 2.5 4 6l3.5 3.5' : 'M4.5 2.5 8 6 4.5 9.5'}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
