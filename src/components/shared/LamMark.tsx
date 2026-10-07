const DOTS = [
  { cx: 103, cy: 41, r: 8 },
  { cx: 120, cy: 57, r: 9 },
  { cx: 131, cy: 78, r: 9.5 },
  { cx: 134, cy: 102, r: 10 },
  { cx: 126, cy: 125, r: 10.5 },
  { cx: 107, cy: 147, r: 11 },
]

type LamMarkProps = {
  className?: string
  animated?: boolean
  title?: string
}

export function LamMark({ className = 'h-8 w-8', animated = false, title }: LamMarkProps) {
  return (
    <svg
      viewBox="28 22 124 140"
      className={className}
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      fill="currentColor"
    >
      {title && <title>{title}</title>}
      <path transform="translate(89 0) scale(0.85 1) translate(-80 0)" d="M80 27 C66 25 52 31 50 46 C37 49 30 61 33 75 C19 84 18 106 29 117 C22 131 33 147 48 146 C54 158 70 162 80 159 Z" />
      {DOTS.map((d, i) => (
        <circle
          key={i}
          cx={d.cx}
          cy={d.cy}
          r={d.r}
          style={
            animated
              ? {
                  animation: `lam-recall 3.6s ${i * 0.18}s ease-in-out infinite`,
                  transformOrigin: `${d.cx}px ${d.cy}px`,
                  transformBox: 'view-box',
                }
              : undefined
          }
        />
      ))}
      {animated && (
        <style>{`@keyframes lam-recall{0%,60%,100%{opacity:1;transform:scale(1)}30%{opacity:.35;transform:scale(.82)}}`}</style>
      )}
    </svg>
  )
}
