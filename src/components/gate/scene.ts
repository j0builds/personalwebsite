export const GOAL_HALF = 3.66
export const GOAL_H = 2.44
export const POST_W = 0.12
export const NET_Z = -2
export const KEEPER_Z = 0.45
export const SPOT_Z = 11
export const BALL_R = 0.11
export const ZONE_EDGE = GOAL_HALF / 3

// A long-lens camera well behind the net, like a broadcast end-stand camera. It sits off to one
// side with a shifted lens (the goal stays centred) so parallax moves the penalty spot and run-up
// out from behind the keeper, while the net stays close to the goal mouth in the image.
const CAM_Y = 1.2
const CAM_Z = -14
const CAM_X = -2.9

export type Zone = -1 | 0 | 1

export interface Layout {
  W: number
  H: number
  f: number
  cx: number
  hy: number
  topBand: number
  bottomBand: number
  /** Vertical centre of the heading block. */
  headY: number
  /** Vertical centre of the side labels. */
  labelY: number
  /** Horizontal lens shift in px, used to follow the ball into the net. */
  pan: number
}

export interface Pt {
  x: number
  y: number
  s: number
}

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v))

export function computeLayout(W: number, H: number): Layout {
  const d0 = -CAM_Z
  const margin = clamp(W * 0.085, 20, 132)
  const fW = ((W / 2 - margin) * d0) / (GOAL_HALF + POST_W)
  const topBand = clamp(H * 0.17, 96, 168)
  const bottomBand = clamp(H * 0.17, 104, 164)
  const crossTop = (GOAL_H + POST_W - CAM_Y) / d0
  const ground = CAM_Y / d0
  const fH = (H - topBand - bottomBand) / (crossTop + ground)
  const f = Math.min(fW, fH)
  const mid = topBand + (H - topBand - bottomBand) / 2
  const hy = mid + (f * (crossTop - ground)) / 2
  // On tall screens the goal is a band in the middle; keep the copy close to it rather than pinned to the edges.
  const crossY = hy - f * crossTop
  const groundY = hy + f * ground
  const headY = Math.max(topBand / 2 + 8, crossY - f * 0.3 - 76)
  const labelY = Math.min(H - bottomBand / 2, groundY + f * 0.3 + 64)
  return { W, H, f, cx: W / 2, hy, topBand, bottomBand, headY, labelY, pan: 0 }
}

export function proj(L: Layout, x: number, y: number, z: number): Pt {
  const s = L.f / (z - CAM_Z)
  const s0 = L.f / -CAM_Z
  return { x: L.cx + L.pan + (x - CAM_X) * s + CAM_X * s0, y: L.hy - (y - CAM_Y) * s, s }
}

/** World x range that covers the screen (plus a margin) at depth z. */
function spanAt(L: Layout, z: number, pad = 60): [number, number] {
  const s = L.f / (z - CAM_Z)
  const s0 = L.f / -CAM_Z
  const at = (offset: number) => CAM_X + (offset - CAM_X * s0) / s
  return [at(-L.W / 2 - pad), at(L.W / 2 + pad)]
}

/** Screen-space rectangles of the three goal thirds, used for hit areas and hover. */
export function zoneRects(L: Layout) {
  const tl = proj(L, -GOAL_HALF, GOAL_H, 0)
  const br = proj(L, GOAL_HALF, 0, 0)
  const a = proj(L, -ZONE_EDGE, 0, 0).x
  const b = proj(L, ZONE_EDGE, 0, 0).x
  return {
    goal: { left: tl.x, top: tl.y, right: br.x, bottom: br.y },
    splits: [a, b] as const,
  }
}

