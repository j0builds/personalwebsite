'use client'

import { motion } from 'framer-motion'
import { SOCIAL_LINKS } from '@/lib/constants'

export function ContactSection() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <h2 className="mb-6 font-mono text-xl tracking-tight text-white/85">
        Connect
      </h2>
      <p className="mb-6 max-w-md text-sm leading-relaxed text-white/50">
        Building The Learning and Memory Lab in SF. Always open to founders,
        operators, investors, and HR / L&amp;D leaders who care about how
        humans and machines learn together.
      </p>
      <div className="flex flex-wrap items-center gap-4 md:gap-6">
        {[
          { href: `mailto:${SOCIAL_LINKS.email}`, label: 'email' },
          { href: SOCIAL_LINKS.linkedin, label: 'linkedin', external: true },
          { href: SOCIAL_LINKS.github, label: 'github', external: true },
          { href: SOCIAL_LINKS.instagram, label: 'instagram', external: true },
        ].map((link) => (
          <a
            key={link.label}
            href={link.href}
            target={link.external ? '_blank' : undefined}
            rel={link.external ? 'noopener noreferrer' : undefined}
            className="text-sm text-white/40 underline decoration-white/20 underline-offset-4 transition-colors duration-300 hover:text-white/80 hover:decoration-white/45"
          >
            {link.label}
          </a>
        ))}
      </div>
    </motion.section>
  )
}
