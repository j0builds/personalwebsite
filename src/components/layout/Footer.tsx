import { SOCIAL_LINKS } from '@/lib/constants'

export function Footer() {
  return (
    <footer className="border-t border-white/10 px-6 py-8 md:px-12">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 md:flex-row">
        <p className="font-mono text-xs text-white/35">
          &copy; {new Date().getFullYear()} Joseph Ayinde
        </p>
        <div className="flex items-center gap-6">
          <a
            href={SOCIAL_LINKS.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-white/35 transition-colors duration-300 hover:text-white/75"
          >
            GitHub
          </a>
          <a
            href={SOCIAL_LINKS.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-white/35 transition-colors duration-300 hover:text-white/75"
          >
            LinkedIn
          </a>
          <a
            href={`mailto:${SOCIAL_LINKS.email}`}
            className="text-xs text-white/35 transition-colors duration-300 hover:text-white/75"
          >
            Email
          </a>
        </div>
      </div>
    </footer>
  )
}