function mulberry32(seed: number) {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

type Ctx = CanvasRenderingContext2D

function groundPoly(ctx: Ctx, L: Layout, pts: [number, number][]) {
  ctx.beginPath()
  pts.forEach(([x, z], i) => {
    const p = proj(L, x, 0, z)
    if (i === 0) ctx.moveTo(p.x, p.y)
    else ctx.lineTo(p.x, p.y)
  })
  ctx.closePath()
}

/** Strokes a painted pitch line with true perspective thickness, faded once it falls below a pixel. */
function pitchLine(ctx: Ctx, L: Layout, pts: [number, number][], width = 0.12) {
  for (let i = 0; i < pts.length - 1; i++) {
    const [x0, z0] = pts[i]
    const [x1, z1] = pts[i + 1]
    const len = Math.hypot(x1 - x0, z1 - z0)
    const steps = Math.max(1, Math.ceil(len / 1.5))
    const nx = (-(z1 - z0) / len) * (width / 2)
    const nz = ((x1 - x0) / len) * (width / 2)
    for (let k = 0; k < steps; k++) {
      const ax = x0 + ((x1 - x0) * k) / steps
      const az = z0 + ((z1 - z0) * k) / steps
      const bx = x0 + ((x1 - x0) * (k + 1)) / steps
      const bz = z0 + ((z1 - z0) * (k + 1)) / steps
      const pa = proj(L, ax, 0, az)
      const pb = proj(L, bx, 0, bz)
      const mx = (ax + bx) / 2
      const mz = (az + bz) / 2
      const p1 = proj(L, mx + nx, 0, mz + nz)
      const p2 = proj(L, mx - nx, 0, mz - nz)
      const ux = pb.x - pa.x
      const uy = pb.y - pa.y
      const ul = Math.hypot(ux, uy) || 1
      const thick = Math.abs(((p1.x - p2.x) * uy - (p1.y - p2.y) * ux) / ul)
      const minW = 0.75
      ctx.globalAlpha = 0.78 * Math.min(1, thick / minW)
      ctx.lineWidth = Math.max(thick, minW)
      ctx.beginPath()
      ctx.moveTo(pa.x, pa.y)
      ctx.lineTo(pb.x, pb.y)
      ctx.stroke()
    }
  }
  ctx.globalAlpha = 1
}

function arcPts(cx: number, cz: number, r: number, a0: number, a1: number, n = 48) {
  const out: [number, number][] = []
  for (let i = 0; i <= n; i++) {
    const a = a0 + ((a1 - a0) * i) / n
    out.push([cx + Math.sin(a) * r, cz + Math.cos(a) * r])
  }
  return out
}

function drawGoalFrame(ctx: Ctx, L: Layout, z: number, simple: boolean) {
  const lp0 = proj(L, -GOAL_HALF - POST_W, GOAL_H + POST_W, z)
  const lp1 = proj(L, -GOAL_HALF, 0, z)
  const rp0 = proj(L, GOAL_HALF, GOAL_H + POST_W, z)
  const rp1 = proj(L, GOAL_HALF + POST_W, 0, z)
  const cb1 = proj(L, GOAL_HALF + POST_W, GOAL_H, z)

  if (simple) {
    ctx.fillStyle = 'rgba(236,240,244,0.42)'
    const w = Math.max(lp1.x - lp0.x, 0.8)
    ctx.fillRect(lp0.x, lp0.y, w, lp1.y - lp0.y)
    ctx.fillRect(rp1.x - w, rp0.y, w, rp1.y - rp0.y)
    ctx.fillRect(lp0.x, lp0.y, cb1.x - lp0.x, Math.max(cb1.y - lp0.y, 0.8))
    return
  }

  const postGrad = (x0: number, x1: number) => {
    const g = ctx.createLinearGradient(x0, 0, x1, 0)
    g.addColorStop(0, '#9aa2ad')
    g.addColorStop(0.35, '#f4f6f8')
    g.addColorStop(0.6, '#ffffff')
    g.addColorStop(1, '#b4bbc4')
    return g
  }
  ctx.fillStyle = postGrad(lp0.x, lp1.x)
  ctx.fillRect(lp0.x, lp0.y, lp1.x - lp0.x, lp1.y - lp0.y)
  ctx.fillStyle = postGrad(rp0.x, rp1.x)
  ctx.fillRect(rp0.x, rp0.y, rp1.x - rp0.x, rp1.y - rp0.y)

  const bg = ctx.createLinearGradient(0, lp0.y, 0, cb1.y)
  bg.addColorStop(0, '#ffffff')
  bg.addColorStop(0.55, '#eef1f4')
  bg.addColorStop(1, '#a3abb5')
  ctx.fillStyle = bg
  ctx.fillRect(lp0.x, lp0.y, cb1.x - lp0.x, cb1.y - lp0.y)

  // contact shadow where the posts meet the grass
  ctx.fillStyle = 'rgba(0,0,0,0.28)'
  for (const [x0, x1] of [
    [lp0.x, lp1.x],
    [rp0.x, rp1.x],
  ]) {
    const w = x1 - x0
    ctx.beginPath()
    ctx.ellipse((x0 + x1) / 2, lp1.y, w * 1.4, w * 0.35, 0, 0, Math.PI * 2)
    ctx.fill()
  }
}

export function drawPosts(ctx: Ctx, L: Layout) {
  drawGoalFrame(ctx, L, 0, false)
}

/** Everything that never moves: sky, stands, pitch, markings, the far goal. */
export function drawStatic(ctx: Ctx, L: Layout) {
  const { W, H, hy } = L
  const rand = mulberry32(7)

  const standsFront = 114
  const standsBack = 140
  const standsTop = 22
  const roofP = proj(L, 0, standsTop, standsBack)

  const sky = ctx.createLinearGradient(0, 0, 0, roofP.y)
  sky.addColorStop(0, '#03050a')
  sky.addColorStop(0.7, '#070b15')
  sky.addColorStop(1, '#0d1424')
  ctx.fillStyle = sky
  ctx.fillRect(0, 0, W, roofP.y + 1)

  for (let i = 0; i < 70; i++) {
    const x = rand() * W
    const y = rand() * roofP.y * 0.8
    ctx.fillStyle = `rgba(220,228,255,${0.08 + rand() * 0.22})`
    ctx.fillRect(Math.round(x), Math.round(y), 1, 1)
  }

  // floodlight haze above the roof line
  const haze = ctx.createLinearGradient(0, roofP.y - L.f * 0.22, 0, roofP.y + 4)
  haze.addColorStop(0, 'rgba(120,150,210,0)')
  haze.addColorStop(1, 'rgba(150,175,230,0.16)')
  ctx.fillStyle = haze
  ctx.fillRect(0, roofP.y - L.f * 0.22, W, L.f * 0.22 + 4)

  // stands
  const fb = proj(L, 0, 0, standsFront)
  const stand = ctx.createLinearGradient(0, roofP.y, 0, fb.y)
  stand.addColorStop(0, '#0b111d')
  stand.addColorStop(1, '#141c2b')
  ctx.fillStyle = stand
  ctx.fillRect(0, roofP.y, W, fb.y - roofP.y + 1)

  const rows = 36
  for (let r = 0; r <= rows; r++) {
    const u = r / rows
    const z = standsFront + (standsBack - standsFront) * u
    const y = 1.3 + (standsTop - 2 - 1.3) * u
    const p = proj(L, 0, y, z)
    ctx.fillStyle = 'rgba(255,255,255,0.025)'
    ctx.fillRect(0, Math.round(p.y), W, 1)
    const [x0, x1] = spanAt(L, z, 10)
    const fans = Math.floor((x1 - x0) / 0.5)
    const size = Math.max(1, Math.min(3, 0.2 * p.s))
    for (let k = 0; k < fans; k++) {
      if (rand() < 0.12) continue
      const x = x0 + ((x1 - x0) * (k + rand())) / fans
      const q = proj(L, x, y + 0.3 + rand() * 0.35, z)
      const sz = size * (0.65 + rand() * 0.35)
      const hue = rand()
      const col =
        hue < 0.3
          ? '200,210,228'
          : hue < 0.5
            ? '150,168,198'
            : hue < 0.65
              ? '214,190,160'
              : hue < 0.78
                ? '170,104,88'
                : hue < 0.9
                  ? '96,118,160'
                  : '230,230,232'
      ctx.fillStyle = `rgba(${col},${0.1 + rand() * 0.24})`
      ctx.fillRect(q.x, q.y - sz, sz, sz)
    }
  }

  // roof edge with a row of floodlights
  ctx.fillStyle = '#05080f'
  ctx.fillRect(0, roofP.y - Math.max(2, L.f * 0.012), W, Math.max(2, L.f * 0.012))
  const [lx0, lx1] = spanAt(L, standsBack, 40)
  for (let x = Math.floor(lx0 / 3.2) * 3.2; x <= lx1; x += 3.2) {
    const p = proj(L, x, standsTop - 0.2, standsBack)
    if (p.x < -40 || p.x > W + 40) continue
    const r = Math.max(6, p.s * 2.4)
    const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r)
    g.addColorStop(0, 'rgba(255,248,226,0.55)')
    g.addColorStop(0.2, 'rgba(255,240,210,0.16)')
    g.addColorStop(1, 'rgba(255,240,210,0)')
    ctx.fillStyle = g
    ctx.fillRect(p.x - r, p.y - r, r * 2, r * 2)
    ctx.fillStyle = '#fffaf0'
    ctx.fillRect(p.x - 0.75, p.y - 0.75, 1.5, 1.5)
  }

  // front wall and LED boards
  const wallTop = proj(L, 0, 1.3, standsFront)
  ctx.fillStyle = '#080c14'
  ctx.fillRect(0, wallTop.y, W, fb.y - wallTop.y + 1)
  const boardZ = standsFront - 4
  const bt = proj(L, 0, 0.9, boardZ)
  const bb = proj(L, 0, 0, boardZ)
  const boardW = 9
  const [bx0, bx1] = spanAt(L, boardZ, 40)
  for (let x = Math.floor(bx0 / boardW) * boardW; x < bx1; x += boardW) {
    const a = proj(L, x + 0.1, 0, boardZ).x
    const b = proj(L, x + boardW - 0.1, 0, boardZ).x
    if (b < 0 || a > W) continue
    const lit = ((Math.round(x / boardW) % 3) + 3) % 3 === 0
    const g = ctx.createLinearGradient(0, bt.y, 0, bb.y)
    g.addColorStop(0, lit ? 'rgba(126,222,198,0.55)' : 'rgba(170,190,226,0.24)')
    g.addColorStop(1, lit ? 'rgba(60,140,124,0.4)' : 'rgba(80,96,130,0.2)')
    ctx.fillStyle = g
    ctx.fillRect(a, bt.y, b - a, bb.y - bt.y)
  }

  // pitch, mowed in 5.25m bands
  const nearZ = CAM_Z + 0.35
  const farZ = boardZ - 0.5
  const bandW = 5.25
  for (let z0 = Math.floor(nearZ / bandW) * bandW; z0 < farZ; z0 += bandW) {
    const za = Math.max(z0, nearZ)
    const zb = Math.min(z0 + bandW, farZ)
    if (zb <= za) continue
    const even = Math.round(z0 / bandW) % 2 === 0
    ctx.fillStyle = even ? '#1d5a36' : '#22663d'
    const [a0, a1] = spanAt(L, za)
    const [b0, b1] = spanAt(L, zb)
    groundPoly(ctx, L, [
      [a0, za],
      [a1, za],
      [b1, zb],
      [b0, zb],
    ])
    ctx.fill()
  }

  // distance haze toward the horizon
  const fogTop = bt.y
  const fogBottom = hy + L.f * 0.1
  const fog = ctx.createLinearGradient(0, fogTop, 0, fogBottom)
  fog.addColorStop(0, 'rgba(14,24,34,0.7)')
  fog.addColorStop(1, 'rgba(14,24,34,0)')
  ctx.fillStyle = fog
  ctx.fillRect(0, bb.y, W, fogBottom - bb.y)

  // floodlit pool around the box
  const spot = proj(L, 0, 0, 8)
  const pool = ctx.createRadialGradient(spot.x, spot.y, 0, spot.x, spot.y, Math.max(W, H) * 0.7)
  pool.addColorStop(0, 'rgba(200,255,210,0.07)')
  pool.addColorStop(1, 'rgba(200,255,210,0)')
  ctx.fillStyle = pool
  ctx.fillRect(0, bb.y, W, H - bb.y)

  // markings
  ctx.strokeStyle = '#eef3ef'
  ctx.lineCap = 'butt'
  const G = 34
  pitchLine(ctx, L, [
    [-G, 0],
    [G, 0],
  ])
  pitchLine(ctx, L, [
    [-9.16, 0],
    [-9.16, 5.5],
    [9.16, 5.5],
    [9.16, 0],
  ])
  pitchLine(ctx, L, [
    [-20.16, 0],
    [-20.16, 16.5],
    [20.16, 16.5],
    [20.16, 0],
  ])
  const arcA = Math.acos(5.5 / 9.15)
  pitchLine(ctx, L, arcPts(0, 11, 9.15, -arcA, arcA, 40))
  pitchLine(ctx, L, [
    [-G, 52.5],
    [G, 52.5],
  ])
  pitchLine(ctx, L, arcPts(0, 52.5, 9.15, 0, Math.PI * 2, 96))
  pitchLine(ctx, L, [
    [-20.16, 105],
    [-20.16, 88.5],
    [20.16, 88.5],
    [20.16, 105],
  ])
  pitchLine(ctx, L, [
    [-9.16, 105],
    [-9.16, 99.5],
    [9.16, 99.5],
    [9.16, 105],
  ])
  pitchLine(ctx, L, [
    [-G, 105],
    [G, 105],
  ])
  pitchLine(ctx, L, arcPts(0, 94, 9.15, Math.PI - arcA, Math.PI + arcA, 40))

  const spotP = proj(L, 0, 0, SPOT_Z)
  const spotB = proj(L, 0, 0, SPOT_Z + 0.11)
  ctx.fillStyle = 'rgba(238,243,239,0.85)'
  ctx.beginPath()
  ctx.ellipse(spotP.x, spotP.y, 0.11 * spotP.s, Math.max(0.6, spotP.y - spotB.y), 0, 0, Math.PI * 2)
  ctx.fill()
  const cs = proj(L, 0, 0, 52.5)
  ctx.beginPath()
  ctx.ellipse(cs.x, cs.y, Math.max(0.8, 0.15 * cs.s), 0.6, 0, 0, Math.PI * 2)
  ctx.fill()

  drawGoalFrame(ctx, L, 105, true)

  // grain
  const grain = makeGrain()
  const pat = ctx.createPattern(grain, 'repeat')
  if (pat) {
    ctx.globalAlpha = 0.05
    ctx.fillStyle = pat
    ctx.fillRect(0, 0, W, H)
    ctx.globalAlpha = 1
  }
}

