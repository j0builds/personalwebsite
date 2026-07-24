export function AuroraBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Lam Lab light field */}
      <div className="absolute inset-0 bg-[#FCFBF9]" />

      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 90% 70% at 15% 10%, rgba(232, 226, 214, 0.55) 0%, transparent 55%), radial-gradient(ellipse 80% 60% at 85% 80%, rgba(220, 228, 224, 0.45) 0%, transparent 50%), linear-gradient(180deg, #FCFBF9 0%, #F7F3EC 48%, #F4F0E8 100%)',
        }}
      />

      {/* Soft living mist — memory / mind */}
      <div
        className="absolute -top-[20%] left-[-10%] h-[70vh] w-[70vw] max-w-[900px] rounded-full blur-[120px] opacity-50 animate-aurora-1 will-change-transform"
        style={{
          background:
            'radial-gradient(circle, rgba(160, 170, 155, 0.28) 0%, transparent 70%)',
        }}
      />
      <div
        className="absolute bottom-[-25%] right-[-15%] h-[65vh] w-[65vw] max-w-[820px] rounded-full blur-[130px] opacity-40 animate-aurora-2 will-change-transform"
        style={{
          background:
            'radial-gradient(circle, rgba(190, 175, 150, 0.22) 0%, transparent 70%)',
        }}
      />

      {/* Giant brain mark watermark — your aura */}
      <div
        className="pointer-events-none absolute right-[-8%] top-[12%] h-[70vh] w-[70vh] max-h-[640px] max-w-[640px] opacity-[0.045] animate-aurora-2 will-change-transform"
        style={{
          backgroundImage: 'url(/assets/brand/lam.png)',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          filter: 'brightness(0)',
        }}
      />

      {/* Fine paper grain */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04] mix-blend-multiply"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          backgroundSize: '220px 220px',
        }}
      />

      {/* Soft vignette for focus */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 65% 55% at 40% 42%, transparent 0%, rgba(252, 251, 249, 0.35) 70%, rgba(247, 243, 236, 0.75) 100%)',
        }}
      />
    </div>
  )
}
