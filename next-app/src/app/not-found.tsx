import Link from 'next/link'
import { Sky } from '@/components/site/Sky'

export default function NotFound() {
  return (
    <Sky>
      <main className="mx-auto flex min-h-[100svh] max-w-[1240px] flex-col justify-center px-6 sm:px-10">
        <p className="text-[14px] opacity-65">404</p>
        <h1 className="mt-4 font-[family-name:var(--font-instrument)] text-[clamp(44px,6.4vw,84px)] leading-[0.98] tracking-[-0.015em]">
          This page drifted off.
        </h1>
        <p className="mt-6 max-w-[480px] text-[16px] leading-[1.65] opacity-80 [text-wrap:balance]">
          Nothing lost. The front door is right where you left it.
        </p>
        <Link
          href="/"
          className="mt-10 self-start text-[14px] underline decoration-current/30 decoration-[1px] underline-offset-[5px] transition-[text-decoration-color] duration-300 hover:decoration-current"
        >
          Back to the window
        </Link>
      </main>
    </Sky>
  )
}
