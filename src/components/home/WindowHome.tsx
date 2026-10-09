'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { Reveal } from '@/components/site/Reveal'
import { LINKS, SOCIALS } from '@/components/site/links'
import { Sky, formatHour, linkClass, useSky } from '@/components/site/Sky'
import { greetingFor, notesFor, useVisitor } from '@/components/site/visitor'

const IN = 4
const OUT = 6
const CYCLES = 6

function Breathe() {
  const { light } = useSky()
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

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

function Greeting() {
  const { hour } = useSky()
  const v = useVisitor()
  if (hour === null || !v) return <span>&nbsp;</span>
  const name = v.guest ? `, ${v.guest.name}` : ''
  const where = v.city ? `in ${v.city}` : 'where you are'
  return (
    <span>
      {greetingFor(hour)}
      {name}. It&rsquo;s {formatHour(hour)} {where}.
    </span>
  )
}

function Notes() {
  const { hour } = useSky()
  const v = useVisitor()
  const notes = hour === null || !v ? [] : notesFor(v, hour)
  return (
    <p
      className="mt-4 min-h-[1.6em] max-w-[440px] font-[family-name:var(--font-instrument)] text-[19px] italic leading-[1.4] opacity-80 transition-opacity duration-700 [text-wrap:pretty]"
      style={{ opacity: notes.length ? undefined : 0 }}
    >
      {notes.join(' ')}
    </p>
  )
}

function HowDidYouKnow() {
  const { hour } = useSky()
  const v = useVisitor()
  if (hour === null || !v) return null
  const items = [
    `Your clock says ${formatHour(hour)} on a ${DAYS[new Date().getDay()]}.`,
    `Your timezone is ${v.zone.replace(/_/g, ' ')}.`,
    `Your browser's language is ${v.lang}.`,
    v.from ? `You came over from ${v.from}.` : 'You typed the address in, or used a bookmark.',
    v.visits > 1 ? `This browser has been here ${v.visits} times.` : 'This is the first visit from this browser.',
  ]
  if (v.saveAttempts) items.push(`You made the save on try ${v.saveAttempts}.`)
  if (v.guest) {
    items.push(`The link you were sent carried your name${v.guest.company ? ` and ${v.guest.company}` : ''}.`)
  }
  return (
    <details className="group relative mt-8 text-[13px]">
      <summary className="inline-flex cursor-pointer list-none items-center gap-2 opacity-60 transition-opacity duration-300 hover:opacity-100 [&::-webkit-details-marker]:hidden">
        <span aria-hidden className="inline-block w-3 text-center group-open:hidden">+</span>
        <span aria-hidden className="hidden w-3 text-center group-open:inline-block">&minus;</span>
        <span className="underline decoration-current/30 underline-offset-[5px]">How did you know?</span>
      </summary>
      <div className="mt-4 max-w-[440px] border-l border-current/20 pl-4 leading-[1.7] md:absolute md:left-0 md:top-full md:w-[440px]">
        <ul className="opacity-80">
          {items.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
        <p className="mt-3 opacity-60">
          None of it leaves your browser. There are no analytics or cookies here; the page just asks
          your browser what it already knows.
        </p>
        <p className="mt-3 opacity-60">
          Sending this to someone? Try{' '}
          <span className="font-[family-name:var(--font-space-mono)] text-[12px]">/hi/their-name</span>.
        </p>
      </div>
    </details>
  )
}

export function WindowHome() {
  return (
    <Sky>
      <main className="mx-auto grid min-h-[100svh] max-w-[1240px] grid-cols-1 items-center gap-12 px-6 pb-24 pt-14 sm:px-10 md:grid-cols-[1.08fr_0.92fr] md:gap-16 md:pb-16">
        <div className="max-w-[560px]">
          <Reveal delay={0.1}>
            <p className="text-[14px] tracking-[0.01em] opacity-70" suppressHydrationWarning>
              <Greeting />
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
            <Notes />
          </Reveal>
          <Reveal delay={0.6} className="mt-10">
            <Breathe />
          </Reveal>
          <Reveal delay={0.75}>
            <nav className="mt-12 flex flex-wrap gap-x-6 gap-y-2 text-[14px]">
              <Link href={LINKS.work.href} className={linkClass}>Work</Link>
              <Link href={LINKS.about.href} className={linkClass}>About</Link>
              <a href={LINKS.email.href} className={linkClass}>Email</a>
              {SOCIALS.map((s) => (
                <a key={s.href} href={s.href} target="_blank" rel="noreferrer" className={`${linkClass} opacity-70 hover:opacity-100`}>
                  {s.label}
                </a>
              ))}
            </nav>
            <HowDidYouKnow />
          </Reveal>
        </div>

        <Reveal delay={0.35} y={0} duration={2} className="relative mx-auto w-full max-w-[460px] md:max-w-none">
          <figure
            className="relative mx-auto aspect-[3/4] overflow-hidden rounded-[3px] shadow-[0_30px_60px_-30px_rgba(10,15,30,0.55)] ring-1 ring-black/10 md:mr-0"
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
      </main>
    </Sky>
  )
}
