import { ImageResponse } from 'next/og'
import { cleanName } from '@/components/site/guest'

const size = { width: 1200, height: 630 }

async function serif(text: string) {
  try {
    const css = await (
      await fetch(`https://fonts.googleapis.com/css2?family=Instrument+Serif&text=${encodeURIComponent(text)}`)
    ).text()
    const url = css.match(/src: url\((.+?)\) format\('(?:opentype|truetype)'\)/)?.[1]
    if (!url) return null
    return await (await fetch(url)).arrayBuffer()
  } catch {
    return null
  }
}

const STARS = Array.from({ length: 36 }, (_, i) => {
  const r = (n: number) => {
    const x = Math.sin(i * 127.1 + n * 311.7) * 43758.5453
    return x - Math.floor(x)
  }
  return { x: r(1) * 1200, y: r(2) * 300, o: 0.25 + r(3) * 0.5, s: r(4) < 0.8 ? 2 : 3 }
})

export async function GET(request: Request) {
  const q = new URL(request.url).searchParams
  const name = cleanName(q.get('name'))
  const company = name ? cleanName(q.get('at'), 32) : null
  const line = name ? `For ${name}${company ? ` at ${company}` : ''}.` : 'Look up for a second.'
  const sub = 'A window, left open. Take a minute.'
  const font = await serif(line + sub + 'josephayinde.com')

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: '72px 84px',
          color: '#eef1f6',
          background: 'linear-gradient(180deg, #18223f 0%, #394571 45%, #b47a76 82%, #d88c76 100%)',
          position: 'relative',
        }}
      >
        {STARS.map((s, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: s.x,
              top: s.y,
              width: s.s,
              height: s.s,
              borderRadius: 9,
              background: 'white',
              opacity: s.o,
            }}
          />
        ))}
        <div style={{ fontSize: 26, opacity: 0.7, letterSpacing: 0.5 }}>josephayinde.com</div>
        <div
          style={{
            marginTop: 18,
            fontSize: line.length > 26 ? 84 : 112,
            lineHeight: 1,
            letterSpacing: -1.5,
            fontFamily: font ? 'Instrument Serif' : undefined,
          }}
        >
          {line}
        </div>
        <div
          style={{
            marginTop: 26,
            fontSize: 40,
            opacity: 0.85,
            fontFamily: font ? 'Instrument Serif' : undefined,
          }}
        >
          {sub}
        </div>
      </div>
    ),
    {
      ...size,
      headers: { 'Cache-Control': 'public, max-age=86400, immutable' },
      fonts: font ? [{ name: 'Instrument Serif', data: font, style: 'normal', weight: 400 }] : undefined,
    },
  )
}
