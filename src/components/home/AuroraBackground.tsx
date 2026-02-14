export function AuroraBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-[#fafafa]" />

      {/* Dot grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            'radial-gradient(circle, rgba(0,0,0,0.4) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* Noise grain texture */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.03] pointer-events-none">
        <filter id="noise">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.8"
            numOctaves="4"
            stitchTiles="stitch"
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#noise)" />
      </svg>

      {/* Aurora blobs — soft pastels for light theme */}
      <div
        className="absolute top-[10%] left-[15%] w-[280px] h-[280px] md:w-[500px] md:h-[500px] rounded-full opacity-30 blur-[80px] md:blur-[120px] animate-aurora-1 will-change-transform"
        style={{
          background:
            'radial-gradient(circle, rgba(0, 135, 83, 0.35), transparent 70%)',
        }}
      />
      <div
        className="absolute top-[60%] right-[20%] w-[250px] h-[250px] md:w-[450px] md:h-[450px] rounded-full opacity-20 blur-[80px] md:blur-[120px] animate-aurora-2 will-change-transform"
        style={{
          background:
            'radial-gradient(circle, rgba(138, 43, 226, 0.25), transparent 70%)',
        }}
      />
      <div
        className="absolute bottom-[15%] left-[25%] w-[240px] h-[240px] md:w-[420px] md:h-[420px] rounded-full opacity-20 blur-[80px] md:blur-[120px] animate-aurora-3 will-change-transform"
        style={{
          background:
            'radial-gradient(circle, rgba(0, 191, 255, 0.25), transparent 70%)',
        }}
      />

      {/* Radial vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 40%, #fafafa 100%)',
        }}
      />
    </div>
  )
}
