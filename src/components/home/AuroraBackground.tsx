export function AuroraBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-[#07080c]" />

      <div
        className="absolute inset-0 scale-110 opacity-70 animate-aurora-1 will-change-transform"
        style={{
          backgroundImage: 'url(/assets/brand/aura-bg.webp)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(105deg, rgba(7,8,12,0.92) 0%, rgba(7,8,12,0.72) 42%, rgba(7,8,12,0.55) 100%)',
        }}
      />

      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 55% 50% at 70% 45%, rgba(255,255,255,0.06) 0%, transparent 60%)',
        }}
      />
    </div>
  )
}
