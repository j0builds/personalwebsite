import {
  BALL_R,
  KEEPER_Z,
  NET_Z,
  SPOT_Z,
  computeLayout,
  proj,
  drawBall,
  drawGroundShadow,
  drawNet,
  drawPosts,
  drawStatic,
  drawVignette,
  drawZoneHint,
  netDisplacement,
  type Bulge,
  type Layout,
  type Zone,
} from './scene'
import {
  KEEPER_KIT,
  KEEPER_READY,
  KEEPER_SET,
  STRIKER_KIT,
  drawFigure,
  gloveCenter,
  keeperCatch,
  keeperDive,
  keeperLanded,
  mixPose,
  strikerBackswing,
  strikerCelebrate,
  strikerDejected,
  strikerRun,
  strikerStand,
  strikerStrike,
  type Pose,
} from './figures'

export type Phase = 'aim' | 'play' | 'saved' | 'scored'

export interface GameEvents {
  onPhase: (phase: Phase, info: { attempt: number; choice?: Zone; ballZone?: Zone }) => void
  onExit: () => void
}

const G = 9.81
const PAUSE = 0.35
const RUN = 1.15
const SWING = 0.16
const CONTACT = PAUSE + RUN + SWING
const RUN_FROM = { x: 0.95, z: 15.0 }
const PLANT = { x: 0.3, z: 11.42 }
const STRIDES = 6

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v))
const easeOut = (t: number) => 1 - Math.pow(1 - clamp(t), 3)
const easeInOut = (t: number) => {
  const x = clamp(t)
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2
}
const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const rnd = (a: number, b: number) => a + Math.random() * (b - a)

interface Shot {
  choice: Zone
  ballZone: Zone
  save: boolean
  T: number
  vx: number
  vy: number
  vz: number
  arrive: number
  netHit: number
  diveFrom: Pose
  diveTo: Pose
  landed: Pose | null
  catchBall: boolean
}

interface FreeBall {
  x: number
  y: number
  z: number
  vx: number
  vy: number
  vz: number
  spin: number
}

export class PenaltyGame {
  private ctx: CanvasRenderingContext2D
  private L: Layout
  private dpr = 1
  private staticLayer: HTMLCanvasElement
  private vignetteLayer: HTMLCanvasElement
  private raf = 0
  private last = 0
  private clock = 0
  private shotStart = 0
  private shot: Shot | null = null
  private free: FreeBall | null = null
  private freeFrom = 0
  private attempt = 1
  private misses = 0
  private hover: Zone | null = null
  private hint: Record<string, number> = { '-1': 0, '0': 0, '1': 0 }
  private fade = 1
  private fadeTarget = 0
  private pendingReset = -1
  private emitted = new Set<string>()
  private overscan = 0
  private pan = 0
  private panTarget = 0
  private fontFamily = 'sans-serif'
  private destroyed = false

  constructor(
    private canvas: HTMLCanvasElement,
    private events: GameEvents,
  ) {
    this.ctx = canvas.getContext('2d', { alpha: false })!
    this.staticLayer = document.createElement('canvas')
    this.vignetteLayer = document.createElement('canvas')
    this.L = computeLayout(1, 1)
    this.fontFamily = getComputedStyle(canvas).fontFamily || 'sans-serif'
    this.last = performance.now()
    this.raf = requestAnimationFrame(this.frame)
  }

  get layout() {
    return this.L
  }

