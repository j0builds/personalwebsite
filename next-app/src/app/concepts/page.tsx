import Link from 'next/link'
import { Reveal } from '@/components/concepts/Reveal'
import { CONCEPTS } from '@/components/concepts/content'

export default function ConceptsIndex() {
  return (
    <main className="min-h-[100svh] bg-[#f4f2ed] text-[#1d1c1a]">
      <div className="mx-auto max-w-[880px] px-6 pb-24 pt-[clamp(56px,12vh,128px)] sm:px-10">
        <Reveal>
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#1d1c1a]/50">
            After the save &middot; five directions
          </p>
          <h1 className="mt-5 font-[family-name:var(--font-instrument)] text-[clamp(40px,7vw,72px)] leading-[1.02] tracking-[-0.01em]">
            Five quieter front doors.
          </h1>
          <p className="mt-5 max-w-[520px] text-[15px] leading-[1.65] text-[#1d1c1a]/65">
            Each one replaces the homepage you land on after the gate. None of them scroll-jack,
            autoplay, or ask for anything. Open one, sit with it for a minute, then flip through
            the rest with the arrow keys.
          </p>
        </Reveal>

        <ol className="mt-14 border-t border-[#1d1c1a]/12">
          {CONCEPTS.map((c, i) => (
            <Reveal as="li" key={c.slug} delay={0.15 + i * 0.08} className="list-none border-b border-[#1d1c1a]/12">
                <Link
                  href={`/concepts/${c.slug}`}
                  className="group grid grid-cols-[28px_1fr_auto] items-center gap-x-4 py-6 sm:grid-cols-[44px_180px_1fr_auto] sm:gap-x-6"
                >
                  <span className="font-mono text-[12px] tabular-nums text-[#1d1c1a]/40">
                    0{i + 1}
                  </span>
                  <span className="font-[family-name:var(--font-instrument)] text-[30px] leading-none transition-transform duration-500 group-hover:translate-x-1">
                    {c.name}
                  </span>
                  <span className="col-span-2 col-start-2 row-start-2 mt-2 text-[14px] leading-[1.55] text-[#1d1c1a]/60 sm:col-span-1 sm:col-start-3 sm:row-start-1 sm:mt-0">
                    {c.line}
                  </span>
                  <span className="col-start-3 row-start-1 flex items-center gap-3 sm:col-start-4">
                    <span className="flex -space-x-1.5">
                      {c.swatch.map((s) => (
                        <span
                          key={s}
                          className="h-4 w-4 rounded-full ring-1 ring-[#1d1c1a]/15"
                          style={{ background: s }}
                        />
                      ))}
                    </span>
                    <span className="text-[#1d1c1a]/35 transition-colors duration-300 group-hover:text-[#1d1c1a]">
                      &rarr;
                    </span>
                  </span>
                </Link>
            </Reveal>
          ))}
        </ol>

        <Reveal delay={0.7}>
          <p className="mt-10 text-[13px] text-[#1d1c1a]/45">
            The current homepage is still live at{' '}
            <Link href="/" className="underline decoration-[#1d1c1a]/25 underline-offset-4 hover:decoration-[#1d1c1a]">
              /
            </Link>
            .
          </p>
        </Reveal>
      </div>
    </main>
  )
}
