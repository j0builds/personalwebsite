'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { useGateOpen } from '@/components/gate/useGateOpen'
import { Reveal } from './Reveal'
import { LINKS, SOCIALS } from './content'

const DAMPING = 0.986
const TOP: [number, number, number] = [16, 40, 52]
const BOTTOM: [number, number, number] = [7, 20, 28]
const MOON: [number, number, number] = [196, 222, 226]

/**
 * A two-buffer height-field ripple simulation at a fraction of screen resolution. The canvas
 * holds one pixel per cell and the browser upscales it, which keeps it soft and cheap.
 */
function usePond(canvasRef: React.RefObject<HTMLCanvasElement | null>, running: boolean) {
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: false })
    if (!ctx) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let cols = 0
    let rows = 0
    let cell = 4
    let cur = new Float32Array(0)
    let prev = new Float32Array(0)
    let refl = new Float32Array(0)
    let base = new Uint8ClampedArray(0)
    let img: ImageData | null = null

    const setup = () => {
      const w = window.innerWidth
      const h = window.innerHeight
      cell = Math.max(3, Math.ceil(w / 360))
      cols = Math.ceil(w / cell) + 2
      rows = Math.ceil(h / cell) + 2
      canvas.width = cols
      canvas.height = rows
      cur = new Float32Array(cols * rows)
      prev = new Float32Array(cols * rows)
      refl = new Float32Array(cols * rows)
      base = new Uint8ClampedArray(rows * 3)
      img = ctx.createImageData(cols, rows)
      const mx = cols * 0.5
      const my = rows * 0.3
      for (let y = 0; y < rows; y++) {
        const t = y / (rows - 1)
        for (let k = 0; k < 3; k++) base[y * 3 + k] = TOP[k] + (BOTTOM[k] - TOP[k]) * t
        for (let x = 0; x < cols; x++) {
          const dx = (x - mx) / (cols * 0.11)
          const dy = (y - my) / (rows * 0.42)
          const glow = Math.exp(-(dx * dx + dy * dy) * 1.6)
          const column = Math.exp(-dx * dx * 5) * Math.max(0, 1 - Math.abs(y - my) / (rows * 0.75))
          refl[y * cols + x] = Math.min(1, glow * 0.16 + column * 0.07)
        }
      }
    }

    const drop = (gx: number, gy: number, radius: number, strength: number) => {
      const r = Math.ceil(radius)
      for (let y = -r; y <= r; y++) {
        for (let x = -r; x <= r; x++) {
          const d = Math.sqrt(x * x + y * y)
          if (d > radius) continue
          const px = Math.round(gx + x)
          const py = Math.round(gy + y)
          if (px < 1 || py < 1 || px >= cols - 1 || py >= rows - 1) continue
          cur[py * cols + px] -= strength * (0.5 + 0.5 * Math.cos((Math.PI * d) / radius))
        }
      }
    }

    // Nine-point Laplacian so rings stay round instead of drifting toward squares.
    const step = () => {
      for (let y = 1; y < rows - 1; y++) {
        let i = y * cols + 1
        for (let x = 1; x < cols - 1; x++, i++) {
          const c = cur[i]
          const edge = cur[i - 1] + cur[i + 1] + cur[i - cols] + cur[i + cols]
          const diag = cur[i - cols - 1] + cur[i - cols + 1] + cur[i + cols - 1] + cur[i + cols + 1]
          const lap = (4 * edge + diag - 20 * c) / 6
          prev[i] = (2 * c - prev[i] + 0.42 * lap) * DAMPING
        }
      }
      const t = prev
      prev = cur
      cur = t
    }

    const render = () => {
      if (!img) return
      const out = img.data
      for (let y = 0; y < rows; y++) {
        const br = base[y * 3]
        const bg = base[y * 3 + 1]
        const bb = base[y * 3 + 2]
        for (let x = 0; x < cols; x++) {
          const i = y * cols + x
          const l = x > 0 ? cur[i - 1] : cur[i]
          const r = x < cols - 1 ? cur[i + 1] : cur[i]
          const u = y > 0 ? cur[i - cols] : cur[i]
          const d = y < rows - 1 ? cur[i + cols] : cur[i]
          const nx = l - r
          const ny = u - d
          const sx = Math.min(cols - 1, Math.max(0, Math.round(x + nx * 2.2)))
          const sy = Math.min(rows - 1, Math.max(0, Math.round(y + ny * 2.2)))
          const m = refl[sy * cols + sx]
          const shade = Math.max(-1, Math.min(1, (nx * 0.55 + ny) * 0.32))
          const lift = shade > 0 ? shade * 0.5 : shade * 0.28
          const o = i * 4
          out[o] = br + (MOON[0] - br) * m + lift * 120
          out[o + 1] = bg + (MOON[1] - bg) * m + lift * 150
          out[o + 2] = bb + (MOON[2] - bb) * m + lift * 160
          out[o + 3] = 255
        }
      }
      ctx.putImageData(img, 0, 0)
    }

    setup()
    render()
    if (reduce || !running) {
      const onResize = () => {
        setup()
        render()
      }
      window.addEventListener('resize', onResize)
      return () => window.removeEventListener('resize', onResize)
    }

    let last: { x: number; y: number } | null = null
    const onMove = (e: PointerEvent) => {
      const gx = e.clientX / cell
      const gy = e.clientY / cell
      if (last) {
        const dist = Math.hypot(gx - last.x, gy - last.y)
        if (dist < 1.6) return
        drop(gx, gy, 2.6, Math.min(1.4, 0.35 + dist * 0.08))
      }
      last = { x: gx, y: gy }
    }
    const onDown = (e: PointerEvent) => drop(e.clientX / cell, e.clientY / cell, 4, 3.2)
    const onLeave = () => {
      last = null
    }
    const onResize = () => setup()

    let nextDrop = performance.now() + 900
    let raf = 0
    const loop = (now: number) => {
      if (now > nextDrop) {
        drop(cols * (0.12 + Math.random() * 0.76), rows * (0.15 + Math.random() * 0.75), 3, 2.4)
        nextDrop = now + 2600 + Math.random() * 3400
      }
      step()
      render()
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerdown', onDown, { passive: true })
    document.addEventListener('pointerleave', onLeave)
    window.addEventListener('resize', onResize)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', onDown)
      document.removeEventListener('pointerleave', onLeave)
      window.removeEventListener('resize', onResize)
    }
  }, [canvasRef, running])
}

