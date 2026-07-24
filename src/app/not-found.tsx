import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center">
        <h1 className="text-6xl font-mono text-white/30 mb-4">404</h1>
        <p className="text-white/50 mb-8">This page doesn&apos;t exist.</p>
        <Link
          href="/"
          className="px-6 py-3 text-sm font-mono tracking-wide border border-white/25 text-white/70 hover:border-white/50 hover:text-white transition-all duration-300 rounded-lg"
        >
          go home
        </Link>
      </div>
    </div>
  )
}
