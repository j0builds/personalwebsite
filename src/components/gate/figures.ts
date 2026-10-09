import { proj, type Layout } from './scene'

type Ctx = CanvasRenderingContext2D
type V = [number, number]

/**
 * A figure in the camera-facing plane. Angles are radians.
 * Limb pairs are [outward swing, bend]; "l"/"r" are screen left/right.
 * Optional length factors fake foreshortening when a limb points at the camera.
 */
export interface Pose {
  px: number
  py: number
  rot: number
  la: V
  ra: V
  ll: V
  rl: V
  laf?: V
  raf?: V
  llf?: V
  rlf?: V
}

const DIMS = {
  torso: 0.5,
  neck: 0.07,
  headR: 0.112,
  shoulder: 0.2,
  hip: 0.095,
  upper: 0.3,
  fore: 0.28,
  thigh: 0.45,
  shin: 0.45,
}

const dir = (a: number): V => [Math.sin(a), Math.cos(a)]
const add = (a: V, b: V, k = 1): V => [a[0] + b[0] * k, a[1] + b[1] * k]
const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const lerpV = (a: V | undefined, b: V | undefined, t: number, d: V): V => {
  const x = a ?? d
  const y = b ?? d
  return [lerp(x[0], y[0], t), lerp(x[1], y[1], t)]
}

export function mixPose(a: Pose, b: Pose, t: number): Pose {
  return {
    px: lerp(a.px, b.px, t),
    py: lerp(a.py, b.py, t),
    rot: lerp(a.rot, b.rot, t),
    la: lerpV(a.la, b.la, t, [0, 0]),
    ra: lerpV(a.ra, b.ra, t, [0, 0]),
    ll: lerpV(a.ll, b.ll, t, [0, 0]),
    rl: lerpV(a.rl, b.rl, t, [0, 0]),
    laf: lerpV(a.laf, b.laf, t, [1, 1]),
    raf: lerpV(a.raf, b.raf, t, [1, 1]),
    llf: lerpV(a.llf, b.llf, t, [1, 1]),
    rlf: lerpV(a.rlf, b.rlf, t, [1, 1]),
  }
}

export interface Skeleton {
  pelvis: V
  neck: V
  head: V
  up: V
  right: V
  shoulder: [V, V]
  elbow: [V, V]
  wrist: [V, V]
  foreDir: [V, V]
  hip: [V, V]
  knee: [V, V]
  ankle: [V, V]
  shinDir: [V, V]
}

export function skeleton(p: Pose): Skeleton {
  const up = dir(p.rot)
  const right: V = [Math.cos(p.rot), -Math.sin(p.rot)]
  const pelvis: V = [p.px, p.py]
  const neck = add(pelvis, up, DIMS.torso)
  const head = add(pelvis, up, DIMS.torso + DIMS.neck + DIMS.headR)
  const sk = { pelvis, neck, head, up, right } as Skeleton
  sk.shoulder = [] as unknown as [V, V]
  sk.elbow = [] as unknown as [V, V]
  sk.wrist = [] as unknown as [V, V]
  sk.foreDir = [] as unknown as [V, V]
  sk.hip = [] as unknown as [V, V]
  sk.knee = [] as unknown as [V, V]
  sk.ankle = [] as unknown as [V, V]
  sk.shinDir = [] as unknown as [V, V]
  ;([-1, 1] as const).forEach((s, i) => {
    const arm = s < 0 ? p.la : p.ra
    const armF = (s < 0 ? p.laf : p.raf) ?? [1, 1]
    const sh = add(add(neck, right, s * DIMS.shoulder), up, -0.035)
    const au = p.rot + Math.PI - s * arm[0]
    const el = add(sh, dir(au), DIMS.upper * armF[0])
    const al = au - s * arm[1]
    const wr = add(el, dir(al), DIMS.fore * armF[1])
    sk.shoulder[i] = sh
    sk.elbow[i] = el
    sk.wrist[i] = wr
    sk.foreDir[i] = dir(al)

    const leg = s < 0 ? p.ll : p.rl
    const legF = (s < 0 ? p.llf : p.rlf) ?? [1, 1]
    const hp = add(pelvis, right, s * DIMS.hip)
    const lt = p.rot + Math.PI - s * leg[0]
    const kn = add(hp, dir(lt), DIMS.thigh * legF[0])
    const ls = lt + s * leg[1]
    const an = add(kn, dir(ls), DIMS.shin * legF[1])
    sk.hip[i] = hp
    sk.knee[i] = kn
    sk.ankle[i] = an
    sk.shinDir[i] = dir(ls)
  })
  return sk
}

