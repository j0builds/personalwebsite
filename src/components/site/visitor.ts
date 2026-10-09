'use client'

import { useSyncExternalStore } from 'react'
import { GATE_ATTEMPTS_KEY, GATE_OPEN_EVENT } from '@/components/gate/constants'
import { guestFrom, type Guest } from './guest'

export type { Guest }

const GUEST_KEY = 'j0-guest'
const FROM_KEY = 'j0-from'
const VISITS_KEY = 'j0-visits'
const COUNTED_KEY = 'j0-visit-counted'

export interface Visitor {
  guest: Guest | null
  /** IANA zone, e.g. "America/New_York". */
  zone: string
  /** Readable city for the zone, e.g. "New York", when the zone names one. */
  city: string | null
  lang: string
  /** A hello in the visitor's own language when it isn't English. */
  hello: string | null
  /** Friendly name of the site that linked here, if any. */
  from: string | null
  visits: number
  saveAttempts: number | null
}

const HELLO: Record<string, string> = {
  es: 'Hola',
  fr: 'Bonjour',
  pt: 'Olá',
  de: 'Hallo',
  it: 'Ciao',
  nl: 'Hallo',
  sv: 'Hej',
  da: 'Hej',
  no: 'Hei',
  nb: 'Hei',
  fi: 'Hei',
  pl: 'Cześć',
  tr: 'Merhaba',
  ru: 'Привет',
  uk: 'Привіт',
  ar: 'مرحبا',
  he: 'שלום',
  hi: 'नमस्ते',
  ja: 'こんにちは',
  ko: '안녕하세요',
  zh: '你好',
  vi: 'Xin chào',
  id: 'Halo',
  sw: 'Habari',
  yo: 'Ẹ n lẹ́',
  ig: 'Ndewo',
  ha: 'Sannu',
}

const REFERRERS: [RegExp, string][] = [
  [/(^|\.)linkedin\.com$|^lnkd\.in$/, 'LinkedIn'],
  [/(^|\.)github\.com$/, 'GitHub'],
  [/(^|\.)instagram\.com$/, 'Instagram'],
  [/^t\.co$|(^|\.)x\.com$|(^|\.)twitter\.com$/, 'X'],
  [/(^|\.)news\.ycombinator\.com$/, 'Hacker News'],
  [/(^|\.)reddit\.com$/, 'Reddit'],
  [/(^|\.)youtube\.com$/, 'YouTube'],
  [/(^|\.)google\.[a-z.]+$/, 'Google'],
  [/(^|\.)bing\.com$/, 'Bing'],
  [/(^|\.)duckduckgo\.com$/, 'DuckDuckGo'],
  [/(^|\.)chatgpt\.com$|(^|\.)openai\.com$/, 'ChatGPT'],
  [/(^|\.)perplexity\.ai$/, 'Perplexity'],
  [/(^|\.)claude\.ai$/, 'Claude'],
]

function store(kind: 'local' | 'session') {
  try {
    return kind === 'local' ? window.localStorage : window.sessionStorage
  } catch {
    return null
  }
}

function referrerLabel(): string | null {
  const session = store('session')
  const kept = session?.getItem(FROM_KEY)
  if (kept !== null && kept !== undefined) return kept || null
  let label = ''
  try {
    if (document.referrer) {
      const host = new URL(document.referrer).hostname.replace(/^www\./, '')
      if (host && host !== location.hostname) {
        label = REFERRERS.find(([re]) => re.test(host))?.[1] ?? host
      }
    }
  } catch {}
  session?.setItem(FROM_KEY, label)
  return label || null
}

function countVisit(): number {
  const local = store('local')
  const session = store('session')
  const seen = Number(local?.getItem(VISITS_KEY) ?? 0) || 0
  if (session?.getItem(COUNTED_KEY)) return Math.max(1, seen)
  const next = seen + 1
  local?.setItem(VISITS_KEY, String(next))
  session?.setItem(COUNTED_KEY, '1')
  return next
}

function readGuest(): Guest | null {
  const session = store('session')
  const fromUrl = guestFrom(location.pathname, location.search)
  if (fromUrl) {
    session?.setItem(GUEST_KEY, JSON.stringify(fromUrl))
    return fromUrl
  }
  try {
    const kept = session?.getItem(GUEST_KEY)
    return kept ? (JSON.parse(kept) as Guest) : null
  } catch {
    return null
  }
}

function readVisitor(): Visitor {
  const zone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
  const last = zone.split('/').pop() ?? ''
  const city = zone.includes('/') && !zone.startsWith('Etc/') ? last.replace(/_/g, ' ') : null
  const lang = navigator.language || 'en'
  const base = lang.split('-')[0].toLowerCase()
  const attempts = Number(store('session')?.getItem(GATE_ATTEMPTS_KEY))
  return {
    guest: readGuest(),
    zone,
    city,
    lang,
    hello: base === 'en' ? null : (HELLO[base] ?? null),
    from: referrerLabel(),
    visits: countVisit(),
    saveAttempts: attempts > 0 ? attempts : null,
  }
}

let cache: { href: string; value: Visitor } | null = null

const subscribe = (onChange: () => void) => {
  const refresh = () => {
    cache = null
    onChange()
  }
  window.addEventListener(GATE_OPEN_EVENT, refresh)
  return () => window.removeEventListener(GATE_OPEN_EVENT, refresh)
}

const getSnapshot = () => {
  if (!cache || cache.href !== location.href) cache = { href: location.href, value: readVisitor() }
  return cache.value
}

/** What the browser already knows about this visit. Null during server render. */
export function useVisitor(): Visitor | null {
  return useSyncExternalStore(subscribe, getSnapshot, () => null)
}

export function greetingFor(hour: number) {
  if (hour >= 5 && hour < 12) return 'Good morning'
  if (hour >= 12 && hour < 17) return 'Good afternoon'
  if (hour >= 17 && hour < 23) return 'Good evening'
  return 'Still up'
}

const ordinal = (n: number) => {
  const s = ['th', 'st', 'nd', 'rd']
  const v = n % 100
  return `${n}${s[(v - 20) % 10] ?? s[v] ?? s[0]}`
}

/** Up to `max` small, true observations about this visit, most personal first. */
export function notesFor(v: Visitor, hour: number, max = 2): string[] {
  const notes: string[] = []
  const day = new Date().getDay()
  if (v.guest?.company) notes.push(`Say hi to everyone at ${v.guest.company}.`)
  if (v.saveAttempts === 1) notes.push('Saved it on the first try. Safe hands.')
  else if (v.saveAttempts && v.saveAttempts <= 3) notes.push(`Saved it on try ${v.saveAttempts}. Not bad at all.`)
  else if (v.saveAttempts) notes.push(`${v.saveAttempts} tries, but a save is a save.`)
  if (v.visits > 1) notes.push(`Welcome back. This is your ${ordinal(v.visits)} visit.`)
  if (v.from) notes.push(`Hello to everyone coming over from ${v.from}.`)
  if (v.hello) notes.push(`${v.hello}, by the way.`)
  if (hour < 5 || hour >= 23) notes.push('The internet will still be here tomorrow.')
  else if (day === 5) notes.push('Happy Friday.')
  else if (day === 0 || day === 6) notes.push('Hope the weekend is treating you well.')
  else if (day === 1 && hour < 12) notes.push('Go easy on yourself this Monday.')
  return notes.slice(0, max)
}
