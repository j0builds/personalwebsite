export function AuroraBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Deep field */}
      <div className="absolute inset-0 bg-[#06070b]" />

      {/* Immersive depth wash */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 90% 70% at 20% 15%, rgba(28, 36, 58, 0.9) 0%, transparent 55%), radial-gradient(ellipse 80% 60% at 85% 75%, rgba(22, 28, 42, 0.85) 0%, transparent 50%), linear-gradient(160deg, #080a10 0%, #06070b 45%, #05060a 100%)',
        }}
      />

      {/* Living light volumes */}
      <div
        className="absolute -top-[25%] left-[-15%] h-[80vh] w-[80vw] max-w-[980px] rounded-full opacity-60 blur-[110px] md:blur-[140px] animate-aurora-1 will-change-transform"
        style={{
          background:
            'radial-gradient(circle, rgba(120, 145, 185, 0.22) 0%, transparent 68%)',
        }}
      />
      <div
        className="absolute top-[25%] right-[-20%] h-[75vh] w-[75vw] max-w-[900px] rounded-full opacity-50 blur-[120px] md:blur-[150px] animate-aurora-2 will-change-transform"
        style={{
          background:
            'radial-gradient(circle, rgba(170, 175, 195, 0.16) 0%, transparent 70%)',
        }}
      />
      <div
        className="absolute bottom-[-30%] left-[20%] h-[70vh] w-[70vw] max-w-[860px] rounded-full opacity-45 blur-[130px] md:blur-[160px] animate-aurora-3 will-change-transform"
        style={{
          background:
            'radial-gradient(circle, rgba(90, 115, 150, 0.18) 0%, transparent 70%)',
        }}
      />

      {/* Soft focus glow near hero mark */}
      <div
        className="absolute top-[30%] right-[8%] h-[42vh] w-[42vh] max-h-[480px] max-w-[480px] rounded-full opacity-40 blur-[90px] animate-aurora-2 will-change-transform"
        style={{
          background:
            'radial-gradient(circle, rgba(255, 255, 255, 0.09) 0%, transparent 70%)',
        }}
      />

      {/* Star dust */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35] animate-aurora-drift"
        style={{
          backgroundImage:
            'radial-gradient(1.5px 1.5px at 12% 22%, rgba(255,255,255,0.45) 0%, transparent 100%), radial-gradient(1px 1px at 28% 68%, rgba(255,255,255,0.35) 0%, transparent 100%), radial-gradient(1.5px 1.5px at 46% 18%, rgba(255,255,255,0.28) 0%, transparent 100%), radial-gradient(1px 1px at 63% 42%, rgba(255,255,255,0.4) 0%, transparent 100%), radial-gradient(1px 1px at 78% 76%, rgba(255,255,255,0.3) 0%, transparent 100%), radial-gradient(1.5px 1.5px at 88% 28%, rgba(255,255,255,0.35) 0%, transparent 100%), radial-gradient(1px 1px at 18% 88%, rgba(255,255,255,0.25) 0%, transparent 100%), radial-gradient(1px 1px at 52% 54%, rgba(255,255,255,0.22) 0%, transparent 100%)',
          backgroundSize: '100% 100%',
        }}
      />

      {/* Soft film grain */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.045] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          backgroundSize: '180px 180px',
        }}
      />

      {/* Edge falloff so it feels like space, not a framed photo */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 75% 65% at 45% 40%, transparent 0%, rgba(6,7,11,0.35) 70%, rgba(6,7,11,0.78) 100%)',
        }}
      />
    </div>
  )
}
