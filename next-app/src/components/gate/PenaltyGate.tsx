'use client'

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { PenaltyGame, type Phase } from './game'
import { computeLayout, zoneRects, type Layout, type Zone } from './scene'
import { GATE_OPEN_EVENT, GATE_STORAGE_KEY } from './constants'

const ZONES: { zone: Zone; label: string; key: string; aria: string }[] = [
  { zone: -1, label: 'Left', key: '←', aria: 'Dive left' },
  { zone: 0, label: 'Stay', key: '↑', aria: 'Stay in the middle' },
  { zone: 1, label: 'Right', key: '→', aria: 'Dive right' },
]

const AGAIN_LINES = ['Read him this time.', 'He’s watching you too.', 'Trust the first instinct.', 'One more. Breathe.']

function copyFor(phase: Phase, attempt: number, choice?: Zone, ballZone?: Zone) {
  if (phase === 'saved') return { title: 'Saved.', sub: attempt === 1 ? 'First time. Come on in.' : 'Come on in.' }
  if (phase === 'scored') {
    if (ballZone === 0 && choice !== 0) return { title: 'Goal.', sub: 'Chipped down the middle. Cheeky.' }
    if (choice === 0) return { title: 'Goal.', sub: 'He picked a corner.' }
    return { title: 'Goal.', sub: 'He went the other way.' }
  }
  if (attempt === 1) return { title: 'Pick a side.', sub: 'Guess where he’s putting it.' }
  return { title: 'Again.', sub: AGAIN_LINES[(attempt - 2) % AGAIN_LINES.length] }
}

const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect

const isOpen = () => document.documentElement.getAttribute('data-gate') === 'open'

