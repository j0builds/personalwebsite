import {
  BALL_R,
  KEEPER_Z,
  NET_Z,
  SPOT_Z,
  computeLayout,
  proj,
  drawBall,
  drawFlash,
  drawFloodShadows,
  drawNet,
  drawParticle,
  drawPosts,
  drawStatic,
  drawVignette,
  drawZoneHint,
  netDisplacement,
  standsBand,
  type Bulge,
  type Particle,
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
import { MatchSound } from './sfx'

export type Phase = 'aim' | 'play' | 'saved' | 'scored'

export interface PhaseInfo {
  attempt: number
  choice?: Zone
  ballZone?: Zone
  /** One sentence on what the striker showed before the kick, when it is worth saying. */
  note?: string
}

export interface GameEvents {
  onPhase: (phase: Phase, info: PhaseInfo) => void
  onExit: () => void
}

const G = 9.81
const WHISTLE = 0.14
const PAUSE = 0.8
const RUN = 1.2
const SWING = 0.16
const CONTACT = PAUSE + RUN + SWING
const PLANT = { x: 0.3, z: 11.42 }
const STRIDES = 6
// How often the run-up tells the truth. Enough to reward reading him, never enough to be sure.
const HONEST = 0.7

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v))
const easeOut = (t: number) => 1 - Math.pow(1 - clamp(t), 3)
const easeInOut = (t: number) => {
  const x = clamp(t)
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2
}
const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const rnd = (a: number, b: number) => a + Math.random() * (b - a)

/** What the striker has decided before he steps up, and what his run-up gives away. */
interface Plan {
  ballZone: Zone
  shows: Zone
  from: { x: number; z: number }
}

function makePlan(): Plan {
  const r = Math.random()
  const ballZone: Zone = r < 0.38 ? -1 : r < 0.62 ? 0 : 1
  const others = ([-1, 0, 1] as Zone[]).filter((z) => z !== ballZone)
  const shows = Math.random() < HONEST ? ballZone : others[Math.floor(Math.random() * 2)]
  // A right-footer opens up to go across his body: he stands wide on the far side of where he'll shoot.
  const from = shows === 0 ? { x: 0.14, z: 15.7 } : { x: -shows * 1.5, z: 14.7 }
  return { ballZone, shows, from }
}

const sideWord = (x: number) => (x > 0 ? 'right' : 'left')

interface Shot {
  choice: Zone
  ballZone: Zone
  save: boolean
  T: number
  vx: number
  vy: number
  vz: number
  /** Sideways acceleration from spin: the curl. */
  ax: number
  arrive: number
  netHit: number
  diveFrom: Pose
  diveTo: Pose
  landed: Pose | null
  catchBall: boolean
  /** Fixed when the outcome is announced; longer notes hold the frame longer. */
  note?: string
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
  private plan: Plan = makePlan()
  private ts = 1
  private zoom = 1
  private shake = 0
  private calm = false
  private particles: Particle[] = []
  private flashes: { x: number; y: number; r: number; born: number; life: number }[] = []
  readonly sound = new MatchSound()

