'use client'

import Link from 'next/link'
import { Reveal } from './Reveal'
import { LINKS, PERSON } from './content'

const SHEET = [
  { n: '01', label: 'Work', note: 'Projects and research', href: LINKS.work.href, internal: true },
  { n: '02', label: 'About', note: 'The longer story', href: LINKS.about.href, internal: true },
  { n: '03', label: 'Email', note: PERSON.email, href: LINKS.email.href },
  { n: '04', label: 'GitHub', note: '@j0builds', href: LINKS.github.href, external: true },
  { n: '05', label: 'LinkedIn', note: 'josephayinde', href: LINKS.linkedin.href, external: true },
  { n: '06', label: 'Instagram', note: '@joseph.ayinde', href: LINKS.instagram.href, external: true },
] as const

// Half a 68 m × 105 m pitch, goal at the top, in metres.
const W = 68
const HALF = 52.5
const PAD = 3.2
const BOX_W = 40.32
const BOX_D = 16.5
const SIX_W = 18.32
const SIX_D = 5.5
const GOAL_W = 7.32
const SPOT = 11
const R = 9.15

function PitchDiagram() {
  const cx = W / 2
  const dTheta = Math.acos((BOX_D - SPOT) / R)
  const arcFrom = { x: cx - R * Math.sin(dTheta), y: BOX_D }
  const arcTo = { x: cx + R * Math.sin(dTheta), y: BOX_D }
  const line = {
    fill: 'none',
    stroke: 'rgba(233,239,230,0.62)',
    strokeWidth: 1,
    vectorEffect: 'non-scaling-stroke' as const,
  }
  const stripes = Math.ceil(HALF / 5.25)

  return (
    <svg
      viewBox={`${-PAD} ${-PAD - 2} ${W + PAD * 2} ${HALF + PAD * 2 + 2}`}
      className="h-auto w-full"
      role="img"
      aria-label="Top-down view of half a football pitch at night, a keeper in goal"
    >
      <defs>
        <radialGradient id="pitch-flood-l" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(-4 -4) scale(70)">
          <stop offset="0" stopColor="#f3f6df" stopOpacity="0.16" />
          <stop offset="1" stopColor="#f3f6df" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="pitch-flood-r" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform={`translate(${W + 4} -4) scale(70)`}>
          <stop offset="0" stopColor="#f3f6df" stopOpacity="0.16" />
          <stop offset="1" stopColor="#f3f6df" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="pitch-fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0.72" stopColor="#0d251b" stopOpacity="0" />
          <stop offset="1" stopColor="#0d251b" stopOpacity="1" />
        </linearGradient>
      </defs>

      <rect x={0} y={0} width={W} height={HALF} fill="#14382a" />
      {Array.from({ length: stripes }, (_, i) =>
        i % 2 ? (
          <rect key={i} x={0} y={i * 5.25} width={W} height={Math.min(5.25, HALF - i * 5.25)} fill="#173f2f" />
        ) : null,
      )}
      <g className="pitch-glow">
        <rect x={0} y={0} width={W} height={HALF} fill="url(#pitch-flood-l)" />
        <rect x={0} y={0} width={W} height={HALF} fill="url(#pitch-flood-r)" />
      </g>

      <rect x={0} y={0} width={W} height={HALF} {...line} />
      <rect x={cx - BOX_W / 2} y={0} width={BOX_W} height={BOX_D} {...line} />
      <rect x={cx - SIX_W / 2} y={0} width={SIX_W} height={SIX_D} {...line} />
      <path d={`M ${arcFrom.x} ${arcFrom.y} A ${R} ${R} 0 0 0 ${arcTo.x} ${arcTo.y}`} {...line} />
      <path d={`M ${cx - R} ${HALF} A ${R} ${R} 0 0 1 ${cx + R} ${HALF}`} {...line} />
      <path d="M 1 0 A 1 1 0 0 1 0 1" {...line} />
      <path d={`M ${W - 1} 0 A 1 1 0 0 0 ${W} 1`} {...line} />
      <circle cx={cx} cy={SPOT} r={0.22} fill="rgba(233,239,230,0.8)" />
      <circle cx={cx} cy={HALF} r={0.22} fill="rgba(233,239,230,0.8)" />
      <rect x={cx - GOAL_W / 2} y={-2} width={GOAL_W} height={2} {...line} stroke="rgba(233,239,230,0.85)" />
      <path
        d={Array.from({ length: 9 }, (_, i) => `M ${cx - GOAL_W / 2 + (i * GOAL_W) / 8} -2 V 0`).join(' ')}
        {...line}
        stroke="rgba(233,239,230,0.18)"
      />

      <rect x={-PAD} y={HALF * 0.55} width={W + PAD * 2} height={HALF * 0.45 + PAD + 0.01} fill="url(#pitch-fade)" />

      <circle cx={cx + 0.5} cy={SPOT} r={0.34} fill="#f4f4ef" />
      <g className="pitch-keeper">
        <circle cx={cx} cy={0.9} r={0.95} fill="#c9f24a" />
        <circle cx={cx} cy={0.9} r={1.9} fill="none" stroke="#c9f24a" strokeOpacity="0.35" strokeWidth={1} vectorEffect="non-scaling-stroke" />
      </g>
    </svg>
  )
}

