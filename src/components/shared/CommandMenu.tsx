'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { SITE_CONFIG, SOCIAL_LINKS } from '@/lib/constants'

export const OPEN_COMMAND_MENU = 'j0:open-command-menu'

type Command = {
  id: string
  label: string
  group: 'Navigate' | 'Connect'
  hint?: string
  run: () => void
}

export function CommandMenu() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(0)
  const [toast, setToast] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const restoreFocus = useRef<HTMLElement | null>(null)

  const close = useCallback(() => {
    setOpen(false)
    restoreFocus.current?.focus?.()
  }, [])

  const commands = useMemo<Command[]>(() => {
    const go = (href: string) => () => router.push(href)
    const ext = (href: string) => () => window.open(href, '_blank', 'noopener,noreferrer')
    return [
      { id: 'home', label: 'Home', group: 'Navigate', hint: '/', run: go('/') },
      { id: 'work', label: 'Work', group: 'Navigate', hint: '/projects', run: go('/projects') },
      { id: 'research', label: 'Research', group: 'Navigate', hint: '/projects#research', run: go('/projects#research') },
      { id: 'about', label: 'About', group: 'Navigate', hint: '/about', run: go('/about') },
      { id: 'chapters', label: 'Chapters', group: 'Navigate', hint: '/about#chapters', run: go('/about#chapters') },
      {
        id: 'copy-email',
        label: 'Copy email address',
        group: 'Connect',
        hint: SOCIAL_LINKS.email,
        run: () => {
          navigator.clipboard?.writeText(SOCIAL_LINKS.email).then(
            () => {
              setToast('Email copied')
              window.setTimeout(() => setToast(null), 1800)
            },
            () => (window.location.href = `mailto:${SOCIAL_LINKS.email}`),
          )
        },
      },
      { id: 'lamlab', label: 'Visit The Learning and Memory Lab', group: 'Connect', hint: 'lamlab.ai', run: ext(SITE_CONFIG.companyUrl) },
      { id: 'linkedin', label: 'LinkedIn', group: 'Connect', run: ext(SOCIAL_LINKS.linkedin) },
      { id: 'github', label: 'GitHub', group: 'Connect', run: ext(SOCIAL_LINKS.github) },
      { id: 'instagram', label: 'Instagram', group: 'Connect', run: ext(SOCIAL_LINKS.instagram) },
    ]
  }, [router])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return commands
    return commands.filter((c) => `${c.label} ${c.hint ?? ''}`.toLowerCase().includes(q))
  }, [commands, query])

  useEffect(() => {
    const show = () => {
      restoreFocus.current = document.activeElement as HTMLElement | null
      setQuery('')
      setSelected(0)
      setOpen(true)
    }
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        if (open) close()
        else show()
      }
    }
    window.addEventListener('keydown', onKey)
    window.addEventListener(OPEN_COMMAND_MENU, show)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener(OPEN_COMMAND_MENU, show)
    }
  }, [open, close])

  useEffect(() => {
    if (open) requestAnimationFrame(() => inputRef.current?.focus())
  }, [open])

  const runAt = (i: number) => {
    const cmd = filtered[i]
    if (!cmd) return
    setOpen(false)
    cmd.run()
  }

  const onInputKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelected((s) => (filtered.length ? (s + 1) % filtered.length : 0))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelected((s) => (filtered.length ? (s - 1 + filtered.length) % filtered.length : 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      runAt(selected)
    } else if (e.key === 'Escape') {
      e.preventDefault()
      close()
    }
  }

  let lastGroup: string | null = null

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-start justify-center px-4 pt-[18vh]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
          >
            <button
              type="button"
              aria-label="Close command menu"
              tabIndex={-1}
              className="absolute inset-0 bg-ink/70 backdrop-blur-sm"
              onClick={close}
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Command menu"
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-paper/12 bg-ink-2/95 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)]"
            >
              <div className="flex items-center gap-3 border-b hairline px-5">
                <span className="h-2 w-2 rounded-full bg-signal" aria-hidden />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value)
                    setSelected(0)
                  }}
                  onKeyDown={onInputKey}
                  placeholder="Where to?"
                  aria-label="Search commands"
                  aria-activedescendant={filtered[selected] ? `cmd-${filtered[selected].id}` : undefined}
                  aria-controls="command-list"
                  className="h-14 flex-1 bg-transparent text-paper placeholder:text-paper/35 focus:outline-none"
                />
                <kbd className="rounded border border-paper/15 px-1.5 py-0.5 font-mono text-[10px] text-paper/40">
                  ESC
                </kbd>
              </div>
              <ul id="command-list" role="listbox" className="max-h-[50vh] overflow-y-auto p-2">
                {filtered.length === 0 && (
                  <li className="px-3 py-8 text-center text-sm text-paper/40">No matches.</li>
                )}
                {filtered.map((c, i) => {
                  const header = c.group !== lastGroup ? c.group : null
                  lastGroup = c.group
                  return (
                    <li key={c.id} role="presentation">
                      {header && (
                        <p className="px-3 pt-3 pb-1.5 font-mono text-[10px] tracking-[0.18em] text-paper/35 uppercase">
                          {header}
                        </p>
                      )}
                      <button
                        id={`cmd-${c.id}`}
                        type="button"
                        role="option"
                        aria-selected={i === selected}
                        onMouseMove={() => setSelected(i)}
                        onClick={() => runAt(i)}
                        className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                          i === selected ? 'bg-paper/[0.08] text-paper' : 'text-paper/65'
                        }`}
                      >
                        <span>{c.label}</span>
                        {c.hint && <span className="font-mono text-[11px] text-paper/35">{c.hint}</span>}
                      </button>
                    </li>
                  )
                })}
              </ul>
              <div className="flex items-center justify-between border-t hairline px-5 py-2.5 font-mono text-[10px] text-paper/35">
                <span>↑↓ navigate · ↵ select</span>
                <span>j0</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <motion.div
            role="status"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            className="fixed bottom-6 left-1/2 z-[101] -translate-x-1/2 rounded-full bg-paper px-4 py-2 font-mono text-xs text-ink"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