/** Lifts or drops the pose so its lowest boot rests on the grass. */
export function grounded(p: Pose): Pose {
  const sk = skeleton(p)
  const low = Math.min(sk.ankle[0][1], sk.ankle[1][1])
  return { ...p, py: p.py + (0.075 - low) }
}

export function gloveCenter(p: Pose): V {
  const sk = skeleton(p)
  const a = add(sk.wrist[0], sk.foreDir[0], 0.08)
  const b = add(sk.wrist[1], sk.foreDir[1], 0.08)
  return [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]
}

export interface Kit {
  jersey: string
  jerseyShade: string
  trim: string
  shorts: string
  socks: string
  sockBand: string
  boots: string
  skin: string
  hair: string
  gloves?: string
  number?: string
  name?: string
}

export const KEEPER_KIT: Kit = {
  jersey: '#14805e',
  jerseyShade: '#0c5a42',
  trim: '#d8f5e8',
  shorts: '#0d1117',
  socks: '#14805e',
  sockBand: '#e9f2ee',
  boots: '#101215',
  skin: '#6f4529',
  hair: '#141010',
  gloves: '#f3f5f1',
  number: '1',
  name: 'AYINDE',
}

export const STRIKER_KIT: Kit = {
  jersey: '#eef1f5',
  jerseyShade: '#c6ccd6',
  trim: '#b5363b',
  shorts: '#1b2333',
  socks: '#eef1f5',
  sockBand: '#b5363b',
  boots: '#141518',
  skin: '#8d5b3b',
  hair: '#17110e',
}