export function Pitch() {
  return (
    <main className="relative min-h-[100svh] overflow-hidden bg-[#0d251b] text-[#e9efe6]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(90% 70% at 75% 20%, rgba(201,242,74,0.06), rgba(201,242,74,0) 60%)' }}
      />
      <div className="relative mx-auto grid min-h-[100svh] max-w-[1280px] grid-cols-1 gap-12 px-6 pb-24 pt-10 sm:px-10 md:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] md:gap-16 md:pb-[72px] md:pt-10">
        <div className="flex flex-col">
          <Reveal>
            <div className="flex items-center justify-between border-b border-[#e9efe6]/15 pb-3 font-[family-name:var(--font-barlow)] text-[13px] font-medium uppercase tracking-[0.22em] text-[#e9efe6]/55">
              <span>Matchday programme</span>
              <span>Issue 01</span>
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <p className="mt-[clamp(24px,5svh,40px)] font-[family-name:var(--font-barlow)] text-[15px] font-semibold uppercase tracking-[0.2em] text-[#c9f24a]">
              No. 1 &middot; In goal
            </p>
            <h1 className="mt-3 font-[family-name:var(--font-barlow)] text-[clamp(60px,min(10vw,12svh),128px)] font-bold uppercase leading-[0.84] tracking-[-0.01em]">
              Joseph
              <br />
              Ayinde
            </h1>
            <p className="mt-5 font-[family-name:var(--font-barlow)] text-[clamp(18px,2vw,22px)] font-medium uppercase tracking-[0.12em] text-[#e9efe6]/80">
              Goalkeeper. Scientist. Builder.
            </p>
          </Reveal>

          <Reveal delay={0.3}>
            <p className="mt-[clamp(20px,3.5svh,32px)] max-w-[420px] text-[15px] leading-[1.7] text-[#e9efe6]/65 [text-wrap:pretty]">
              Full time. The floodlights are still on and the stands have emptied out. Nobody needs
              anything from you here. Stay as long as you like.
            </p>
          </Reveal>

          <Reveal delay={0.45} className="mt-10 md:mt-auto md:pt-[clamp(20px,4svh,40px)]">
            <p className="font-[family-name:var(--font-barlow)] text-[13px] font-medium uppercase tracking-[0.22em] text-[#e9efe6]/45">
              Team sheet
            </p>
            <ul className="mt-3 border-t border-[#e9efe6]/12">
              {SHEET.map((row) => {
                const inner = (
                  <>
                    <span className="font-[family-name:var(--font-barlow)] text-[15px] font-semibold tabular-nums text-[#c9f24a]/80">
                      {row.n}
                    </span>
                    <span className="font-[family-name:var(--font-barlow)] text-[22px] font-semibold uppercase leading-none tracking-[0.04em]">
                      {row.label}
                    </span>
                    <span className="truncate text-right text-[13px] text-[#e9efe6]/45 transition-colors duration-300 group-hover:text-[#e9efe6]/80">
                      {row.note}
                    </span>
                  </>
                )
                const cls =
                  'group grid grid-cols-[32px_1fr_auto] items-baseline gap-4 border-b border-[#e9efe6]/12 py-[clamp(8px,1.3svh,12px)] transition-colors duration-300 hover:bg-[#e9efe6]/[0.03]'
                return (
                  <li key={row.n}>
                    {'internal' in row ? (
                      <Link href={row.href} className={cls}>{inner}</Link>
                    ) : (
                      <a
                        href={row.href}
                        className={cls}
                        {...('external' in row ? { target: '_blank', rel: 'noreferrer' } : {})}
                      >
                        {inner}
                      </a>
                    )}
                  </li>
                )
              })}
            </ul>
          </Reveal>
        </div>

        <Reveal delay={0.25} y={0} duration={2.2} className="relative flex items-center md:pt-2">
          <PitchDiagram />
        </Reveal>
      </div>
    </main>
  )
}