  resize(W: number, H: number, dpr: number) {
    this.dpr = dpr
    this.L = computeLayout(W, H)
    // Whole device pixels on both sides, so panning by whole css px stays on the pixel grid.
    this.overscan = Math.ceil(this.L.f * 0.6)
    const M = this.overscan
    const ph = Math.round(H * dpr)
    for (const c of [this.canvas, this.vignetteLayer]) {
      c.width = Math.round(W * dpr)
      c.height = ph
    }
    this.staticLayer.width = Math.round((W + 2 * M) * dpr)
    this.staticLayer.height = ph
    const paint = (c: HTMLCanvasElement, w: number, fn: (g: CanvasRenderingContext2D) => void) => {
      const g = c.getContext('2d')!
      g.setTransform(dpr, 0, 0, dpr, 0, 0)
      g.clearRect(0, 0, w, H)
      fn(g)
    }
    paint(this.staticLayer, W + 2 * M, (g) => drawStatic(g, { ...this.L, W: W + 2 * M, cx: this.L.cx + M }))
    paint(this.vignetteLayer, W, (g) => drawVignette(g, this.L))
  }

  setHover(zone: Zone | null) {
    this.hover = zone
  }

  choose(zone: Zone) {
    if (this.shot || this.pendingReset >= 0) return
    const ballZone: Zone =
      this.misses >= 3 ? zone : (() => {
        const r = Math.random()
        return r < 0.38 ? -1 : r < 0.62 ? 0 : 1
      })()
    const save = ballZone === zone

    let tx: number
    let ty: number
    let T: number
    if (ballZone === 0) {
      tx = rnd(-0.6, 0.6)
      if (save) {
        ty = rnd(0.55, 1.85)
        T = 0.64
      } else {
        // a chipped Panenka down the middle while the keeper goes early
        ty = rnd(1.15, 1.7)
        T = 0.92
      }
    } else {
      tx = ballZone * rnd(1.75, 2.95)
      ty = rnd(0.3, 2.05)
      T = rnd(0.56, 0.64)
    }
    const vx = tx / T
    const vz = -SPOT_Z / T
    const vy = (ty - BALL_R) / T + 0.5 * G * T
    const tk = ((SPOT_Z - KEEPER_Z) / SPOT_Z) * T
    const kx = vx * tk
    const ky = BALL_R + vy * tk - 0.5 * G * tk * tk
    const tn = ((SPOT_Z - NET_Z) / SPOT_Z) * T

    let diveTo: Pose
    let landed: Pose | null = null
    let catchBall = false
    if (zone === 0) {
      if (save) {
        diveTo = keeperCatch(kx, ky)
        catchBall = true
      } else {
        diveTo = mixPose(KEEPER_SET, keeperCatch(0, 1.6), 0.6)
      }
    } else {
      const gx = save ? kx : zone * 2.55
      const gy = save ? ky : 1.05
      diveTo = keeperDive(zone, gx, gy)
      landed = keeperLanded(zone, gx)
    }

    this.shot = {
      choice: zone,
      ballZone,
      save,
      T,
      vx,
      vy,
      vz,
      arrive: CONTACT + tk,
      netHit: CONTACT + tn,
      diveFrom: KEEPER_SET,
      diveTo,
      landed,
      catchBall,
    }
    this.free = null
    this.shotStart = this.clock
    this.emitted.clear()
    this.hover = null
    this.panTarget = 0
    if (!save) {
      const hx = vx * tn
      const hy = BALL_R + vy * tn - 0.5 * G * tn * tn
      const hit = proj({ ...this.L, pan: 0 }, hx, hy, NET_Z - netDisplacement({ x: hx, y: hy, amp: 0.95 }, hx, hy))
      const r = BALL_R * hit.s
      const edge = Math.max(20, this.L.W * 0.035) + r
      const lo = edge
      const hi = this.L.W - edge
      this.panTarget = hit.x > hi ? hi - hit.x : hit.x < lo ? lo - hit.x : 0
      this.panTarget = Math.max(-this.overscan, Math.min(this.overscan, Math.round(this.panTarget)))
    }
    this.events.onPhase('play', { attempt: this.attempt, choice: zone })
  }

  destroy() {
    this.destroyed = true
    cancelAnimationFrame(this.raf)
  }

  private emitOnce(key: string, fn: () => void) {
    if (this.emitted.has(key)) return
    this.emitted.add(key)
    fn()
  }