export function drawFigure(
  ctx: Ctx,
  L: Layout,
  pose: Pose,
  z: number,
  kit: Kit,
  facing: 'away' | 'toward',
  fontFamily: string,
) {
  const sk = skeleton(pose)
  const s = proj(L, 0, 0, z).s
  const P = (v: V): V => {
    const q = proj(L, v[0], v[1], z)
    return [q.x, q.y]
  }

  ctx.save()
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'

  const seg = (a: V, b: V, w: number, color: string) => {
    const A = P(a)
    const B = P(b)
    ctx.strokeStyle = color
    ctx.lineWidth = w * s
    ctx.beginPath()
    ctx.moveTo(A[0], A[1])
    ctx.lineTo(B[0], B[1])
    ctx.stroke()
  }

  const legs = () => {
    for (let i = 0; i < 2; i++) {
      const hp = sk.hip[i]
      const kn = sk.knee[i]
      const an = sk.ankle[i]
      const sd = sk.shinDir[i]
      seg(hp, kn, 0.15, kit.skin)
      const sockTop = add(kn, sd, 0.06)
      seg(sockTop, an, 0.122, kit.socks)
      seg(sockTop, add(sockTop, sd, 0.05), 0.124, kit.sockBand)
      const toe = add(an, sd, 0.075)
      seg(an, toe, 0.118, kit.boots)
    }
  }

  const shorts = () => {
    for (let i = 0; i < 2; i++) {
      const hp = sk.hip[i]
      const kn = sk.knee[i]
      const mid: V = [hp[0] + (kn[0] - hp[0]) * 0.42, hp[1] + (kn[1] - hp[1]) * 0.42]
      seg(hp, mid, 0.19, kit.shorts)
    }
    seg(add(sk.pelvis, sk.right, -0.11), add(sk.pelvis, sk.right, 0.11), 0.2, kit.shorts)
  }

  const arms = () => {
    for (let i = 0; i < 2; i++) {
      seg(sk.shoulder[i], sk.elbow[i], 0.118, kit.jersey)
      if (kit.gloves) {
        seg(sk.elbow[i], sk.wrist[i], 0.104, kit.jersey)
        const fd = sk.foreDir[i]
        const g0 = add(sk.wrist[i], fd, 0.01)
        const g1 = add(sk.wrist[i], fd, 0.13)
        seg(g0, g1, 0.135, kit.gloves)
        seg(add(sk.wrist[i], fd, -0.005), add(sk.wrist[i], fd, 0.035), 0.12, '#1d2228')
      } else {
        const cuff = add(sk.elbow[i], sk.foreDir[i], 0.02)
        seg(sk.elbow[i], cuff, 0.1, kit.jersey)
        seg(cuff, sk.wrist[i], 0.082, kit.skin)
        seg(sk.wrist[i], add(sk.wrist[i], sk.foreDir[i], 0.05), 0.088, kit.skin)
      }
    }
  }

  const torso = () => {
    const pv = P(sk.pelvis)
    ctx.save()
    ctx.translate(pv[0], pv[1])
    ctx.rotate(pose.rot)
    ctx.scale(s, s)
    const Y = (y: number) => -y
    ctx.beginPath()
    ctx.moveTo(-0.17, Y(0.02))
    ctx.lineTo(0.17, Y(0.02))
    ctx.quadraticCurveTo(0.2, Y(0.2), 0.205, Y(0.36))
    ctx.quadraticCurveTo(0.215, Y(0.45), 0.245, Y(0.47))
    ctx.quadraticCurveTo(0.2, Y(0.535), 0.075, Y(0.535))
    ctx.lineTo(-0.075, Y(0.535))
    ctx.quadraticCurveTo(-0.2, Y(0.535), -0.245, Y(0.47))
    ctx.quadraticCurveTo(-0.215, Y(0.45), -0.205, Y(0.36))
    ctx.quadraticCurveTo(-0.2, Y(0.2), -0.17, Y(0.02))
    ctx.closePath()
    ctx.fillStyle = kit.jersey
    ctx.fill()

    const sh = ctx.createLinearGradient(-0.25, 0, 0.25, 0)
    sh.addColorStop(0, 'rgba(0,0,0,0.22)')
    sh.addColorStop(0.35, 'rgba(0,0,0,0)')
    sh.addColorStop(0.7, 'rgba(255,255,255,0.05)')
    sh.addColorStop(1, 'rgba(0,0,0,0.25)')
    ctx.fillStyle = sh
    ctx.fill()

    ctx.strokeStyle = kit.trim
    ctx.lineWidth = 0.018
    ctx.beginPath()
    if (facing === 'toward') {
      ctx.moveTo(-0.075, Y(0.535))
      ctx.quadraticCurveTo(0, Y(0.45), 0.075, Y(0.535))
    } else {
      ctx.moveTo(-0.08, Y(0.53))
      ctx.quadraticCurveTo(0, Y(0.505), 0.08, Y(0.53))
    }
    ctx.stroke()

    if (facing === 'away' && kit.number) {
      ctx.fillStyle = kit.trim
      ctx.textAlign = 'center'
      ctx.textBaseline = 'alphabetic'
      ctx.font = `700 0.2px ${fontFamily}`
      ctx.fillText(kit.number, 0, Y(0.14))
      if (kit.name) {
        ctx.font = `600 0.052px ${fontFamily}`
        ctx.fillText(kit.name.split('').join(String.fromCharCode(8202)), 0, Y(0.4))
      }
    }
    if (facing === 'toward') {
      ctx.fillStyle = kit.trim
      ctx.fillRect(-0.205, Y(0.36), 0.025, 0.3)
      ctx.fillRect(0.18, Y(0.36), 0.025, 0.3)
    }
    ctx.restore()
  }

  const head = () => {
    seg(sk.neck, add(sk.neck, sk.up, DIMS.neck + 0.03), 0.095, kit.skin)
    const h = P(sk.head)
    const r = DIMS.headR * s
    // ears
    ctx.fillStyle = kit.skin
    for (const sgn of [-1, 1]) {
      const e = P(add(add(sk.head, sk.right, sgn * 0.105), sk.up, -0.01))
      ctx.beginPath()
      ctx.ellipse(e[0], e[1], 0.022 * s, 0.034 * s, pose.rot, 0, Math.PI * 2)
      ctx.fill()
    }
    if (facing === 'away') {
      const g = ctx.createRadialGradient(h[0] - r * 0.3, h[1] - r * 0.4, r * 0.1, h[0], h[1], r)
      g.addColorStop(0, '#2a2220')
      g.addColorStop(1, kit.hair)
      ctx.fillStyle = g
      ctx.beginPath()
      ctx.arc(h[0], h[1], r, 0, Math.PI * 2)
      ctx.fill()
    } else {
      ctx.fillStyle = kit.skin
      ctx.beginPath()
      ctx.arc(h[0], h[1], r, 0, Math.PI * 2)
      ctx.fill()
      ctx.save()
      ctx.translate(h[0], h[1])
      ctx.rotate(pose.rot)
      ctx.fillStyle = kit.hair
      ctx.beginPath()
      ctx.arc(0, 0, r * 1.02, Math.PI * 1.08, Math.PI * 1.92)
      ctx.quadraticCurveTo(0, -r * 0.55, -r * 1.0, -r * 0.25)
      ctx.fill()
      ctx.restore()
    }
  }

  legs()
  if (facing === 'away') {
    arms()
    shorts()
    torso()
  } else {
    shorts()
    torso()
    arms()
  }
  head()
  ctx.restore()
}

