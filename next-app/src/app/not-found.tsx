import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center">
        <h1 className="text-6xl font-mono text-neutral-300 mb-4">404</h1>
        <p className="text-neutral-500 mb-8">This page doesn&apos;t exist.</p>
        <Link
          href="/"
          className="px-6 py-3 text-sm font-mono tracking-wide border border-neutral-300 text-neutral-600 hover:border-neutral-500 hover:text-neutral-900 transition-all duration-300 rounded-lg"
        >
          go home
        </Link>
      </div>
    </div>
  )
}
