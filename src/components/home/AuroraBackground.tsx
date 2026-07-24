export function AuroraBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-[#0a0a0b]" />
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(165deg, #101114 0%, #0a0a0b 42%, #080809 100%)',
        }}
      />
    </div>
  )
}
