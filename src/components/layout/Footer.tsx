import Link from 'next/link'
import { LamMark } from '@/components/shared/LamMark'
import { LocalTime } from '@/components/shared/LocalTime'
import { SOCIAL_LINKS } from '@/lib/constants'

const columns = [
  {
    title: 'Index',
    links: [
      { href: '/', label: 'Home' },
      { href: '/projects', label: 'Work' },
      { href: '/projects#research', label: 'Research' },
      { href: '/about', label: 'About' },
    ],
  },
  {
    title: 'Elsewhere',
    links: [
      { href: SOCIAL_LINKS.linkedin, label: 'LinkedIn', external: true },
      { href: SOCIAL_LINKS.github, label: 'GitHub', external: true },
      { href: SOCIAL_LINKS.instagram, label: 'Instagram', external: true },
      { href: `mailto:${SOCIAL_LINKS.email}`, label: 'Email' },
    ],
  },
]

export function Footer() {
  return (
    <footer className="relative z-10 overflow-hidden border-t hairline px-6 pt-16 pb-8 md:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-6">
            <LamMark className="mb-6 h-8 w-8 text-paper/80" />
            <p className="max-w-sm text-sm leading-relaxed text-paper/50">
              Joseph Ayinde — co-founder &amp; CEO of The Learning and Memory Lab. Building a world
              where humans and machines can learn together.
            </p>
          </div>
          {columns.map((col) => (
            <nav key={col.title} aria-label={col.title} className="md:col-span-3">
              <p className="eyebrow mb-4">{col.title}</p>
              <ul className="space-y-2 text-sm">
                {col.links.map((l) => (
                  <li key={l.label}>
                    {'external' in l && l.external ? (
                      <a
                        href={l.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-paper/60 transition-colors hover:text-paper"
                      >
                        {l.label} ↗
                      </a>
                    ) : l.href.startsWith('mailto:') ? (
                      <a href={l.href} className="text-paper/60 transition-colors hover:text-paper">
                        {l.label}
                      </a>
                    ) : (
                      <Link href={l.href} className="text-paper/60 transition-colors hover:text-paper">
                        {l.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <p
          aria-hidden
          className="pointer-events-none mt-20 select-none font-display text-[15.5vw] leading-[0.8] tracking-[-0.04em] whitespace-nowrap text-paper/[0.07]"
        >
          Joseph Ayinde
        </p>

        <div className="mt-6 flex flex-col gap-3 border-t hairline pt-6 font-mono text-[11px] text-paper/40 md:flex-row md:items-center md:justify-between">
          <span>&copy; {new Date().getFullYear()} Joseph Ayinde</span>
          <span>
            SF · <LocalTime />
          </span>
          <span>Designed &amp; pair-programmed with Claude</span>
        </div>
      </div>
    </footer>
  )
}
