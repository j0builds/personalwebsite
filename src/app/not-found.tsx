import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="text-center">
        <h1 className="mb-4 font-mono text-6xl text-white/25">404</h1>
        <p className="mb-8 text-white/45">This page doesn&apos;t exist.</p>
        <Link
          href="/"
          className="rounded-full border border-white/20 px-6 py-3 font-mono text-sm tracking-wide text-white/70 transition-all duration-300 hover:border-white/40 hover:text-white"
        >
          go home
        </Link>
      </div>
    </div>
  )
}
