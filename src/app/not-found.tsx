import Link from 'next/link'
import { LamMark } from '@/components/shared/LamMark'

export default function NotFound() {
  return (
    <section className="flex min-h-[100svh] items-center justify-center px-6">
      <div className="text-center">
        <LamMark animated className="mx-auto mb-10 h-16 w-16 text-paper/70" />
        <p className="eyebrow mb-6">Error 404</p>
        <h1 className="mb-6 font-display text-6xl leading-none md:text-8xl">
          Lost to <span className="italic text-paper/70">memory</span>
          <span className="text-signal">.</span>
        </h1>
        <p className="mx-auto mb-10 max-w-sm text-paper/50">
          This page doesn&apos;t exist — or it&apos;s been forgotten. Let&apos;s get you back.
        </p>
        <Link
          href="/"
          className="inline-block rounded-full bg-paper px-6 py-3 text-sm font-medium text-ink transition-transform duration-300 hover:scale-[1.03]"
        >
          Go home
        </Link>
      </div>
    </section>
  )
}