export function Water() {
  const canvas = useRef<HTMLCanvasElement>(null)
  const open = useGateOpen()
  const [moved, setMoved] = useState(false)
  usePond(canvas, open)

  useEffect(() => {
    if (!open) return
    const onMove = () => setMoved(true)
    window.addEventListener('pointermove', onMove, { once: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [open])

  const link =
    'pointer-events-auto underline decoration-[#d9e6ea]/25 decoration-[1px] underline-offset-[5px] transition-[text-decoration-color,color] duration-300 hover:text-white hover:decoration-[#d9e6ea]/80'

  return (
    <main className="relative h-[100svh] overflow-hidden bg-[#0b1d27] text-[#d9e6ea]">
      <canvas ref={canvas} aria-hidden className="absolute inset-0 h-full w-full" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(120% 90% at 50% 45%, rgba(5,14,20,0) 55%, rgba(5,14,20,0.55) 100%)' }}
      />

      <div className="pointer-events-none relative flex h-full flex-col items-center justify-center px-6 pb-10 text-center">
        <Reveal delay={0.3} duration={2}>
          <h1 className="font-[family-name:var(--font-fraunces)] text-[clamp(44px,7vw,92px)] font-light leading-[1] tracking-[-0.02em] [font-variation-settings:'opsz'_144,'SOFT'_100]">
            Joseph Ayinde
          </h1>
        </Reveal>
        <Reveal delay={0.7} duration={2}>
          <p className="mt-5 font-[family-name:var(--font-fraunces)] text-[clamp(19px,2.2vw,24px)] font-light italic text-[#d9e6ea]/80 [font-variation-settings:'opsz'_36,'SOFT'_100]">
            Nothing here is urgent.
          </p>
        </Reveal>
        <Reveal delay={1.1} duration={2}>
          <p className="mx-auto mt-6 max-w-[380px] text-[14px] leading-[1.7] text-[#d9e6ea]/55 [text-wrap:balance]">
            I build things where neuroscience meets software. Stay a while; the water is in no
            hurry either.
          </p>
        </Reveal>
        <Reveal delay={1.4} duration={2}>
          <nav className="mt-9 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[14px] text-[#d9e6ea]/80">
            <Link href={LINKS.work.href} className={link}>Work</Link>
            <Link href={LINKS.about.href} className={link}>About</Link>
            <a href={LINKS.email.href} className={link}>Email</a>
            {SOCIALS.map((s) => (
              <a key={s.href} href={s.href} target="_blank" rel="noreferrer" className={`${link} text-[#d9e6ea]/55`}>
                {s.label}
              </a>
            ))}
          </nav>
        </Reveal>
      </div>

      <p
        className="pointer-events-none absolute inset-x-0 bottom-[68px] text-center text-[11px] uppercase tracking-[0.24em] text-[#d9e6ea]/35 transition-opacity duration-[1500ms]"
        style={{ opacity: open && !moved ? 1 : 0 }}
      >
        Move slowly
      </p>
    </main>
  )
}
