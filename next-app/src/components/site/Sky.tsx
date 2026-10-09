'use client'

import { createContext, useContext, useSyncExternalStore, type ReactNode } from 'react'

type Rgb = [number, number, number]

// Sky at the zenith and at the horizon through a day, keyed by local hour.
const SKY: { h: number; top: string; bottom: string }[] = [
  { h: 0, top: '#0a1322', bottom: '#1a2540' },
  { h: 4.5, top: '#0e182b', bottom: '#28304d' },
  { h: 5.6, top: '#2a3858', bottom: '#b9877a' },
  { h: 6.6, top: '#6585ad', bottom: '#efc19a' },
  { h: 8, top: '#87acd2', bottom: '#dfe7ee' },
  { h: 12, top: '#79a5d2', bottom: '#e2ecf3' },
  { h: 16, top: '#88abd0', bottom: '#ebdcc7' },
  { h: 18, top: '#6a7ca4', bottom: '#f1b283' },
  { h: 19.3, top: '#394571', bottom: '#d88c76' },
  { h: 20.5, top: '#18223f', bottom: '#4a4868' },
  { h: 22, top: '#0d162a', bottom: '#222b45' },
  { h: 24, top: '#0a1322', bottom: '#1a2540' },
]

const hex = (s: string): Rgb => [1, 3, 5].map((i) => parseInt(s.slice(i, i + 2), 16)) as Rgb
const mix = (a: Rgb, b: Rgb, t: number): Rgb => a.map((v, i) => v + (b[i] - v) * t) as Rgb
const css = (c: Rgb) => `rgb(${c.map((v) => Math.round(v)).join(' ')})`
const lum = ([r, g, b]: Rgb) => (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255

const linear = (v: number) => {
  const c = v / 255
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
}
const relLum = ([r, g, b]: Rgb) => 0.2126 * linear(r) + 0.7152 * linear(g) + 0.0722 * linear(b)

const INK_DARK = hex('#1f2a38')
const INK_LIGHT = hex('#eef1f6')
const PAPER: Rgb = [255, 255, 255]
const DEEP = hex('#0b1220')

/** Nudges a sky colour toward white or deep navy until body ink on it reaches 7:1 contrast. */
function legible(c: Rgb, darkInk: boolean): Rgb {
  const ink = relLum(darkInk ? INK_DARK : INK_LIGHT)
  const toward = darkInk ? PAPER : DEEP
  for (let t = 0; t <= 1; t += 0.02) {
    const m = mix(c, toward, t)
    const l = relLum(m)
    const ratio = darkInk ? (l + 0.05) / (ink + 0.05) : (ink + 0.05) / (l + 0.05)
    if (ratio >= 7) return m
  }
  return toward
}

function skyAt(hour: number) {
  let i = 0
  while (i < SKY.length - 2 && SKY[i + 1].h <= hour) i++
  const a = SKY[i]
  const b = SKY[i + 1]
  const t = Math.min(1, Math.max(0, (hour - a.h) / (b.h - a.h)))
  const s = t * t * (3 - 2 * t)
  return { top: mix(hex(a.top), hex(b.top), s), bottom: mix(hex(a.bottom), hex(b.bottom), s) }
}

const subscribeMinute = (onChange: () => void) => {
  const id = window.setInterval(onChange, 15_000)
  return () => window.clearInterval(id)
}

// `?hour=19.5` previews any time of day.
const readHour = () => {
  const override = new URLSearchParams(location.search).get('hour')
  const forced = override === null ? NaN : Number(override)
  if (forced >= 0 && forced < 24) return forced
  const d = new Date()
  return d.getHours() + d.getMinutes() / 60
}

export function formatHour(hour: number) {
  const d = new Date()
  d.setHours(Math.floor(hour), Math.round((hour % 1) * 60), 0, 0)
  return d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })
}

// Deterministic so server and client agree.
const STARS = Array.from({ length: 70 }, (_, i) => {
  const r = (n: number) => {
    const x = Math.sin(i * 127.1 + n * 311.7) * 43758.5453
    return x - Math.floor(x)
  }
  const round = (v: number) => Math.round(v * 100) / 100
  return { x: round(r(1) * 100), y: round(r(2) * 62), s: r(3) < 0.85 ? 1 : 1.5, o: round(0.35 + r(4) * 0.55) }
})

export interface SkyState {
  /** Local hour as a fraction, or null until the client has read the clock. */
  hour: number | null
  /** True when the sky is bright enough to need dark ink. */
  light: boolean
  night: number
}

const SkyContext = createContext<SkyState>({ hour: null, light: false, night: 0 })

export const useSky = () => useContext(SkyContext)

/**
 * Paints the visitor's current sky behind the page and sets ink colour to match. The `reading`
 * variant stops short of the horizon so long text keeps one contrast level from top to bottom.
 */
export function Sky({ children, variant = 'full' }: { children: ReactNode; variant?: 'full' | 'reading' }) {
  const hour = useSyncExternalStore(subscribeMinute, readHour, () => null)
  const full = skyAt(hour ?? 12)
  const ready = hour !== null
  let sky = full
  let light = ready && lum(mix(full.top, full.bottom, 0.55)) > 0.5
  if (variant === 'reading') {
    const top = full.top
    const bottom = mix(full.top, full.bottom, 0.45)
    light = ready && relLum(mix(top, bottom, 0.5)) > 0.2
    sky = { top: legible(top, light), bottom: legible(bottom, light) }
  }
  const night = ready ? Math.min(1, Math.max(0, (0.34 - lum(sky.top)) / 0.22)) : 0

  return (
    <SkyContext.Provider value={{ hour, light, night }}>
      <div
        className={`relative min-h-[100svh] bg-[#141b29] transition-colors duration-1000 ${light ? 'text-[#1f2a38]' : 'text-[#eef1f6]'}`}
      >
        <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
          <div
            className="absolute inset-0 transition-opacity duration-[1600ms]"
            style={{
              opacity: ready ? 1 : 0,
              background: `linear-gradient(180deg, ${css(sky.top)} 0%, ${css(mix(sky.top, sky.bottom, 0.55))} 55%, ${css(sky.bottom)} 100%)`,
            }}
          />
          <div className="absolute inset-0 transition-opacity duration-1000" style={{ opacity: night }}>
            {STARS.map((s, i) => (
              <span
                key={i}
                className="absolute rounded-full bg-white"
                style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.s, height: s.s, opacity: s.o }}
              />
            ))}
          </div>
          <div className="absolute inset-0" style={{ opacity: ready ? 0.55 * (1 - night) ** 2 : 0 }}>
            <span className="window-cloud left-[-10%] top-[14%] h-[90px] w-[420px]" />
            <span className="window-cloud left-[38%] top-[8%] h-[60px] w-[300px] [animation-delay:-70s]" />
            <span className="window-cloud left-[62%] top-[30%] h-[70px] w-[360px] [animation-delay:-140s]" />
          </div>
        </div>
        <div className="relative">{children}</div>
      </div>
    </SkyContext.Provider>
  )
}

/** "It's 4:12 PM where you are." Renders a non-breaking space until the clock is known. */
export function LocalTime({ prefix = 'It\u2019s', suffix = 'where you are.' }: { prefix?: string; suffix?: string }) {
  const { hour } = useSky()
  return (
    <span suppressHydrationWarning>{hour === null ? '\u00a0' : `${prefix} ${formatHour(hour)} ${suffix}`}</span>
  )
}

export const linkClass =
  'underline decoration-current/30 decoration-[1px] underline-offset-[5px] transition-[text-decoration-color,opacity] duration-300 hover:decoration-current'