  private reset() {
    this.pan = 0
    this.panTarget = 0
    this.shot = null
    this.free = null
    this.attempt += 1
    this.emitted.clear()
    this.events.onPhase('aim', { attempt: this.attempt })
  }

  private frame = (now: number) => {
    if (this.destroyed) return
    const dt = Math.min(0.05, (now - this.last) / 1000)
    this.last = now
    this.clock += dt
    this.update(dt)
    this.render()
    this.raf = requestAnimationFrame(this.frame)
  }

  private update(dt: number) {
    for (const k of ['-1', '0', '1']) {
      const target = this.hover !== null && String(this.hover) === k && !this.shot ? 1 : 0
      this.hint[k] += (target - this.hint[k]) * Math.min(1, dt * 10)
    }
    this.fade += (this.fadeTarget - this.fade) * Math.min(1, dt * 7)

    if (this.pendingReset >= 0 && this.clock >= this.pendingReset) {
      if (this.fade > 0.97) {
        this.pendingReset = -1
        this.reset()
        this.fadeTarget = 0
      }
    }

    const sh = this.shot
    if (!sh) return
    const t = this.clock - this.shotStart

    if (!sh.save && t > CONTACT + sh.T * 0.35) {
      this.pan += (this.panTarget - this.pan) * (1 - Math.exp(-dt * 7))
    }

    if (sh.save && t >= sh.arrive && !this.free) {
      const p = this.ballFlight(sh, sh.arrive - CONTACT)
      const side = sh.choice
      this.free = sh.catchBall
        ? { ...p, vx: 0, vy: 0, vz: 0, spin: p.spin }
        : {
            ...p,
            vx: side * rnd(3.8, 5.2),
            vy: rnd(2.2, 3.4),
            vz: rnd(3.2, 4.4),
            spin: p.spin,
          }
      this.freeFrom = t
    }
    if (this.free && !sh.catchBall) {
      const b = this.free
      b.vy -= G * dt
      b.x += b.vx * dt
      b.y += b.vy * dt
      b.z += b.vz * dt
      b.spin += dt * 14
      if (b.y < BALL_R) {
        b.y = BALL_R
        b.vy = Math.abs(b.vy) * 0.45
        b.vx *= 0.8
        b.vz *= 0.8
        if (b.vy < 0.4) b.vy = 0
      }
    }

    if (sh.save) {
      if (t >= sh.arrive + 0.32) this.emitOnce('saved', () => this.events.onPhase('saved', { attempt: this.attempt, choice: sh.choice, ballZone: sh.ballZone }))
      if (t >= sh.arrive + 2.1) this.emitOnce('exit', () => this.events.onExit())
    } else {
      if (t >= sh.netHit + 0.28) {
        this.emitOnce('scored', () => {
          this.misses += 1
          this.events.onPhase('scored', { attempt: this.attempt, choice: sh.choice, ballZone: sh.ballZone })
        })
      }
      if (t >= sh.netHit + 2.3 && this.pendingReset < 0) {
        this.emitOnce('reset', () => {
          this.fadeTarget = 1
          this.pendingReset = this.clock
        })
      }
    }
  }

  private ballFlight(sh: Shot, tau: number) {
    return {
      x: sh.vx * tau,
      y: BALL_R + sh.vy * tau - 0.5 * G * tau * tau,
      z: SPOT_Z + sh.vz * tau,
      spin: tau * 22,
    }
  }

  private bulgeAmp(tau: number) {
    if (tau < 0) return 0
    if (tau < 0.14) return 0.95 * Math.sin((tau / 0.14) * (Math.PI / 2))
    const k = tau - 0.14
    return 0.95 * Math.exp(-k * 4.2) * Math.cos(k * 9)
  }

