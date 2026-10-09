'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { Reveal } from './Reveal'
import { LINKS, SOCIALS } from './content'

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

function skyAt(hour: number) {
  let i = 0
  while (i < SKY.length - 2 && SKY[i + 1].h <= hour) i++
  const a = SKY[i]
  const b = SKY[i + 1]
  const t = Math.min(1, Math.max(0, (hour - a.h) / (b.h - a.h)))
  const s = t * t * (3 - 2 * t)
  const top = mix(hex(a.top), hex(b.top), s)
  const bottom = mix(hex(a.bottom), hex(b.bottom), s)
  return { top, bottom, light: lum(mix(top, bottom, 0.55)) > 0.5 }
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

function useLocalHour() {
  return useSyncExternalStore(subscribeMinute, readHour, () => null)
}

function formatHour(hour: number) {
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

const IN = 4
const OUT = 6
const CYCLES = 6

function Breathe({ light }: { light: boolean }) {
  const [state, setState] = useState<'idle' | 'running' | 'done'>('idle')
  const [phase, setPhase] = useState<{ label: string; left: number }>({ label: '', left: CYCLES })
  const dot = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (state !== 'running') return
    const start = performance.now()
    let raf = 0
    const tick = (now: number) => {
      const t = (now - start) / 1000
      const total = (IN + OUT) * CYCLES
      if (t >= total) {
        setState('done')
        if (dot.current) dot.current.style.transform = 'scale(0.42)'
        return
      }
      const c = t % (IN + OUT)
      const inhale = c < IN
      const u = inhale ? c / IN : 1 - (c - IN) / OUT
      const e = 0.5 - 0.5 * Math.cos(Math.PI * u)
      if (dot.current) dot.current.style.transform = `scale(${0.42 + 0.58 * e})`
      const label = inhale ? 'Breathe in' : 'Breathe out'
      const left = CYCLES - Math.floor(t / (IN + OUT))
      setPhase((p) => (p.label === label && p.left === left ? p : { label, left }))
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [state])

  const ring = light ? 'ring-[#1f2a38]/25' : 'ring-white/30'
  const fill = light ? 'bg-[#1f2a38]/12' : 'bg-white/14'

  return (
    <button
      type="button"
      onClick={() => setState((s) => (s === 'running' ? 'idle' : 'running'))}
      className="group flex items-center gap-4 text-left"
      aria-live="polite"
    >
      <span className={`relative grid h-12 w-12 shrink-0 place-items-center rounded-full ring-1 ${ring}`}>
        <span
          ref={dot}
          className={`absolute inset-0 rounded-full ${fill} transition-transform ${state === 'running' ? 'duration-0' : 'duration-700'}`}
          style={{ transform: 'scale(0.42)' }}
        />
      </span>
      <span className="text-[15px] leading-[1.35]">
        {state === 'idle' && (
          <>
            <span className="block">Breathe with me</span>
            <span className="block opacity-60">One minute. Nothing else.</span>
          </>
        )}
        {state === 'running' && (
          <>
            <span className="block">{phase.label}</span>
            <span className="block tabular-nums opacity-60">
              {phase.left} {phase.left === 1 ? 'breath' : 'breaths'} left &middot; tap to stop
            </span>
          </>
        )}
        {state === 'done' && (
          <>
            <span className="block">That was a minute.</span>
            <span className="block opacity-60">Welcome back.</span>
          </>
        )}
      </span>
    </button>
  )
}

export function WindowHome() {
  const hour = useLocalHour()
  const sky = skyAt(hour ?? 12)
  const night = hour === null ? 0 : Math.min(1, Math.max(0, (0.34 - lum(sky.top)) / 0.22))
  const light = hour === null ? false : sky.light
  const text = light ? 'text-[#1f2a38]' : 'text-[#eef1f6]'
  const linkCls = `underline decoration-current/30 decoration-[1px] underline-offset-[5px] transition-[text-decoration-color] duration-300 hover:decoration-current`

  return (
    <main className={`relative min-h-[100svh] overflow-hidden bg-[#141b29] ${text} transition-colors duration-1000`}>
      <div
        aria-hidden
        className="absolute inset-0 transition-opacity duration-[1600ms]"
        style={{
          opacity: hour === null ? 0 : 1,
          background: `linear-gradient(180deg, ${css(sky.top)} 0%, ${css(mix(sky.top, sky.bottom, 0.55))} 55%, ${css(sky.bottom)} 100%)`,
        }}
      />
      <div aria-hidden className="absolute inset-0 transition-opacity duration-1000" style={{ opacity: night }}>
        {STARS.map((s, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-white"
            style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.s, height: s.s, opacity: s.o }}
          />
        ))}
      </div>
      <div aria-hidden className="absolute inset-0" style={{ opacity: hour === null ? 0 : 0.55 * (1 - night) ** 2 }}>
        <span className="window-cloud left-[-10%] top-[14%] h-[90px] w-[420px]" />
        <span className="window-cloud left-[38%] top-[8%] h-[60px] w-[300px] [animation-delay:-70s]" />
        <span className="window-cloud left-[62%] top-[30%] h-[70px] w-[360px] [animation-delay:-140s]" />
      </div>

      <div className="relative mx-auto grid min-h-[100svh] max-w-[1240px] grid-cols-1 items-center gap-12 px-6 pb-24 pt-14 sm:px-10 md:grid-cols-[1.08fr_0.92fr] md:gap-16 md:pb-16">
        <div className="max-w-[560px]">
          <Reveal delay={0.1}>
            <p className="text-[14px] tracking-[0.01em] opacity-70" suppressHydrationWarning>
              {hour === null ? '\u00a0' : `It\u2019s ${formatHour(hour)} where you are.`}
            </p>
          </Reveal>
          <Reveal delay={0.25}>
            <h1 className="mt-5 font-[family-name:var(--font-instrument)] text-[clamp(44px,6.4vw,84px)] leading-[0.98] tracking-[-0.015em] [text-wrap:balance]">
              Look up from the screen for a second.
            </h1>
          </Reveal>
          <Reveal delay={0.45}>
            <p className="mt-7 max-w-[440px] text-[16px] leading-[1.65] opacity-80 [text-wrap:pretty]">
              I&rsquo;m Joseph Ayinde. I build things where neuroscience meets software. There&rsquo;s
              no rush here; this page will wait while you do.
            </p>
          </Reveal>
          <Reveal delay={0.6} className="mt-10">
            <Breathe light={light} />
          </Reveal>
          <Reveal delay={0.75}>
            <nav className="mt-12 flex flex-wrap gap-x-6 gap-y-2 text-[14px]">
              <Link href={LINKS.work.href} className={linkCls}>Work</Link>
              <Link href={LINKS.about.href} className={linkCls}>About</Link>
              <a href={LINKS.email.href} className={linkCls}>Email</a>
              {SOCIALS.map((s) => (
                <a key={s.href} href={s.href} target="_blank" rel="noreferrer" className={`${linkCls} opacity-70 hover:opacity-100`}>
                  {s.label}
                </a>
              ))}
            </nav>
          </Reveal>
        </div>

        <Reveal delay={0.35} y={0} duration={2} className="relative mx-auto w-full max-w-[460px] md:max-w-none">
          <figure
            className="relative aspect-[3/4] overflow-hidden rounded-[3px] shadow-[0_30px_60px_-30px_rgba(10,15,30,0.55)] ring-1 ring-black/10 mx-auto md:mr-0"
            style={{ width: 'min(100%, calc(78svh * 0.75))' }}
          >
            <Image
              src="/assets/images/unc.JPG"
              alt="Joseph standing at a tall window, looking out over the trees and rooftops"
              fill
              priority
              sizes="(min-width: 768px) 42vw, 92vw"
              className="object-cover object-[40%_50%]"
            />
          </figure>
        </Reveal>
      </div>
    </main>
  )
}
