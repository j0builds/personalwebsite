import { CopyEmail } from '@/components/shared/CopyEmail'
import { Reveal } from '@/components/shared/Reveal'
import { SOCIAL_LINKS } from '@/lib/constants'

const links = [
  { href: SOCIAL_LINKS.linkedin, label: 'LinkedIn' },
  { href: SOCIAL_LINKS.github, label: 'GitHub' },
  { href: SOCIAL_LINKS.instagram, label: 'Instagram' },
]

export function ContactCTA() {
  return (
    <section id="contact" className="relative overflow-hidden px-6 py-32 md:px-12 md:py-48">
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-[-30%] left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-signal/[0.07] blur-[140px]"
      />
      <div className="relative mx-auto max-w-7xl text-center">
        <Reveal>
          <p className="eyebrow mb-8">Say hello</p>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="font-display text-[15vw] leading-[0.88] tracking-[-0.035em] md:text-[10rem]">
            Let&apos;s learn
            <br />
            <span className="italic text-paper/75">together</span>
            <span className="text-signal">.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.12}>
          <p className="mx-auto mt-10 max-w-md text-paper/55">
            Always open to founders, operators, investors, and HR / L&amp;D leaders who care
            about how humans and machines learn together.
          </p>
        </Reveal>
        <Reveal delay={0.18} className="mt-10 flex flex-col items-center gap-8">
          <CopyEmail />
          <ul className="flex items-center gap-8 text-sm">
            {links.map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-paper/50 underline decoration-paper/15 underline-offset-4 transition-colors hover:text-paper hover:decoration-signal"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  )
}