  constructor(
    private canvas: HTMLCanvasElement,
    private events: GameEvents,
  ) {
    this.ctx = canvas.getContext('2d', { alpha: false })!
    this.staticLayer = document.createElement('canvas')
    this.vignetteLayer = document.createElement('canvas')
    this.L = computeLayout(1, 1)
    this.fontFamily = getComputedStyle(canvas).fontFamily || 'sans-serif'
    this.calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches
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
    this.sound.wake()
    const ballZone: Zone = this.misses >= 3 ? zone : this.plan.ballZone
    const save = ballZone === zone

    let tx: number
    let ty: number
    let T: number
    let ax: number
    if (ballZone === 0) {
      tx = rnd(-0.6, 0.6)
      ax = rnd(-0.8, 0.8)
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
      // curls away from the keeper, toward the corner
      ax = ballZone * rnd(1.6, 3.6)
    }
    const vx = (tx - 0.5 * ax * T * T) / T
    const vz = -SPOT_Z / T
    const vy = (ty - BALL_R) / T + 0.5 * G * T
    const tk = ((SPOT_Z - KEEPER_Z) / SPOT_Z) * T
    const tn = ((SPOT_Z - NET_Z) / SPOT_Z) * T
    const at = (tau: number) => ({ x: vx * tau + 0.5 * ax * tau * tau, y: BALL_R + vy * tau - 0.5 * G * tau * tau })
    const k = at(tk)
    const kx = k.x
    const ky = k.y

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
      ax,
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
      const h = at(tn)
      const hit = proj({ ...this.L, pan: 0 }, h.x, h.y, NET_Z - netDisplacement({ x: h.x, y: h.y, amp: 0.95 }, h.x, h.y))
      const r = BALL_R * hit.s
      const edge = Math.max(20, this.L.W * 0.035) + r
      const lo = edge
      const hi = this.L.W - edge
      this.panTarget = hit.x > hi ? hi - hit.x : hit.x < lo ? lo - hit.x : 0
      this.panTarget = Math.max(-this.overscan, Math.min(this.overscan, Math.round(this.panTarget)))
    }
    this.events.onPhase('play', { attempt: this.attempt, choice: zone })
  }

  /** What to tell the visitor about the striker's run-up once the shot is over. */
  private noteFor(sh: Shot): string | undefined {
    const { shows, from } = this.plan
    if (sh.save) {
      return shows === sh.ballZone && sh.choice === shows ? 'You read his run-up.' : undefined
    }
    if (this.misses >= 3) return undefined
    if (shows === sh.ballZone) {
      return sh.ballZone === 0
        ? 'He ran straight at it and went straight down the middle.'
        : `He lined up wide on the ${sideWord(from.x)} and went across his body.`
    }
    return shows === 0 ? 'He ran straight at it, then picked a corner.' : 'He showed you one side and went the other.'
  }

  private spray(x: number, y: number, z: number, n: number, power: number, spread: number) {
    for (let i = 0; i < n; i++) {
      const grass = Math.random() < 0.75
      this.particles.push({
        x: x + rnd(-spread, spread),
        y: y + rnd(0, 0.05),
        z: z + rnd(-spread, spread) * 0.5,
        vx: rnd(-1, 1) * power * 0.6,
        vy: rnd(0.6, 1.6) * power,
        vz: rnd(-1, 1) * power * 0.5,
        life: rnd(0.5, 0.9),
        max: 0.9,
        size: rnd(0.018, 0.034),
        color: grass ? (Math.random() < 0.5 ? '#3f8a52' : '#2f6e40') : '#5a4630',
      })
    }
  }

  private flash(n: number, over: number) {
    const [top, bottom] = standsBand(this.L)
    const unit = Math.max(1, this.L.f / 1100)
    for (let i = 0; i < n; i++) {
      this.flashes.push({
        x: rnd(-this.overscan, this.L.W + this.overscan),
        y: rnd(top, bottom),
        r: rnd(2.5, 6) * unit,
        born: this.clock + Math.random() * over,
        life: rnd(0.07, 0.14),
      })
    }
  }

  private kickCamera(px: number) {
    if (!this.calm) this.shake = Math.max(this.shake, px)
  }

  destroy() {
    this.destroyed = true
    cancelAnimationFrame(this.raf)
    this.sound.destroy()
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
    this.zoom = 1
    this.shake = 0
    this.particles = []
    this.plan = makePlan()
    this.attempt += 1
    this.emitted.clear()
    this.events.onPhase('aim', { attempt: this.attempt })
  }

  private frame = (now: number) => {
    if (this.destroyed) return
    const real = Math.min(0.05, (now - this.last) / 1000)
    this.last = now
    this.ts += (this.slowMo() - this.ts) * Math.min(1, real * 16)
    const dt = real * this.ts
    this.clock += dt
    this.update(dt)
    this.render()
    this.raf = requestAnimationFrame(this.frame)
  }

  /** Time runs at a quarter speed for the instant that decides it. */
  private slowMo() {
    const sh = this.shot
    if (!sh) return 1
    const d = this.clock - this.shotStart - (sh.save ? sh.arrive : sh.netHit)
    return d > -0.15 && d < 0.2 ? 0.26 : 1
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

    for (const p of this.particles) {
      p.life -= dt
      if (p.y > 0) {
        p.vy -= G * dt
        p.x += p.vx * dt
        p.y += p.vy * dt
        p.z += p.vz * dt
        if (p.y < 0) p.y = 0
      }
    }
    this.particles = this.particles.filter((p) => p.life > 0)
    this.flashes = this.flashes.filter((f) => this.clock < f.born + f.life)
    this.shake *= Math.exp(-dt * 10)

    const sh = this.shot
    const zoomTo = (() => {
      if (!sh || this.calm) return 1
      const t = this.clock - this.shotStart
      const K = sh.save ? sh.arrive : sh.netHit
      return t > CONTACT - 0.2 && t < K + 1.3 ? 1.045 : 1
    })()
    this.zoom += (zoomTo - this.zoom) * (1 - Math.exp(-dt * (zoomTo > this.zoom ? 3.2 : 1.6)))
    if (Math.abs(this.zoom - 1) < 0.0004 && zoomTo === 1) this.zoom = 1
    if (!sh) return
    const t = this.clock - this.shotStart

    if (t >= WHISTLE)
      this.emitOnce('whistle', () => {
        this.sound.hush()
        this.sound.whistle()
      })
    if (t >= CONTACT)
      this.emitOnce('kick', () => {
        this.sound.kick()
        this.sound.whoosh(sh.T * 1.5)
        this.kickCamera(0.9)
        this.spray(0.05, 0.02, SPOT_Z + 0.06, 12, 1.4, 0.08)
        this.flash(9, 0.7)
      })
    const reach = sh.choice === 0 ? sh.arrive - 0.32 : sh.arrive
    if (sh.choice !== 0 && t >= CONTACT - 0.06)
      this.emitOnce('push', () => this.spray(sh.choice * 0.25, 0.02, KEEPER_Z, 6, 0.9, 0.12))
    if (sh.landed && t >= reach + 0.5)
      this.emitOnce('land', () => {
        this.spray(sh.landed!.px, 0.02, KEEPER_Z, 16, 1.1, 0.45)
        this.kickCamera(1.2)
      })
    if (sh.save) {
      if (t >= sh.arrive)
        this.emitOnce('glove', () => {
          this.sound.glove(sh.catchBall)
          this.kickCamera(sh.catchBall ? 2 : 3.5)
        })
      if (t >= sh.arrive + 0.1)
        this.emitOnce('crowd', () => {
          this.sound.crowd('save')
          this.flash(22, 1.4)
        })
    } else {
      if (t >= sh.netHit)
        this.emitOnce('net', () => {
          this.sound.net()
          this.kickCamera(2.4)
        })
      if (t >= sh.netHit + 0.08)
        this.emitOnce('roar', () => {
          this.sound.crowd('roar')
          this.flash(30, 1.6)
        })
    }

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
      if (t >= sh.arrive + 0.32)
        this.emitOnce('saved', () => {
          sh.note = this.noteFor(sh)
          this.events.onPhase('saved', { attempt: this.attempt, choice: sh.choice, ballZone: sh.ballZone, note: sh.note })
        })
      if (t >= sh.arrive + (sh.note ? 2.7 : 2.1))
        this.emitOnce('exit', () => {
          this.sound.fadeOut(1.4)
          this.events.onExit()
        })
    } else {
      if (t >= sh.netHit + 0.28) {
        this.emitOnce('scored', () => {
          sh.note = this.noteFor(sh)
          this.misses += 1
          this.events.onPhase('scored', { attempt: this.attempt, choice: sh.choice, ballZone: sh.ballZone, note: sh.note })
        })
      }
      if (t >= sh.netHit + (sh.note ? 3.2 : 2.3) && this.pendingReset < 0) {
        this.emitOnce('reset', () => {
          this.fadeTarget = 1
          this.pendingReset = this.clock
        })
      }
    }
  }

  private ballFlight(sh: Shot, tau: number) {
    return {
      x: sh.vx * tau + 0.5 * sh.ax * tau * tau,
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

  /** On his toes on the line: a slow shuffle, a light bounce, gloves loose. */
  private keeperIdle(c: number): Pose {
    const bounce = (0.5 + 0.5 * Math.sin(c * Math.PI * 2.8)) * 0.018
    const arms = Math.sin(c * 1.3) * 0.07
    const R = KEEPER_READY
    return {
      ...R,
      px: Math.sin(c * 1.15) * 0.07,
      py: R.py + bounce,
      la: [R.la[0] + arms, R.la[1]],
      ra: [R.ra[0] + arms, R.ra[1]],
    }
  }

  private keeperPose(): Pose {
    const sh = this.shot
    const c = this.clock
    if (!sh) return this.keeperIdle(c)
    const t = c - this.shotStart
    const diveStart = CONTACT - 0.06
    if (t < diveStart) {
      const settleFrom = PAUSE + RUN * 0.35
      const u = easeInOut(clamp((t - settleFrom) / (diveStart - settleFrom)))
      const p = mixPose(this.keeperIdle(c), KEEPER_SET, u)
      // the split-step: a small hop that lands just as the striker plants his foot
      const hop = Math.sin(Math.PI * clamp((t - (CONTACT - 0.36)) / 0.28)) * 0.06
      return { ...p, py: p.py + hop }
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
    const from = this.plan.from
    if (!sh) return { pose: strikerStand(from.x, Math.sin(c * 1.6)), z: from.z }
    const t = c - this.shotStart
    if (t < PAUSE) return { pose: strikerStand(from.x, 0), z: from.z }
    if (t < PAUSE + RUN) {
      const u = (t - PAUSE) / RUN
      const d = u * u * (3 - 2 * u) * 0.35 + u * 0.65
      const x = lerp(from.x, PLANT.x, d)
      const z = lerp(from.z, PLANT.z, d)
      const run = strikerRun(x, u * STRIDES * Math.PI)
      const start = strikerStand(from.x, 0)
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
    const settled = mixPose(strike, strikerStand(PLANT.x, 0), 0.6)
    const u = easeInOut((t - outcomeAt) / 0.45)
    const bounce = sh.save ? 0 : Math.max(0, Math.sin((t - outcomeAt) * 9)) * 0.07 * clamp(1 - (t - outcomeAt) / 1.6)
    const p = mixPose(settled, react, u)
    return { pose: { ...p, py: p.py + bounce }, z: PLANT.z }
  }

  /** Where the ball was a moment ago, for a hint of motion blur while it is in flight. */
  private trail(): { x: number; y: number; z: number }[] {
    const sh = this.shot
    if (!sh || this.free) return []
    const tau = this.clock - this.shotStart - CONTACT
    if (tau <= 0 || (!sh.save && tau >= sh.netHit - CONTACT)) return []
    const step = 0.012 * this.ts
    return [3, 2, 1].map((k) => {
      const p = this.ballFlight(sh, Math.max(0, tau - k * step))
      return { x: p.x, y: p.y, z: p.z }
    })
  }

  private render() {
    const { ctx, L, dpr } = this
    const { W, H } = L
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    // snap the lens shift to device pixels so the pre-rendered layer never resamples
    const pan = Math.round(this.pan * dpr) / dpr
    L.pan = pan
    const M = this.overscan

    ctx.save()
    if (this.zoom !== 1 || this.shake > 0.05) {
      const c = this.clock
      const ox = this.shake * (Math.sin(c * 71) + 0.5 * Math.sin(c * 117)) / 1.5
      const oy = this.shake * (Math.cos(c * 83) + 0.5 * Math.sin(c * 131)) / 1.5
      const focus = proj(L, 0, 1.1, 0)
      ctx.translate(focus.x + ox, focus.y + oy)
      ctx.scale(this.zoom, this.zoom)
      ctx.translate(-focus.x, -focus.y)
    }
    ctx.drawImage(this.staticLayer, pan - M, 0, W + 2 * M, H)

    for (const f of this.flashes) {
      if (this.clock < f.born) continue
      drawFlash(ctx, f.x + pan, f.y, f.r, 1 - (this.clock - f.born) / f.life)
    }

    const striker = this.strikerState()
    const keeper = this.keeperPose()
    const ball = this.ballState()
    const trail = this.trail()

    const paintBall = () => {
      trail.forEach((p, i) => {
        ctx.globalAlpha = 0.08 + i * 0.07
        drawBall(ctx, L, p.x, p.y, p.z, ball.spin)
      })
      ctx.globalAlpha = 1
      drawBall(ctx, L, ball.x, ball.y, ball.z, ball.spin)
    }

    drawFloodShadows(ctx, L, striker.pose.px, striker.z, { width: 0.7, length: 1.5, alpha: 0.5 })
    for (const p of this.particles) if (p.z > KEEPER_Z + 1) drawParticle(ctx, L, p)
    drawFigure(ctx, L, striker.pose, striker.z, STRIKER_KIT, 'toward', this.fontFamily)

    drawFloodShadows(ctx, L, ball.x, ball.z, {
      width: BALL_R * 2.6,
      length: 0.28,
      height: ball.y - BALL_R,
      alpha: 0.5 * clamp(1 - (ball.y - BALL_R) / 3),
    })
    if (ball.z > KEEPER_Z) paintBall()

    const lift = Math.max(0, keeper.py - 0.9)
    drawFloodShadows(ctx, L, keeper.px, KEEPER_Z, { width: 0.85, length: 1.6, height: lift, alpha: 0.5 })
    drawFigure(ctx, L, keeper, KEEPER_Z, KEEPER_KIT, 'away', this.fontFamily)
    for (const p of this.particles) if (p.z <= KEEPER_Z + 1) drawParticle(ctx, L, p)

    for (const z of [-1, 0, 1] as Zone[]) drawZoneHint(ctx, L, z, this.hint[String(z)])

    if (ball.z <= KEEPER_Z && ball.z > 0) paintBall()
    drawPosts(ctx, L)
    if (ball.z <= 0) paintBall()

    drawNet(ctx, L, ball.bulge)
    ctx.restore()

    ctx.drawImage(this.vignetteLayer, 0, 0, W, H)

    if (this.fade > 0.002) {
      ctx.fillStyle = `rgba(3,5,10,${this.fade})`
      ctx.fillRect(0, 0, W, H)
    }
  }
}
