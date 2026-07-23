export function AuroraBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-[#f7f6f4]" />

      {/* Soft vertical wash */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(165deg, #faf9f7 0%, #f4f2ee 45%, #eef1ef 100%)',
        }}
      />

      {/* Quiet aura — sage */}
      <div
        className="absolute top-[-10%] left-[10%] w-[55vw] h-[55vw] max-w-[720px] max-h-[720px] rounded-full opacity-50 blur-[100px] md:blur-[140px] animate-aurora-1 will-change-transform"
        style={{
          background:
            'radial-gradient(circle, rgba(120, 140, 128, 0.18), transparent 68%)',
        }}
      />

      {/* Quiet aura — warm stone */}
      <div
        className="absolute bottom-[-15%] right-[5%] w-[50vw] h-[50vw] max-w-[640px] max-h-[640px] rounded-full opacity-40 blur-[110px] md:blur-[150px] animate-aurora-2 will-change-transform"
        style={{
          background:
            'radial-gradient(circle, rgba(180, 165, 145, 0.16), transparent 70%)',
        }}
      />

      {/* Soft center focus */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 70% 55% at 50% 45%, rgba(247, 246, 244, 0.15) 0%, transparent 55%, rgba(247, 246, 244, 0.85) 100%)',
        }}
      />

      {/* Whisper grain */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none mix-blend-multiply"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          backgroundSize: '180px 180px',
        }}
      />
    </div>
  )
}
