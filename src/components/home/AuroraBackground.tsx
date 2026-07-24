export function AuroraBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Lam Lab thematic base */}
      <div className="absolute inset-0 bg-[#070c1a]" />

      <div
        className="absolute inset-0 scale-105 animate-aurora-1 will-change-transform"
        style={{
          backgroundImage: 'url(/assets/brand/products-bg.webp)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Soft second drift layer for depth */}
      <div
        className="absolute inset-0 opacity-40 mix-blend-screen animate-aurora-2 will-change-transform"
        style={{
          backgroundImage: 'url(/assets/brand/products-bg.webp)',
          backgroundSize: '115% 115%',
          backgroundPosition: '60% 40%',
        }}
      />

      {/* Readability overlays — matched to lamlab.ai products section */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(7,12,26,.80) 0%, rgba(7,12,26,.62) 42%, rgba(7,12,26,.88) 100%)',
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 70% 55% at 50% 40%, rgba(127,176,230,.12) 0%, transparent 60%)',
        }}
      />
    </div>
  )
}