  private ballState(): { x: number; y: number; z: number; spin: number; bulge: Bulge | null } {
    const sh = this.shot
    const t = sh ? this.clock - this.shotStart : 0
    if (!sh || t < CONTACT) return { x: 0, y: BALL_R, z: SPOT_Z, spin: 0, bulge: null }
    if (this.free) {
      if (sh.catchBall) {
        const pose = this.keeperPose()
        const g = gloveCenter(pose)
        const low = g[1] < 1.15
        return { x: g[0], y: g[1] + (low ? 0.02 : 0.07), z: KEEPER_Z + (low ? 0.16 : 0.02), spin: this.free.spin, bulge: null }
      }
      return { ...this.free, bulge: null }
    }
    const tau = t - CONTACT
    const netTau = sh.netHit - CONTACT
    if (sh.save || tau < netTau) return { ...this.ballFlight(sh, tau), bulge: null }

    const hit = this.ballFlight(sh, netTau)
    const k = tau - netTau
    const amp = this.bulgeAmp(k)
    const drop = Math.max(0, k - 0.1)
    let y = hit.y - 0.5 * G * drop * drop
    if (y < BALL_R) {
      const land = Math.sqrt(Math.max(0, (2 * (hit.y - BALL_R)) / G)) + 0.1
      const after = k - land
      y = BALL_R + Math.max(0, Math.sin(after * 7) * 0.22 * Math.exp(-after * 5))
    }
    const bulge: Bulge = { x: hit.x, y: hit.y, amp: Math.max(0, amp) }
    const local = netDisplacement(bulge, hit.x, y)
    return {
      x: hit.x,
      y,
      z: NET_Z - local + BALL_R * 0.4,
      spin: hit.spin + k * 6,
      bulge: amp > 0.004 || amp < -0.004 ? bulge : null,
    }
  }

  private keeperPose(): Pose {
    const sh = this.shot
    const c = this.clock
    if (!sh) {
      const sway = Math.sin(c * 1.15) * 0.06
      const bob = Math.sin(c * 3.2) * 0.006
      return { ...KEEPER_READY, px: sway, py: KEEPER_READY.py + bob }
    }
    const t = c - this.shotStart
    const diveStart = CONTACT - 0.06
    if (t < diveStart) {
      const u = easeInOut(t / diveStart)
      const sway = Math.sin(this.shotStart * 1.15) * 0.06 * (1 - u)
      const p = mixPose(KEEPER_READY, KEEPER_SET, u)
      return { ...p, px: sway + Math.sin(t * 6) * 0.015 * (1 - u) }
    }
    const reach = sh.choice === 0 ? sh.arrive - 0.32 : sh.arrive
    const start = sh.choice === 0 ? sh.arrive - 0.62 : diveStart
    if (t < reach) {
      const u = clamp((t - start) / (reach - start))
      if (u <= 0) return KEEPER_SET
      const e = easeOut(u)
      const p = mixPose(KEEPER_SET, sh.diveTo, e)
      if (sh.choice !== 0) {
        p.py += Math.sin(Math.PI * u) * 0.1
        // arms reach overhead before the body has finished rotating
        const arms = mixPose(KEEPER_SET, sh.diveTo, easeOut(Math.min(1, u * 1.8)))
        p.la = arms.la
        p.ra = arms.ra
      }
      return p
    }
    if (!sh.landed) return sh.diveTo
    const fall = clamp((t - reach - 0.14) / 0.38)
    return mixPose(sh.diveTo, sh.landed, fall * fall)
  }

