import { affiliations } from '@/lib/data'

export function Marquee() {
  const items = [...affiliations, ...affiliations]
  return (
    <section
      aria-label="Affiliations"
      className="relative overflow-hidden border-y hairline py-6 [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]"
    >
      <ul className="flex w-max animate-marquee items-center hover:[animation-play-state:paused]">
        {items.map((name, i) => (
          <li
            key={`${name}-${i}`}
            aria-hidden={i >= affiliations.length}
            className="flex items-center gap-10 pr-10 font-display text-3xl whitespace-nowrap text-paper/45 md:text-4xl"
          >
            <span className="transition-colors duration-300 hover:text-paper">{name}</span>
            <span className="h-1.5 w-1.5 rounded-full bg-signal/60" />
          </li>
        ))}
      </ul>
    </section>
  )
}
