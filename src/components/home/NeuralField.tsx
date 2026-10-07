'use client'

import { useEffect, useRef } from 'react'

type Node = { x: number; y: number; vx: number; vy: number; a: number; cool: number }
type Signal = { from: number; to: number; t: number }

const LINK_DIST = 150
const CURSOR_RADIUS = 190
const PAPER = '242, 238, 230'
const SIGNAL = '122, 240, 176'

export function NeuralField({ className = '' }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let width = 0
    let height = 0
    let nodes: Node[] = []
    const signals: Signal[] = []
    const pointer = { x: -9999, y: -9999, active: false }
    let raf = 0
    let running = false
    let visible = true
    let lastSpark = 0

    const seed = () => {
      const count = Math.round(Math.min(150, Math.max(42, (width * height) / 10500)))
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
        a: 0,
        cool: 0,
      }))
    }

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = rect.width
      height = rect.height
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      seed()
    }

    const excite = (x: number, y: number, radius: number, amount: number) => {
      for (const n of nodes) {
        const d = Math.hypot(n.x - x, n.y - y)
        if (d < radius) n.a = Math.min(1, n.a + amount * (1 - d / radius))
      }
    }

    const step = (time: number) => {
      ctx.clearRect(0, 0, width, height)

      if (time - lastSpark > 900) {
        lastSpark = time
        const n = nodes[Math.floor(Math.random() * nodes.length)]
        if (n) n.a = 1
      }

      for (const n of nodes) {
        n.x += n.vx
        n.y += n.vy
        if (n.x < -20) n.x = width + 20
        if (n.x > width + 20) n.x = -20
        if (n.y < -20) n.y = height + 20
        if (n.y > height + 20) n.y = -20

        if (pointer.active) {
          const dx = pointer.x - n.x
          const dy = pointer.y - n.y
          const d = Math.hypot(dx, dy)
          if (d < CURSOR_RADIUS) {
            n.a = Math.min(1, n.a + 0.05 * (1 - d / CURSOR_RADIUS))
            n.x -= (dx / (d || 1)) * 0.35 * (1 - d / CURSOR_RADIUS)
            n.y -= (dy / (d || 1)) * 0.35 * (1 - d / CURSOR_RADIUS)
          }
        }
        n.a *= 0.965
        if (n.cool > 0) n.cool -= 1
      }

      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i]
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const d2 = dx * dx + dy * dy
          if (d2 > LINK_DIST * LINK_DIST) continue
          const d = Math.sqrt(d2)
          const proximity = 1 - d / LINK_DIST
          const heat = Math.max(a.a, b.a)
          ctx.strokeStyle =
            heat > 0.15
              ? `rgba(${SIGNAL}, ${proximity * (0.08 + heat * 0.45)})`
              : `rgba(${PAPER}, ${proximity * 0.09})`
          ctx.lineWidth = 0.6 + heat * 0.6
          ctx.beginPath()
          ctx.moveTo(a.x, a.y)
          ctx.lineTo(b.x, b.y)
          ctx.stroke()

          if (signals.length < 70) {
            if (a.a > 0.7 && a.cool <= 0 && Math.random() < 0.08) {
              signals.push({ from: i, to: j, t: 0 })
              a.cool = 24
            } else if (b.a > 0.7 && b.cool <= 0 && Math.random() < 0.08) {
              signals.push({ from: j, to: i, t: 0 })
              b.cool = 24
            }
          }
        }
      }

      for (let s = signals.length - 1; s >= 0; s--) {
        const sig = signals[s]
        const from = nodes[sig.from]
        const to = nodes[sig.to]
        sig.t += 0.035
        if (!from || !to || sig.t >= 1) {
          if (to) to.a = Math.min(1, to.a + 0.55)
          signals.splice(s, 1)
          continue
        }
        const x = from.x + (to.x - from.x) * sig.t
        const y = from.y + (to.y - from.y) * sig.t
        ctx.fillStyle = `rgba(${SIGNAL}, ${0.9 * (1 - sig.t * 0.4)})`
        ctx.beginPath()
        ctx.arc(x, y, 1.6, 0, Math.PI * 2)
        ctx.fill()
      }

      for (const n of nodes) {
        const r = 1.1 + n.a * 2.2
        if (n.a > 0.2) {
          ctx.fillStyle = `rgba(${SIGNAL}, ${n.a * 0.18})`
          ctx.beginPath()
          ctx.arc(n.x, n.y, r * 4, 0, Math.PI * 2)
          ctx.fill()
        }
        ctx.fillStyle = n.a > 0.2 ? `rgba(${SIGNAL}, ${0.5 + n.a * 0.5})` : `rgba(${PAPER}, 0.32)`
        ctx.beginPath()
        ctx.arc(n.x, n.y, r, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    const loop = (time: number) => {
      step(time)
      raf = requestAnimationFrame(loop)
    }

    const start = () => {
      if (running || reduceMotion || !visible || document.hidden) return
      running = true
      raf = requestAnimationFrame(loop)
    }

    const stop = () => {
      running = false
      cancelAnimationFrame(raf)
    }

    const onPointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      pointer.x = e.clientX - rect.left
      pointer.y = e.clientY - rect.top
      pointer.active = pointer.y >= 0 && pointer.y <= rect.height
    }

    const onPointerDown = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      const y = e.clientY - rect.top
      if (y < 0 || y > rect.height) return
      excite(e.clientX - rect.left, y, 220, 1)
    }

    const onLeave = () => {
      pointer.active = false
    }

    const onVisibility = () => (document.hidden ? stop() : start())

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible) start()
      else stop()
    })

    resize()
    if (reduceMotion) {
      for (let i = 0; i < 6; i++) nodes[Math.floor(Math.random() * nodes.length)].a = 0.8
      step(0)
    }
    io.observe(canvas)
    start()

    const ro = new ResizeObserver(() => {
      resize()
      if (reduceMotion) step(0)
    })
    ro.observe(canvas)
    window.addEventListener('pointermove', onPointerMove, { passive: true })
    window.addEventListener('pointerdown', onPointerDown, { passive: true })
    document.addEventListener('pointerleave', onLeave)
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      stop()
      io.disconnect()
      ro.disconnect()
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('pointerleave', onLeave)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  return <canvas ref={canvasRef} className={className} aria-hidden />
}