/* ---------- keeper poses ---------- */

export const KEEPER_READY: Pose = grounded({
  px: 0,
  py: 0.9,
  rot: 0,
  la: [0.55, 0.38],
  ra: [0.55, 0.38],
  ll: [0.3, 0.44],
  rl: [0.3, 0.44],
})

export const KEEPER_SET: Pose = grounded({
  px: 0,
  py: 0.86,
  rot: 0,
  la: [0.78, 0.28],
  ra: [0.78, 0.28],
  ll: [0.38, 0.6],
  rl: [0.38, 0.6],
})

const GLOVE_REACH = DIMS.torso - 0.035 + DIMS.upper + DIMS.fore + 0.08

/** Full-stretch dive with both gloves arriving at (gx, gy). */
export function keeperDive(side: -1 | 1, gx: number, gy: number): Pose {
  const t = Math.min(1, Math.max(0, (gy - 0.2) / 1.9))
  const lean = lerp(1.42, 0.86, t)
  const rot = side * lean
  const up = dir(rot)
  const px = gx - up[0] * GLOVE_REACH
  const py = Math.max(0.2, gy - up[1] * GLOVE_REACH)
  return {
    px,
    py,
    rot,
    la: side < 0 ? [Math.PI - 0.06, -0.02] : [Math.PI - 0.2, 0.05],
    ra: side > 0 ? [Math.PI - 0.06, -0.02] : [Math.PI - 0.2, 0.05],
    ll: side < 0 ? [0.12, 0.08] : [0.42, 0.75],
    rl: side > 0 ? [0.12, 0.08] : [0.42, 0.75],
  }
}