  private strikerState(): { pose: Pose; z: number } {
    const sh = this.shot
    const c = this.clock
    if (!sh) return { pose: strikerStand(RUN_FROM.x, Math.sin(c * 1.6)), z: RUN_FROM.z }
    const t = c - this.shotStart
    if (t < PAUSE) return { pose: strikerStand(RUN_FROM.x, 0), z: RUN_FROM.z }
    if (t < PAUSE + RUN) {
      const u = (t - PAUSE) / RUN
      const d = u * u * (3 - 2 * u) * 0.35 + u * 0.65
      const x = lerp(RUN_FROM.x, PLANT.x, d)
      const z = lerp(RUN_FROM.z, PLANT.z, d)
      const run = strikerRun(x, u * STRIDES * Math.PI)
      const start = strikerStand(RUN_FROM.x, 0)
      const blendIn = clamp(u / 0.12)
      return { pose: mixPose({ ...start, px: x }, run, blendIn), z }
    }
    if (t < CONTACT) {
      const u = (t - PAUSE - RUN) / SWING
      const end = strikerRun(PLANT.x, STRIDES * Math.PI)
      const back = strikerBackswing(PLANT.x)
      const strike = strikerStrike(PLANT.x)
      const pose = u < 0.6 ? mixPose(end, back, easeInOut(u / 0.6)) : mixPose(back, strike, easeOut((u - 0.6) / 0.4))
      return { pose, z: PLANT.z }
    }
    const strike = strikerStrike(PLANT.x)
    const outcomeAt = sh.save ? sh.arrive + 0.25 : sh.netHit + 0.15
    if (t < outcomeAt) {
      const u = clamp((t - CONTACT) / 0.3)
      return { pose: mixPose(strike, strikerStand(PLANT.x, 0), easeInOut(u) * 0.6), z: PLANT.z }
    }
    const react = sh.save ? strikerDejected(PLANT.x) : strikerCelebrate(PLANT.x)
    const from = mixPose(strike, strikerStand(PLANT.x, 0), 0.6)
    const u = easeInOut((t - outcomeAt) / 0.45)
    const bounce = sh.save ? 0 : Math.max(0, Math.sin((t - outcomeAt) * 9)) * 0.07 * clamp(1 - (t - outcomeAt) / 1.6)
    const p = mixPose(from, react, u)
    return { pose: { ...p, py: p.py + bounce }, z: PLANT.z }
  }

  private render() {
    const { ctx, L, dpr } = this
    const { W, H } = L
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    // snap the lens shift to device pixels so the pre-rendered layer never resamples
    const pan = Math.round(this.pan * dpr) / dpr
    L.pan = pan
    const M = this.overscan
    ctx.drawImage(this.staticLayer, pan - M, 0, W + 2 * M, H)

    const striker = this.strikerState()
    const keeper = this.keeperPose()
    const ball = this.ballState()

    drawGroundShadow(ctx, L, striker.pose.px, striker.z, 0.42, 0.3)
    drawFigure(ctx, L, striker.pose, striker.z, STRIKER_KIT, 'toward', this.fontFamily)

    const shadowA = 0.34 * clamp(1 - (ball.y - BALL_R) / 2.4)
    drawGroundShadow(ctx, L, ball.x, ball.z, 0.15 + ball.y * 0.05, shadowA)
    if (ball.z > KEEPER_Z) drawBall(ctx, L, ball.x, ball.y, ball.z, ball.spin)

    const kh = clamp(1 - (keeper.py - 0.9) / 1.4, 0.25, 1)
    drawGroundShadow(ctx, L, keeper.px, KEEPER_Z, 0.5, 0.34 * kh)
    drawFigure(ctx, L, keeper, KEEPER_Z, KEEPER_KIT, 'away', this.fontFamily)

    for (const z of [-1, 0, 1] as Zone[]) drawZoneHint(ctx, L, z, this.hint[String(z)])

    if (ball.z <= KEEPER_Z && ball.z > 0) drawBall(ctx, L, ball.x, ball.y, ball.z, ball.spin)
    drawPosts(ctx, L)
    if (ball.z <= 0) drawBall(ctx, L, ball.x, ball.y, ball.z, ball.spin)

    drawNet(ctx, L, ball.bulge)

    ctx.drawImage(this.vignetteLayer, 0, 0, W, H)

    if (this.fade > 0.002) {
      ctx.fillStyle = `rgba(3,5,10,${this.fade})`
      ctx.fillRect(0, 0, W, H)
    }
  }
}
