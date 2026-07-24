import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="text-center">
        <h1 className="mb-4 font-mono text-6xl text-[#141311]/2">404</h1>
        <p className="mb-8 text-[#141311]/45">This page doesn&apos;t exist.</p>
        <Link
          href="/"
          className="rounded-full border border-[#141311]/18 px-6 py-3 font-mono text-sm tracking-wide text-[#141311]/65 transition-all duration-300 hover:border-[#141311]/4 hover:text-[#141311]"
        >
          go home
        </Link>
      </div>
    </div>
  )
}