export function PenaltyGate() {
  const rootRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const gameRef = useRef<PenaltyGame | null>(null)
  const [active, setActive] = useState(true)
  const [leaving, setLeaving] = useState(false)
  const [layout, setLayout] = useState<Layout | null>(null)
  const [phase, setPhase] = useState<Phase>('aim')
  const [info, setInfo] = useState<{ attempt: number; choice?: Zone; ballZone?: Zone }>({ attempt: 1 })
  const [hover, setHover] = useState<Zone | null>(null)
  const [touch, setTouch] = useState(false)

  useIsoLayoutEffect(() => {
    if (isOpen()) setActive(false)
    setTouch(window.matchMedia('(hover: none)').matches)
  }, [])

  const finish = useCallback(() => {
    try {
      sessionStorage.setItem(GATE_STORAGE_KEY, 'open')
    } catch {}
    document.documentElement.setAttribute('data-gate', 'open')
    window.scrollTo(0, 0)
    window.dispatchEvent(new Event(GATE_OPEN_EVENT))
    setActive(false)
  }, [])

  useEffect(() => {
    if (!active || isOpen()) return
    const canvas = canvasRef.current
    const root = rootRef.current
    if (!canvas || !root) return

    const game = new PenaltyGame(canvas, {
      onPhase: (p, i) => {
        setPhase(p)
        setInfo(i)
      },
      onExit: () => {
        setLeaving(true)
        window.setTimeout(finish, 950)
      },
    })
    gameRef.current = game

    const measure = () => {
      const W = root.clientWidth
      const H = root.clientHeight
      if (!W || !H) return
      const dpr = Math.min(window.devicePixelRatio || 1, 3)
      game.resize(W, H, dpr)
      setLayout(computeLayout(W, H))
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(root)
    const mq = window.matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`)
    mq.addEventListener('change', measure)

    const swallow = (e: Event) => {
      e.stopPropagation()
      if (e.cancelable) e.preventDefault()
    }
    root.addEventListener('wheel', swallow, { passive: false })
    root.addEventListener('touchmove', swallow, { passive: false })

    return () => {
      ro.disconnect()
      mq.removeEventListener('change', measure)
      root.removeEventListener('wheel', swallow)
      root.removeEventListener('touchmove', swallow)
      game.destroy()
      gameRef.current = null
    }
  }, [active, finish])

  const choose = useCallback((zone: Zone) => {
    gameRef.current?.choose(zone)
  }, [])

  useEffect(() => {
    if (!active || isOpen()) return
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      const onButton = (e.target as HTMLElement | null)?.closest?.('button')
      const map: Record<string, Zone> = {
        ArrowLeft: -1,
        a: -1,
        ArrowUp: 0,
        ArrowDown: 0,
        w: 0,
        s: 0,
        ArrowRight: 1,
        d: 1,
      }
      if (e.key === ' ' && !onButton) {
        e.preventDefault()
        choose(0)
        return
      }
      const z = map[e.key] ?? map[e.key.toLowerCase()]
      if (z !== undefined) {
        e.preventDefault()
        choose(z)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [active, choose])

  const setHoverZone = (z: Zone | null) => {
    setHover(z)
    gameRef.current?.setHover(z)
  }

  if (!active) return null

  const rects = layout ? zoneRects(layout) : null
  const copy = copyFor(phase, info.attempt, info.choice, info.ballZone)
  const showCopy = phase !== 'play'
  const canChoose = phase === 'aim'
  const columns =
    layout && rects
      ? [
          { left: 0, right: rects.splits[0] },
          { left: rects.splits[0], right: rects.splits[1] },
          { left: rects.splits[1], right: layout.W },
        ]
      : null
  const labelX = rects
    ? [
        (rects.goal.left + rects.splits[0]) / 2,
        (rects.splits[0] + rects.splits[1]) / 2,
        (rects.splits[1] + rects.goal.right) / 2,
      ]
    : null

  return (
    <div
      ref={rootRef}
      className="penalty-gate fixed inset-0 z-[10000] overflow-hidden bg-[#03050a] text-white select-none"
      style={{
        opacity: leaving ? 0 : 1,
        transform: leaving ? 'scale(1.045)' : 'scale(1)',
        filter: leaving ? 'blur(6px)' : 'blur(0px)',
        transition: 'opacity 900ms cubic-bezier(.4,0,.2,1), transform 1100ms cubic-bezier(.2,.7,.2,1), filter 900ms ease',
        touchAction: 'none',
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="gate-title"
      aria-describedby="gate-sub"
    >
      <canvas ref={canvasRef} className="absolute inset-0 block h-full w-full" aria-hidden />

      {layout && (
        <>
          <div
            className="pointer-events-none absolute inset-x-0 flex h-[96px] flex-col items-center justify-start text-center sm:h-[104px]"
            style={{ top: Math.round(layout.headY - 48) }}
          >
            <p className="font-mono text-[10px] uppercase leading-none tracking-[0.34em] text-white/45 sm:text-[11px]">
              One save to enter
            </p>
            <div className="relative mt-3 h-[56px] w-full sm:mt-4 sm:h-[64px]" aria-live="polite">
              <AnimatePresence mode="wait">
                {showCopy && (
                  <motion.div
                    key={`${phase}-${info.attempt}`}
                    initial={{ opacity: 0, y: 6, filter: 'blur(4px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, y: -4, filter: 'blur(4px)' }}
                    transition={{ duration: 0.38, ease: [0.25, 0.4, 0.25, 1] }}
                    className="absolute inset-x-0 top-0"
                  >
                    <h1
                      id="gate-title"
                      className="text-[26px] font-medium leading-[32px] tracking-[-0.02em] text-white sm:text-[32px] sm:leading-[38px]"
                    >
                      {copy.title}
                    </h1>
                    <p id="gate-sub" className="mt-1.5 text-[13px] leading-[18px] text-white/55 sm:text-[14px]">
                      {copy.sub}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="pointer-events-none absolute left-0 top-0 flex items-center px-5 sm:px-8" style={{ height: 56 }}>
            <span className="font-mono text-[13px] tracking-[0.08em] text-white/70">j0</span>
          </div>
          <div className="pointer-events-none absolute right-0 top-0 flex items-center px-5 sm:px-8" style={{ height: 56 }}>
            <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-white/40 tabular-nums sm:text-[11px]">
              Attempt {String(info.attempt).padStart(2, '0')}
            </span>
          </div>

          {columns &&
            ZONES.map(({ zone, aria }, i) => (
              <button
                key={zone}
                type="button"
                aria-label={aria}
                disabled={!canChoose}
                onClick={() => choose(zone)}
                onPointerEnter={(e) => e.pointerType === 'mouse' && setHoverZone(zone)}
                onPointerLeave={() => setHoverZone(null)}
                onFocus={() => setHoverZone(zone)}
                onBlur={() => setHoverZone(null)}
                className="absolute outline-none disabled:cursor-default enabled:cursor-pointer"
                style={{
                  left: columns[i].left,
                  width: columns[i].right - columns[i].left,
                  top: layout.topBand,
                  bottom: 0,
                  WebkitTapHighlightColor: 'transparent',
                }}
              />
            ))}

          {labelX && (
            <div
              className="pointer-events-none absolute inset-x-0"
              style={{ top: Math.round(layout.labelY), height: 0, opacity: canChoose ? 1 : 0, transition: 'opacity 400ms ease' }}
              aria-hidden
            >
              {ZONES.map(({ zone, label, key }, i) => {
                const lit = hover === zone
                return (
                  <div
                    key={zone}
                    className="absolute top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2.5"
                    style={{ left: labelX[i] }}
                  >
                    {!touch && (
                      <span
                        className="grid h-7 w-7 place-items-center rounded-[7px] border font-mono text-[13px] leading-none transition-colors duration-300"
                        style={{
                          borderColor: lit ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.18)',
                          color: lit ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.55)',
                          background: lit ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.02)',
                        }}
                      >
                        {key}
                      </span>
                    )}
                    <span
                      className="font-mono text-[10px] uppercase leading-none tracking-[0.28em] transition-colors duration-300 sm:text-[11px]"
                      style={{ color: lit ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.45)', marginRight: '-0.28em' }}
                    >
                      {label}
                    </span>
                  </div>
                )
              })}
              {touch && (
                <p className="absolute inset-x-0 top-11 text-center font-mono text-[10px] uppercase tracking-[0.28em] text-white/30">
                  Tap a side of the goal
                </p>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}