export function keeperLanded(side: -1 | 1, gx: number): Pose {
  const rot = side * 1.5
  return {
    px: gx - side * GLOVE_REACH * 0.98,
    py: 0.16,
    rot,
    la: side < 0 ? [Math.PI - 0.1, 0.1] : [Math.PI - 0.35, 0.3],
    ra: side > 0 ? [Math.PI - 0.1, 0.1] : [Math.PI - 0.35, 0.3],
    ll: side < 0 ? [0.08, 0.05] : [0.3, 0.6],
    rl: side > 0 ? [0.08, 0.05] : [0.3, 0.6],
  }
}

/** Stays central and takes the ball cleanly into the gloves at (gx, gy). */
export function keeperCatch(gx: number, gy: number): Pose {
  const px = gx * 0.8
  const rot = gx * 0.1
  if (gy < 0.95) {
    // low scoop: crouched, forearms folding in toward the ball
    return grounded({ px, py: 0.8, rot, la: [0.3, -0.95], ra: [0.3, -0.95], ll: [0.44, 0.66], rl: [0.44, 0.66] })
  }
  if (gy < 1.7) {
    // chest catch: elbows out, gloves meeting in front of the body
    return grounded({ px, py: 0.95, rot, la: [0.62, -1.75], ra: [0.62, -1.75], ll: [0.24, 0.3], rl: [0.24, 0.3] })
  }
  // overhead: a small spring with the gloves closing above the head
  return {
    px,
    py: Math.max(1.0, gy - 1.12),
    rot,
    la: [2.72, -0.34],
    ra: [2.72, -0.34],
    ll: [0.1, 0.06],
    rl: [0.1, 0.06],
  }
}

/* ---------- striker poses ---------- */

export function strikerStand(px: number, breathe: number): Pose {
  return grounded({
    px,
    py: 1,
    rot: 0,
    la: [0.16 + breathe * 0.01, 0.12],
    ra: [0.16 + breathe * 0.01, 0.12],
    ll: [0.07, 0.02],
    rl: [0.07, 0.02],
  })
}

/** One pose of a run cycle seen head-on; `phase` advances by π per stride. */
export function strikerRun(px: number, phase: number): Pose {
  const s = Math.sin(phase)
  const liftL = Math.max(0, s)
  const liftR = Math.max(0, -s)
  return grounded({
    px,
    py: 1,
    rot: 0.035 * s,
    la: [0.2 + 0.12 * liftR, 0.35 + 0.9 * liftR],
    ra: [0.2 + 0.12 * liftL, 0.35 + 0.9 * liftL],
    laf: [1 - 0.15 * liftR, 1 - 0.45 * liftR],
    raf: [1 - 0.15 * liftL, 1 - 0.45 * liftL],
    ll: [0.06, 0.08 + 0.25 * liftL],
    rl: [0.06, 0.08 + 0.25 * liftR],
    llf: [1 - 0.38 * liftL, 1 - 0.3 * liftL],
    rlf: [1 - 0.38 * liftR, 1 - 0.3 * liftR],
  })
}

export function strikerBackswing(px: number): Pose {
  return grounded({
    px,
    py: 1,
    rot: 0.14,
    la: [0.5, 0.5],
    ra: [1.35, 0.25],
    ll: [0.12, 0.25],
    rl: [0.04, 0.0],
    llf: [0.9, 0.3],
  })
}

export function strikerStrike(px: number): Pose {
  return grounded({
    px,
    py: 1,
    rot: 0.1,
    la: [0.42, 0.55],
    ra: [1.25, 0.2],
    ll: [-0.12, 0.02],
    rl: [0.05, 0.02],
    llf: [0.82, 0.86],
  })
}

export function strikerCelebrate(px: number): Pose {
  return grounded({
    px,
    py: 1,
    rot: 0,
    la: [2.55, 0.15],
    ra: [2.55, 0.15],
    ll: [0.12, 0.04],
    rl: [0.12, 0.04],
  })
}

export function strikerDejected(px: number): Pose {
  return grounded({
    px,
    py: 1,
    rot: 0,
    la: [2.45, 2.25],
    ra: [2.45, 2.25],
    ll: [0.08, 0.03],
    rl: [0.08, 0.03],
  })
}
