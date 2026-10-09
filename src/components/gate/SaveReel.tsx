'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import { motion, useReducedMotion } from 'framer-motion'

interface Print {
  src: string
  /** Focal point of the crop, as CSS percentages. */
  focus: string
  zoom: number
  title: string
  meta: string
  rotate: number
  dx: number
  dy: number
}

const PRINTS: Print[] = [
  {
    src: '/assets/images/soccer.jpg',
    focus: '46% 46%',
    zoom: 1.55,
    title: 'Joseph Ayinde',
    meta: 'Goalkeeper',
    rotate: -4,
    dx: -16,
    dy: 8,
  },
  {
    src: '/assets/images/saywordfc.jpg',
    focus: '50% 16%',
    zoom: 1.3,
    title: 'The Soccer Tournament',
    meta: 'Cary, NC',
    rotate: 3,
    dx: 14,
    dy: -6,
  },
  {
    src: '/assets/images/saywordfc.jpg',
    focus: '50% 72%',
    zoom: 1.05,
    title: 'Say Word FC',
    meta: '#1 · 2023',
    rotate: -1.8,
    dx: -6,
    dy: 4,
  },
  {
    src: '/assets/images/soccer.jpg',
    focus: '50% 40%',
    zoom: 1,
    title: 'Late to goal',
    meta: 'NC Fusion ECNL',
    rotate: 1.2,
    dx: 0,
    dy: 0,
  },
]

const FIRST = 0.45
const GAP = 0.42

/** Seconds from the save until the last print has landed. */
export const REEL_LENGTH = FIRST + GAP * (PRINTS.length - 1) + 0.5

const CAPTION = 34
const MAT = 6

/**
 * Press photos of the real keeper, fired off like camera flashes once the visitor makes their save.
 * Always mounted so the images are decoded before they're needed.
 */
export function SaveReel({
  run,
  centerX,
  centerY,
  maxHeight,
  maxWidth,
  onShutter,
}: {
  run: boolean
  centerX: number
  centerY: number
  maxHeight: number
  maxWidth: number
  onShutter?: () => void
}) {
  const calm = useReducedMotion()
  const h = Math.round(Math.min(maxHeight, 440, (maxWidth / 0.8) | 0))
  const w = Math.round(h * 0.8)

  useEffect(() => {
    if (!run || !onShutter) return
    const timers = PRINTS.map((_, i) => window.setTimeout(onShutter, (FIRST + GAP * i) * 1000))
    return () => timers.forEach(clearTimeout)
  }, [run, onShutter])

  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden style={{ visibility: run ? 'visible' : 'hidden' }}>
      <motion.div
        className="absolute inset-0"
        initial={false}
        animate={{ opacity: run ? 1 : 0 }}
        transition={{ duration: 0.6, delay: run ? FIRST - 0.2 : 0 }}
        style={{
          background: `radial-gradient(ellipse ${w * 1.6}px ${h * 1.1}px at ${centerX}px ${centerY}px, rgba(3,5,10,0.72), rgba(3,5,10,0.35) 70%, rgba(3,5,10,0.2))`,
        }}
      />
      {PRINTS.map((p, i) => {
        const delay = FIRST + GAP * i
        return (
          <motion.figure
            key={i}
            className="absolute m-0 shadow-[0_18px_50px_rgba(0,0,0,0.55)]"
            style={{
              width: w,
              height: h,
              top: centerY - h / 2,
              left: centerX - w / 2,
              padding: MAT,
              paddingBottom: 0,
              background: '#f1eee6',
              borderRadius: 2,
            }}
            initial={false}
            animate={
              run
                ? {
                    opacity: 1,
                    scale: 1,
                    x: calm ? 0 : p.dx,
                    y: calm ? 0 : p.dy,
                    rotate: calm ? 0 : p.rotate,
                  }
                : { opacity: 0, scale: calm ? 1 : 1.12, x: 0, y: calm ? 0 : 22, rotate: calm ? 0 : p.rotate * 2 }
            }
            transition={
              run
                ? {
                    default: { delay, duration: calm ? 0.4 : 0.5, ease: [0.16, 1, 0.3, 1] },
                    opacity: { delay, duration: calm ? 0.4 : 0.07 },
                  }
                : { duration: 0 }
            }
          >
            <div className="relative overflow-hidden bg-black" style={{ height: h - MAT - CAPTION }}>
              <motion.div
                className="absolute inset-0"
                style={{ transformOrigin: p.focus }}
                initial={false}
                animate={{ scale: run && !calm ? p.zoom * 1.06 : p.zoom }}
                transition={run ? { delay, duration: 3.2, ease: 'linear' } : { duration: 0 }}
              >
                <Image
                  src={p.src}
                  alt=""
                  fill
                  loading="eager"
                  sizes={`${w}px`}
                  className="object-cover"
                  style={{ objectPosition: p.focus }}
                />
              </motion.div>
              <motion.div
                className="absolute inset-0 bg-white"
                initial={false}
                animate={{ opacity: run ? 0 : 1 }}
                transition={run ? { delay: delay + 0.06, duration: 0.55, ease: 'easeOut' } : { duration: 0 }}
              />
            </div>
            <figcaption
              className="flex items-center justify-between gap-3 font-mono text-[9.5px] uppercase tracking-[0.16em] text-[#1b1d22] sm:text-[10px]"
              style={{ height: CAPTION }}
            >
              <span className="truncate">{p.title}</span>
              <span className="shrink-0 text-[#1b1d22]/50">{p.meta}</span>
            </figcaption>
          </motion.figure>
        )
      })}
      {!calm &&
        PRINTS.map((_, i) => (
          <motion.div
            key={`flash-${i}`}
            className="absolute inset-0 bg-white mix-blend-screen"
            initial={false}
            animate={{ opacity: run ? [0, 0.32, 0] : 0 }}
            transition={run ? { delay: FIRST + GAP * i, duration: 0.24, times: [0, 0.12, 1] } : { duration: 0 }}
          />
        ))}
    </div>
  )
}
