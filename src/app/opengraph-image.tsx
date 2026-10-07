import { ImageResponse } from 'next/og'

export const alt = 'Joseph Ayinde — Co-founder & CEO, The Learning and Memory Lab'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const DOTS = [
  [103, 41, 8],
  [120, 57, 9],
  [131, 78, 9.5],
  [134, 102, 10],
  [126, 125, 10.5],
  [107, 147, 11],
]

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 72,
          background: 'radial-gradient(circle at 85% 10%, #173a2a 0%, #09090a 55%)',
          color: '#f2eee6',
          fontFamily: 'serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <svg width="56" height="64" viewBox="28 22 124 140" fill="#f2eee6">
            <path
              transform="translate(89 0) scale(0.85 1) translate(-80 0)"
              d="M80 27 C66 25 52 31 50 46 C37 49 30 61 33 75 C19 84 18 106 29 117 C22 131 33 147 48 146 C54 158 70 162 80 159 Z"
            />
            {DOTS.map(([cx, cy, r]) => (
              <circle key={cy} cx={cx} cy={cy} r={r} />
            ))}
          </svg>
          <div style={{ display: 'flex', flexDirection: 'column', fontSize: 24, lineHeight: 1.15, opacity: 0.75 }}>
            <span>The Learning</span>
            <span>and Memory Lab</span>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 150, lineHeight: 0.9, letterSpacing: -5, display: 'flex' }}>
            Joseph Ayinde<span style={{ color: '#7af0b0' }}>.</span>
          </div>
          <div style={{ marginTop: 28, fontSize: 36, opacity: 0.7 }}>
            Building a world where humans and machines can learn together.
          </div>
        </div>
      </div>
    ),
    size,
  )
}