let grainCanvas: HTMLCanvasElement | null = null
function makeGrain() {
  if (grainCanvas) return grainCanvas
  const c = document.createElement('canvas')
  c.width = c.height = 160
  const g = c.getContext('2d')!
  const img = g.createImageData(160, 160)
  const rand = mulberry32(42)
  for (let i = 0; i < img.data.length; i += 4) {
    const v = Math.floor(rand() * 255)
    img.data[i] = img.data[i + 1] = img.data[i + 2] = v
    img.data[i + 3] = 255
  }
  g.putImageData(img, 0, 0)
  grainCanvas = c
  return c
}

export function drawVignette(ctx: Ctx, L: Layout) {
  const { W, H } = L
  const g = ctx.createRadialGradient(W / 2, H * 0.5, Math.min(W, H) * 0.35, W / 2, H * 0.5, Math.hypot(W, H) * 0.62)
  g.addColorStop(0, 'rgba(0,0,0,0)')
  g.addColorStop(1, 'rgba(0,0,0,0.55)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, W, H)
}

export interface Bulge {
  x: number
  y: number
  amp: number
}

/** How far the back net is pushed toward the camera at (x, y); the net is tied down along its frame. */
export function netDisplacement(b: Bulge | null, x: number, y: number) {
  if (!b) return 0
  const edge = Math.min(x + GOAL_HALF, GOAL_HALF - x, y, GOAL_H - y)
  const tie = Math.min(1, Math.max(0, edge / 0.7))
  const gauss = Math.exp(-((x - b.x) ** 2 + (y - b.y) ** 2) / (2 * 0.4 * 0.4))
  return b.amp * gauss * tie * tie * (3 - 2 * tie)
}

const NET_COLS = 56
const NET_ROWS = 19
const NET_DEEP = 15

/** The goal net, seen from behind. With a bulge, the back panel is pushed toward the camera. */
export function drawNet(ctx: Ctx, L: Layout, bulge: Bulge | null) {
  ctx.save()
  ctx.lineWidth = 1
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  const disp = (x: number, y: number) => netDisplacement(bulge, x, y)

  const line = (pts: [number, number, number][]) => {
    ctx.beginPath()
    pts.forEach(([x, y, z], i) => {
      const p = proj(L, x, y, z)
      if (i === 0) ctx.moveTo(p.x, p.y)
      else ctx.lineTo(p.x, p.y)
    })
    ctx.stroke()
  }

  // roof and side panels
  ctx.strokeStyle = 'rgba(226,232,240,0.13)'
  for (let i = 0; i <= NET_COLS; i++) {
    const x = -GOAL_HALF + (2 * GOAL_HALF * i) / NET_COLS
    line([
      [x, GOAL_H, 0],
      [x, GOAL_H, NET_Z],
    ])
  }
  for (let k = 0; k <= NET_DEEP; k++) {
    const z = (NET_Z * k) / NET_DEEP
    line([
      [-GOAL_HALF, 0, z],
      [-GOAL_HALF, GOAL_H, z],
      [GOAL_HALF, GOAL_H, z],
      [GOAL_HALF, 0, z],
    ])
  }
  for (let j = 0; j <= NET_ROWS; j++) {
    const y = (GOAL_H * j) / NET_ROWS
    for (const sx of [-GOAL_HALF, GOAL_HALF]) {
      line([
        [sx, y, 0],
        [sx, y, NET_Z],
      ])
    }
  }

  // back panel
  ctx.strokeStyle = 'rgba(232,238,246,0.17)'
  const steps = bulge ? 40 : 1
  for (let i = 0; i <= NET_COLS; i++) {
    const x = -GOAL_HALF + (2 * GOAL_HALF * i) / NET_COLS
    const pts: [number, number, number][] = []
    for (let k = 0; k <= steps; k++) {
      const y = (GOAL_H * k) / steps
      pts.push([x, y, NET_Z - disp(x, y)])
    }
    line(pts)
  }
  const hsteps = bulge ? 90 : 1
  for (let j = 0; j <= NET_ROWS; j++) {
    const y = (GOAL_H * j) / NET_ROWS
    const pts: [number, number, number][] = []
    for (let k = 0; k <= hsteps; k++) {
      const x = -GOAL_HALF + (2 * GOAL_HALF * k) / hsteps
      pts.push([x, y, NET_Z - disp(x, y)])
    }
    line(pts)
  }

  // ropes along the frame read slightly heavier
  ctx.strokeStyle = 'rgba(232,238,246,0.3)'
  ctx.lineWidth = 1.25
  line([
    [-GOAL_HALF, 0, NET_Z],
    [-GOAL_HALF, GOAL_H, NET_Z],
    [GOAL_HALF, GOAL_H, NET_Z],
    [GOAL_HALF, 0, NET_Z],
  ])
  line([
    [-GOAL_HALF, GOAL_H, 0],
    [-GOAL_HALF, GOAL_H, NET_Z],
  ])
  line([
    [GOAL_HALF, GOAL_H, 0],
    [GOAL_HALF, GOAL_H, NET_Z],
  ])
  line([
    [-GOAL_HALF, 0, 0],
    [-GOAL_HALF, 0, NET_Z],
    [GOAL_HALF, 0, NET_Z],
    [GOAL_HALF, 0, 0],
  ])
  ctx.restore()
}

const ICO = (() => {
  const p = (1 + Math.sqrt(5)) / 2
  const v: [number, number, number][] = [
    [0, 1, p], [0, 1, -p], [0, -1, p], [0, -1, -p],
    [1, p, 0], [1, -p, 0], [-1, p, 0], [-1, -p, 0],
    [p, 0, 1], [p, 0, -1], [-p, 0, 1], [-p, 0, -1],
  ]
  return v.map(([a, b, c]) => {
    const l = Math.hypot(a, b, c)
    return [a / l, b / l, c / l] as [number, number, number]
  })
})()

export function drawBall(ctx: Ctx, L: Layout, x: number, y: number, z: number, spin: number) {
  const p = proj(L, x, y, z)
  const r = BALL_R * p.s
  ctx.save()
  const g = ctx.createRadialGradient(p.x - r * 0.35, p.y - r * 0.4, r * 0.1, p.x, p.y, r)
  g.addColorStop(0, '#ffffff')
  g.addColorStop(0.6, '#e6e9ed')
  g.addColorStop(1, '#8e97a2')
  ctx.fillStyle = g
  ctx.beginPath()
  ctx.arc(p.x, p.y, r, 0, Math.PI * 2)
  ctx.fill()

  if (r > 3) {
    ctx.clip()
    ctx.fillStyle = 'rgba(28,32,40,0.9)'
    const cs = Math.cos(spin)
    const sn = Math.sin(spin)
    for (const [a, b, c] of ICO) {
      // spin about a tilted axis: rotate in the y-z plane, then a fixed tilt in x-y
      const y1 = b * cs - c * sn
      const z1 = b * sn + c * cs
      const x2 = a * 0.94 - y1 * 0.34
      const y2 = a * 0.34 + y1 * 0.94
      if (z1 < -0.1) continue
      const depth = Math.max(0.15, z1)
      ctx.save()
      ctx.translate(p.x + x2 * r, p.y - y2 * r)
      ctx.rotate(Math.atan2(-y2, x2))
      ctx.scale(depth, 1)
      ctx.beginPath()
      for (let k = 0; k < 5; k++) {
        const ang = (k / 5) * Math.PI * 2
        const px = Math.cos(ang) * r * 0.3
        const py = Math.sin(ang) * r * 0.3
        if (k === 0) ctx.moveTo(px, py)
        else ctx.lineTo(px, py)
      }
      ctx.closePath()
      ctx.fill()
      ctx.restore()
    }
    const shade = ctx.createRadialGradient(p.x - r * 0.35, p.y - r * 0.4, r * 0.2, p.x, p.y, r)
    shade.addColorStop(0, 'rgba(255,255,255,0.18)')
    shade.addColorStop(0.7, 'rgba(0,0,0,0)')
    shade.addColorStop(1, 'rgba(0,0,0,0.28)')
    ctx.fillStyle = shade
    ctx.fillRect(p.x - r, p.y - r, r * 2, r * 2)
  }
  ctx.restore()
}

export function drawGroundShadow(ctx: Ctx, L: Layout, x: number, z: number, rx: number, alpha: number) {
  if (alpha <= 0.005) return
  const c = proj(L, x, 0, z)
  const n = proj(L, x, 0, z - rx * 0.6)
  const f = proj(L, x, 0, z + rx * 0.6)
  const w = rx * c.s
  const h = Math.max(0.5, (n.y - f.y) / 2)
  ctx.save()
  ctx.translate(c.x, c.y)
  ctx.scale(1, h / w)
  const g = ctx.createRadialGradient(0, 0, 0, 0, 0, w)
  g.addColorStop(0, `rgba(0,0,0,${alpha})`)
  g.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.fillStyle = g
  ctx.beginPath()
  ctx.arc(0, 0, w, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()
}

export function drawZoneHint(ctx: Ctx, L: Layout, zone: Zone, strength: number) {
  if (strength <= 0.001) return
  const x0 = zone === -1 ? -GOAL_HALF : zone === 0 ? -ZONE_EDGE : ZONE_EDGE
  const x1 = zone === -1 ? -ZONE_EDGE : zone === 0 ? ZONE_EDGE : GOAL_HALF
  const a = proj(L, x0, GOAL_H, 0)
  const b = proj(L, x1, 0, 0)
  const g = ctx.createLinearGradient(0, a.y, 0, b.y)
  g.addColorStop(0, `rgba(255,255,255,${0.02 * strength})`)
  g.addColorStop(1, `rgba(255,255,255,${0.085 * strength})`)
  ctx.fillStyle = g
  ctx.fillRect(a.x, a.y, b.x - a.x, b.y - a.y)
  ctx.fillStyle = `rgba(255,255,255,${0.5 * strength})`
  ctx.fillRect(a.x + 1, b.y - 2, b.x - a.x - 2, 2)
}

// Four floodlight towers at the corners of the ground, so every player throws four soft shadows.
const FLOODS: [number, number][] = [
  [0.62, 0.78],
  [-0.62, 0.78],
  [0.7, -0.71],
  [-0.7, -0.71],
]

/**
 * Floodlit shadows: a dark contact patch plus one faint streak per tower. `height` is how far the
 * object is off the grass; airborne things cast shadows that separate and fade.
 */
export function drawFloodShadows(
  ctx: Ctx,
  L: Layout,
  x: number,
  z: number,
  opts: { width: number; length: number; height?: number; alpha: number },
) {
  const { width, length, height = 0, alpha } = opts
  if (alpha <= 0.005) return
  const lift = Math.max(0, height)
  const fade = 1 / (1 + lift * 0.9)
  for (const [dx, dz] of FLOODS) {
    const cx = x + dx * (length * 0.5 + lift * 0.7)
    const cz = z + dz * (length * 0.5 + lift * 0.7)
    const c = proj(L, cx, 0, cz)
    const a = proj(L, cx - dx * length * 0.5, 0, cz - dz * length * 0.5)
    const b = proj(L, cx + dx * length * 0.5, 0, cz + dz * length * 0.5)
    const major = Math.max(1, Math.hypot(b.x - a.x, b.y - a.y) / 2)
    const minor = Math.max(1.5, width * 0.5 * c.s * 0.7)
    ctx.save()
    ctx.translate(c.x, c.y)
    ctx.rotate(Math.atan2(b.y - a.y, b.x - a.x))
    ctx.scale(1, minor / major)
    const g = ctx.createRadialGradient(0, 0, 0, 0, 0, major)
    g.addColorStop(0, `rgba(0,0,0,${alpha * 0.55 * fade})`)
    g.addColorStop(0.55, `rgba(0,0,0,${alpha * 0.28 * fade})`)
    g.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.fillStyle = g
    ctx.beginPath()
    ctx.arc(0, 0, major, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  }
  drawGroundShadow(ctx, L, x, z, width * 0.5, alpha * fade * fade)
}

/** Screen-space vertical band of the crowd, used for camera flashes. */
export function standsBand(L: Layout): [number, number] {
  const top = proj(L, 0, 20, 140).y
  const bottom = proj(L, 0, 1.6, 114).y
  return [top, bottom]
}

export function drawFlash(ctx: Ctx, x: number, y: number, r: number, a: number) {
  const g = ctx.createRadialGradient(x, y, 0, x, y, r)
  g.addColorStop(0, `rgba(255,255,255,${a})`)
  g.addColorStop(0.25, `rgba(230,238,255,${a * 0.45})`)
  g.addColorStop(1, 'rgba(230,238,255,0)')
  ctx.fillStyle = g
  ctx.fillRect(x - r, y - r, r * 2, r * 2)
}

export interface Particle {
  x: number
  y: number
  z: number
  vx: number
  vy: number
  vz: number
  life: number
  max: number
  size: number
  color: string
}

export function drawParticle(ctx: Ctx, L: Layout, p: Particle) {
  const q = proj(L, p.x, p.y, p.z)
  const sz = Math.max(1, p.size * q.s)
  ctx.globalAlpha = Math.min(1, (p.life / p.max) * 2.2)
  ctx.fillStyle = p.color
  ctx.fillRect(q.x - sz / 2, q.y - sz / 2, sz, sz)
  ctx.globalAlpha = 1
}
